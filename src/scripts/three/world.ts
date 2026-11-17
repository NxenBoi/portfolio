/**
 * The 3D world the visitor flies through.
 *
 * One fixed canvas. Each page section is a "stop" with a landmark; the camera
 * glides along a curved path between stops as `journey` goes 0 → stops-1.
 * The sky colour blends between zone palettes on the way.
 *
 * Rules: renders from gsap.ticker (no rAF of its own), DPR capped at 2,
 * paused when the tab or canvas is hidden, and everything is disposed on destroy().
 */
import * as THREE from 'three';
import { gsap } from '../lib/gsap';
import { readPalette, type ZoneKey, type SkyColors } from './palette';
import { createSky } from './sky';
import { bubbleMaterial } from './materials';
import { contactLandmark, gameLandmark, heroLandmark, promisesLandmark, type Landmark } from './landmarks';

export type StopKind = 'hero' | 'game' | 'promises' | 'contact';

export interface StopDef {
  kind: StopKind;
  side: 'left' | 'right' | 'center';
  image: string;
  title: string;
}

export interface World {
  /** Fractional stop index: 0 = first stop, 1.5 = halfway between stops 1 and 2. */
  setJourney(j: number): void;
  /** motion=false: static frames only, rendered on demand. */
  setMode(motion: boolean, parallax: boolean): void;
  destroy(): void;
}

const SPACING = 64;
const ZONE: Record<StopKind, ZoneKey> = { hero: 'hero', game: 'games', promises: 'promises', contact: 'contact' };
const DIST: Record<StopKind, number> = { hero: 30, game: 22, promises: 24, contact: 26 };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Small seeded RNG so the world looks the same on every visit. */
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

