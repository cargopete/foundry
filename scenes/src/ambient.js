// The ambient layer: one fixed, transparent canvas behind the whole page, with machine parts scattered
// in the margins below the hero. They drift with the scroll at their own depth and turn slowly; they
// never sit behind the text column, and they fade to almost nothing on a phone.
import * as THREE from 'three';
import { COLORS } from './world.js';

function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

const mats = () => ({
  iron: new THREE.MeshStandardMaterial({ color: COLORS.iron, metalness: 0.7, roughness: 0.35 }),
  ironLit: new THREE.MeshStandardMaterial({ color: COLORS.ironLit, metalness: 0.55, roughness: 0.45 }),
  brass: new THREE.MeshStandardMaterial({ color: COLORS.brass, metalness: 0.95, roughness: 0.3 }),
  copper: new THREE.MeshStandardMaterial({ color: COLORS.copper, metalness: 0.9, roughness: 0.35 }),
  bakelite: new THREE.MeshStandardMaterial({ color: COLORS.bakelite, metalness: 0.1, roughness: 0.4 }),
  glass: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.05, transparent: true, opacity: 0.14, depthWrite: false }),
  glow: new THREE.MeshBasicMaterial({ color: COLORS.glow, toneMapped: false }),
});

// Each part returns a group about one unit tall, and optionally a spin function.
const PARTS = {
  valve(M) {
    const g = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.18, 24), M.bakelite); base.position.y = -0.45; g.add(base);
    const env = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.75, 24, 1, true), M.glass); g.add(env);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), M.glass); cap.position.y = 0.375; g.add(cap);
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.42, 0.1), M.iron); g.add(plate);
    const fil = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.36, 0.02), M.glow); fil.position.z = 0.07; g.add(fil);
    return { g, spin: (o, t) => { o.rotation.y = t * 0.2; } };
  },
  reel(M) {
    const g = new THREE.Group();
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.04, 40), M.ironLit); disc.rotation.x = Math.PI / 2; g.add(disc);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 20), M.brass); hub.rotation.x = Math.PI / 2; g.add(hub);
    for (let k = 0; k < 3; k++) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 0.05), M.iron); s.rotation.z = k * Math.PI * 2 / 3; s.position.z = 0.03; g.add(s); }
    return { g, spin: (o, t) => { o.rotation.z = t * 0.35; } };
  },
  coil(M) {
    const g = new THREE.Group();
    for (let k = 0; k < 7; k++) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.035, 10, 32), M.copper); r.rotation.x = Math.PI / 2; r.position.y = -0.3 + k * 0.1; g.add(r); }
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.8, 16), M.iron); g.add(core);
    return { g, spin: (o, t) => { o.rotation.y = t * 0.15; } };
  },
  rack(M, rand) {
    const g = new THREE.Group();
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.4, 0.5), M.iron); g.add(b);
    for (let r = 0; r < 7; r++) for (let c = 0; c < 4; c++) { if (rand() < 0.6) continue; const l = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.02), M.glow); l.position.set(-0.18 + c * 0.12, -0.5 + r * 0.15, 0.26); g.add(l); }
    return { g, spin: (o, t) => { o.rotation.y = 0.5 + Math.sin(t * 0.1) * 0.15; } };
  },
  radio(M) {
    const g = new THREE.Group();
    const s = new THREE.Shape(); s.moveTo(-0.4, -0.45); s.lineTo(0.4, -0.45); s.lineTo(0.4, 0.05); s.absarc(0, 0.05, 0.4, 0, Math.PI, false); s.lineTo(-0.4, -0.45);
    const cab = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.35, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 2, curveSegments: 24 }), M.bakelite); cab.position.z = -0.17; g.add(cab);
    const dial = new THREE.Mesh(new THREE.CircleGeometry(0.1, 24), M.glow); dial.position.set(0, -0.25, 0.22); g.add(dial);
    const bez = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.012, 6, 24), M.brass); bez.position.copy(dial.position); g.add(bez);
    return { g, spin: (o, t) => { o.rotation.y = Math.sin(t * 0.12) * 0.35; } };
  },
  armillary(M) {
    const g = new THREE.Group();
    for (let k = 0; k < 4; k++) { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.015, 8, 56), k % 2 ? M.brass : M.copper); ring.rotation.y = k * Math.PI / 4; g.add(ring); }
    const eq = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.02, 8, 56), M.brass); eq.rotation.x = Math.PI / 2; g.add(eq);
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 10), M.glow); g.add(core);
    g.rotation.z = 0.41;
    return { g, spin: (o, t) => { o.rotation.y = t * 0.12; } };
  },
  astrolabe(M) {
    const g = new THREE.Group();
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.04, 48), M.brass); plate.rotation.x = Math.PI / 2; g.add(plate);
    const rete = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.014, 6, 48), M.copper); rete.position.z = 0.03; g.add(rete);
    const ruler = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.03, 0.01), M.iron); ruler.position.z = 0.045; g.add(ruler);
    return { g, spin: (o, t) => { ruler.rotation.z = t * 0.2; o.rotation.y = Math.sin(t * 0.1) * 0.4; } };
  },
  scope(M) {
    const g = new THREE.Group();
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.6), M.iron); g.add(b);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.3), new THREE.MeshBasicMaterial({ color: 0x140b07 })); scr.position.set(-0.1, 0.03, 0.301); g.add(scr);
    const n = 40, pos = new Float32Array(n * 3), geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: COLORS.glow, toneMapped: false })); line.position.set(-0.1, 0.03, 0.305); g.add(line);
    return { g, spin: (o, t) => { for (let i = 0; i < n; i++) { const x = -0.19 + (i / (n - 1)) * 0.38; pos[i * 3] = x; pos[i * 3 + 1] = Math.sin(x * 40 + t * 2.5) * 0.08; } geo.attributes.position.needsUpdate = true; o.rotation.y = -0.4 + Math.sin(t * 0.1) * 0.2; } };
  },
};
const KITS = {
  machine: ['valve', 'reel', 'rack', 'coil', 'radio', 'valve', 'reel'],
  workbench: ['radio', 'scope', 'coil', 'valve', 'radio', 'scope'],
  observatory: ['armillary', 'astrolabe', 'armillary', 'reel', 'valve'],
};

