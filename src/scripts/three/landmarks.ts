/**
 * The landmark at each stop of the journey. Every builder returns a group
 * centred on the stop, plus an `update` for idle animation.
 *
 *  hero     → floating grass island inside a giant soap bubble; glossy
 *             blocks assemble into a tower crowned by a chrome orb.
 *  game     → chrome-framed screen showing the game's screenshot, on a
 *             mini island, with glossy blocks orbiting it.
 *  promises → Y3K chrome sculpture: torus knot, sparkle stars, orbs.
 *  contact  → cotton-candy cloud bank with a glowing portal ring.
 */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { WorldPalette } from './palette';
import { readFont } from './palette';
import { bubbleMaterial, chrome, glossy } from './materials';

export interface Landmark {
  group: THREE.Group;
  /** a = hero assembly 0..1 (only the hero uses it). */
  update(time: number, motion: boolean, a: number): void;
  /** Shader materials that need uTime. */
  timed: THREE.ShaderMaterial[];
}

interface Ctx {
  pal: WorldPalette;
  lite: boolean;
  rand: () => number;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

// ---------------------------------------------------------------------------
// Shared pieces

const BRICK = { w: 2, h: 0.8, gap: 0.06 };

export function brickGeometry(lite: boolean): THREE.BufferGeometry {
  const rounded = new RoundedBoxGeometry(BRICK.w, BRICK.h, BRICK.w, lite ? 1 : 3, 0.14);
  const parts: THREE.BufferGeometry[] = [rounded.index ? rounded.toNonIndexed() : rounded];
  for (const sx of [-0.5, 0.5]) {
    for (const sz of [-0.5, 0.5]) {
      const stud = new THREE.CylinderGeometry(0.3, 0.3, 0.2, lite ? 10 : 20).toNonIndexed();
      stud.translate(sx, BRICK.h / 2 + 0.1, sz);
      parts.push(stud);
    }
  }
  const merged = mergeGeometries(parts);
  if (!merged) throw new Error('brick geometry');
  return merged;
}

function island(ctx: Ctx, radius: number): THREE.Group {
  const g = new THREE.Group();
  const seg = ctx.lite ? 24 : 48;
  const top = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.92, radius * 0.16, seg), glossy(ctx.pal.grass, ctx.lite, 0.15));
  const rock = new THREE.Mesh(new THREE.ConeGeometry(radius * 0.9, radius * 1.1, ctx.lite ? 7 : 9), glossy(ctx.pal.lilac, ctx.lite, 0.1));
  rock.rotation.x = Math.PI;
  rock.position.y = -radius * 0.08 - radius * 0.55;
  g.add(top, rock);
  return g;
}

function sparkleStarGeometry(): THREE.ExtrudeGeometry {
  // 4-point Y2K sparkle star.
  const s = new THREE.Shape();
  const pts = 8;
  for (let i = 0; i <= pts; i++) {
    const a = (i / pts) * Math.PI * 2 + Math.PI / 2;
    const r = i % 2 === 0 ? 1 : 0.28;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  return new THREE.ExtrudeGeometry(s, { depth: 0.25, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.08, bevelSegments: 3 });
}

// ---------------------------------------------------------------------------
// Hero

export function heroLandmark(ctx: Ctx): Landmark {
  const { pal, lite, rand } = ctx;
  const group = new THREE.Group();
  const isle = island(ctx, 9);
  isle.position.y = -1.2;
  group.add(isle);

  const brickGeo = brickGeometry(lite);
  const mats = [glossy(pal.pink, lite), glossy(pal.blue, lite), glossy(pal.lilac, lite), glossy(pal.white, lite, 0.05)];
  const chromeMat = chrome(pal, lite);
  const tower = new THREE.Group();
  group.add(tower);

  interface Piece {
    mesh: THREE.Object3D;
    from: THREE.Vector3;
    to: THREE.Vector3;
    qFrom: THREE.Quaternion;
    delay: number;
    bob: number;
  }
  const pieces: Piece[] = [];
  const q0 = new THREE.Quaternion();
  const add = (mesh: THREE.Object3D, to: THREE.Vector3, order: number) => {
    const dir = new THREE.Vector3(rand() * 2 - 1, rand() * 1.4 - 0.2, rand() * 2 - 1).normalize();
    const from = dir.multiplyScalar(7 + rand() * 7).add(new THREE.Vector3(0, 4, 0));
    const qFrom = new THREE.Quaternion().setFromEuler(new THREE.Euler(rand() * 6, rand() * 6, rand() * 6));
    pieces.push({ mesh, from, to, qFrom, delay: order * 0.5 + rand() * 0.08, bob: rand() * 6.28 });
    tower.add(mesh);
  };

  const layers = lite ? [3, 2, 1] : [4, 3, 2, 1];
  const pitch = BRICK.w + BRICK.gap;
  layers.forEach((size, layer) => {
    for (let ix = 0; ix < size; ix++) {
      for (let iz = 0; iz < size; iz++) {
        const mat = layer === layers.length - 1 ? chromeMat : (mats[(ix + iz + layer) % mats.length] as THREE.Material);
        add(
          new THREE.Mesh(brickGeo, mat),
          new THREE.Vector3((ix - (size - 1) / 2) * pitch, layer * (BRICK.h + BRICK.gap) + 0.1, (iz - (size - 1) / 2) * pitch),
          layer / layers.length,
        );
      }
    }
  });
  const orb = new THREE.Mesh(new THREE.SphereGeometry(1.1, lite ? 24 : 48, lite ? 16 : 32), chromeMat);
  add(orb, new THREE.Vector3(0, layers.length * (BRICK.h + BRICK.gap) + 1.2, 0), 0.92);

  // Giant soap-bubble dome around the island (the "world in a bubble").
  const domeMat = bubbleMaterial(pal);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(15, lite ? 32 : 64, lite ? 24 : 48), domeMat);
  dome.position.y = 3;
  group.add(dome);

  return {
    group,
    timed: [domeMat],
    update(time, motion, a) {
      for (const p of pieces) {
        const t = ease(clamp01((a - p.delay) / 0.4));
        p.mesh.position.lerpVectors(p.from, p.to, t);
        p.mesh.quaternion.slerpQuaternions(p.qFrom, q0, t);
        if (motion && t < 1) p.mesh.position.y += Math.sin(time * 0.8 + p.bob) * 0.4 * (1 - t);
      }
      tower.rotation.y = -0.6 + a * 1.2 + (motion ? time * 0.05 : 0);
      group.position.y = motion ? Math.sin(time * 0.4) * 0.3 : 0;
    },
  };
}

