import { Component, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Group, Mesh, OrthographicCamera, TextureLoader, Vector2 } from 'three';
import { createIndustrialLighting } from './lighting';
import logo from '../assets/converdive-logo.svg';
import { StaticInstallation } from './HeroFallback';
import { createIndustrialKit, type IndustrialKit } from './materials';

gsap.registerPlugin(MotionPathPlugin);

const LEFT = -1.72;
const RIGHT = 1.72;
const LEFT_BEADS: [number, number, number][] = [
  [-.36, -.83, -.25], [0, -.83, -.35], [.35, -.83, -.2], [-.48, -.82, .12], [-.12, -.82, .05], [.24, -.82, .12], [.48, -.82, .18], [-.3, -.82, .4], [.08, -.82, .4],
  [-.3, -.47, -.2], [.06, -.47, -.25], [.39, -.47, -.06], [-.4, -.47, .14], [-.06, -.47, .12], [.24, -.47, .28], [-.22, -.47, .4],
  [-.18, -.13, -.01], [.18, -.13, .13],
];
const RIGHT_BEADS: [number, number, number][] = [[-.34, -.83, -.15], [.03, -.83, -.3], [.36, -.83, -.05], [-.35, -.83, .25], [.03, -.83, .13], [.32, -.83, .3]];

class InstallationBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <StaticInstallation /> : this.props.children; }
}

function SceneEnvironment({ onReady, onFailed }: { onReady: () => void; onFailed: () => void }) {
  const { gl, scene, camera, size, invalidate, setFrameloop } = useThree();
  useLayoutEffect(() => { setFrameloop('never'); }, [setFrameloop]);
  useEffect(() => {
    let disposed = false;
    let environment: Awaited<ReturnType<typeof createIndustrialLighting>> | undefined;
    const previous = scene.environment, previousIntensity = scene.environmentIntensity;
    void createIndustrialLighting().then(async texture => {
      if (disposed) { texture.dispose(); return; }
      environment = texture; scene.environment = texture; scene.environmentIntensity = .5;
      await gl.compileAsync(scene, camera);
      if (!disposed) { setFrameloop('demand'); invalidate(); requestAnimationFrame(() => { if (!disposed) onReady(); }); }
    }).catch(() => { if (!disposed) onFailed(); });
    return () => { disposed = true; scene.environment = previous; scene.environmentIntensity = previousIntensity; environment?.dispose(); };
  }, [gl, scene, camera, invalidate, setFrameloop, onReady, onFailed]);

  useEffect(() => {
    const orthographic = camera as OrthographicCamera;
    orthographic.zoom = Math.min(size.width / 7.7, size.height / 4.35);
    orthographic.lookAt(0, .37, 0);
    orthographic.updateProjectionMatrix();
    invalidate();
  }, [camera, size, invalidate]);
  return null;
}

function Sphere({ position, warm = false, kit }: { position: [number, number, number]; warm?: boolean; kit: IndustrialKit }) {
  return <mesh position={position} geometry={kit.beadGeometry} material={warm ? kit.warmBead : kit.bead} dispose={null} />;
}

