import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { CatmullRomCurve3, DoubleSide, Group, Mesh, OrthographicCamera, PMREMGenerator, TextureLoader, Vector2, Vector3 } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import logo from '../assets/converdive-logo.svg';

const CYAN = '#65BEDB';
const LEFT = -1.72;
const RIGHT = 1.72;
const LEFT_BEADS: [number, number, number][] = [
  [-.36, -.83, -.25], [0, -.83, -.35], [.35, -.83, -.2], [-.48, -.82, .12], [-.12, -.82, .05], [.24, -.82, .12], [.48, -.82, .18], [-.3, -.82, .4], [.08, -.82, .4],
  [-.3, -.47, -.2], [.06, -.47, -.25], [.39, -.47, -.06], [-.4, -.47, .14], [-.06, -.47, .12], [.24, -.47, .28], [-.22, -.47, .4],
  [-.18, -.13, -.01], [.18, -.13, .13],
];
const RIGHT_BEADS: [number, number, number][] = [[-.34, -.83, -.15], [.03, -.83, -.3], [.36, -.83, -.05], [-.35, -.83, .25], [.03, -.83, .13], [.32, -.83, .3]];
const smooth = (value: number) => { const t = Math.min(1, Math.max(0, value)); return t * t * (3 - 2 * t); };

class InstallationBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <StaticInstallation /> : this.props.children; }
}

