'use client';

import { useEffect, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { gsap } from '@/components/site/motion';

/**
 * Auth particle canvas — a warm, breathing point cloud behind the login card.
 * ~2400 particles arranged in a loose sphere, drifting with slow turbulence.
 *
 * `intensityRef` (0 → 1) is driven by the parent auth-client on login success:
 *   0 = idle ambient drift
 *   1 = full vortex — particles rush toward center, spin fast, glow bright
 *
 * Renders on the GSAP ticker (same RAF clock as Lenis); pauses when invisible.
 */

const COUNT = 2400;

const VERTEX = /* glsl */ `
  attribute float aSeed;
  attribute float aRadius;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uIntensity;
  varying float vSeed;
  varying float vIntensity;

  void main() {
    // Speed ramps from gentle (1x) to moderately faster (2x) with intensity
    float speed = 1.0 + uIntensity * 1.0;
    float angle1 = aSeed * 6.2831853 + uTime * (0.04 + aSeed * 0.03) * speed;
    float angle2 = acos(1.0 - 2.0 * fract(aSeed * 137.035999));

    // Radius contracts gently toward center as intensity rises
    float contractedRadius = mix(aRadius, 1.5 + aSeed * 1.2, uIntensity * uIntensity);
    float r = contractedRadius + sin(uTime * 0.3 * speed + aSeed * 43.0) * 0.6 * (1.0 - uIntensity * 0.4);

    vec3 pos = vec3(
      r * sin(angle2) * cos(angle1),
      r * sin(angle2) * sin(angle1) * 0.65,
      r * cos(angle2) * 0.7
    );

    // Turbulence increases subtly with the vortex
    float turbulence = 0.35 + uIntensity * 0.6;
    pos += turbulence * vec3(
      sin(uTime * 0.5 * speed + aSeed * 29.0),
      cos(uTime * 0.4 * speed + aSeed * 17.0),
      sin(uTime * 0.6 * speed + aSeed * 53.0)
    );

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    // Points grow gently as they converge
    float sizeBoost = 1.0 + uIntensity * 0.8;
    gl_PointSize = uSize * uPixelRatio * (0.3 + aSeed * 0.7) * sizeBoost * (30.0 / -mv.z);

    vSeed = aSeed;
    vIntensity = uIntensity;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uColorBase;
  uniform vec3 uColorAccent;
  uniform vec3 uColorWhite;
  uniform float uIntensity;
  varying float vSeed;
  varying float vIntensity;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float alpha = smoothstep(0.5, 0.08, length(uv));

    // At idle: ~14% accent. At full intensity: everything shifts toward bright white-gold
    float accentMix = mix(step(0.86, vSeed), 1.0, vIntensity);
    vec3 baseColor = mix(uColorBase, uColorAccent, accentMix);
    vec3 color = mix(baseColor, uColorWhite, vIntensity * vIntensity * 0.7);

    // Brightness ramps dramatically
    float brightness = mix(0.35 + 0.25 * vSeed, 0.9 + 0.1 * vSeed, vIntensity);
    gl_FragColor = vec4(color, alpha * brightness);
  }
`;

export interface AuthParticlesProps {
  intensityRef: MutableRefObject<number>;
}

export function AuthParticles({ intensityRef }: AuthParticlesProps) {
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
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 80);
    camera.position.z = 16;

    // Build geometry
    const seeds = new Float32Array(COUNT);
    const radii = new Float32Array(COUNT);
    const positions = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      seeds[i] = Math.random();
      radii[i] = 3 + Math.random() * 7;
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    geometry.setAttribute('aRadius', new THREE.BufferAttribute(radii, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 22 },
        uPixelRatio: { value: pixelRatio },
        uIntensity: { value: 0 },
        uColorBase: { value: new THREE.Color(readToken('--sq-inverse-soft', '#b5ac99')) },
        uColorAccent: { value: new THREE.Color(readToken('--sq-accent', '#e4572e')) },
        uColorWhite: { value: new THREE.Color('#fff5e6') },
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

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: '25%' }
    );
    io.observe(holder);

    const tick = (_time: number, deltaTime: number) => {
      if (!visible) return;

      const intensity = intensityRef.current;
      material.uniforms.uTime.value += deltaTime / 1000;
      material.uniforms.uIntensity.value = intensity;

      // Rotation accelerates gently during the vortex
      const rotSpeed = 0.015 + intensity * 0.04;
      points.rotation.y = material.uniforms.uTime.value * rotSpeed;
      points.rotation.x = Math.sin(material.uniforms.uTime.value * 0.08) * 0.06
        + intensity * 0.12;

      // Camera pushes in subtly during vortex
      camera.position.z = 16 - intensity * 3;

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
  }, [intensityRef]);

  return <div ref={holderRef} className="absolute inset-0 [&>canvas]:h-full [&>canvas]:w-full" />;
}

export default AuthParticles;
