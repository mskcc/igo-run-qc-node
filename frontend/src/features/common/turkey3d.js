import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// A 3D cartoon turkey for the block loading spinner, built from three.js shapes (no model file).
// One 4.8 s lap: turn to face right, run right (jump, skid, a feather flies off), turn to face you and strut,
// turn and run back left, strut again. Turns are real rotations and the shadows are real.
const LAP = 4.8;
const RUN = 4.1; // how far either side of centre it runs, in scene units
const RIGHT = 0;
const FRONT = -Math.PI / 2;
const LEFT = -Math.PI;
const SEGMENTS = [
    { end: 0.2, kind: 'turn', x: -1, from: FRONT, to: RIGHT },
    { end: 1.6, kind: 'run', from: -1, to: 1, yaw: RIGHT },
    { end: 1.8, kind: 'turn', x: 1, from: RIGHT, to: FRONT },
    { end: 2.4, kind: 'strut', x: 1 },
    { end: 2.6, kind: 'turn', x: 1, from: FRONT, to: LEFT },
    { end: 4.0, kind: 'run', from: 1, to: -1, yaw: LEFT },
    { end: 4.2, kind: 'turn', x: -1, from: LEFT, to: FRONT },
    { end: LAP, kind: 'strut', x: -1 },
];
// Fractions of a run or strut segment
const JUMP = [0.39, 0.61];
const SKID = 0.82;
const STRUT_HOPS = [[0.12, 0.32, 0.4], [0.7, 0.85, 0.3]];
const HEAD_BOB = [0.42, 0.62];

const COLORS = {
    body: '#7a4a26', breast: '#9a6234', wing: '#5e3519', face: '#8d5a32', beak: '#f5a623',
    red: '#d63031', leg: '#e8901a', eye: '#ffffff', pupil: '#222222', tip: '#fde7b0',
};
const FEATHER_COLORS = ['#c0392b', '#e8731a', '#f4c430', '#e8731a', '#c0392b', '#e8731a', '#f4c430', '#e8731a', '#c0392b'];
const FEATHER_ANGLES = [-80, -60, -40, -20, 0, 20, 40, 60, 80].map(degrees => degrees * Math.PI / 180);

const clamp01 = x => Math.min(1, Math.max(0, x));
const smooth = x => x * x * (3 - 2 * x);
const lerp = (a, b, u) => a + (b - a) * u;
// A hop of height h while u goes from a to b
const bump = (u, a, b, h) => (u > a && u < b ? h * Math.sin(Math.PI * (u - a) / (b - a)) : 0);

const buildTurkey = (geo, mat) => {
    const mesh = (geometry, material, [x, y, z], [sx, sy, sz] = [1, 1, 1]) => {
        const m = new THREE.Mesh(geometry, material);
        m.position.set(x, y, z);
        m.scale.set(sx, sy, sz);
        return m;
    };
    const group = ([x, y, z], ...children) => {
        const g = new THREE.Group();
        g.position.set(x, y, z);
        children.forEach(child => g.add(child));
        return g;
    };

    // `bird` hops, leans, waddles and squashes about its feet; `root` moves it along the track and turns it
    const bird = new THREE.Group();
    const body = group([0, 1.35, 0],
        mesh(geo.sphere, mat.body, [0, 0, 0], [1.2, 1, 0.95]),
        mesh(geo.sphere, mat.breast, [0.5, -0.2, 0], [0.7, 0.75, 0.72]));
    bird.add(body);
    const neck = mesh(geo.capsule, mat.body, [0.95, 2.05, 0]);
    neck.rotation.z = -0.45;
    bird.add(neck);

    const beak = mesh(geo.cone, mat.beak, [0.45, -0.02, 0]);
    beak.rotation.z = -Math.PI / 2;
    const snood = group([0.32, 0.12, 0], mesh(geo.snood, mat.red, [0.04, -0.15, 0.03]));
    const wattle = group([0.22, -0.2, 0], mesh(geo.sphere, mat.red, [0, -0.14, 0], [0.12, 0.22, 0.1]));
    const eyes = [1, -1].map(side => group([0.22, 0.1, 0.18 * side],
        mesh(geo.sphere, mat.eye, [0, 0, 0], [0.11, 0.11, 0.11]),
        mesh(geo.sphere, mat.pupil, [0.07, 0.005, 0.03 * side], [0.065, 0.065, 0.065])));
    const head = group([1.15, 2.55, 0], mesh(geo.sphere, mat.face, [0, 0, 0], [0.38, 0.38, 0.36]), beak, snood, wattle, ...eyes);
    bird.add(head);

    const wings = [1, -1].map(side => {
        const wing = group([0.35, 1.7, 0.82 * side], mesh(geo.sphere, mat.wing, [-0.5, -0.15, 0.03 * side], [0.75, 0.42, 0.2]));
        bird.add(wing);
        return wing;
    });

    // The tail fans out in the plane across the turkey's back and leans backwards
    const tail = group([-0.95, 1.6, 0]);
    tail.rotation.z = 0.35;
    const feathers = FEATHER_ANGLES.map((angle, i) => {
        const feather = group([0, 0, 0],
            mesh(geo.sphere, mat.feathers[i], [0, 0.95, 0], [0.06, 0.95, 0.24]),
            mesh(geo.sphere, mat.tip, [0.01, 1.68, 0], [0.065, 0.24, 0.18]));
        tail.add(feather);
        return feather;
    });
    bird.add(tail);

    const legs = [1, -1].map(side => {
        const toes = [-0.5, 0, 0.5].map(a => {
            const toe = mesh(geo.box, mat.leg, [0.12 * Math.cos(a), -0.74, 0.12 * Math.sin(a)], [0.28, 0.045, 0.06]);
            toe.rotation.y = -a;
            return toe;
        });
        const leg = group([0.1, 0.78, 0.33 * side], mesh(geo.cylinder, mat.leg, [0, -0.38, 0]), ...toes);
        bird.add(leg);
        return leg;
    });

    const root = group([0, 0, 0], bird);
    root.traverse(o => { o.castShadow = o.isMesh; });
    return { root, bird, body, head, eyes, snood, wattle, wings, tail, feathers, legs };
};

