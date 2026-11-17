/**
 * Shared materials for the dream-sky world:
 *  - glossy candy plastic (Frutiger Aero),
 *  - chrome that reflects the pastel sky (Y2K / Y3K),
 *  - soap bubbles with an iridescent rim (works on Mesh and InstancedMesh),
 */
import * as THREE from 'three';
import type { WorldPalette } from './palette';

export function glossy(color: THREE.Color, lite: boolean, emissive = 0.12): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color,
    emissive: color,
    emissiveIntensity: emissive,
    roughness: 0.18,
    metalness: 0.02,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    iridescence: lite ? 0 : 0.35,
    iridescenceIOR: 1.3,
    envMapIntensity: 1.2,
  });
}

export function chrome(pal: WorldPalette, lite: boolean): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: pal.white,
    metalness: 1,
    roughness: 0.06,
    iridescence: lite ? 0 : 0.7,
    iridescenceIOR: 1.7,
    envMapIntensity: 1.5,
  });
}

/**
 * Soap bubble: clear centre, pink→blue iridescent rim, specular glint.
 * Optional rising motion (uRise > 0) for the aqua bubble column.
 * Per-instance `aPhase` gives each bubble its own wobble.
 */
export function bubbleMaterial(pal: WorldPalette, rise = 0, riseSpeed = 0): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uRise: { value: rise },
      uRiseSpeed: { value: riseSpeed },
      uPink: { value: pal.pink.clone() },
      uBlue: { value: pal.blue.clone() },
      uAqua: { value: pal.aqua.clone() },
      uWhite: { value: pal.white.clone() },
    },
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform float uRise;
      uniform float uRiseSpeed;
      attribute float aPhase;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vec4 local = vec4(position, 1.0);
        mat4 model = modelMatrix;
        vec3 n = normal;
        #ifdef USE_INSTANCING
          model = modelMatrix * instanceMatrix;
          n = mat3(instanceMatrix) * normal;
          float ph = aPhase;
        #else
          float ph = 0.0;
        #endif
        vec4 world = model * local;
        world.x += sin(uTime * 0.6 + ph * 6.28) * 0.4;
        world.y += sin(uTime * 0.45 + ph * 12.0) * 0.5;
        if (uRise > 0.0) {
          world.y += mod(ph * uRise + uTime * uRiseSpeed, uRise);
        }
        vec4 mv = viewMatrix * world;
        vNormal = normalize(mat3(viewMatrix) * mat3(modelMatrix) * n);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uPink;
      uniform vec3 uBlue;
      uniform vec3 uAqua;
      uniform vec3 uWhite;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float facing = max(dot(vNormal, vView), 0.0);
        float rim = pow(1.0 - facing, 2.4);
        float band = vNormal.y * 0.6 + vNormal.x * 0.4;
        vec3 film = mix(uBlue, uPink, smoothstep(-0.7, 0.2, band));
        film = mix(film, uAqua, smoothstep(0.2, 0.9, band));
        float glint = smoothstep(0.92, 1.0, dot(vNormal, normalize(vec3(-0.45, 0.6, 0.65))));
        vec3 col = mix(film, uWhite, glint);
        float alpha = clamp(rim * 0.95 + glint * 0.9 + 0.04, 0.0, 1.0);
        gl_FragColor = vec4(col, alpha);
      }
    `,
  });
}
