// The workbench: long benches either side of the aisle, set with radios, scopes, coils and boards,
// under hanging lamps, running to the sun. Scenery for cargopete.com.
import { createWorld, COLORS } from './world.js';

function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

export function createWorkbench(canvas, opts = {}) {
  const W = createWorld(canvas, { fog: 0.034, bloom: 0.32, ...opts });
  const { THREE, scene, camera } = W;
  const rand = rng(opts.seed ?? 11);
  const box = new THREE.BoxGeometry(1, 1, 1);
  const iron = new THREE.MeshStandardMaterial({ color: COLORS.iron, metalness: 0.7, roughness: 0.35 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x24170f, metalness: 0.05, roughness: 0.7 });
  const brass = new THREE.MeshStandardMaterial({ color: COLORS.brass, metalness: 0.95, roughness: 0.3 });
  const copper = new THREE.MeshStandardMaterial({ color: COLORS.copper, metalness: 0.9, roughness: 0.35 });
  const bakelite = new THREE.MeshStandardMaterial({ color: COLORS.bakelite, metalness: 0.1, roughness: 0.4 });
  const board = new THREE.MeshStandardMaterial({ color: 0x1d1410, roughness: 0.8 });
  const glowMat = new THREE.MeshBasicMaterial({ color: COLORS.glow, toneMapped: false });
  const scopes = [];
  const lampsSwing = [];

  const BENCH_H = 0.95, LEN = 110, AISLE = 2.6;
  for (const side of [-1, 1]) {
    const top = new THREE.Mesh(box, wood); top.scale.set(1.4, 0.08, LEN); top.position.set(side * (AISLE + 0.7), BENCH_H, -LEN / 2 + 6); scene.add(top);
    const apron = new THREE.Mesh(box, iron); apron.scale.set(1.3, 0.85, LEN); apron.position.set(side * (AISLE + 0.75), BENCH_H / 2 - 0.05, -LEN / 2 + 6); scene.add(apron);
  }

  function radio(g) {
    const s = new THREE.Shape(), w = 0.32, h = 0.3;
    s.moveTo(-w, 0); s.lineTo(w, 0); s.lineTo(w, h); s.absarc(0, h, w, 0, Math.PI, false); s.lineTo(-w, 0);
    const cab = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.3, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2, curveSegments: 24 }), bakelite);
    cab.position.z = -0.15; g.add(cab);
    const dial = new THREE.Mesh(new THREE.CircleGeometry(0.08, 24), glowMat); dial.position.set(0, 0.18, 0.17); g.add(dial);
    const bez = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.01, 6, 24), brass); bez.position.copy(dial.position); g.add(bez);
  }
  function scope(g) {
    const b = new THREE.Mesh(box, iron); b.scale.set(0.55, 0.42, 0.5); b.position.y = 0.21; g.add(b);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.24), new THREE.MeshBasicMaterial({ color: 0x140b07 })); scr.position.set(-0.05, 0.24, 0.251); g.add(scr);
    const n = 48, pos = new Float32Array(n * 3), geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: COLORS.glow, toneMapped: false })); line.position.set(-0.05, 0.24, 0.255); g.add(line);
    for (let i = 0; i < 3; i++) { const k = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.03, 12), brass); k.rotation.x = Math.PI / 2; k.position.set(0.19, 0.12 + i * 0.1, 0.26); g.add(k); }
    scopes.push({ line, pos, n, f: 3 + rand() * 5, ph: rand() * 6 });
  }
  function coil(g) {
    const c = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.05, 12, 32), copper); c.rotation.x = Math.PI / 2; c.position.y = 0.05; g.add(c);
    const c2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.34, 20), copper); c2.position.set(0.32, 0.17, 0); g.add(c2);
  }
  function pcb(g) {
    const b = new THREE.Mesh(box, board); b.scale.set(0.6, 0.02, 0.4); b.position.y = 0.01; g.add(b);
    for (let i = 0; i < 9; i++) { const t = new THREE.Mesh(box, copper); t.scale.set(0.5 * rand() + 0.1, 0.004, 0.012); t.position.set((rand() - 0.5) * 0.3, 0.022, (rand() - 0.5) * 0.32); g.add(t); }
    for (let i = 0; i < 4; i++) { const ch = new THREE.Mesh(box, bakelite); ch.scale.set(0.09, 0.03, 0.06); ch.position.set((rand() - 0.5) * 0.4, 0.035, (rand() - 0.5) * 0.25); g.add(ch); }
    for (let i = 0; i < 3; i++) { const v = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.14, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 })); v.position.set(-0.2 + i * 0.12, 0.09, 0.12); g.add(v); const f = new THREE.Mesh(box, glowMat); f.scale.set(0.012, 0.06, 0.012); f.position.set(-0.2 + i * 0.12, 0.09, 0.12); g.add(f); }
  }
  function valveTester(g) {
    const b = new THREE.Mesh(box, wood); b.scale.set(0.6, 0.18, 0.45); b.position.y = 0.09; g.add(b);
    const panel = new THREE.Mesh(box, iron); panel.scale.set(0.56, 0.01, 0.41); panel.position.y = 0.185; g.add(panel);
    const meter = new THREE.Mesh(new THREE.CircleGeometry(0.07, 24), new THREE.MeshBasicMaterial({ color: 0xe9c2ab, toneMapped: false })); meter.rotation.x = -Math.PI / 2; meter.position.set(-0.15, 0.192, 0); g.add(meter);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.072, 0.01, 6, 24), brass); rim.rotation.x = -Math.PI / 2; rim.position.copy(meter.position); g.add(rim);
  }
  const kinds = [radio, scope, coil, pcb, valveTester, scope, radio];
  for (let z = 4; z > -LEN + 8; z -= 1.3 + rand() * 1.1) {
    for (const side of [-1, 1]) {
      if (rand() < 0.3) continue;
      const g = new THREE.Group();
      g.position.set(side * (AISLE + 0.55 + rand() * 0.3), BENCH_H + 0.04, z);
      g.rotation.y = -side * Math.PI / 2 + (rand() - 0.5) * 0.5;
      scene.add(g);
      kinds[Math.floor(rand() * kinds.length)](g);
    }
  }
  // Hanging lamps over the benches: a shade, a warm bulb, a pool of light.
  for (let i = 0; i < 9; i++) {
    const side = i % 2 ? 1 : -1, z = 2 - i * 7;
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.22, 24, 1, true), iron); shade.position.set(side * (AISLE + 0.6), 2.9, z); scene.add(shade);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), glowMat); bulb.position.set(side * (AISLE + 0.6), 2.82, z); scene.add(bulb);
    const cord = new THREE.Mesh(box, bakelite); cord.scale.set(0.01, 3, 0.01); cord.position.set(side * (AISLE + 0.6), 4.5, z); scene.add(cord);
    const light = new THREE.PointLight(COLORS.brick, 5, 7, 1.6); light.position.set(side * (AISLE + 0.6), 2.7, z); scene.add(light);
    lampsSwing.push({ parts: [shade, bulb, light], side, z, ph: rand() * 6 });
  }
  const aisleGlow = new THREE.PointLight(0xffc7a6, 2.5, 30, 1.2); aisleGlow.position.set(0, 3, -24); scene.add(aisleGlow);

  W.tick((t, pointer, { reduced }) => {
    const walk = reduced ? 0.2 : (1 - Math.cos(t * 0.03)) / 2;
    const z = 7 - walk * 24;
    camera.position.set(pointer.x * 0.4, 1.65 - pointer.y * 0.2, z);
    camera.lookAt(pointer.x * 0.6, 1.5, z - 20);
    for (const s of scopes) {
      for (let i = 0; i < s.n; i++) { const x = -0.14 + (i / (s.n - 1)) * 0.28; s.pos[i * 3] = x; s.pos[i * 3 + 1] = Math.sin(x * s.f * 20 + t * 2.5 + s.ph) * 0.07; s.pos[i * 3 + 2] = 0; }
      s.line.geometry.attributes.position.needsUpdate = true;
    }
    for (const l of lampsSwing) { const dx = Math.sin(t * 0.6 + l.ph) * 0.03; for (const p of l.parts) p.position.x = l.side * (AISLE + 0.6) + dx; }
  });
  W.render();
  return W;
}
