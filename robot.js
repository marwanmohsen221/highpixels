/**
 * HighPixels — 3D Robot Hero  (Three.js r160)
 * ─────────────────────────────────────────────
 * Idle:  gentle float + slow self-rotation
 * Hover: right arm waves 👋
 * Click: full 360° spin reaction
 * Mouse: robot tracks pointer (subtle tilt)
 */
(function initRobot() {
    'use strict';

    const canvas = document.getElementById('robot-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    /* ═══════════════════════════════════════
       RENDERER
    ═══════════════════════════════════════ */
    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    /* ═══════════════════════════════════════
       SCENE + CAMERA
    ═══════════════════════════════════════ */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    camera.position.set(0, 0.7, 6.5);
    camera.lookAt(0, 0.5, 0);

    /* ── Responsive resize ── */
    function onResize() {
        const el = canvas.parentElement;
        const w  = el.offsetWidth  || 500;
        const h  = el.offsetHeight || 480;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    onResize();
    window.addEventListener('resize', onResize);

    /* ═══════════════════════════════════════
       MATERIALS
    ═══════════════════════════════════════ */
    const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x12121f,
        metalness: 0.88,
        roughness: 0.14,
    });
    const darkMat = new THREE.MeshStandardMaterial({
        color: 0x070710,
        metalness: 0.92,
        roughness: 0.08,
    });
    const greenMat = new THREE.MeshStandardMaterial({
        color:            0x0aff8d,
        emissive:         0x0aff8d,
        emissiveIntensity: 0.9,
        metalness: 0.2,
        roughness: 0.2,
    });
    const purpleMat = new THREE.MeshStandardMaterial({
        color:            0x9d00ff,
        emissive:         0x9d00ff,
        emissiveIntensity: 0.55,
        metalness: 0.3,
        roughness: 0.25,
    });
    const glassMat = new THREE.MeshStandardMaterial({
        color:     0x001a0d,
        emissive:  0x003820,
        emissiveIntensity: 0.28,
        transparent: true,
        opacity:   0.92,
        metalness: 0.05,
        roughness: 0.0,
    });

    /* ═══════════════════════════════════════
       HELPERS
    ═══════════════════════════════════════ */
    const B  = (w, h, d, m) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    const S  = (r, m)       => new THREE.Mesh(new THREE.SphereGeometry(r, 24, 24), m);
    const Cy = (t, b, h, m) => new THREE.Mesh(new THREE.CylinderGeometry(t, b, h, 12), m);
    const Cr = (r, m)       => new THREE.Mesh(new THREE.CircleGeometry(r, 32), m);

    /* ═══════════════════════════════════════
       ROBOT GROUP
    ═══════════════════════════════════════ */
    const robot = new THREE.Group();
    scene.add(robot);

    /* ── HEAD ── */
    const head = B(0.95, 0.95, 0.95, bodyMat);
    head.position.y = 1.65;
    robot.add(head);

    // Face screen glass
    const faceScreen = B(0.78, 0.62, 0.02, glassMat);
    faceScreen.position.set(0, 1.65, 0.49);
    robot.add(faceScreen);

    // Eyes
    const eyeL = Cr(0.1, greenMat);
    eyeL.position.set(-0.2, 1.72, 0.501);
    robot.add(eyeL);

    const eyeR = Cr(0.1, greenMat);
    eyeR.position.set( 0.2, 1.72, 0.501);
    robot.add(eyeR);

    // Smile arc (torus half)
    const smileMesh = new THREE.Mesh(
        new THREE.TorusGeometry(0.17, 0.028, 8, 20, Math.PI),
        greenMat
    );
    smileMesh.rotation.z = Math.PI;
    smileMesh.position.set(0, 1.52, 0.501);
    robot.add(smileMesh);

    // Ear details (side strips)
    [-1, 1].forEach(side => {
        const ear = B(0.04, 0.55, 0.04, purpleMat);
        ear.position.set(side * 0.495, 1.65, 0);
        robot.add(ear);
    });

    // Head bottom chin strip
    const chinStrip = B(0.95, 0.04, 0.04, purpleMat);
    chinStrip.position.set(0, 1.2, 0.49);
    robot.add(chinStrip);

    // Neck
    const neck = Cy(0.18, 0.22, 0.22, bodyMat);
    neck.position.y = 1.17;
    robot.add(neck);

    /* ── ANTENNA ── */
    const antPole = Cy(0.025, 0.025, 0.42, bodyMat);
    antPole.position.set(0, 2.32, 0);
    robot.add(antPole);

    const antTip = S(0.075, greenMat);
    antTip.position.set(0, 2.57, 0);
    robot.add(antTip);

    /* ── TORSO ── */
    const torso = B(1.28, 1.15, 0.88, bodyMat);
    torso.position.y = 0.68;
    robot.add(torso);

    // Chest dark panel
    const chestPanel = B(0.78, 0.58, 0.03, darkMat);
    chestPanel.position.set(0, 0.78, 0.47);
    robot.add(chestPanel);

    // Chest core orb (purple)
    const coreOrb = S(0.08, purpleMat);
    coreOrb.position.set(0, 0.92, 0.49);
    robot.add(coreOrb);

    // Chest lower green strip
    const chestStrip = B(0.65, 0.035, 0.04, greenMat);
    chestStrip.position.set(0, 0.63, 0.48);
    robot.add(chestStrip);

    // Torso side neon strips
    [-1, 1].forEach(side => {
        const strip = B(0.04, 0.95, 0.04, purpleMat);
        strip.position.set(side * 0.645, 0.68, 0.45);
        robot.add(strip);
    });

    /* ── SHOULDERS ── */
    const shoulderGeo = new THREE.SphereGeometry(0.23, 20, 20);
    const shL = new THREE.Mesh(shoulderGeo, purpleMat);
    shL.position.set(-0.82, 1.1, 0);
    robot.add(shL);

    const shR = new THREE.Mesh(shoulderGeo, purpleMat);
    shR.position.set( 0.82, 1.1, 0);
    robot.add(shR);

    /* ── ARMS (pivot at shoulder for wave) ── */
    function makeArm(isRight) {
        const g = new THREE.Group();
        g.position.set(isRight ? 0.82 : -0.82, 1.1, 0);

        // Upper arm
        const upper = B(0.3, 0.52, 0.3, bodyMat);
        upper.position.y = -0.34;
        g.add(upper);

        // Elbow joint
        const elbow = S(0.17, bodyMat);
        elbow.position.y = -0.62;
        g.add(elbow);

        // Elbow neon ring
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.18, 0.025, 8, 20),
            isRight ? greenMat : purpleMat
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = -0.62;
        g.add(ring);

        // Lower arm
        const lower = B(0.26, 0.44, 0.26, bodyMat);
        lower.position.y = -0.9;
        g.add(lower);

        // Hand
        const hand = S(0.19, isRight ? greenMat : bodyMat);
        hand.position.y = -1.12;
        g.add(hand);

        return g;
    }

    const leftArmGroup  = makeArm(false);
    const rightArmGroup = makeArm(true);
    robot.add(leftArmGroup);
    robot.add(rightArmGroup);

    /* ── HIP CONNECTOR ── */
    const hip = B(0.95, 0.22, 0.75, darkMat);
    hip.position.y = 0.09;
    robot.add(hip);

    const hipStrip = B(0.85, 0.04, 0.04, greenMat);
    hipStrip.position.set(0, 0.09, 0.4);
    robot.add(hipStrip);

    /* ── LEGS ── */
    function makeLeg(side) {
        const x = side * 0.34;

        const upper = B(0.38, 0.52, 0.4, bodyMat);
        upper.position.set(x, -0.28, 0);
        robot.add(upper);

        // Knee
        const knee = S(0.17, purpleMat);
        knee.position.set(x, -0.57, 0.18);
        robot.add(knee);

        const lower = B(0.34, 0.44, 0.36, bodyMat);
        lower.position.set(x, -0.85, 0);
        robot.add(lower);

        // Foot
        const foot = B(0.46, 0.2, 0.56, bodyMat);
        foot.position.set(x, -1.14, 0.08);
        robot.add(foot);

        // Foot green toe strip
        const toe = B(0.46, 0.04, 0.04, greenMat);
        toe.position.set(x, -1.05, 0.32);
        robot.add(toe);
    }
    makeLeg(-1); // left
    makeLeg( 1); // right

    /* ── SHADOW GLOW DISC ── */
    const glowDisc = new THREE.Mesh(
        new THREE.CircleGeometry(1.1, 48),
        new THREE.MeshBasicMaterial({
            color: 0x0aff8d,
            transparent: true,
            opacity: 0.07,
            depthWrite: false,
        })
    );
    glowDisc.rotation.x = -Math.PI / 2;
    glowDisc.position.y = -1.28;
    robot.add(glowDisc);

    /* ═══════════════════════════════════════
       LIGHTS
    ═══════════════════════════════════════ */
    scene.add(new THREE.AmbientLight(0x111133, 0.7));

    const greenPt = new THREE.PointLight(0x0aff8d, 4, 12);
    greenPt.position.set(-2.5, 2.5, 3.5);
    scene.add(greenPt);

    const purplePt = new THREE.PointLight(0x9d00ff, 2.5, 10);
    purplePt.position.set(2.5, -0.5, 2);
    scene.add(purplePt);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(1, 4, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x0aff8d, 0.6);
    rimLight.position.set(-4, 0, -2);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xffffff, 0.8, 8);
    fillLight.position.set(0, 3, 4);
    scene.add(fillLight);

    /* ═══════════════════════════════════════
       INTERACTION STATE
    ═══════════════════════════════════════ */
    const mouse      = { x: 0, y: 0 };
    let   hovering   = false;
    let   waveT      = 0;
    let   spinLeft   = 0;      // radians remaining to spin
    const SPIN_TOTAL = Math.PI * 2.2;
    const SPIN_SPEED = 0.12;

    const container = canvas.parentElement;
    container.style.cursor = 'pointer';

    container.addEventListener('mousemove', e => {
        const r  = canvas.getBoundingClientRect();
        mouse.x  = ((e.clientX - r.left) / r.width  - 0.5) * 2;
        mouse.y  = -((e.clientY - r.top) / r.height - 0.5) * 2;
    });
    container.addEventListener('mouseenter', () => { hovering = true;  });
    container.addEventListener('mouseleave', () => { hovering = false; mouse.x = 0; mouse.y = 0; });
    container.addEventListener('click',      () => { spinLeft = SPIN_TOTAL; });

    /* ═══════════════════════════════════════
       ANIMATION LOOP
    ═══════════════════════════════════════ */
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        /* Float */
        robot.position.y = Math.sin(t * 1.15) * 0.13;

        /* Glow disc breathes */
        glowDisc.material.opacity = 0.05 + Math.abs(Math.sin(t * 1.15)) * 0.06;

        /* Mouse look — only when not spinning */
        if (spinLeft <= 0) {
            robot.rotation.y += (mouse.x * 0.38 - robot.rotation.y) * 0.04;
            robot.rotation.x += (-mouse.y * 0.14 - robot.rotation.x) * 0.04;
        }

        /* Click spin */
        if (spinLeft > 0) {
            const step = Math.min(SPIN_SPEED, spinLeft);
            robot.rotation.y += step;
            spinLeft -= step;
            if (spinLeft <= 0) {
                robot.rotation.y = 0; // snap back straight
            }
        }

        /* Hover — wave right arm */
        if (hovering) {
            waveT += 0.12;
            rightArmGroup.rotation.z =  1.15 + Math.sin(waveT * 2.8) * 0.38; // raise + oscillate
            rightArmGroup.rotation.x = -0.28;
        } else {
            waveT = 0;
            rightArmGroup.rotation.z += (0 - rightArmGroup.rotation.z) * 0.07;
            rightArmGroup.rotation.x += (0 - rightArmGroup.rotation.x) * 0.07;
        }

        /* Left arm gentle idle swing */
        leftArmGroup.rotation.z  = -0.12 + Math.sin(t * 0.7) * 0.06;
        leftArmGroup.rotation.x  =  Math.sin(t * 0.9) * 0.08;

        /* Eye glow pulse */
        greenMat.emissiveIntensity  = 0.65 + Math.sin(t * 2.8) * 0.3;
        antTip.material             = greenMat; // antTip shares greenMat

        /* Green point light breathe */
        greenPt.intensity  = 3.2 + Math.sin(t * 1.6) * 1.0;
        purplePt.intensity = 2.2 + Math.sin(t * 1.1 + 1) * 0.6;

        /* Core orb pulse */
        coreOrb.material.emissiveIntensity = 0.4 + Math.sin(t * 3) * 0.35;

        renderer.render(scene, camera);
    }

    animate();
})();
