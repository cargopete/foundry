// The machine room: an aisle of valve-era equipment running to the sun. Scenery, not instruments:
// nothing here stands for a number. Dark metal, lit from behind, with lamps, valves and reels alive.
import { createWorld, COLORS } from './world.js';

function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

export function createMachineRoom(canvas, opts = {}) {
  const W = createWorld(canvas, { fog: 0.03, bloom: 0.3, ...opts });
  const { THREE, scene, camera } = W;
  const rand = rng(opts.seed ?? 7);

  const iron = new THREE.MeshStandardMaterial({ color: COLORS.iron, metalness: 0.7, roughness: 0.35 });
  const ironLit = new THREE.MeshStandardMaterial({ color: COLORS.ironLit, metalness: 0.5, roughness: 0.5 });
  const brass = new THREE.MeshStandardMaterial({ color: COLORS.brass, metalness: 0.95, roughness: 0.3 });
  const bakelite = new THREE.MeshStandardMaterial({ color: COLORS.bakelite, metalness: 0.1, roughness: 0.4 });
  const glass = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.05, transparent: true, opacity: 0.12, depthWrite: false });
  const box = new THREE.BoxGeometry(1, 1, 1);

  // Lamps and valve filaments share one instanced mesh each, so a hundred machines cost a few draws.
  const MAX_LAMPS = 2400;
  const lamps = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ toneMapped: false }), MAX_LAMPS);
  const lampBase = [];
  let nLamps = 0;
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v3 = new THREE.Vector3(), s3 = new THREE.Vector3();
  const dark = new THREE.Color('#2a1a14');
  function lamp(group, x, y, z, size, on) {
    if (nLamps >= MAX_LAMPS) return;
    group.updateMatrixWorld(true);
    v3.set(x, y, z).applyMatrix4(group.matrixWorld);
    group.getWorldQuaternion(q);
    s3.set(size, size, size * 0.4);
    m4.compose(v3, q, s3);
    lamps.setMatrixAt(nLamps, m4);
    const c = on ? COLORS.glow.clone().multiplyScalar(0.6 + rand() * 0.8) : dark;
    lamps.setColorAt(nLamps, c);
    lampBase.push(on);
    nLamps++;
  }

  const reels = [];
  const scopes = [];

  // ---- the machines ----
  function rack(g) {
    const h = 2.4 + rand() * 0.5;
    const b = new THREE.Mesh(box, iron); b.scale.set(0.95, h, 0.8); b.position.y = h / 2; g.add(b);
    const p = new THREE.Mesh(box, ironLit); p.scale.set(0.8, h - 0.3, 0.02); p.position.set(0, h / 2, 0.41); g.add(p);
    const rows = Math.floor(5 + rand() * 6), cols = Math.floor(4 + rand() * 4);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      if (rand() < 0.25) continue;
      lamp(g, -0.3 + (c / (cols - 1)) * 0.6, 0.5 + r * ((h - 0.9) / rows), 0.43, 0.035, rand() < 0.35);
    }
    for (let i = 0; i < 6; i++) { const v = new THREE.Mesh(box, iron); v.scale.set(0.6, 0.012, 0.01); v.position.set(0, 0.2 + i * 0.05, 0.43); g.add(v); }
  }
  function tape(g) {
    const h = 2.2;
    const b = new THREE.Mesh(box, iron); b.scale.set(1.1, h, 0.8); b.position.y = h / 2; g.add(b);
    for (const y of [1.65, 1.0]) {
      const reel = new THREE.Group(); reel.position.set(0, y, 0.43);
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.02, 36), ironLit); disc.rotation.x = Math.PI / 2; reel.add(disc);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.04, 18), brass); hub.rotation.x = Math.PI / 2; reel.add(hub);
      for (let k = 0; k < 3; k++) { const s = new THREE.Mesh(box, iron); s.scale.set(0.05, 0.36, 0.03); s.rotation.z = k * Math.PI / 3 * 2; s.position.z = 0.012; reel.add(s); }
      g.add(reel); reels.push({ reel, speed: (0.3 + rand() * 0.5) * (y > 1.3 ? 1 : -1) });
    }
    for (let i = 0; i < 4; i++) lamp(g, -0.36 + i * 0.24, 0.35, 0.42, 0.04, rand() < 0.5);
  }
  function valveBank(g) {
    const b = new THREE.Mesh(box, iron); b.scale.set(1.4, 0.9, 0.9); b.position.y = 0.45; g.add(b);
    const deck = new THREE.Mesh(box, ironLit); deck.scale.set(1.3, 0.04, 0.8); deck.position.y = 0.92; g.add(deck);
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) {
      const x = -0.45 + c * 0.3, z = -0.15 + r * 0.3;
      const env = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.075, 0.42, 16, 1, true), glass); env.position.set(x, 1.15, z); g.add(env);
      lamp(g, x, 1.12, z, 0.05, rand() < 0.85);
    }
    for (let i = 0; i < 5; i++) { const k = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.05, 14), brass); k.rotation.x = Math.PI / 2; k.position.set(-0.5 + i * 0.25, 0.5, 0.46); g.add(k); }
  }
  function scope(g) {
    const b = new THREE.Mesh(box, iron); b.scale.set(1.2, 1.0, 0.9); b.position.y = 0.5; g.add(b);
    const mon = new THREE.Mesh(box, bakelite); mon.scale.set(0.9, 0.75, 0.7); mon.position.set(0, 1.4, 0); g.add(mon);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.48), new THREE.MeshBasicMaterial({ color: 0x140b07 })); scr.position.set(0, 1.42, 0.351); g.add(scr);
    const n = 64, pos = new Float32Array(n * 3);
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: COLORS.glow, toneMapped: false })); line.position.set(0, 1.42, 0.355); g.add(line);
    scopes.push({ line, pos, n, f: 2 + rand() * 4, ph: rand() * 6 });
    for (let i = 0; i < 3; i++) lamp(g, -0.3 + i * 0.3, 0.3, 0.46, 0.04, true);
  }
  function radio(g) {
    const shape = new THREE.Shape();
    const w = 0.5, hgt = 0.55;
    shape.moveTo(-w, 0); shape.lineTo(w, 0); shape.lineTo(w, hgt); shape.absarc(0, hgt, w, 0, Math.PI, false); shape.lineTo(-w, 0);
    const cab = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.45, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 3, curveSegments: 32 }), bakelite);
    cab.position.set(0, 1.0, -0.2); g.add(cab);
    const stand = new THREE.Mesh(box, iron); stand.scale.set(1.2, 1.0, 0.8); stand.position.y = 0.5; g.add(stand);
    const dial = new THREE.Mesh(new THREE.CircleGeometry(0.13, 32), new THREE.MeshBasicMaterial({ color: COLORS.glow.clone().multiplyScalar(0.9), toneMapped: false }));
    dial.position.set(0, 1.25, 0.29); g.add(dial);
    const bez = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.015, 8, 32), brass); bez.position.copy(dial.position); g.add(bez);
  }
  const kinds = [rack, rack, rack, tape, valveBank, scope, radio];

  // ---- the aisle ----
  const ROWS = 34, STEP = 3.1, AISLE = 3.4;
  for (let i = 0; i < ROWS; i++) {
    for (const side of [-1, 1]) {
      if (rand() < 0.12) continue;
      const g = new THREE.Group();
      g.position.set(side * (AISLE + rand() * 0.3), 0, 4 - i * STEP - rand() * 0.6);
      g.rotation.y = -side * Math.PI / 2 + (rand() - 0.5) * 0.08;
      scene.add(g);
      kinds[Math.floor(rand() * kinds.length)](g);
    }
  }
  const cableMat = new THREE.MeshStandardMaterial({ color: 0x14100d, roughness: 0.95, metalness: 0 });
  for (const x of [-2.5, 2.6]) {
    const run = new THREE.LineCurve3(new THREE.Vector3(x, 0.04, 6), new THREE.Vector3(x, 0.04, -90));
    scene.add(new THREE.Mesh(new THREE.TubeGeometry(run, 1, 0.04, 6, false), cableMat));
  }
  lamps.count = nLamps;
  lamps.instanceMatrix.needsUpdate = true;
  if (lamps.instanceColor) lamps.instanceColor.needsUpdate = true;
  scene.add(lamps);

  // Brick pools of light along the aisle, so the floor reads.
  // Brick pools of light down the aisle, one per side every few bays, so fronts and floor catch an edge.
  for (let i = 0; i < 12; i++) {
    const p = new THREE.PointLight(COLORS.brick, 4.5, 9, 1.6);
    p.position.set((i % 2 ? 1 : -1) * 1.9, 0.6 + (i % 3) * 0.9, 3 - i * 6.5);
    scene.add(p);
  }
  const aisleGlow = new THREE.PointLight(0xffc7a6, 3, 30, 1.2);
  aisleGlow.position.set(0, 3, -24);
  scene.add(aisleGlow);

  // ---- motion: a slow walk down the aisle, lamps that blink now and then ----
  let lastBlink = 0;
  const tmp = new THREE.Color();
  W.tick((t, pointer, { reduced }) => {
    const walk = reduced ? 0.25 : (1 - Math.cos(t * 0.035)) / 2;
    const z = 7 - walk * 30;
    camera.position.set(pointer.x * 0.5, 1.7 - pointer.y * 0.25, z);
    camera.lookAt(pointer.x * 0.8, 1.9, z - 20);
    for (const r of reels) r.reel.rotation.z = t * r.speed;
    for (const s of scopes) {
      for (let i = 0; i < s.n; i++) {
        const x = -0.28 + (i / (s.n - 1)) * 0.56;
        s.pos[i * 3] = x;
        s.pos[i * 3 + 1] = Math.sin(x * s.f * 10 + t * 2 + s.ph) * 0.12 * Math.sin(t * 0.5 + s.ph);
        s.pos[i * 3 + 2] = 0;
      }
      s.line.geometry.attributes.position.needsUpdate = true;
    }
    if (!reduced && t - lastBlink > 0.15 && lamps.instanceColor) {
      lastBlink = t;
      for (let k = 0; k < 18; k++) {
        const i = Math.floor(Math.random() * nLamps);
        if (lampBase[i] === undefined) continue;
        lampBase[i] = !lampBase[i];
        lamps.setColorAt(i, lampBase[i] ? tmp.copy(COLORS.glow).multiplyScalar(0.6 + Math.random() * 0.8) : dark);
      }
      lamps.instanceColor.needsUpdate = true;
    }
  });
  W.render();
  return W;
}