function Vessel({ x, right = false, kit }: { x: number; right?: boolean; kit: IndustrialKit }) {
  // Hollow lathed glass: only the narrow annular rim crosses the mouth.
  // The beads are visible through the walls and through the genuinely open top.
  const profile = useMemo(() => [new Vector2(0, -1.04), new Vector2(.7, -1.04), new Vector2(.79, -.96), new Vector2(.79, .48), new Vector2(.725, .48), new Vector2(.725, -.9), new Vector2(0, -.9)], []);
  return <group position={[x, 0, 0]}>
    <mesh position={[0, -1.09, 0]} material={kit.darkSteel}><cylinderGeometry args={[.92, 1, .12, 64]} /></mesh>
    <mesh position={[0, -1.017, 0]} rotation={[-Math.PI / 2, 0, 0]} material={right ? kit.warm : kit.cyan}><ringGeometry args={[.79, .91, 64]} /></mesh>
    <mesh renderOrder={2} material={kit.glass}><latheGeometry args={[profile, 64]} /></mesh>
    <mesh position={[0, -.93, 0]} material={kit.darkSteel}><cylinderGeometry args={[.72, .72, .08, 64]} /></mesh>
    <mesh position={[0, .48, 0]} rotation={[Math.PI / 2, 0, 0]} material={kit.steel}><torusGeometry args={[.757, .045, 12, 64]} /></mesh>
    <mesh position={[0, .427, 0]} rotation={[Math.PI / 2, 0, 0]} material={right ? kit.warm : kit.cyan}><torusGeometry args={[.776, .011, 8, 64]} /></mesh>
    {[-.9, -.82].map(y => <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} material={kit.darkSteel}><torusGeometry args={[.787, .012, 6, 64]} /></mesh>)}
    {[0, 1, 2, 3, 4].map(i => <mesh key={i} position={[.49, -.62 + i * .18, .62]} rotation={[0, -.64, 0]} material={kit.scale}><boxGeometry args={[i % 2 ? .065 : .12, .012, .007]} /></mesh>)}
    {(right ? RIGHT_BEADS : LEFT_BEADS.slice(0, 16)).map((position, i) => <Sphere key={i} position={position} warm={right} kit={kit} />)}
  </group>;
}

function LogoPlate() {
  const texture = useLoader(TextureLoader, logo);
  return <mesh position={[0, 1.58, .225]}><planeGeometry args={[.48, .296]} /><meshBasicMaterial map={texture} transparent toneMapped={false} /></mesh>;
}

