// The observatory: brass navigation instruments, telescopes and dishes in an open field under stars,
// facing the sun on the horizon. Scenery for Lodestar.
import { createWorld, COLORS } from './world.js';

function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

export function createObservatory(canvas, opts = {}) {
  const W = createWorld(canvas, { fog: 0.022, bloom: 0.34, ...opts });
  const { THREE, scene, camera } = W;
  const rand = rng(opts.seed ?? 3);
  const iron = new THREE.MeshStandardMaterial({ color: COLORS.iron, metalness: 0.7, roughness: 0.35 });
  const brass = new THREE.MeshStandardMaterial({ color: COLORS.brass, metalness: 0.95, roughness: 0.28 });
  const copper = new THREE.MeshStandardMaterial({ color: COLORS.copper, metalness: 0.9, roughness: 0.35 });
  const spinners = [];

  // Stars: a dome of faint points, a few in brick.
  const N = 1400, pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const th = rand() * Math.PI * 2, ph = Math.acos(rand() * 0.85), r = 150;
    pos[i * 3] = Math.sin(ph) * Math.cos(th) * r; pos[i * 3 + 1] = Math.cos(ph) * r * 0.7 + 4; pos[i * 3 + 2] = Math.sin(ph) * Math.sin(th) * r - 60;
    const c = rand() < 0.12 ? COLORS.brick : COLORS.brickInk, k = 0.4 + rand() * 0.6;
    col[i * 3] = c.r * k; col[i * 3 + 1] = c.g * k; col[i * 3 + 2] = c.b * k;
  }
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); sg.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const stars = new THREE.Points(sg, new THREE.PointsMaterial({ size: 0.6, vertexColors: true, fog: false, transparent: true, opacity: 0.9, sizeAttenuation: true }));
  scene.add(stars);

  function tripod(g, h) {
    for (let k = 0; k < 3; k++) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, h * 1.05, 8), iron);
      const a = k / 3 * Math.PI * 2;
      leg.position.set(Math.cos(a) * h * 0.22, h / 2, Math.sin(a) * h * 0.22);
      leg.lookAt(0, h, 0); leg.rotateX(Math.PI / 2);
      g.add(leg);
    }
  }
  function telescope(g) {
    const h = 1.6;
    tripod(g, h);
    const tube = new THREE.Group(); tube.position.y = h;
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 1.9, 24), brass); body.rotation.z = Math.PI / 2; tube.add(body);
    for (const x of [-0.7, 0, 0.7]) { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.018, 8, 24), copper); ring.rotation.y = Math.PI / 2; ring.position.x = x; tube.add(ring); }
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.1, 20), new THREE.MeshBasicMaterial({ color: COLORS.glow, toneMapped: false, transparent: true, opacity: 0.5 })); lens.rotation.y = -Math.PI / 2; lens.position.x = -0.96; tube.add(lens);
    tube.rotation.z = 0.45; tube.rotation.y = rand() * 0.6 - 0.3;
    g.add(tube);
  }
  function armillary(g) {
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.22, 1.2, 16), iron); stand.position.y = 0.6; g.add(stand);
    const sphere = new THREE.Group(); sphere.position.y = 1.9;
    const r = 0.65;
    for (let k = 0; k < 4; k++) { const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.018, 8, 64), k % 2 ? brass : copper); ring.rotation.y = k * Math.PI / 4; sphere.add(ring); }
    const eq = new THREE.Mesh(new THREE.TorusGeometry(r * 1.02, 0.022, 8, 64), brass); eq.rotation.x = Math.PI / 2; sphere.add(eq);
    const axis = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, r * 2.5, 6), iron); sphere.add(axis);
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), new THREE.MeshBasicMaterial({ color: COLORS.glow, toneMapped: false })); sphere.add(core);
    sphere.rotation.z = 0.41;
    g.add(sphere);
    spinners.push({ o: sphere, s: 0.05 + rand() * 0.05 });
  }
  function dish(g) {
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 2.4, 12), iron); mast.position.y = 1.2; g.add(mast);
    const head = new THREE.Group(); head.position.y = 2.5;
    const pts = []; for (let i = 0; i <= 16; i++) { const x = i / 16 * 1.3; pts.push(new THREE.Vector2(x, x * x * 0.28)); }
    const bowl = new THREE.Mesh(new THREE.LatheGeometry(pts, 40), new THREE.MeshStandardMaterial({ color: COLORS.ironLit, metalness: 0.55, roughness: 0.4, side: THREE.DoubleSide }));
    bowl.rotation.x = -0.55; head.add(bowl);
    const feed = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.0, 6), brass); feed.position.set(0, 0.55, 0.3); feed.rotation.x = -0.55; head.add(feed);
    head.rotation.y = rand() * Math.PI;
    g.add(head);
    spinners.push({ o: head, s: 0.02 + rand() * 0.02, yaw: true });
  }
  function astrolabe(g) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.16, 1.4, 12), iron); post.position.y = 0.7; g.add(post);
    const disc = new THREE.Group(); disc.position.y = 1.85;
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.04, 48), brass); plate.rotation.x = Math.PI / 2; disc.add(plate);
    const rete = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.015, 6, 48), copper); rete.position.z = 0.03; disc.add(rete);
    for (let k = 0; k < 12; k++) { const tk = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.08, 0.01), iron); const a = k / 12 * Math.PI * 2; tk.position.set(Math.cos(a) * 0.45, Math.sin(a) * 0.45, 0.03); tk.rotation.z = a; disc.add(tk); }
    const ruler = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.03, 0.01), iron); ruler.position.z = 0.04; disc.add(ruler);
    g.add(disc);
    spinners.push({ o: ruler, s: 0.08 });
  }
  const kinds = [telescope, armillary, dish, astrolabe, telescope, armillary];
  for (let i = 0; i < 26; i++) {
    for (const side of [-1, 1]) {
      if (rand() < 0.25) continue;
      const g = new THREE.Group();
      g.position.set(side * (3 + rand() * 5), 0, 3 - i * 5 - rand() * 2);
      g.rotation.y = -side * (0.5 + rand() * 0.6);
      scene.add(g);
      kinds[Math.floor(rand() * kinds.length)](g);
    }
  }
  for (let i = 0; i < 8; i++) { const p = new THREE.PointLight(COLORS.brick, 4, 10, 1.6); p.position.set((i % 2 ? 1 : -1) * 3.5, 1.2, 2 - i * 12); scene.add(p); }

  W.tick((t, pointer, { reduced }) => {
    const walk = reduced ? 0.2 : (1 - Math.cos(t * 0.025)) / 2;
    const z = 8 - walk * 40;
    camera.position.set(pointer.x * 0.6, 1.9 - pointer.y * 0.3, z);
    camera.lookAt(pointer.x * 0.8, 3.2, z - 22);
    for (const s of spinners) { if (s.yaw) s.o.rotation.y += reduced ? 0 : s.s * 0.016; else s.o.rotation.y = t * s.s * 3; }
    stars.rotation.y = t * 0.003;
  });
  W.render();
  return W;
}
