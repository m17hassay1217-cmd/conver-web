import { HeroV3 } from './site/HeroV3';
import { Website } from './site/Website';
export function App(){ return new URLSearchParams(location.search).get('hero')==='v3'?<HeroV3/>:<Website/>; }