// ---------------------------------------------------------------------------
// Game screen

function placeholderTexture(title: string, pal: WorldPalette): THREE.CanvasTexture {
  const w = 1024;
  const h = 576;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  if (g) {
    const css = (col: THREE.Color) => `#${col.getHexString()}`;
    const bg = g.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, css(pal.blue));
    bg.addColorStop(0.55, css(pal.lilac));
    bg.addColorStop(1, css(pal.pink));
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);
    // Bubbles
    g.strokeStyle = 'rgba(255,255,255,0.8)';
    g.lineWidth = 4;
    for (const [x, y, r] of [[180, 150, 90], [860, 130, 60], [780, 430, 110], [120, 470, 50]] as const) {
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.stroke();
    }
    const display = readFont('--font-display');
    g.fillStyle = css(pal.ink);
    g.textAlign = 'center';
    g.font = `700 64px ${display}`;
    g.fillText(title, w / 2, h / 2 + 20, w - 120);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function gameLandmark(ctx: Ctx, image: string, title: string): Landmark & { face(target: THREE.Vector3): void } {
  const { pal, lite, rand } = ctx;
  const group = new THREE.Group();
  const holder = new THREE.Group();
  group.add(holder);

  // 16:9, matching Roblox game thumbnails.
  const W = 10.4;
  const H = 5.85;
  const frame = new THREE.Mesh(new RoundedBoxGeometry(W + 0.9, H + 0.9, 0.6, lite ? 2 : 4, 0.4), chrome(pal, lite));
  const screenMat = new THREE.MeshBasicMaterial({ map: placeholderTexture(title, pal), toneMapped: false });
  if (image) {
    new THREE.TextureLoader().load(image, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      screenMat.map?.dispose();
      screenMat.map = tex;
      screenMat.needsUpdate = true;
    });
  }
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(W, H), screenMat);
  screen.position.z = 0.31;
  holder.add(frame, screen);

  const isle = island(ctx, 4);
  isle.position.y = -H / 2 - 2.2;
  group.add(isle);

  // Glossy blocks orbiting the screen.
  const brickGeo = brickGeometry(lite);
  const orbiters: Array<{ m: THREE.Mesh; r: number; s: number; o: number; y: number }> = [];
  const colors = [pal.pink, pal.blue, pal.lilac];
  for (let i = 0; i < 3; i++) {
    const m = new THREE.Mesh(brickGeo, glossy(colors[i] as THREE.Color, lite));
    m.scale.setScalar(0.6);
    group.add(m);
    orbiters.push({ m, r: 7.5 + rand() * 1.5, s: 0.25 + rand() * 0.15, o: (i / 3) * Math.PI * 2, y: rand() * 4 - 2 });
  }

  return {
    group,
    timed: [],
    face(target) {
      holder.rotation.y = Math.atan2(target.x - group.position.x, target.z - group.position.z);
    },
    update(time, motion) {
      holder.position.y = motion ? Math.sin(time * 0.7) * 0.35 : 0;
      const t = motion ? time : 0;
      for (const o of orbiters) {
        const a = o.o + t * o.s;
        o.m.position.set(Math.cos(a) * o.r, o.y + Math.sin(t + o.o) * 0.5, Math.sin(a) * o.r * 0.6);
        o.m.rotation.set(t * 0.5 + o.o, t * 0.7, 0);
      }
    },
  };
}