export function createAmbient(canvas, opts = {}) {
  const reduced = opts.reducedMotion ?? matchMedia('(prefers-reduced-motion: reduce)').matches;
  const kit = KITS[opts.kit || 'machine'];
  const rand = rng(opts.seed ?? 5);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(COLORS.bg, 9, 26);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
  scene.add(new THREE.HemisphereLight(0x5a4034, 0x0c0907, 1.1));
  const key = new THREE.DirectionalLight(0xffb08a, 1.6); key.position.set(-4, 3, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffe2cf, 0.7); rim.position.set(5, -2, -3); scene.add(rim);
  const M = mats();
  const items = [];
  let width = 1, height = 1, k = 0.01;

  // Lay parts down the page in the side margins, below the first screen.
  function layout() {
    for (const it of items) scene.remove(it.o);
    items.length = 0;
    const doc = Math.max(document.documentElement.scrollHeight, window.innerHeight * 2);
    const vh = 2 * 10 * Math.tan((camera.fov * Math.PI / 180) / 2); // world height visible at depth 10
    k = vh / height;
    const halfW = (vh * camera.aspect) / 2;
    const content = opts.contentWidth ?? 1296; // px of the text column to keep clear
    const colShare = Math.min(1, content / width); // the text column as a share of the canvas width
    const spacing = opts.spacing ?? 380; // px between parts on one side
    for (let y = window.innerHeight * 0.95; y < doc - 200; y += spacing * (0.7 + rand() * 0.6)) {
      for (const side of [-1, 1]) {
        if (rand() < 0.3) continue;
        const depth = 11 + rand() * 9;
        // The whole column stays clear. A part is about 1.3 units wide at scale 1: it shrinks to fit
        // the margin beside the column, and is left out where the margin is too narrow for it.
        const hw = halfW * (depth / 10), col = hw * colShare, margin = hw - col;
        const scale = Math.min(0.75 + rand() * 0.7, margin / 1.4);
        if (scale < 0.35) continue;
        const name = kit[Math.floor(rand() * kit.length)];
        const { g, spin } = PARTS[name](M, rand);
        const free = Math.max(0, margin - 1.3 * scale);
        g.position.set(side * (col + 0.65 * scale + free * rand()), -(y + (rand() - 0.5) * 120) * k, 10 - depth);
        g.scale.setScalar(scale);
        g.rotation.x = (rand() - 0.5) * 0.4;
        scene.add(g);
        items.push({ o: g, spin, ph: rand() * 10 });
      }
    }
  }
  function resize() {
    const box = canvas.getBoundingClientRect();
    width = Math.max(1, box.width || window.innerWidth); height = Math.max(1, box.height || window.innerHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    canvas.style.opacity = window.innerWidth < 920 ? String(opts.phoneOpacity ?? 0.2) : String(opts.opacity ?? 0.6);
    layout();
  }
  let raf = 0, t0 = performance.now(), dirty = true;
  function frame(now) {
    const t = reduced ? 0 : (now - t0) / 1000;
    camera.position.set(0, -window.scrollY * k, 10);
    for (const it of items) it.spin(it.o, t + it.ph);
    renderer.render(scene, camera);
    dirty = false;
    raf = requestAnimationFrame(loop);
  }
  function loop(now) { if (!reduced || dirty) frame(now); else raf = requestAnimationFrame(loop); }
  window.addEventListener('scroll', () => { dirty = true; }, { passive: true });
  window.addEventListener('resize', () => { resize(); dirty = true; });
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(loop); });
  resize();
  // Pages that grow after load (charts, lazy sections) get their parts laid out again once.
  setTimeout(() => { layout(); dirty = true; }, 1500);
  raf = requestAnimationFrame(loop);
  return { relayout: () => { layout(); dirty = true; }, dispose() { cancelAnimationFrame(raf); renderer.dispose(); } };
}
