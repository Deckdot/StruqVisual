'use client';

import { useEffect, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { gsap } from '@/components/site/motion';

/**
 * WebGL layer for the Geheugen section: een puntenwolk die van chaos
 * (elke chat begint bij nul) naar een geordend geheugenrooster trekt.
 * De voortgang komt binnen via `progressRef` (0 = chaos, 1 = orde) zodat de
 * sectie de regie houdt; deze component rendert alleen. Eén RAF-klok: de
 * render draait op de GSAP-ticker en alleen zolang het canvas in beeld is.
 */

const COUNT_X = 30;
const COUNT_Y = 16;
const COUNT_Z = 8;
const SPACING = 0.42;

const VERTEX = /* glsl */ `
  attribute vec3 aStart;
  attribute vec3 aEnd;
  attribute float aSeed;
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vSeed;
  varying float vP;

  void main() {
    // Per-point offset zodat het rooster in golven samentrekt.
    float p = clamp((uProgress - aSeed * 0.4) / 0.6, 0.0, 1.0);
    p = p * p * (3.0 - 2.0 * p);
    vec3 pos = mix(aStart, aEnd, p);

    float drift = (1.0 - p) * 0.42;
    pos += drift * vec3(
      sin(uTime * 0.6 + aSeed * 43.0),
      cos(uTime * 0.5 + aSeed * 29.0),
      sin(uTime * 0.7 + aSeed * 17.0)
    );

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.5 + aSeed * 0.9) * (34.0 / -mv.z);
    vSeed = aSeed;
    vP = p;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vSeed;
  varying float vP;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float alpha = smoothstep(0.5, 0.12, length(uv));
    // Een vaste fractie van de punten kleurt accent zodra ze hun plek vinden.
    float accent = step(0.86, vSeed) * vP;
    vec3 color = mix(uColorA, uColorB, accent);
    float fade = 0.45 + 0.55 * vP;
    gl_FragColor = vec4(color, alpha * fade);
  }
`;

function buildGeometry() {
  const count = COUNT_X * COUNT_Y * COUNT_Z;
  const start = new Float32Array(count * 3);
  const end = new Float32Array(count * 3);
  const seed = new Float32Array(count);

  const rand = gsap.utils.random;
  let i = 0;
  for (let x = 0; x < COUNT_X; x += 1) {
    for (let y = 0; y < COUNT_Y; y += 1) {
      for (let z = 0; z < COUNT_Z; z += 1) {
        // Chaos: een losse wolk rond de camera-as.
        const radius = rand(5.5, 11);
        const theta = rand(0, Math.PI * 2);
        const phi = Math.acos(rand(-1, 1));
        start[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        start[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.7;
        start[i * 3 + 2] = radius * Math.cos(phi) * 0.8;

        // Orde: het geheugenrooster, exact op zijn plek.
        end[i * 3] = (x - (COUNT_X - 1) / 2) * SPACING + rand(-0.02, 0.02);
        end[i * 3 + 1] = (y - (COUNT_Y - 1) / 2) * SPACING + rand(-0.02, 0.02);
        end[i * 3 + 2] = (z - (COUNT_Z - 1) / 2) * SPACING + rand(-0.02, 0.02);

        seed[i] = Math.random();
        i += 1;
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(start.slice(), 3));
  geometry.setAttribute('aStart', new THREE.BufferAttribute(start, 3));
  geometry.setAttribute('aEnd', new THREE.BufferAttribute(end, 3));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  return geometry;
}

interface MemoryCanvasProps {
  progressRef: MutableRefObject<number>;
}

export function MemoryCanvas({ progressRef }: MemoryCanvasProps) {
  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return;

    const css = getComputedStyle(holder);
    const readToken = (token: string, fallback: string) =>
      css.getPropertyValue(token).trim() || fallback;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    holder.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 60);
    camera.position.z = 13;

    const geometry = buildGeometry();
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: 26 },
        uPixelRatio: { value: pixelRatio },
        uColorA: { value: new THREE.Color(readToken('--sq-inverse-soft', '#b5ac99')) },
        uColorB: { value: new THREE.Color(readToken('--sq-accent', '#e4572e')) },
      },
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const resize = () => {
      const { clientWidth, clientHeight } = holder;
      if (!clientWidth || !clientHeight) return;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(holder);

    // Alleen renderen terwijl de sectie (bijna) in beeld is.
    let visible = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: '25%' }
    );
    io.observe(holder);

    const tick = (_time: number, deltaTime: number) => {
      if (!visible) return;
      const progress = progressRef.current;
      material.uniforms.uTime.value += deltaTime / 1000;
      material.uniforms.uProgress.value = progress;

      // De wolk draait vrij en komt tot stilstand zodra de orde compleet is.
      points.rotation.y =
        0.65 * (1 - progress) + material.uniforms.uTime.value * 0.03 * (1 - progress * 0.85);
      points.rotation.x = 0.12 * (1 - progress);
      camera.position.z = 13 - 2.6 * progress;
      renderer.render(scene, camera);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [progressRef]);

  return <div ref={holderRef} className="absolute inset-0 [&>canvas]:h-full [&>canvas]:w-full" />;
}

export default MemoryCanvas;