// ---------------------------------------------------------------------------
// Promises: chrome sculpture

export function promisesLandmark(ctx: Ctx): Landmark {
  const { pal, lite, rand } = ctx;
  const group = new THREE.Group();
  const mat = chrome(pal, lite);
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(3.2, 0.85, lite ? 96 : 200, lite ? 12 : 24), mat);
  group.add(knot);

  const starGeo = sparkleStarGeometry();
  const orbGeo = new THREE.SphereGeometry(1, 32, 24);
  const iri = glossy(pal.lilac, lite, 0.2);
  const satellites: Array<{ m: THREE.Mesh; r: number; s: number; o: number; tilt: number }> = [];
  for (let i = 0; i < (lite ? 5 : 9); i++) {
    const isStar = i % 2 === 0;
    const m = new THREE.Mesh(isStar ? starGeo : orbGeo, isStar ? mat : i % 3 === 0 ? iri : mat);
    m.scale.setScalar(isStar ? 0.9 + rand() * 0.8 : 0.4 + rand() * 0.6);
    group.add(m);
    satellites.push({ m, r: 6 + rand() * 4, s: 0.15 + rand() * 0.25, o: rand() * 6.28, tilt: rand() * 1.2 - 0.6 });
  }
  const halo = new THREE.Mesh(new THREE.TorusGeometry(8.5, 0.06, 8, 160), mat);
  halo.rotation.x = Math.PI / 2.3;
  group.add(halo);

  return {
    group,
    timed: [],
    update(time, motion) {
      const t = motion ? time : 0;
      knot.rotation.set(t * 0.2, t * 0.3, 0);
      halo.rotation.z = t * 0.1;
      for (const s of satellites) {
        const a = s.o + t * s.s;
        s.m.position.set(Math.cos(a) * s.r, Math.sin(a) * s.r * s.tilt + Math.sin(t + s.o) * 0.6, Math.sin(a) * s.r * 0.5);
        s.m.rotation.set(0, t * 0.8 + s.o, t * 0.3);
      }
    },
  };
}

// ---------------------------------------------------------------------------
// Contact: cotton-candy cloud bank + portal

export function contactLandmark(ctx: Ctx): Landmark {
  const { pal, lite, rand } = ctx;
  const group = new THREE.Group();

  const ringMat = glossy(pal.pink, lite, 0.35);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(6, 0.6, lite ? 16 : 32, lite ? 64 : 128), ringMat);
  ring.position.y = 3;
  group.add(ring);
  const inner = new THREE.Mesh(new THREE.TorusGeometry(5.1, 0.12, 12, 128), chrome(pal, lite));
  inner.position.y = 3;
  group.add(inner);

  // Glowing portal membrane: a bubble disc.
  const memMat = bubbleMaterial(pal);
  const membrane = new THREE.Mesh(new THREE.SphereGeometry(5, 48, 32), memMat);
  membrane.scale.z = 0.08;
  membrane.position.y = 3;
  group.add(membrane);

  // Cotton-candy cloud bank (pink puffs) under and around the portal.
  const puffs = lite ? 26 : 60;
  const puffGeo = new THREE.IcosahedronGeometry(1, lite ? 2 : 3);
  const puffMat = new THREE.MeshLambertMaterial({ color: pal.white, emissive: pal.pink, emissiveIntensity: 0.25 });
  const bank = new THREE.InstancedMesh(puffGeo, puffMat, puffs);
  const m = new THREE.Matrix4();
  const tint = new THREE.Color();
  for (let i = 0; i < puffs; i++) {
    const a = rand() * Math.PI * 2;
    const r = 4 + rand() * 12;
    const s = 1.6 + rand() * 2.6;
    m.compose(new THREE.Vector3(Math.cos(a) * r, -4 + rand() * 2.5, Math.sin(a) * r * 0.6 - 2), new THREE.Quaternion(), new THREE.Vector3(s, s * 0.8, s));
    bank.setMatrixAt(i, m);
    bank.setColorAt(i, tint.copy(pal.pink).lerp(pal.white, rand() * 0.6));
  }
  group.add(bank);

  return {
    group,
    timed: [memMat],
    update(time, motion) {
      const t = motion ? time : 0;
      ring.rotation.z = t * 0.15;
      inner.rotation.z = -t * 0.25;
      group.position.y = motion ? Math.sin(t * 0.35) * 0.3 : 0;
    },
  };
}