function Transfer({ animate, onComplete, kit }: { animate: boolean; onComplete: () => void; kit: IndustrialKit }) {
  const frameloop = useThree(state => state.frameloop);
  const invalidate = useThree(state => state.invalidate);
  const lastFrame = useRef(0);
  const requestFrame = useCallback(() => {
    const now = performance.now();
    if (now - lastFrame.current >= 1000 / 30) { lastFrame.current = now; invalidate(); }
  }, [invalidate]);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const bead = useRef<Mesh>(null);
  const carriage = useRef<Group>(null);
  const leftOne = useRef<Group>(null);
  const leftTwo = useRef<Group>(null);
  const landedOne = useRef<Group>(null);
  const landedTwo = useRef<Group>(null);
  const field = useRef<Mesh>(null);
  const proxy = useMemo(() => ({ x: LEFT, y: -.13, z: .03, flight: 0, extracted: 0, landed: 0, field: 0, fieldX: LEFT, carriageX: LEFT }), []);

  useLayoutEffect(() => {
    // GSAP is the sole clock. MotionPath interpolates numeric 3D proxy values;
    // useFrame only copies the current sample into Three objects. Three's own
    // render loop stays on demand and never advances animation time.
    const sequence = gsap.timeline({ paused: true, onUpdate: requestFrame, onComplete: () => { invalidate(); onComplete(); } });
    for (let cycle = 0; cycle < 2; cycle += 1) {
      const start = .9 + cycle * 6.25;
      const source = LEFT_BEADS[16 + cycle];
      const targetX = RIGHT + (cycle ? .18 : -.15);
      const targetZ = cycle ? .15 : -.04;
      sequence.set(proxy, { x: LEFT + source[0], y: source[1], z: source[2], flight: 1, extracted: cycle + 1, field: 1, fieldX: LEFT }, start)
        .to(proxy, { motionPath: { path: [
          { x: LEFT + source[0], y: source[1], z: source[2] },
          { x: LEFT + source[0] * .65, y: .5, z: .03 },
          { x: LEFT, y: 1.28, z: .03 },
        ], curviness: .55, autoRotate: false }, duration: 1.45, ease: 'power2.inOut' }, start)
        .set(proxy, { field: 0 }, start + 1.45)
        .to(proxy, { motionPath: { path: [
          { x: LEFT, y: 1.28, z: .03 },
          { x: LEFT + .24, y: 1.43, z: .03 },
          { x: 0, y: 1.43, z: .03 },
          { x: RIGHT - .24, y: 1.43, z: .03 },
          { x: RIGHT, y: 1.28, z: .03 },
        ], curviness: .55, autoRotate: false }, duration: 1.85, ease: 'power2.inOut' }, start + 1.45)
        .set(proxy, { field: 1, fieldX: RIGHT }, start + 3.3)
        .to(proxy, { motionPath: { path: [
          { x: RIGHT, y: 1.28, z: .03 },
          { x: RIGHT + (targetX - RIGHT) * .35, y: .55, z: .03 },
          { x: targetX, y: -.48, z: targetZ },
        ], curviness: .55, autoRotate: false }, duration: 1.5, ease: 'power2.inOut' }, start + 3.3)
        .set(proxy, { flight: 0, field: 0, landed: cycle + 1, carriageX: RIGHT }, start + 4.8);
      if (cycle === 0) sequence.to(proxy, { carriageX: LEFT, duration: .8, ease: 'power2.inOut' }, start + 5.1);
    }
    timeline.current = sequence;
    return () => { sequence.kill(); timeline.current = null; };
  }, [invalidate, requestFrame, onComplete, proxy]);
  useEffect(() => {
    if (animate && frameloop !== 'never') timeline.current?.resume();
    else timeline.current?.pause();
    invalidate();
  }, [animate, frameloop, invalidate]);

  useFrame(() => {
    if (leftOne.current) leftOne.current.visible = proxy.extracted < 1;
    if (leftTwo.current) leftTwo.current.visible = proxy.extracted < 2;
    if (landedOne.current) landedOne.current.visible = proxy.landed >= 1;
    if (landedTwo.current) landedTwo.current.visible = proxy.landed >= 2;
    if (bead.current) { bead.current.visible = proxy.flight > .5; bead.current.position.set(proxy.x, proxy.y, proxy.z); }
    if (carriage.current) carriage.current.position.x = proxy.flight > .5 ? proxy.x : proxy.carriageX;
    if (field.current) { field.current.visible = proxy.field > .5; field.current.position.x = proxy.fieldX; }
  });
  return <>
    <group ref={leftOne} position={[LEFT, 0, 0]}><Sphere position={LEFT_BEADS[16]} kit={kit} /></group>
    <group ref={leftTwo} position={[LEFT, 0, 0]}><Sphere position={LEFT_BEADS[17]} kit={kit} /></group>
    <group ref={landedOne} visible={false} position={[RIGHT, 0, 0]}><Sphere position={[-.15, -.48, -.04]} warm kit={kit} /></group>
    <group ref={landedTwo} visible={false} position={[RIGHT, 0, 0]}><Sphere position={[.18, -.48, .15]} warm kit={kit} /></group>
    <mesh ref={bead} visible={false} geometry={kit.beadGeometry} material={kit.transferBead} dispose={null} />
    <group ref={carriage} position={[LEFT, 0, 0]}>
      <mesh position={[0, 1.65, 0]} material={kit.darkSteel}><boxGeometry args={[.38, .17, .42]} /></mesh>
      <mesh position={[0, 1.53, 0]} material={kit.steel}><cylinderGeometry args={[.095, .13, .13, 24]} /></mesh>
      <mesh position={[0, 1.445, 0]} rotation={[Math.PI / 2, 0, 0]} material={kit.cyan}><torusGeometry args={[.105, .014, 8, 32]} /></mesh>
    </group>
    <mesh ref={field} visible={false} position={[LEFT, .94, .02]} material={kit.field}><cylinderGeometry args={[.065, .22, .8, 24, 1, true]} /></mesh>
  </>;
}

