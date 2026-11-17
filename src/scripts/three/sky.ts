/**
 * Sky dome: a vertical pastel gradient with a bright hazy horizon band and a
 * soft sun glow. Colours are lerped between zones as the camera travels.
 */
import * as THREE from 'three';
import type { SkyColors } from './palette';

export interface Sky {
  mesh: THREE.Mesh;
  set(c: SkyColors): void;
  dispose(): void;
}

export function createSky(initial: SkyColors, radius = 420): Sky {
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTop: { value: initial.top.clone() },
      uHorizon: { value: initial.horizon.clone() },
      uBottom: { value: initial.bottom.clone() },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_Position = p.xyww;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uTop;
      uniform vec3 uHorizon;
      uniform vec3 uBottom;
      varying vec3 vDir;
      void main() {
        float h = vDir.y;
        vec3 col = h > 0.0
          ? mix(uHorizon, uTop, pow(smoothstep(0.0, 0.75, h), 0.8))
          : mix(uHorizon, uBottom, smoothstep(0.0, -0.5, h));
        // Sun haze, top-left: the Frutiger "light leak".
        float sun = pow(max(dot(vDir, normalize(vec3(-0.5, 0.55, -0.65))), 0.0), 18.0);
        col += vec3(1.0) * sun * 0.45;
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 24), material);
  mesh.frustumCulled = false;
  mesh.renderOrder = -1;

  return {
    mesh,
    set(c) {
      material.uniforms.uTop!.value.copy(c.top);
      material.uniforms.uHorizon!.value.copy(c.horizon);
      material.uniforms.uBottom!.value.copy(c.bottom);
    },
    dispose() {
      mesh.geometry.dispose();
      material.dispose();
    },
  };
}
