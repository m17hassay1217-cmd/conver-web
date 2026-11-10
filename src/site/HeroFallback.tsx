import { Component, type ReactNode } from 'react';
import logo from '../assets/converdive-logo.svg';

/** Keep the semantic hero complete if the optional 3D chunk cannot load. */
export class HeroSceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <HeroFallback /> : this.props.children; }
}

/** SVG keeps the same open-vessel metaphor when WebGL is unavailable/lost. */
export function StaticInstallation() {
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


/** Complete, lightweight still while the optional Three.js chunk loads. */
export function HeroFallback({onPlay}:{onPlay?:()=>void} = {}) {
  return <figure className="cv-installation" aria-label="Symbolic illustration: many enquiries and fewer booked jobs in two open-top vessels, connected by a suspended transfer rail.">
    <div className="cv-installation-halo" aria-hidden="true" />
    <div className="cv-installation-render" aria-hidden="true"><StaticInstallation /></div>
    <figcaption className="cv-installation-labels"><span>ENQUIRIES</span><span>BOOKED JOBS</span></figcaption>
    <div className="cv-installation-footer"><p>Different starting points. A process worth understanding.</p>{onPlay&&<button type="button" className="cv-installation-pause" onClick={onPlay}>Play 3D transfer <span aria-hidden="true">▷</span></button>}</div>
  </figure>;
}
