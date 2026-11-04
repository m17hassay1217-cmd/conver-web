import { cubic, orbitalLayout, type Box, type Point } from './geometry';
import { TIMING } from './timeline';
export const clamp = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (x: number) => { const t = clamp(x); return t * t * (3 - 2 * t); };
export type Flight = {
  rank: number; start: number; end: number;
  position: (time: number) => Point;
};
export type Scene = {
  width: number; height: number; source: Point; gate: number; logoSize: number;
  beamFrom: Point; impact: Point; wordmark: Box; flights: Flight[];
};

/** All positions are local CSS pixels, measured before any animation is applied. */
export function measureScene(root: HTMLElement): Scene {
  const core = root.querySelector<HTMLElement>('.logo-core')!;
  const name = root.querySelector<HTMLElement>('.intro-wordmark')!;
  const width = root.clientWidth, height = root.clientHeight;
  const source = { x: core.offsetLeft, y: core.offsetTop };
  const wordmark = { x: name.offsetLeft - name.offsetWidth / 2, y: name.offsetTop, width: name.offsetWidth, height: name.offsetHeight };
  const labels = [...root.querySelectorAll<HTMLElement>('.outcome')].map(el => ({ x: 0, y: 0, width: el.offsetWidth, height: el.offsetHeight }));
  const obstacles = [{ x: source.x - core.offsetWidth / 2, y: source.y - core.offsetHeight / 2, width: core.offsetWidth, height: core.offsetHeight }, wordmark];
  const orbit = (t: number, i: number) => orbitalLayout(t, width, height, labels, obstacles)[i];
  const order = labels.map((_, i) => ({ i, distance: Math.hypot(orbit(TIMING.attract,i).x-source.x,orbit(TIMING.attract,i).y-source.y) })).sort((a,b)=>a.distance-b.distance);
  const flights = labels.map((label, i): Flight => {
    const rank = order.findIndex(item => item.i === i);
    const start = TIMING.attract + rank * TIMING.pullStagger, end = start + TIMING.pullDuration;
    const a = orbit(start,i), prior = orbit(start-40,i);
    const tangent = { x: (a.x-prior.x)*9, y: (a.y-prior.y)*9 };
    const side = a.x < source.x ? -1 : 1;
    const below = a.y > wordmark.y + wordmark.height;
    const margin = width < 700 ? 10 : 38;
    const corridor = wordmark.width/2 + label.width*(width<700?.18:.5) + margin;
    const waypoint = { x: Math.max(12+label.width*.18,Math.min(width-12-label.width*.18,source.x+side*corridor)), y: wordmark.y-48 };
    return { rank, start, end, position(time) {
      if(time<=start) return orbit(time,i);
      const u=clamp((time-start)/TIMING.pullDuration);
      const p=.16*u+.84*u*u;
      let attracted: Point;
      if(below) {
        // Detour around the measured name, then meet the logo from above it.
        const split=.69;
        attracted=p<split ? cubic(a,{x:a.x+tangent.x,y:a.y+tangent.y},{x:waypoint.x,y:a.y},waypoint,p/split)
          : cubic(waypoint,{x:waypoint.x,y:waypoint.y-45},{x:source.x+side*60,y:source.y+20},source,(p-split)/(1-split));
      } else {
        attracted=cubic(a,{x:a.x+tangent.x,y:a.y+tangent.y},{x:source.x+(a.y-source.y)*.18,y:source.y-(a.x-source.x)*.12},source,p);
      }
      const blend=smooth(u/.22), floating=orbit(start+(time-start)*.5,i);
      const result={x:floating.x+(attracted.x-floating.x)*blend,y:floating.y+(attracted.y-floating.y)*blend};
      if(width<700){const half=label.width*(1-.64*smooth((time-start)/300))/2+12;result.x=Math.max(half,Math.min(width-half,result.x));}
      return result;
    }};
  });
  return { width,height,source,logoSize:core.offsetWidth,gate:core.offsetWidth*.29,wordmark,flights,
    beamFrom:{x:source.x,y:source.y+core.offsetHeight*.43},
    impact:{x:wordmark.x+wordmark.width/2,y:wordmark.y+wordmark.height*.38} };
}

export function renderPhrases(root: HTMLElement, scene: Scene, time: number) {
  root.querySelectorAll<HTMLElement>('.outcome').forEach((el,i)=>{
    const flight=scene.flights[i], p=flight.position(time);
    const distance=Math.hypot(p.x-scene.source.x,p.y-scene.source.y);
    const squeeze=smooth((150-distance)/115);
    const mobileDetour=scene.width<700 ? smooth((time-flight.start)/300)*.64 : 0;
    const xScale=1-Math.max(squeeze*.75,mobileDetour), yScale=1-squeeze*.18;
    el.style.transform=`translate(${p.x}px,${p.y}px) translate(-50%,-50%) scale(${xScale},${yScale})`;
    el.style.visibility=time>=flight.end?'hidden':'visible';
    el.dataset.pullRank=String(flight.rank);
    el.dataset.absorbed=String(time>=flight.end);
  });
}