function SceneEnvironment() {
  const { gl, scene, camera, size } = useThree();
  useEffect(() => {
    const generator = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const environment = generator.fromScene(room, .04);
    const previous = scene.environment;
    const previousIntensity = scene.environmentIntensity;
    scene.environment = environment.texture;
    scene.environmentIntensity = .45;
    generator.dispose();
    room.dispose();
    return () => { scene.environment = previous; scene.environmentIntensity = previousIntensity; environment.dispose(); };
  }, [gl, scene]);
  useEffect(() => {
    const orthographic = camera as OrthographicCamera;
    orthographic.zoom = Math.min(size.width / 7.7, size.height / 4.35);
    orthographic.lookAt(0, .37, 0);
    orthographic.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

function Sphere({ position, warm = false }: { position: [number, number, number]; warm?: boolean }) {
  return <mesh position={position} castShadow>
    <sphereGeometry args={[.165, 24, 16]} />
    <meshPhysicalMaterial color={warm ? '#a4c9d1' : '#80aebb'} metalness={.55} roughness={.2} clearcoat={1} clearcoatRoughness={.15} envMapIntensity={1.4} />
  </mesh>;
}

function Vessel({ x, right = false }: { x: number; right?: boolean }) {
  // Closed cross-section around a hollow interior: the only horizontal surface
  // at the mouth is the narrow annulus. There is deliberately no lid/cap mesh.
  const profile = useMemo(() => [new Vector2(0, -1.04), new Vector2(.7, -1.04), new Vector2(.79, -.96), new Vector2(.79, .48), new Vector2(.725, .48), new Vector2(.725, -.9), new Vector2(0, -.9)], []);
  return <group position={[x, 0, 0]}>
    <mesh receiveShadow position={[0, -1.09, 0]}>
      <cylinderGeometry args={[.92, 1, .12, 64]} />
      <meshStandardMaterial color="#1b303b" metalness={.8} roughness={.29} />
    </mesh>
    <mesh position={[0, -1.017, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[.79, .91, 64]} /><meshBasicMaterial color={right ? '#D6A980' : CYAN} transparent opacity={.45} side={DoubleSide} />
    </mesh>
    <mesh renderOrder={2}>
      <latheGeometry args={[profile, 80]} />
      <meshPhysicalMaterial color="#7398a7" metalness={.12} roughness={.16} transparent opacity={.16} depthWrite={false} side={DoubleSide} clearcoat={1} envMapIntensity={.55} />
    </mesh>
    <mesh position={[0, -.93, 0]}>
      <cylinderGeometry args={[.72, .72, .08, 64]} />
      <meshStandardMaterial color="#25414e" metalness={.7} roughness={.24} />
    </mesh>
    <mesh position={[0, .48, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[.757, .045, 12, 80]} />
      <meshStandardMaterial color="#9eb7c0" metalness={.92} roughness={.19} envMapIntensity={1.3} />
    </mesh>
    <mesh position={[0, .427, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[.776, .011, 8, 80]} />
      <meshBasicMaterial color={right ? '#D6A980' : '#65BEDB'} transparent opacity={.7} />
    </mesh>
    {[-.9, -.82].map(y => <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.787, .012, 6, 64]} /><meshStandardMaterial color="#587886" metalness={.8} roughness={.25} /></mesh>)}
    {/* A restrained measuring scale makes the wall and open mouth legible. */}
    {[0, 1, 2, 3, 4].map(i => <mesh key={i} position={[.49, -.62 + i * .18, .62]} rotation={[0, -.64, 0]}>
      <boxGeometry args={[i % 2 ? .065 : .12, .012, .007]} /><meshBasicMaterial color="#aac3cc" transparent opacity={.55} />
    </mesh>)}
    {(right ? RIGHT_BEADS : LEFT_BEADS.slice(0, 16)).map((position, i) => <Sphere key={i} position={position} warm={right} />)}
  </group>;
}

function LogoPlate() {
  const texture = useLoader(TextureLoader, logo);
  return <mesh position={[0, 1.58, .225]}><planeGeometry args={[.48, .296]} /><meshBasicMaterial map={texture} transparent toneMapped={false} /></mesh>;
}

function Transfer({ animate, onComplete }: { animate: boolean; onComplete: () => void }) {
  const elapsed = useRef(0);
  const completedAnimation = useRef(false);
  const bead = useRef<Mesh>(null);
  const carriage = useRef<Group>(null);
  const leftOne = useRef<Group>(null);
  const leftTwo = useRef<Group>(null);
  const landedOne = useRef<Group>(null);
  const landedTwo = useRef<Group>(null);
  const field = useRef<Mesh>(null);
  const path = useMemo(() => new CatmullRomCurve3([new Vector3(LEFT, -.13, .03), new Vector3(LEFT, 1.28, .03), new Vector3(-1.45, 1.47, .03), new Vector3(0, 1.47, .03), new Vector3(1.45, 1.47, .03), new Vector3(RIGHT, 1.28, .03), new Vector3(RIGHT, -.48, .03)], false, 'centripetal'), []);
  const point = useMemo(() => new Vector3(), []);
  useFrame((_, delta) => {
    if (!animate) return;
    elapsed.current += Math.min(delta, .06);
    const t = elapsed.current;
    const cycle = Math.min(1, Math.floor(Math.max(0, t - .7) / 7));
    const local = t - .7 - cycle * 7;
    const inFlight = local >= .65 && local <= 5.5 && t < 13.25;
    const completed = t > 6.2 ? (t > 13.2 ? 2 : 1) : 0;
    if (leftOne.current) leftOne.current.visible = t < 1.35;
    if (leftTwo.current) leftTwo.current.visible = t < 8.35;
    if (landedOne.current) landedOne.current.visible = completed >= 1;
    if (landedTwo.current) landedTwo.current.visible = completed >= 2;
    if (bead.current) {
      bead.current.visible = inFlight;
      if (inFlight) {
        // Each leg settles before the next: extraction, overhead, release.
        let progress: number;
        if (local < 2.15) progress = smooth((local - .65) / 1.5) * .255;
        else if (local < 3.95) progress = .255 + smooth((local - 2.15) / 1.8) * .49;
        else progress = .745 + smooth((local - 3.95) / 1.55) * .255;
        path.getPoint(progress, point);
        bead.current.position.copy(point);
      }
    }
    if (carriage.current) carriage.current.position.x = inFlight ? point.x : (completed >= 2 ? RIGHT : LEFT);
    if (field.current) { field.current.visible = inFlight && (local < 2.15 || local > 3.95); field.current.position.x = local < 2.15 ? LEFT : RIGHT; }
    if (t >= 13.4 && !completedAnimation.current) { completedAnimation.current = true; onComplete(); }
  });
  return <>
    <group ref={leftOne} position={[LEFT, 0, 0]}><Sphere position={LEFT_BEADS[16]} /></group>
    <group ref={leftTwo} position={[LEFT, 0, 0]}><Sphere position={LEFT_BEADS[17]} /></group>
    <group ref={landedOne} visible={false} position={[RIGHT, 0, 0]}><Sphere position={[-.15, -.48, -.04]} warm /></group>
    <group ref={landedTwo} visible={false} position={[RIGHT, 0, 0]}><Sphere position={[.18, -.48, .15]} warm /></group>
    <mesh ref={bead} visible={false} castShadow><sphereGeometry args={[.165, 28, 18]} /><meshPhysicalMaterial color="#c3e1e8" emissive="#65BEDB" emissiveIntensity={.2} metalness={.55} roughness={.18} clearcoat={1} /></mesh>
    <group ref={carriage} position={[LEFT, 0, 0]}>
      <mesh position={[0, 1.65, 0]}><boxGeometry args={[.38, .17, .42]} /><meshStandardMaterial color="#3e5966" metalness={.85} roughness={.25} /></mesh>
      <mesh position={[0, 1.53, 0]}><cylinderGeometry args={[.095, .13, .13, 24]} /><meshStandardMaterial color="#b2c8cf" metalness={.9} roughness={.2} /></mesh>
      <mesh position={[0, 1.445, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.105, .014, 8, 32]} /><meshBasicMaterial color={CYAN} /></mesh>
    </group>
    <mesh ref={field} visible={false} position={[LEFT, .94, .02]}>
      <cylinderGeometry args={[.065, .22, .8, 24, 1, true]} /><meshBasicMaterial color={CYAN} transparent opacity={.075} depthWrite={false} side={DoubleSide} />
    </mesh>
  </>;
}

function InstallationScene({ animate, onComplete }: { animate: boolean; onComplete: () => void }) {
  return <>
    <SceneEnvironment />
    <ambientLight intensity={.45} />
    <directionalLight position={[-3, 5, 4]} intensity={2.1} color="#d9e8ee" />
    <directionalLight position={[4, 2, -2]} intensity={2.3} color="#D6A980" />
    <pointLight position={[-2, .9, 1.2]} intensity={4} color={CYAN} distance={5} />
    <fog attach="fog" args={['#08141C', 11, 23]} />
    <mesh position={[0, -1.22, 0]}>
      <boxGeometry args={[6.55, .13, 2.7]} /><meshStandardMaterial color="#10232d" metalness={.18} roughness={.56} envMapIntensity={.3} />
    </mesh>
    <mesh position={[0, -1.29, 0]}>
      <boxGeometry args={[6.9, .04, 2.95]} /><meshStandardMaterial color="#29434c" metalness={.65} roughness={.31} envMapIntensity={.4} />
    </mesh>
    {[-2.5, 2.5].map(x => <mesh key={x} position={[x, 2.45, -.2]}><cylinderGeometry args={[.012, .012, 1.95, 8]} /><meshStandardMaterial color="#59717b" metalness={.9} roughness={.3} /></mesh>)}
    <mesh position={[0, 1.73, -.13]}><boxGeometry args={[5.5, .13, .22]} /><meshStandardMaterial color="#7d99a5" metalness={.88} roughness={.24} /></mesh>
    <mesh position={[0, 1.71, .003]}><boxGeometry args={[5.45, .016, .014]} /><meshBasicMaterial color={CYAN} transparent opacity={.7} /></mesh>
    <mesh position={[0, 1.58, .08]}><boxGeometry args={[.82, .43, .22]} /><meshStandardMaterial color="#162b36" metalness={.85} roughness={.23} /></mesh>
    <Suspense fallback={null}><LogoPlate /></Suspense>
    <Vessel x={LEFT} /><Vessel x={RIGHT} right />
    <Transfer animate={animate} onComplete={onComplete} />
    <mesh position={[1.72, -1.145, .7]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[.025, .7]} /><meshBasicMaterial color={CYAN} transparent opacity={.7} /></mesh>
  </>;
}

/** SVG keeps the same open-vessel metaphor when WebGL is unavailable/lost. */
function StaticInstallation() {
  return <svg className="cv-installation-static" viewBox="0 0 1000 450" role="img" aria-label="Two open-top vessels: many enquiries, fewer booked jobs, and a suspended transfer mechanism.">
    <defs><linearGradient id="cv-vessel-wall" x1="0" x2="1"><stop stopColor="#82b0c1" stopOpacity=".3" /><stop offset=".4" stopColor="#142d3a" stopOpacity=".15" /><stop offset="1" stopColor="#80b0c2" stopOpacity=".35" /></linearGradient><radialGradient id="cv-bead"><stop stopColor="#c6e0e7" /><stop offset=".45" stopColor="#79a3b3" /><stop offset="1" stopColor="#28444f" /></radialGradient><linearGradient id="cv-pedestal"><stop stopColor="#34505e" /><stop offset="1" stopColor="#11252f" /></linearGradient></defs>
    <path d="M170 375H830L880 407H120Z" fill="url(#cv-pedestal)" stroke="#3c5865" />
    <path d="M190 0V105M810 0V105" stroke="#5a717b" strokeWidth="2" />
    <path d="M165 103H835" stroke="#7995a0" strokeWidth="11" /><path d="M165 109H835" stroke="#65bedb" strokeOpacity=".6" />
    <rect x="455" y="98" width="90" height="47" rx="2" fill="#243d48" stroke="#617b87" /><image href={logo} x="475" y="105" width="50" height="31" />
    {[285, 715].map((x, side) => <g key={x}>
      <ellipse cx={x} cy="374" rx="107" ry="23" fill="#10242e" stroke="#50717c" />
      <path d={`M${x - 90} 219V350C${x - 90} 383 ${x + 90} 383 ${x + 90} 350V219`} fill="url(#cv-vessel-wall)" stroke="#638693" strokeOpacity=".6" />
      <ellipse cx={x} cy="219" rx="90" ry="27" fill="#0b1b25" stroke="#a3bdc8" strokeWidth="6" />
      <ellipse cx={x} cy="221" rx="83" ry="22" fill="#0c212c" stroke="#496c7e" strokeWidth="2" />
      {Array.from({ length: side ? 6 : 18 }, (_, i) => <circle key={i} cx={x - 55 + (i % 4) * 36 + (Math.floor(i / 4) % 2 ? 9 : 0)} cy={348 - Math.floor(i / 4) * 29} r="16" fill="url(#cv-bead)" stroke="#7698a7" strokeWidth=".5" />)}
      <path d={`M${x - 90} 222V350C${x - 90} 383 ${x + 90} 383 ${x + 90} 350V222`} fill="url(#cv-vessel-wall)" fillOpacity=".35" />
      <path d={`M${x - 90} 219C${x - 90} 253 ${x + 90} 253 ${x + 90} 219`} fill="none" stroke="#9eb9c4" strokeWidth="5" />
      <path d={`M${x + 59} 277h13m-13 21h8m-8 21h13m-13 21h8`} stroke="#9bb6c0" opacity=".6" />
    </g>)}
    <path d="M285 192V144Q285 130 300 130H699Q715 130 715 145V194" fill="none" stroke="#65BEDB" strokeWidth="1" strokeDasharray="3 7" opacity=".45" />
    <circle cx="342" cy="130" r="15" fill="url(#cv-bead)" />
  </svg>;
}

export function HeroInstallation() {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [finished, setFinished] = useState(false);
  const [failed, setFailed] = useState(false);
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
    <div className="cv-installation-render" aria-hidden="true">
      {failed ? <StaticInstallation /> : <InstallationBoundary><Canvas orthographic camera={{ position: [0, 3.5, 9], zoom: 75, near: .1, far: 40 }} dpr={[1, 1.5]} frameloop={active ? 'always' : 'demand'} gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }} fallback={<StaticInstallation />} onCreated={({ gl }) => { contextCanvas.current = gl.domElement; gl.domElement.addEventListener('webglcontextlost', onLost); gl.setClearColor('#08141C', 0); }}><InstallationScene animate={active} onComplete={completeAnimation} /></Canvas></InstallationBoundary>}
    </div>
    <figcaption className="cv-installation-labels"><span>ENQUIRIES</span><span>BOOKED JOBS</span></figcaption>
    <div className="cv-installation-footer"><p>Different starting points. A process worth understanding.</p>{!reduced && !finished && !failed && <button type="button" className="cv-installation-pause" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Resume transfer animation' : 'Pause transfer animation'}>{paused ? 'Play' : 'Pause'} <svg width="10" height="11" viewBox="0 0 10 11" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">{paused ? <path d="m2 1 6 4.5L2 10Z" /> : <path d="M3 1v9m4-9v9" />}</svg></button>}</div>
  </figure>;
}
