// The sea: a dark ocean under stars running to the brick sun, an iron lighthouse turning its lamp,
// icebergs, and a rusted wreck listing out of the water. Scenery for Lodestar.
import { createWorld, COLORS } from './world.js';

function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

// A stable pseudo-random value for a point, so the copies of a shared corner move together.
function jitter(x, y, z, seed) {
  const v = Math.sin(Math.round(x * 1000) * 12.9898 + Math.round(y * 1000) * 78.233 + Math.round(z * 1000) * 37.719 + seed) * 43758.5453;
  return v - Math.floor(v);
}

export function createSea(canvas, opts = {}) {
  const W = createWorld(canvas, { fog: 0.016, bloom: 0.42, floor: false, ...opts });
  const { THREE, scene, camera } = W;
  const rand = rng(opts.seed ?? 21);
  const iron = new THREE.MeshStandardMaterial({ color: 0x24201c, metalness: 0.6, roughness: 0.5 });
  const rust = new THREE.MeshStandardMaterial({ color: 0x3e2418, metalness: 0.45, roughness: 0.8 });
  const rock = new THREE.MeshStandardMaterial({ color: 0x16120f, metalness: 0.05, roughness: 0.95, flatShading: true });
  const ice = new THREE.MeshStandardMaterial({ color: 0xd8cfc6, emissive: 0x4a3a31, metalness: 0, roughness: 0.6, flatShading: true });
  const glow = new THREE.MeshBasicMaterial({ color: COLORS.glow, toneMapped: false });

  // ---- the ocean: gentle waves, the sun's path laid across it, a faint grid as the family's floor ----
  const sunDir = new THREE.Vector3(0, 0.07, -1).normalize();
  const ocean = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 400, 220, 220),
    new THREE.ShaderMaterial({
      fog: true,
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
        uTime: { value: 0 },
        uSunDir: { value: sunDir },
        uDeep: { value: new THREE.Color('#0d0b09') },
        uSky: { value: new THREE.Color('#3a2a22') },
        uSun: { value: COLORS.brick },
        uLine: { value: COLORS.line },
      }]),
      vertexShader: `
        #include <fog_pars_vertex>
        uniform float uTime;
        varying vec3 vW; varying vec3 vN;
        float h(vec2 p) {
          return sin(p.x * 0.18 + uTime * 0.6) * 0.18 + sin(p.y * 0.23 - uTime * 0.8) * 0.14
               + sin((p.x + p.y) * 0.41 + uTime * 1.1) * 0.06 + sin((p.x - p.y) * 0.9 + uTime * 1.7) * 0.025;
        }
        void main() {
          vec4 w = modelMatrix * vec4(position, 1.0);
          vec2 p = w.xz;
          float e = 0.15;
          float hc = h(p);
          w.y += hc;
          vec3 dx = vec3(e, h(p + vec2(e, 0.0)) - hc, 0.0);
          vec3 dz = vec3(0.0, h(p + vec2(0.0, e)) - hc, e);
          vN = normalize(cross(dz, dx));
          vW = w.xyz;
          vec4 mvPosition = viewMatrix * w;
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,
      fragmentShader: `
        #include <fog_pars_fragment>
        uniform vec3 uSunDir; uniform vec3 uDeep; uniform vec3 uSky; uniform vec3 uSun; uniform vec3 uLine;
        varying vec3 vW; varying vec3 vN;
        float line(float v) { float d = abs(fract(v - 0.5) - 0.5) / fwidth(v); return 1.0 - min(d, 1.0); }
        void main() {
          vec3 V = normalize(cameraPosition - vW);
          vec3 R = reflect(-V, normalize(vN));
          float fres = pow(1.0 - max(dot(V, vec3(0.0, 1.0, 0.0)), 0.0), 3.0);
          float d = max(dot(R, uSunDir), 0.0);
          float glint = pow(d, 260.0) * 3.0 + pow(d, 60.0) * 0.35 + pow(d, 14.0) * 0.06;
          vec3 col = mix(uDeep, uSky, fres * 0.8) + uSun * glint;
          vec2 g = vW.xz / 2.0;
          float grid = max(line(g.x), line(g.y)) * 0.05 * exp(-length(vW.xz) * 0.035);
          col += uLine * grid;
          gl_FragColor = vec4(col, 1.0);
          #include <fog_fragment>
        }`,
    }),
  );
  ocean.rotation.x = -Math.PI / 2;
  scene.add(ocean);

  // ---- stars ----
  const N = 1600, pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const th = rand() * Math.PI * 2, ph = Math.acos(rand() * 0.82), r = 150;
    pos[i * 3] = Math.sin(ph) * Math.cos(th) * r; pos[i * 3 + 1] = Math.cos(ph) * r * 0.7 + 6; pos[i * 3 + 2] = Math.sin(ph) * Math.sin(th) * r - 60;
    const c = rand() < 0.1 ? COLORS.brick : COLORS.brickInk, k = 0.35 + rand() * 0.65;
    col[i * 3] = c.r * k; col[i * 3 + 1] = c.g * k; col[i * 3 + 2] = c.b * k;
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  sg.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const stars = new THREE.Points(sg, new THREE.PointsMaterial({ size: 0.55, vertexColors: true, fog: false, transparent: true, opacity: 0.9 }));
  scene.add(stars);

  // ---- the lighthouse: riveted iron on a rock, brick bands, a lamp that turns ----
  const lh = new THREE.Group();
  lh.position.set(opts.lighthouseX ?? 11, 0, -40);
  scene.add(lh);
  for (let i = 0; i < 9; i++) {
    const g = new THREE.DodecahedronGeometry(1.6 + rand() * 1.4, 0);
    const m = new THREE.Mesh(g, rock);
    m.position.set((rand() - 0.5) * 4.5, -0.6 + rand() * 0.5, (rand() - 0.5) * 4);
    m.scale.y = 0.45 + rand() * 0.3; m.rotation.y = rand() * 6;
    lh.add(m);
  }
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.35, 10, 20), iron);
  tower.position.y = 5.4; lh.add(tower);
  for (const y of [2.2, 5.0, 7.8]) {
    const band = new THREE.Mesh(new THREE.CylinderGeometry(1.36 - y * 0.05, 1.38 - y * 0.05, 0.55, 20), rust);
    band.position.y = y; lh.add(band);
  }
  for (let i = 0; i < 3; i++) {
    const win = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.3), glow);
    win.position.set(0, 3 + i * 2.4, 1.33 - i * 0.12); lh.add(win);
  }
  const gallery = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.25, 0.18, 24), iron); gallery.position.y = 10.5; lh.add(gallery);
  const rail = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.03, 6, 32), iron); rail.rotation.x = Math.PI / 2; rail.position.y = 11.0; lh.add(rail);
  const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.3, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.15, roughness: 0.05, depthWrite: false }));
  lantern.position.y = 11.3; lh.add(lantern);
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.34, 20, 12), glow); lamp.position.y = 11.25; lh.add(lamp);
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.95, 1.0, 20), iron); cap.position.y = 12.45; lh.add(cap);
  const vane = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 6), iron); vane.position.y = 13.2; lh.add(vane);
  const lampLight = new THREE.PointLight(COLORS.glow, 30, 40, 1.6); lampLight.position.y = 11.3; lh.add(lampLight);
  // Two opposed beams, faint additive cones, swept slowly round the tower.
  const beams = new THREE.Group(); beams.position.y = 11.25; lh.add(beams);
  const beamMat = new THREE.MeshBasicMaterial({ color: COLORS.glow, transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false, toneMapped: false });
  for (const s of [1, -1]) {
    const geo = new THREE.ConeGeometry(4.5, 60, 24, 1, true);
    geo.translate(0, -30, 0);
    const beam = new THREE.Mesh(geo, beamMat);
    beam.rotation.z = s * Math.PI / 2;
    beams.add(beam);
  }

  // ---- icebergs: faceted, mostly under water, catching the brick light ----
  const bergs = [];
  function iceberg(x, z, size) {
    // A chunky berg: a rounded body, sheared flat on top like tabular ice, a little uneven.
    const geo = new THREE.IcosahedronGeometry(1, 2);
    const p = geo.attributes.position;
    const tabular = rand() < 0.5, top = 0.55 + rand() * 0.35, seed = rand() * 100;
    for (let i = 0; i < p.count; i++) {
      const y = p.getY(i), k = 0.88 + jitter(p.getX(i), y, p.getZ(i), seed) * 0.2;
      // tabular bergs are sheared flat on top; the others rise to an uneven peak
      const j2 = jitter(p.getZ(i), p.getX(i), y, seed + 1);
      const yy = tabular ? Math.min(y * (0.85 + j2 * 0.25), top) : (y > 0 ? y * (1.2 + j2 * 0.6) : y);
      p.setXYZ(i, p.getX(i) * k * (tabular ? 1 : 1 - Math.max(0, y) * 0.35), yy, p.getZ(i) * k * (tabular ? 1 : 1 - Math.max(0, y) * 0.35));
    }
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, ice);
    m.scale.set(size * (1.1 + rand() * 0.7), size * (1.2 + rand() * 0.8), size * (0.9 + rand() * 0.6));
    m.position.set(x, -size * 0.1, z);
    m.rotation.y = rand() * 6;
    scene.add(m);
    bergs.push({ m, base: m.position.y, ph: rand() * 6 });
  }
  iceberg(-5, -40, 2.4); iceberg(18, -54, 3.4); iceberg(-4, -66, 3.2); iceberg(-17, -50, 2.4); iceberg(4.5, -78, 4.5); iceberg(22, -64, 3); iceberg(-28, -90, 5);
  for (let i = 0; i < 4; i++) iceberg((rand() < 0.5 ? -1 : 1) * (18 + rand() * 30), -100 - rand() * 40, 2 + rand() * 3);
  for (let i = 0; i < 5; i++) iceberg((rand() - 0.5) * 34, -16 - rand() * 26, 0.35 + rand() * 0.45);

  // ---- the wreck: a freighter's bow and bridge listing out of the water, a broken mast, a funnel ----
  const wreck = new THREE.Group();
  wreck.position.set(opts.wreckX ?? -4.5, -0.6, -30);
  wreck.rotation.set(0.05, 0.6, -0.32);
  scene.add(wreck);
  const hullShape = new THREE.Shape();
  hullShape.moveTo(-7, 0); hullShape.lineTo(5.5, 0); hullShape.lineTo(8.5, 2.6); hullShape.lineTo(8.8, 3.2); hullShape.lineTo(-7, 3.0); hullShape.lineTo(-7, 0);
  const hull = new THREE.Mesh(new THREE.ExtrudeGeometry(hullShape, { depth: 3.2, bevelEnabled: false }), rust);
  hull.position.set(0, -1.6, -1.6); wreck.add(hull);
  const deck = new THREE.Mesh(new THREE.BoxGeometry(14, 0.12, 3), iron); deck.position.set(0.2, 1.42, 0); wreck.add(deck);
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.0, 2.4), rust); bridge.position.set(-4.2, 2.4, 0); wreck.add(bridge);
  for (let i = 0; i < 4; i++) {
    const w = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.3), new THREE.MeshBasicMaterial({ color: 0x0b0806 }));
    w.position.set(-5.0 + i * 0.55, 2.9, 1.21); wreck.add(w);
  }
  const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 2.6, 16), iron); funnel.position.set(-2.2, 3.0, 0); funnel.rotation.z = 0.12; wreck.add(funnel);
  const fband = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.4, 16), rust); fband.position.set(-2.05, 3.9, 0); fband.rotation.z = 0.12; wreck.add(fband);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 6.5, 8), iron); mast.position.set(3.0, 4.4, 0); mast.rotation.z = -0.55; wreck.add(mast);
  const boom = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.12, 0.12), iron); boom.position.set(4.6, 5.6, 0); boom.rotation.z = -0.9; wreck.add(boom);
  const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 4.8, 4), iron); cable.position.set(5.6, 3.3, 0.1); cable.rotation.z = 0.25; wreck.add(cable);
  // Debris in the water round it.
  for (let i = 0; i < 10; i++) {
    const d = new THREE.Mesh(new THREE.BoxGeometry(0.3 + rand() * 0.9, 0.08, 0.2 + rand() * 0.4), rust);
    d.position.set(wreck.position.x + (rand() - 0.5) * 14, 0.02, wreck.position.z + (rand() - 0.5) * 10);
    d.rotation.y = rand() * 6;
    scene.add(d);
    bergs.push({ m: d, base: 0.02, ph: rand() * 6, small: true });
  }

  // ---- motion: a slow drift along the water, the beam turning, everything riding the swell ----
  W.tick((t, pointer, { reduced, width }) => {
    ocean.material.uniforms.uTime.value = t;
    const drift = reduced ? 0.3 : (1 - Math.cos(t * 0.03)) / 2;
    const wide = width >= 920;
    camera.position.set(-2 + drift * 4 + pointer.x * 0.6, 2.2 - pointer.y * 0.3 + Math.sin(t * 0.5) * 0.08, 10 - drift * 6);
    camera.lookAt(wide ? 2 : 0, 2.6, -40);
    beams.rotation.y = reduced ? 0.6 : t * 0.35;
    for (const b of bergs) b.m.position.y = b.base + Math.sin(t * (b.small ? 0.9 : 0.35) + b.ph) * (b.small ? 0.05 : 0.08);
    wreck.rotation.z = -0.32 + Math.sin(t * 0.3) * 0.006;
    stars.rotation.y = t * 0.002;
  });
  W.render();
  return W;
}