export function createWorld(canvas: HTMLCanvasElement, stops: StopDef[], opts: { lite: boolean }): World {
  const { lite } = opts;
  const pal = readPalette();
  const rand = rng(7);
  const n = Math.max(1, stops.length);

  // ---- Renderer ------------------------------------------------------------
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !lite, powerPreference: lite ? 'low-power' : 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lite ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const firstZone = ZONE[stops[0]?.kind ?? 'hero'];
  const fog = new THREE.Fog(pal.sky[firstZone].horizon.clone(), 50, 150);
  scene.fog = fog;

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1000);

  // ---- Environment: chrome reflects a pastel studio sky ---------------------
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  const envSky = createSky(pal.sky.hero, 40);
  envScene.add(envSky.mesh);
  // Bright softbox strips give chrome its crisp highlights.
  const stripGeo = new THREE.BoxGeometry(30, 1.5, 6);
  const stripMat = new THREE.MeshBasicMaterial({ color: pal.white });
  [[0, 22, -8], [-18, 10, 12], [20, 6, 10]].forEach(([x, y, z], i) => {
    const s = new THREE.Mesh(stripGeo, stripMat);
    s.position.set(x as number, y as number, z as number);
    s.lookAt(0, 0, 0);
    s.rotation.z = i * 0.6;
    envScene.add(s);
  });
  const envMap = pmrem.fromScene(envScene, 0.02).texture;
  envSky.dispose();
  stripGeo.dispose();
  stripMat.dispose();
  scene.environment = envMap;
  scene.environmentIntensity = 0.9;

  // ---- Sky + light ------------------------------------------------------------
  const sky = createSky(pal.sky[firstZone]);
  scene.add(sky.mesh);
  const hemi = new THREE.HemisphereLight(pal.white, pal.lilac, 1.7);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(pal.white, 2.2);
  sun.position.set(-20, 40, 20);
  scene.add(sun);

  // ---- Landmarks ----------------------------------------------------------------
  const ctx = { pal, lite, rand };
  const landmarks: Array<Landmark & { face?: (t: THREE.Vector3) => void }> = [];
  const anchors: THREE.Vector3[] = [];
  stops.forEach((stop, k) => {
    const lm =
      stop.kind === 'hero'
        ? heroLandmark(ctx)
        : stop.kind === 'game'
          ? gameLandmark(ctx, stop.image, stop.title)
          : stop.kind === 'promises'
            ? promisesLandmark(ctx)
            : contactLandmark(ctx);
    const anchor = new THREE.Vector3(Math.sin(k * 1.25) * 12, Math.cos(k * 0.9) * 5, -k * SPACING);
    lm.group.position.copy(anchor);
    scene.add(lm.group);
    landmarks.push(lm);
    anchors.push(anchor);
  });
  const timed = landmarks.flatMap((l) => l.timed);

  // ---- Ambient: cloud puffs, bubbles, sparkles along the whole route ---------
  const pathLen = (n - 1) * SPACING + 120;

  // Cotton-candy / white cloud clusters, kept off the flight line.
  const clusters = lite ? 26 : 60;
  const perCluster = lite ? 5 : 8;
  const puffGeo = new THREE.IcosahedronGeometry(1, lite ? 2 : 3);
  const puffMat = new THREE.MeshLambertMaterial({ color: pal.white, emissive: pal.white, emissiveIntensity: 0.18 });
  const clouds = new THREE.InstancedMesh(puffGeo, puffMat, clusters * perCluster);
  {
    const m = new THREE.Matrix4();
    const c = new THREE.Color();
    let idx = 0;
    for (let i = 0; i < clusters; i++) {
      const z = 60 - rand() * pathLen;
      const side = rand() < 0.5 ? -1 : 1;
      const below = rand() < 0.45;
      const center = new THREE.Vector3(
        below ? rand() * 80 - 40 : side * (26 + rand() * 50),
        below ? -22 - rand() * 18 : rand() * 40 - 12,
        z,
      );
      // Pinker near the end of the journey.
      const pinkness = clamp01((-z / pathLen) * 1.2) * 0.8 + rand() * 0.25;
      const base = c.copy(pal.white).lerp(rand() < 0.3 ? pal.lilac : pal.pink, Math.min(0.85, pinkness));
      const scale = 2 + rand() * 4;
      for (let p = 0; p < perCluster; p++) {
        const off = new THREE.Vector3((rand() - 0.5) * scale * 3.2, (rand() - 0.3) * scale * 0.9, (rand() - 0.5) * scale * 1.6);
        const s = scale * (0.55 + rand() * 0.6);
        m.compose(center.clone().add(off), new THREE.Quaternion(), new THREE.Vector3(s, s * 0.85, s));
        clouds.setMatrixAt(idx, m);
        clouds.setColorAt(idx, base);
        idx++;
      }
    }
  }
  scene.add(clouds);

  // Floating soap bubbles.
  const bubbleCount = lite ? 40 : 110;
  const bubbleGeo = new THREE.SphereGeometry(1, lite ? 16 : 24, lite ? 12 : 16);
  const bubbleMat = bubbleMaterial(pal);
  const bubbles = new THREE.InstancedMesh(bubbleGeo, bubbleMat, bubbleCount);
  {
    const m = new THREE.Matrix4();
    const phase = new Float32Array(bubbleCount);
    for (let i = 0; i < bubbleCount; i++) {
      const s = 0.3 + rand() * rand() * 2.6;
      m.compose(new THREE.Vector3(rand() * 70 - 35, rand() * 34 - 12, 40 - rand() * pathLen), new THREE.Quaternion(), new THREE.Vector3(s, s, s));
      bubbles.setMatrixAt(i, m);
      phase[i] = rand();
    }
    bubbleGeo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phase, 1));
  }
  bubbles.frustumCulled = false;
  bubbles.renderOrder = 2;
  scene.add(bubbles);
  timed.push(bubbleMat);

  // Y2K sparkle stars (sprite points).
  const sparkTex = sparkleTexture();
  const sparkCount = lite ? 60 : 160;
  const sparkPos = new Float32Array(sparkCount * 3);
  for (let i = 0; i < sparkCount; i++) {
    sparkPos[i * 3] = rand() * 90 - 45;
    sparkPos[i * 3 + 1] = rand() * 50 - 15;
    sparkPos[i * 3 + 2] = 40 - rand() * pathLen;
  }
  const sparkGeo = new THREE.BufferGeometry();
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
  const sparkMat = new THREE.PointsMaterial({
    map: sparkTex,
    color: pal.white,
    size: lite ? 1.6 : 1.3,
    sizeAttenuation: true,
    transparent: true,
    depthWrite: false,
    alphaTest: 0.01,
  });
  const sparkles = new THREE.Points(sparkGeo, sparkMat);
  scene.add(sparkles);

  function sparkleTexture(): THREE.CanvasTexture {
    const s = 64;
    const c = document.createElement('canvas');
    c.width = c.height = s;
    const g = c.getContext('2d');
    if (g) {
      g.translate(s / 2, s / 2);
      const grad = g.createRadialGradient(0, 0, 0, 0, 0, s / 2);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.25, 'rgba(255,255,255,0.6)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grad;
      g.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const r = i % 2 === 0 ? s / 2 : s / 10;
        g.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      g.closePath();
      g.fill();
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  // ---- Camera path ------------------------------------------------------------
  let camCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(0, 0, -1)]);
  let lookCurve = camCurve;

  function layout(): void {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const portrait = camera.aspect < 0.9;
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));

    const camPts: THREE.Vector3[] = [];
    const lookPts: THREE.Vector3[] = [];
    stops.forEach((stop, k) => {
      const anchor = anchors[k] as THREE.Vector3;
      const dist = DIST[stop.kind] * (portrait ? 1.55 : 1);
      const halfW = tanHalf * dist * camera.aspect;
      const halfH = tanHalf * dist;
      // Panel on the left → landmark framed on the right, and vice versa.
      const shift = portrait || stop.side === 'center' ? 0 : (stop.side === 'left' ? 1 : -1) * halfW * 0.42;
      // Portrait: landmark sits in the top half, above the panel.
      const lift = portrait ? -halfH * 0.5 : stop.side === 'center' ? -halfH * 0.05 : 0;
      const look = new THREE.Vector3(anchor.x - shift, anchor.y + lift + 1, anchor.z);
      const cam = new THREE.Vector3(look.x, look.y + 2.5, anchor.z + dist);
      lookPts.push(look);
      camPts.push(cam);
      const next = anchors[k + 1];
      if (next) {
        // Swoop up and away from the landmark (towards the panel side) so the
        // camera never flies through it on the way to the next stop.
        const sway = stop.side === 'left' ? -16 : stop.side === 'right' ? 16 : k % 2 ? -14 : 14;
        const nextCam = new THREE.Vector3(next.x, next.y, next.z + DIST[stops[k + 1]!.kind]);
        camPts.push(cam.clone().lerp(nextCam, 0.5).add(new THREE.Vector3(sway, 15, 0)));
        lookPts.push(look.clone().lerp(next, 0.5).add(new THREE.Vector3(sway * 0.5, 4, 0)));
      }
    });
    if (camPts.length === 1) {
      camPts.push(camPts[0]!.clone().add(new THREE.Vector3(0, 0, -0.01)));
      lookPts.push(lookPts[0]!.clone().add(new THREE.Vector3(0, 0, -0.01)));
    }
    camCurve = new THREE.CatmullRomCurve3(camPts, false, 'centripetal');
    lookCurve = new THREE.CatmullRomCurve3(lookPts, false, 'centripetal');
    landmarks.forEach((lm, k) => lm.face?.(camPts[Math.min(k * 2, camPts.length - 1)] as THREE.Vector3));
  }

  // ---- State -----------------------------------------------------------------------
  let target = 0;
  let current = 0;
  let motion = true;
  let parallax = false;
  let visible = true;
  let destroyed = false;
  let elapsed = 0;
  const mouse = new THREE.Vector2();
  const mouseLerp = new THREE.Vector2();
  const ORIGIN = new THREE.Vector2();
  const camPos = new THREE.Vector3();
  const lookPos = new THREE.Vector3();
  const skyMix: SkyColors = { top: new THREE.Color(), horizon: new THREE.Color(), bottom: new THREE.Color() };

  function update(): void {
    const j = Math.min(Math.max(current, 0), n - 1);
    const k = Math.floor(j);
    // Ease within each leg so the camera lingers at stops and glides between.
    const f = (j - k + smooth(j - k)) / 2;
    const u = n > 1 ? (k + f) / (n - 1) : 0;
    camCurve.getPoint(u, camPos);
    lookCurve.getPoint(u, lookPos);

    mouseLerp.lerp(parallax ? mouse : ORIGIN, 0.05);
    camera.position.set(camPos.x + mouseLerp.x * 1.4, camPos.y + mouseLerp.y * 0.8, camPos.z);
    camera.lookAt(lookPos);

    // Sky + fog blend between this stop's zone and the next.
    const a = pal.sky[ZONE[stops[k]?.kind ?? 'hero']];
    const b = pal.sky[ZONE[stops[Math.min(k + 1, n - 1)]?.kind ?? 'hero']];
    skyMix.top.lerpColors(a.top, b.top, f);
    skyMix.horizon.lerpColors(a.horizon, b.horizon, f);
    skyMix.bottom.lerpColors(a.bottom, b.bottom, f);
    sky.set(skyMix);
    fog.color.copy(skyMix.horizon);
    sky.mesh.position.copy(camera.position);

    // The hero tower builds during the first leg of the journey.
    const assembly = motion ? clamp01(j / 0.7) : 1;
    const t = motion ? elapsed : 0;
    landmarks.forEach((lm) => lm.update(t, motion, assembly));
    for (const m of timed) (m.uniforms.uTime as THREE.IUniform<number>).value = t;
    sparkles.rotation.y = motion ? Math.sin(elapsed * 0.05) * 0.02 : 0;
  }

  function render(): void {
    if (destroyed) return;
    update();
    renderer.render(scene, camera);
  }

  // One shared loop: gsap.ticker.
  const tick = (_time: number, deltaMs: number) => {
    if (!visible || !motion || document.hidden) return;
    const dt = Math.min(deltaMs, 50) / 1000;
    elapsed += dt;
    current += (target - current) * (1 - Math.exp(-dt * 5));
    if (Math.abs(target - current) < 0.0005) current = target;
    render();
  };
  gsap.ticker.add(tick);

  const onPointer = (e: PointerEvent) => {
    mouse.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  const io = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? true;
  });
  io.observe(canvas);

  const ro = new ResizeObserver(() => {
    layout();
    if (!motion) render();
  });
  ro.observe(canvas);

  layout();
  render();
  canvas.classList.add('is-ready');

  return {
    setJourney(j) {
      target = j;
      if (!motion) {
        current = j;
        render();
      }
    },
    setMode(m, px) {
      motion = m;
      parallax = px && m;
      if (!m) {
        current = target;
        mouse.set(0, 0);
        mouseLerp.set(0, 0);
        render();
      }
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      gsap.ticker.remove(tick);
      window.removeEventListener('pointermove', onPointer);
      io.disconnect();
      ro.disconnect();
      const geos = new Set<THREE.BufferGeometry>();
      const mats = new Set<THREE.Material>();
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) geos.add(mesh.geometry);
        const mat = mesh.material;
        if (Array.isArray(mat)) mat.forEach((x) => mats.add(x));
        else if (mat) mats.add(mat);
      });
      mats.forEach((m) => {
        const map = (m as THREE.MeshBasicMaterial).map;
        map?.dispose();
        m.dispose();
      });
      geos.forEach((g) => g.dispose());
      sky.dispose();
      envMap.dispose();
      pmrem.dispose();
      scene.clear();
      renderer.dispose();
    },
  };
}