function InstallationScene({ animate, onComplete, onReady, onFailed }: { animate: boolean; onComplete: () => void; onReady: () => void; onFailed: () => void }) {
  const kit = useMemo(createIndustrialKit, []);
  useEffect(() => () => Object.values(kit).forEach(resource => resource.dispose()), [kit]);
  return <>
    <SceneEnvironment onReady={onReady} onFailed={onFailed} />
    <ambientLight intensity={.5} />
    <directionalLight position={[-3, 5, 4]} intensity={2.3} color="#d9e8ee" />
    <directionalLight position={[4, 2, -2]} intensity={1.8} color="#D6A980" />
    <fog attach="fog" args={['#08141C', 11, 23]} />
    <mesh position={[0, -1.22, 0]} material={kit.base}><boxGeometry args={[6.55, .13, 2.7]} /></mesh>
    <mesh position={[0, -1.29, 0]} material={kit.darkSteel}><boxGeometry args={[6.9, .04, 2.95]} /></mesh>
    {[-2.5, 2.5].map(x => <mesh key={x} position={[x, 2.45, -.2]} material={kit.darkSteel}><cylinderGeometry args={[.012, .012, 1.95, 8]} /></mesh>)}
    <mesh position={[0, 1.73, -.13]} material={kit.steel}><boxGeometry args={[5.5, .13, .22]} /></mesh>
    <mesh position={[0, 1.71, .003]} material={kit.cyan}><boxGeometry args={[5.45, .016, .014]} /></mesh>
    <mesh position={[0, 1.58, .08]} material={kit.housing}><boxGeometry args={[.82, .43, .22]} /></mesh>
    <Suspense fallback={null}><LogoPlate /></Suspense>
    <Vessel x={LEFT} kit={kit} /><Vessel x={RIGHT} right kit={kit} />
    <Transfer animate={animate} onComplete={onComplete} kit={kit} />
    <mesh position={[1.72, -1.145, .7]} rotation={[-Math.PI / 2, 0, 0]} material={kit.cyan}><planeGeometry args={[.025, .7]} /></mesh>
  </>;
}

export function HeroInstallation() {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const sceneReady = useCallback(() => setReady(true), []);
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [finished, setFinished] = useState(false);
  const [failed, setFailed] = useState(false);
  const sceneFailed = useCallback(() => setFailed(true), []);
  const [paused, setPaused] = useState(false);
  const active = visible && !reduced && !finished && !paused;
  const contextCanvas = useRef<HTMLCanvasElement | null>(null);
  const onLost = useCallback((event: Event) => { event.preventDefault(); setFailed(true); }, []);
  const completeAnimation = useCallback(() => setFinished(true), []);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(preference.matches);
    preference.addEventListener('change', change);
    const element = container.current;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && !document.hidden), { threshold: .06 });
    if (element) observer.observe(element);
    const onVisibility = () => setVisible(!document.hidden && !!element && element.getBoundingClientRect().bottom > 0 && element.getBoundingClientRect().top < window.innerHeight);
    document.addEventListener('visibilitychange', onVisibility);
    return () => { preference.removeEventListener('change', change); observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility); };
  }, []);
  useEffect(() => () => contextCanvas.current?.removeEventListener('webglcontextlost', onLost), [onLost, failed]);

  return <figure className="cv-installation" ref={container} aria-label="Symbolic illustration: many enquiries and fewer booked jobs in two open-top vessels, connected by a suspended transfer rail.">
    <div className="cv-installation-halo" aria-hidden="true" />
    <div className="cv-installation-render" aria-hidden="true" data-render-ready={ready}>
      {!ready && !failed && <div className="cv-installation-loading"><StaticInstallation /></div>}
      {failed ? <StaticInstallation /> : <InstallationBoundary><Canvas style={{opacity:ready?1:0}} orthographic camera={{ position: [0, 3.5, 9], zoom: 75, near: .1, far: 40 }} dpr={[1, 1.5]} frameloop="demand" gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }} fallback={<StaticInstallation />} onCreated={({ gl }) => { contextCanvas.current = gl.domElement; gl.domElement.addEventListener('webglcontextlost', onLost); gl.transmissionResolutionScale = .5; gl.setClearColor('#08141C', 0); }}><InstallationScene animate={active} onComplete={completeAnimation} onReady={sceneReady} onFailed={sceneFailed} /></Canvas></InstallationBoundary>}
    </div>
    <figcaption className="cv-installation-labels"><span>ENQUIRIES</span><span>BOOKED JOBS</span></figcaption>
    <div className="cv-installation-footer"><p>Different starting points. A process worth understanding.</p>{!reduced && !finished && !failed && <button type="button" className="cv-installation-pause" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Resume transfer animation' : 'Pause transfer animation'}>{paused ? 'Play' : 'Pause'} <svg width="10" height="11" viewBox="0 0 10 11" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">{paused ? <path d="m2 1 6 4.5L2 10Z" /> : <path d="M3 1v9m4-9v9" />}</svg></button>}</div>
  </figure>;
}
