// The relay: an exchange tower on a dusk plain, masts in rings around it, cables strung between them,
// and pulses of light running out along the cables and back. Requests out, answers home; now and then
// one request forks to two masts at once and both answers race back. Scenery, not an instrument.
import { createWorld, COLORS } from './world.js';

function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

export function createRelay(canvas, opts = {}) {
  const W = createWorld(canvas, { fog: 0.016, bloom: 0.6, ...opts });
  const { THREE, scene, camera } = W;
  const rand = rng(opts.seed ?? 11);

  const iron = new THREE.MeshStandardMaterial({ color: COLORS.iron, metalness: 0.75, roughness: 0.4 });
  const ironLit = new THREE.MeshStandardMaterial({ color: COLORS.ironLit, metalness: 0.6, roughness: 0.45 });
  const brass = new THREE.MeshStandardMaterial({ color: COLORS.brass, metalness: 0.95, roughness: 0.3 });
  const glowMat = (c, k = 1) => new THREE.MeshBasicMaterial({ color: c.clone().multiplyScalar(k), toneMapped: false });

  const HUB = new THREE.Vector3(0, 0, -30);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v3 = new THREE.Vector3(), s3 = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);

  // ---- the exchange: a tapering lattice tower with a lantern room and a ring gallery ----
  const exchange = new THREE.Group();
  exchange.position.copy(HUB);
  scene.add(exchange);
  const TOWER_H = 15;
  const legGeo = new THREE.CylinderGeometry(0.09, 0.14, 1, 8);
  const strutGeo = new THREE.CylinderGeometry(0.035, 0.035, 1, 6);
  function beam(group, geo, mat, a, b) {
    const m = new THREE.Mesh(geo, mat);
    const d = new THREE.Vector3().subVectors(b, a);
    m.position.copy(a).addScaledVector(d, 0.5);
    m.scale.set(1, d.length(), 1);
    m.quaternion.setFromUnitVectors(up, d.normalize());
    group.add(m);
  }
  const corner = (y, i) => {
    const r = 2.2 * (1 - y / TOWER_H) + 0.55;
    const a = Math.PI / 4 + i * Math.PI / 2;
    return new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
  };
  for (let i = 0; i < 4; i++) beam(exchange, legGeo, iron, corner(0, i), corner(TOWER_H, i));
  const LEVELS = 9;
  for (let l = 0; l <= LEVELS; l++) {
    const y0 = (l / LEVELS) * TOWER_H, y1 = ((l + 1) / LEVELS) * TOWER_H;
    for (let i = 0; i < 4; i++) {
      beam(exchange, strutGeo, ironLit, corner(y0, i), corner(y0, (i + 1) % 4));
      if (l < LEVELS) beam(exchange, strutGeo, ironLit, corner(y0, i), corner(y1, (i + 1) % 4));
    }
  }
  const gallery = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.06, 8, 48), brass);
  gallery.rotation.x = Math.PI / 2; gallery.position.y = TOWER_H; exchange.add(gallery);
  const deck = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.12, 32), iron); deck.position.y = TOWER_H; exchange.add(deck);
  const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 1.6, 24, 1, true),
    new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.14, roughness: 0.05, depthWrite: false }));
  lantern.position.y = TOWER_H + 0.9; exchange.add(lantern);
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 16), glowMat(COLORS.glow, 1.6));
  core.position.y = TOWER_H + 0.9; exchange.add(core);
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.95, 0.8, 24), iron); cap.position.y = TOWER_H + 2.1; exchange.add(cap);
  const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.05, 2.2, 6), brass); spire.position.y = TOWER_H + 3.5; exchange.add(spire);
  const beacon = new THREE.PointLight(COLORS.glow, 60, 60, 1.6); beacon.position.y = TOWER_H + 0.9; exchange.add(beacon);
  const hubTop = HUB.clone().add(new THREE.Vector3(0, TOWER_H + 0.9, 0));

  // ---- the masts: rings of smaller lattice masts, each with a lamp at its crossarm ----
  const masts = [];
  const RINGS = [{ r: 16, n: 9 }, { r: 30, n: 14 }, { r: 48, n: 18 }, { r: 70, n: 22 }];
  for (const [ri, ring] of RINGS.entries()) {
    for (let i = 0; i < ring.n; i++) {
      const a = (i / ring.n) * Math.PI * 2 + ri * 0.37 + (rand() - 0.5) * 0.18;
      const r = ring.r + (rand() - 0.5) * ring.r * 0.12;
      const base = new THREE.Vector3(HUB.x + Math.cos(a) * r, 0, HUB.z + Math.sin(a) * r * 0.85);
      if (base.z > -8) continue; // keep the foreground clear for the camera
      masts.push({ base, h: 4.2 + rand() * 3.2 - ri * 0.35 });
    }
  }
  const mastLeg = new THREE.InstancedMesh(legGeo, iron, masts.length * 3);
  const mastStrut = new THREE.InstancedMesh(strutGeo, ironLit, masts.length * 13);
  const insulator = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.07, 0.09, 0.22, 10), brass, masts.length * 2);
  const lampGeo = new THREE.SphereGeometry(0.16, 12, 8);
  const lamps = new THREE.InstancedMesh(lampGeo, new THREE.MeshBasicMaterial({ toneMapped: false }), masts.length);
  let nLeg = 0, nStrut = 0, nIns = 0;
  function place(mesh, n, a, b) {
    const d = v3.subVectors(b, a);
    q.setFromUnitVectors(up, d.clone().normalize());
    s3.set(1, d.length(), 1);
    m4.compose(a.clone().addScaledVector(d, 0.5), q, s3);
    mesh.setMatrixAt(n, m4);
  }
  const lampIdle = COLORS.glow.clone().multiplyScalar(0.55);
  masts.forEach((m, k) => {
    const foot = (i) => { const a = i * (Math.PI * 2 / 3); return m.base.clone().add(new THREE.Vector3(Math.cos(a) * 0.6, 0, Math.sin(a) * 0.6)); };
    const top = m.base.clone().add(new THREE.Vector3(0, m.h, 0));
    for (let i = 0; i < 3; i++) place(mastLeg, nLeg++, foot(i), top);
    for (let l = 1; l <= 4; l++) {
      const f = l / 5;
      for (let i = 0; i < 3; i++) {
        const a = foot(i).lerp(top, f), b = foot((i + 1) % 3).lerp(top, f);
        place(mastStrut, nStrut++, a, b);
      }
    }
    const arm0 = top.clone().add(new THREE.Vector3(-0.7, -0.3, 0)), arm1 = top.clone().add(new THREE.Vector3(0.7, -0.3, 0));
    place(mastStrut, nStrut++, arm0, arm1);
    for (const p of [arm0, arm1]) { m4.makeTranslation(p.x, p.y + 0.12, p.z); insulator.setMatrixAt(nIns++, m4); }
    m.lamp = top.clone().add(new THREE.Vector3(0, 0.25, 0));
    m4.makeTranslation(m.lamp.x, m.lamp.y, m.lamp.z);
    lamps.setMatrixAt(k, m4);
    lamps.setColorAt(k, lampIdle);
    m.heat = 0;
  });
  mastLeg.count = nLeg; mastStrut.count = nStrut; insulator.count = nIns;
  for (const mesh of [mastLeg, mastStrut, insulator, lamps]) { mesh.instanceMatrix.needsUpdate = true; scene.add(mesh); }

  // ---- the cables: catenary-ish sags from the exchange to each mast, and between neighbours ----
  const routes = [];
  const SEG = 40;
  function cable(a, b, sagK, opacity) {
    const mid = a.clone().lerp(b, 0.5);
    mid.y -= a.distanceTo(b) * sagK * 2;
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    const pts = curve.getPoints(SEG);
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: COLORS.brick, transparent: true, opacity }));
    scene.add(line);
    return curve;
  }
  masts.forEach((m) => { m.route = routes.push(cable(hubTop, m.lamp, 0.07, 0.5)) - 1; });
  for (let i = 0; i < masts.length; i++) {
    let best = -1, bd = Infinity;
    for (let j = 0; j < masts.length; j++) {
      if (j === i) continue;
      const d = masts[i].base.distanceTo(masts[j].base);
      if (d < bd && d > 3) { bd = d; best = j; }
    }
    if (best > i) cable(masts[i].lamp, masts[best].lamp, 0.05, 0.22);
  }

  // ---- the pulses: requests out in pale brick, answers home in hot glow ----
  const MAX = 220;
  const pulseGeo = new THREE.SphereGeometry(0.2, 12, 8);
  const pulses = new THREE.InstancedMesh(pulseGeo, new THREE.MeshBasicMaterial({ toneMapped: false }), MAX);
  pulses.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  pulses.count = 0;
  scene.add(pulses);
  const trailGeo = new THREE.SphereGeometry(0.13, 8, 6);
  const trails = new THREE.InstancedMesh(trailGeo, new THREE.MeshBasicMaterial({ toneMapped: false, transparent: true, opacity: 0.55 }), MAX * 3);
  trails.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  trails.count = 0;
  scene.add(trails);

  const OUT = COLORS.brickInk.clone().multiplyScalar(1.6);
  const BACK = COLORS.glow.clone().multiplyScalar(2.2);
  const CHECK = new THREE.Color('#ffe0b0').multiplyScalar(2.4);
  const live = [];
  function send(mi, color, delay = 0) {
    if (live.length >= MAX) return;
    live.push({ mi, t: -delay, speed: 0.32 + rand() * 0.2, out: true, color });
  }
  function spawn() {
    const mi = Math.floor(rand() * masts.length);
    if (rand() < 0.12) {
      // a cross-check: the same question to two masts at once
      let mj = Math.floor(rand() * masts.length);
      if (mj === mi) mj = (mi + 1) % masts.length;
      send(mi, CHECK); send(mj, CHECK);
    } else {
      send(mi, OUT);
    }
  }

  // A still frame for reduced motion: pulses frozen mid-flight.
  if (W.reduced) {
    for (let i = 0; i < 40; i++) {
      const mi = Math.floor(rand() * masts.length);
      live.push({ mi, t: rand(), speed: 0, out: rand() < 0.5, color: rand() < 0.5 ? OUT : BACK });
    }
  }

  let last = 0, carry = 0;
  const tmpC = new THREE.Color();
  W.tick((t, pointer, { reduced }) => {
    const dt = Math.min(0.05, t - last); last = t;

    // Camera: a slow arc in front of the exchange, the sun kept behind it.
    const az = reduced ? 0.18 : Math.sin(t * 0.05) * 0.42;
    const R = 46;
    camera.position.set(HUB.x + Math.sin(az) * R + pointer.x * 1.5, 10.5 - pointer.y * 1.2, HUB.z + Math.cos(az) * R);
    camera.lookAt(HUB.x, 7.5, HUB.z - 6);

    if (!reduced) {
      carry += dt * 11;
      while (carry >= 1) { carry -= 1; spawn(); }
    }

    let n = 0, nt = 0;
    for (let i = live.length - 1; i >= 0; i--) {
      const p = live[i];
      p.t += dt * p.speed;
      if (p.t < 0) continue;
      if (p.t >= 1) {
        if (p.out) {
          masts[p.mi].heat = 1;
          p.out = false; p.t = 0; p.color = BACK; p.speed *= 1.15;
        } else {
          live.splice(i, 1);
          continue;
        }
      }
      const curve = routes[masts[p.mi].route];
      const u = p.out ? p.t : 1 - p.t;
      curve.getPoint(u, v3);
      m4.makeTranslation(v3.x, v3.y, v3.z);
      pulses.setMatrixAt(n, m4);
      pulses.setColorAt(n, p.color);
      n++;
      for (let k = 1; k <= 3 && nt < MAX * 3; k++) {
        const uu = p.out ? Math.max(0, u - k * 0.018) : Math.min(1, u + k * 0.018);
        curve.getPoint(uu, v3);
        s3.setScalar(1 - k * 0.25);
        m4.compose(v3, q.identity(), s3);
        trails.setMatrixAt(nt, m4);
        trails.setColorAt(nt, tmpC.copy(p.color).multiplyScalar(0.6 - k * 0.15));
        nt++;
      }
    }
    pulses.count = n; trails.count = nt;
    pulses.instanceMatrix.needsUpdate = true; trails.instanceMatrix.needsUpdate = true;
    if (pulses.instanceColor) pulses.instanceColor.needsUpdate = true;
    if (trails.instanceColor) trails.instanceColor.needsUpdate = true;

    // A mast flares when a request lands, then settles back.
    masts.forEach((m, k) => {
      if (m.heat > 0) {
        m.heat = Math.max(0, m.heat - dt * 1.4);
        lamps.setColorAt(k, tmpC.copy(lampIdle).lerp(CHECK, m.heat));
      }
    });
    if (lamps.instanceColor) lamps.instanceColor.needsUpdate = true;

    // The exchange breathes with its traffic.
    const busy = Math.min(1, n / 40);
    beacon.intensity = 40 + busy * 50 + Math.sin(t * 2.1) * 6;
    core.scale.setScalar(1 + busy * 0.18 + Math.sin(t * 2.1) * 0.04);
  });
  W.render();
  return W;
}