const Turkey3D = ({ size = 64, style, fallback }) => {
    const mountRef = useRef(null);
    const [failed, setFailed] = useState(false);
    const width = size * 3;
    const height = Math.round(size * 1.2);

    useEffect(() => {
        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        } catch (e) {
            setFailed(true); // no WebGL: show the flat turkey instead
            return undefined;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        const mount = mountRef.current;
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(24, width / height, 0.1, 100);
        camera.position.set(0, 3.8, 11.2);
        camera.lookAt(0, 1.5, 0);
        scene.add(new THREE.HemisphereLight('#fff8ee', '#6b4a2a', 1.6));
        const sun = new THREE.DirectionalLight('#ffffff', 2.2);
        sun.position.set(2.5, 8, 4);
        sun.castShadow = true;
        sun.shadow.mapSize.set(1024, 1024);
        Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 6, bottom: -6, near: 1, far: 20 });
        sun.shadow.camera.updateProjectionMatrix();
        sun.shadow.bias = -0.0015;
        scene.add(sun);
        const fill = new THREE.DirectionalLight('#fff4e6', 0.8);
        fill.position.set(-4, 3, 4);
        scene.add(fill);

        const standard = color => new THREE.MeshStandardMaterial({ color, roughness: 0.6 });
        const mat = Object.fromEntries(Object.entries(COLORS).map(([name, color]) => [name, standard(color)]));
        mat.feathers = FEATHER_COLORS.map(standard);
        mat.loose = new THREE.MeshStandardMaterial({ color: FEATHER_COLORS[1], roughness: 0.6, transparent: true, side: THREE.DoubleSide });
        mat.ground = new THREE.ShadowMaterial({ opacity: 0.2 });
        const geo = {
            sphere: new THREE.SphereGeometry(1, 32, 20),
            capsule: new THREE.CapsuleGeometry(0.22, 0.6, 6, 12),
            snood: new THREE.CapsuleGeometry(0.04, 0.24, 4, 8),
            cone: new THREE.ConeGeometry(0.1, 0.32, 14),
            cylinder: new THREE.CylinderGeometry(0.06, 0.05, 0.76, 10),
            box: new THREE.BoxGeometry(1, 1, 1),
            ground: new THREE.PlaneGeometry(20, 8),
        };
        const ground = new THREE.Mesh(geo.ground, mat.ground);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);
        const turkey = buildTurkey(geo, mat);
        scene.add(turkey.root);

        // A feather that flies off when it skids
        const loose = new THREE.Mesh(geo.sphere, mat.loose);
        loose.scale.set(0.04, 0.5, 0.16);
        loose.castShadow = true;
        loose.visible = false;
        scene.add(loose);
        let looseBorn = -10;
        let looseFrom = { x: 0, dir: 1 };

        // Dust kicked up while running, skidding and landing
        const dust = Array.from({ length: 18 }, () => {
            const m = new THREE.Mesh(geo.sphere, new THREE.MeshBasicMaterial({ color: '#d8d0c4', transparent: true, depthWrite: false }));
            m.visible = false;
            scene.add(m);
            return { mesh: m, born: -1, x: 0, drift: 0 };
        });
        let nextDust = 0;
        let nextSlot = 0;
        const puff = (clock, x, z, drift) => {
            const p = dust[nextSlot];
            nextSlot = (nextSlot + 1) % dust.length;
            Object.assign(p, { born: clock, x, drift });
            p.mesh.position.set(x, 0.12, z);
            p.mesh.visible = true;
        };

        // Each segment's start, and the landings and skids that set off dust, squash and the loose feather
        let start = 0;
        const timeline = SEGMENTS.map(s => {
            const seg = { ...s, start };
            start = s.end;
            return seg;
        });
        const events = timeline.flatMap(s => {
            const at = u => s.start + u * (s.end - s.start);
            if (s.kind === 'turn') return [{ t: s.end, kind: 'land' }];
            if (s.kind === 'run') return [{ t: at(JUMP[1]), kind: 'land' }, { t: at(SKID), kind: 'skid' }];
            return STRUT_HOPS.map(([, end]) => ({ t: at(end), kind: 'land' }));
        });
        let prevT = 0;
        let lastLand = -10;
        const crossed = (t, at) => (prevT <= t ? prevT < at && at <= t : prevT < at || at <= t);

        const animate = clock => {
            const t = clock % LAP;
            const seg = timeline.find(s => t < s.end) || timeline[timeline.length - 1];
            const u = (t - seg.start) / (seg.end - seg.start);
            const stride = clock * 4.2 * Math.PI * 2;
            const { root, bird, body, head, eyes, snood, wattle, wings, tail, feathers, legs } = turkey;
            let x;
            let yaw;
            let hop = 0;
            let pitch = 0;
            let roll = 0;
            let fan = 0.5;
            let legSwing = 0;
            let legLift = 0;
            let flap = 0.12;
            let rattle = 0;
            let strut = 0;
            let headUp = 0;
            let jiggle = 0;
            let headBob = 0;
            let headShake = 0;

            if (seg.kind === 'turn') {
                x = seg.x * RUN;
                yaw = lerp(seg.from, seg.to, smooth(u));
                hop = bump(u, 0, 1, 0.6);
                legLift = -0.4; // legs tucked back mid-hop
                jiggle = 0.3 * Math.sin(clock * Math.PI * 2 * 6);
            } else if (seg.kind === 'run') {
                x = lerp(seg.from, seg.to, smooth(u)) * RUN;
                yaw = seg.yaw;
                const jump = bump(u, JUMP[0], JUMP[1], 0.95);
                const grounded = jump === 0;
                const skid = smooth(clamp01((u - SKID) / 0.1));
                hop = jump + (grounded ? 0.07 * Math.abs(Math.sin(stride)) * (1 - skid) : 0);
                pitch = lerp(grounded ? -0.2 : 0.15, 0.4, skid);
                roll = 0.07 * Math.sin(stride) * (1 - skid); // waddle
                legSwing = (grounded ? 0.8 : 0.2) * (1 - skid);
                legLift = grounded ? 0.55 * skid : -0.5; // brace to brake; tuck in the jump
                flap = grounded ? 0.2 + 0.2 * Math.sin(stride * 2) : 0.5 + 0.45 * Math.sin(clock * Math.PI * 2 * 9);
                fan = 0.5 + 0.04 * Math.sin(stride * 2);
                jiggle = 0.45 * Math.sin(stride * 2);
                headBob = 0.06 * Math.sin(stride * 2);
                const forward = Math.cos(yaw);
                if (grounded && clock >= nextDust) {
                    if (skid > 0.2) {
                        puff(clock, x + forward * 0.6, (Math.random() - 0.5) * 0.8, forward * 1.2);
                        nextDust = clock + 0.04;
                    } else if (u > 0.05) {
                        puff(clock, x - forward * 0.3, 0.33 * Math.sign(Math.sin(stride)), -forward * 0.6);
                        nextDust = clock + 0.09;
                    }
                }
            } else {
                // Strut: puff up, drag the wings and fan the tail; rattle it, then stretch the neck and shake the head
                x = seg.x * RUN;
                yaw = FRONT;
                strut = smooth(clamp01(u / 0.12)) * (1 - smooth(clamp01((u - 0.88) / 0.12)));
                fan = lerp(0.5, 1, strut);
                rattle = u > 0.2 && u < 0.4 ? 0.07 * Math.sin(clock * Math.PI * 2 * 9) : 0;
                hop = STRUT_HOPS.reduce((sum, [a, b, h]) => sum + bump(u, a, b, h), 0);
                headUp = bump(u, HEAD_BOB[0], HEAD_BOB[1], 1);
                const since = (u - HEAD_BOB[0]) * (seg.end - seg.start);
                jiggle = since > 0 ? 0.7 * Math.sin(since * Math.PI * 2 * 7) * Math.exp(-since * 5) : 0;
                headShake = u > 0.62 && u < 0.76 ? 0.25 * Math.sin(clock * Math.PI * 2 * 6) : 0;
                flap = 0.1 + 0.2 * strut;
            }

            events.forEach(ev => {
                if (!crossed(t, ev.t)) return;
                if (ev.kind === 'land') {
                    lastLand = clock;
                    [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([dx, dz]) => puff(clock, x + dx * 0.5, dz * 0.3, dx * 0.9));
                } else {
                    looseBorn = clock;
                    looseFrom = { x, dir: Math.cos(yaw) };
                }
            });
            prevT = t;

            root.position.x = x;
            root.rotation.y = yaw;
            const squash = clamp01(1 - (clock - lastLand) / 0.14);
            bird.position.y = hop;
            bird.rotation.set(roll, 0, pitch);
            bird.scale.set(1 + 0.1 * squash, 1 - 0.14 * squash, 1 + 0.1 * squash);
            body.scale.setScalar(1 + 0.08 * strut);
            head.position.set(1.15 - 0.12 * strut + 0.2 * headUp + headBob, 2.55 + 0.12 * headUp, 0);
            head.rotation.set(0, headShake, 0.3 * headUp);
            snood.rotation.z = 0.2 + jiggle;
            wattle.rotation.set(jiggle * 0.3, 0, jiggle * 0.8);
            const blink = clock % 2.7 < 0.12 ? 0.15 : 1;
            eyes.forEach(eye => { eye.scale.y = blink; });
            wings.forEach((wing, i) => wing.rotation.set((i ? -1 : 1) * flap, 0, 0.35 * strut));
            // Turn the tail fan toward the camera when running sideways, so it doesn't show edge-on
            tail.rotation.y = -0.65 * Math.cos(yaw);
            feathers.forEach((feather, i) => { feather.rotation.x = FEATHER_ANGLES[i] * fan + rattle; });
            legs.forEach((leg, i) => { leg.rotation.z = legLift + (i ? -1 : 1) * legSwing * Math.sin(stride); });

            const looseAge = (clock - looseBorn) / 1.4;
            loose.visible = looseAge >= 0 && looseAge < 1;
            if (loose.visible) {
                loose.position.set(looseFrom.x - looseFrom.dir * (0.6 + 1.2 * looseAge), 2.3 - 2.1 * smooth(looseAge) + 0.15 * Math.sin(looseAge * 12), 0.4);
                loose.rotation.set(0.4 * Math.sin(looseAge * 7), 1.2 + 0.5 * Math.sin(looseAge * 5), 0.9 * Math.sin(looseAge * 9) - looseFrom.dir * 0.6);
                loose.material.opacity = looseAge > 0.8 ? (1 - looseAge) / 0.2 : 1;
            }
            dust.forEach(p => {
                const age = (clock - p.born) / 0.45;
                p.mesh.visible = p.born >= 0 && age < 1;
                if (!p.mesh.visible) return;
                const s = lerp(0.08, 0.32, age);
                p.mesh.scale.set(s, s, s);
                p.mesh.position.x = p.x + p.drift * 0.45 * age;
                p.mesh.position.y = 0.12 + 0.2 * age;
                p.mesh.material.opacity = 0.75 * (1 - age);
            });

            renderer.render(scene, camera);
        };

        const started = performance.now();
        let frame;
        const tick = time => {
            animate((time - started) / 1000);
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frame);
            Object.values(geo).forEach(g => g.dispose());
            [...Object.values(mat).flat(), ...dust.map(p => p.mesh.material)].forEach(m => m.dispose());
            renderer.dispose();
            renderer.forceContextLoss();
            mount.removeChild(renderer.domElement);
        };
    }, [width, height]);

    if (failed) {
        return fallback;
    }
    return (
        <div className='turkey-spinner running turkey-3d' style={{ width, height, ...style }} role='status' aria-label='Loading'>
            <div ref={mountRef} />
        </div>
    );
};

export default Turkey3D;
