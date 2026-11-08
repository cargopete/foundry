// The Overview atmosphere every Foundry scene shares: a dark warm ground, a slate-free grid that runs
// to a banded brick sun, fog, gentle bloom, and a camera that drifts. Scenes add their own objects.
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

export const COLORS = {
  bg: new THREE.Color('#171614'),
  line: new THREE.Color('#9c978c'),
  brick: new THREE.Color('#d0704f'),
  brickInk: new THREE.Color('#f2cbbb'),
  glow: new THREE.Color('#ff8a4c'),
  iron: new THREE.Color('#1f1c19'),
  ironLit: new THREE.Color('#2e2a25'),
  brass: new THREE.Color('#a8863a'),
  copper: new THREE.Color('#b8734a'),
  bakelite: new THREE.Color('#1c130e'),
};

export function createWorld(canvas, opts = {}) {
  const reduced = opts.reducedMotion ?? matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(COLORS.bg);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(COLORS.bg, opts.fog ?? 0.03);
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 400);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), opts.bloom ?? 0.4, 0.5, 0.7);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // Light: a low warm ambient, the sun behind everything as a rim, and brick pools near the floor.
  scene.add(new THREE.HemisphereLight(0x5a4034, 0x0c0907, 1.2));
  const rim = new THREE.DirectionalLight(0xffb08a, 2.2);
  rim.position.set(0, 6, -40);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffe2cf, 0.35);
  fill.position.set(6, 8, 10);
  scene.add(fill);

  // The floor: the Overview's grid, scrolling gently toward the viewer.
  const gridMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uTime: { value: 0 }, uColor: { value: COLORS.line } },
    vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `
      uniform float uTime; uniform vec3 uColor; varying vec3 vW;
      float line(float v){ float d = abs(fract(v - 0.5) - 0.5) / fwidth(v); return 1.0 - min(d, 1.0); }
      void main(){
        vec2 p = vW.xz / 2.0; p.y += uTime * 0.25;
        float g = max(line(p.x), line(p.y));
        float fade = exp(-length(vW.xz) * 0.03);
        gl_FragColor = vec4(uColor, g * 0.22 * fade);
      }`,
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), gridMat);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ color: 0x0f0d0b, roughness: 0.95 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.02;
  scene.add(ground);

  // The sun: brick, banded at its foot, on the horizon.
  const sunMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    fog: false,
    uniforms: { uTime: { value: 0 }, uTop: { value: COLORS.brickInk }, uBottom: { value: COLORS.brick } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      uniform float uTime; uniform vec3 uTop; uniform vec3 uBottom; varying vec2 vUv;
      void main(){
        vec2 c = vUv - 0.5; float r = length(c); if (r > 0.5) discard;
        float y = vUv.y;
        float band = step(0.5, fract(y * 14.0 - uTime * 0.2));
        if (y < 0.48 && band * smoothstep(0.48, 0.0, y) * 1.4 > 0.5) discard;
        vec3 col = mix(uBottom, uTop, smoothstep(0.0, 1.0, y));
        gl_FragColor = vec4(col, smoothstep(0.5, 0.47, r) * 0.88);
      }`,
  });
  const sun = new THREE.Mesh(new THREE.PlaneGeometry(56, 56), sunMat);
  sun.position.set(opts.sunX ?? 0, 10, -160);
  scene.add(sun);

  let width = 1, height = 1, raf = 0, running = false, onTick = null;
  const pointer = { x: 0, y: 0 };
  const t0 = performance.now();

  function resize() {
    const r = canvas.getBoundingClientRect();
    width = Math.max(1, r.width); height = Math.max(1, r.height);
    renderer.setSize(width, height, false);
    composer.setSize(width, height);
    camera.aspect = width / height;
    camera.fov = width < 700 ? 60 : 46;
    camera.updateProjectionMatrix();
  }
  function frame(now) {
    const t = reduced ? 0 : (now - t0) / 1000;
    gridMat.uniforms.uTime.value = t;
    sunMat.uniforms.uTime.value = t;
    if (onTick) onTick(t, pointer, { width, height, reduced });
    composer.render();
    if (running && !reduced) raf = requestAnimationFrame(frame);
  }
  const once = () => requestAnimationFrame(frame);
  window.addEventListener('resize', () => { resize(); once(); });
  window.addEventListener('pointermove', (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !running) { running = true; raf = requestAnimationFrame(frame); }
    if (!e.isIntersecting) { running = false; cancelAnimationFrame(raf); }
  });
  io.observe(canvas);
  resize();

  return {
    THREE, scene, camera, renderer, sun, reduced,
    tick(fn) { onTick = fn; },
    render: once,
    dispose() { running = false; cancelAnimationFrame(raf); io.disconnect(); renderer.dispose(); },
  };
}
