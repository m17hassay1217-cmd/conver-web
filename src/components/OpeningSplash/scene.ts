import { cubic, orbitalLayout, type Box, type Point } from './geometry';
import { TIMING } from './timeline';
export const clamp=(x:number)=>Math.max(0,Math.min(1,x));
export const smooth=(x:number)=>{const t=clamp(x);return t*t*(3-2*t);};
export type Flight={rank:number;start:number;end:number;position:(time:number)=>Point;angle:(time:number)=>number};
export type Scene={width:number;height:number;source:Point;gate:number;logoSize:number;beamFrom:Point;impact:Point;wordmark:Box;flights:Flight[]};

/** Measure unanimated layout once; every subsystem receives these same coordinates. */
export function measureScene(root:HTMLElement):Scene {
  const core=root.querySelector<HTMLElement>('.logo-core')!;
  const name=root.querySelector<HTMLElement>('.intro-wordmark')!;
  const width=root.clientWidth,height=root.clientHeight;
  const source={x:core.offsetLeft,y:core.offsetTop};
  const wordmark={x:name.offsetLeft-name.offsetWidth/2,y:name.offsetTop,width:name.offsetWidth,height:name.offsetHeight};
  const labels=[...root.querySelectorAll<HTMLElement>('.outcome')].map(el=>({x:0,y:0,width:el.offsetWidth,height:el.offsetHeight}));
  const obstacles=[{x:source.x-core.offsetWidth/2,y:source.y-core.offsetHeight/2,width:core.offsetWidth,height:core.offsetHeight},wordmark];
  const orbit=(time:number,i:number)=>orbitalLayout(time,width,height,labels,obstacles)[i];
  const order=labels.map((_,i)=>({i,distance:Math.hypot(orbit(TIMING.attract,i).x-source.x,orbit(TIMING.attract,i).y-source.y)})).sort((a,b)=>a.distance-b.distance);
  const flights=labels.map((label,i):Flight=>{
    const rank=order.findIndex(item=>item.i===i);
    const start=TIMING.attract+rank*TIMING.pullStagger,end=start+TIMING.pullDuration;
    const a=orbit(start,i),before=orbit(start-1,i),after=orbit(start+1,i);
    const velocity={x:(after.x-before.x)/2,y:(after.y-before.y)/2};
    const side=a.x<source.x?-1:1;
    const below=a.y>wordmark.y+wordmark.height+12;
    const narrow=width<700;
    const split=.72;
    const clearance=narrow?label.height/2+12:label.width/2+22;
    const corridor=Math.min(width/2-22,wordmark.width/2+clearance);
    const waypoint={x:source.x+side*corridor,y:wordmark.y-label.height/2-36};
    const approach={x:waypoint.x,y:waypoint.y+Math.min(100,(a.y-waypoint.y)*.46)};
    const acceleration=(u:number)=>.28*u+.72*u*u;
    // Match orbital velocity at t=0. Cubic segments share the exact derivative
    // at their join, including the segment-time ratio.
    const firstScale=TIMING.pullDuration*(below?split:1)/(3*.28);
    const first={x:a.x+velocity.x*firstScale,y:a.y+velocity.y*firstScale};
    const depart={x:waypoint.x+(waypoint.x-approach.x)*(1-split)/split,y:waypoint.y+(waypoint.y-approach.y)*(1-split)/split};
    return {rank,start,end,position(time){
      if(time<=start)return orbit(time,i);
      const u=clamp((time-start)/TIMING.pullDuration),p=acceleration(u);
      if(below)return p<split?cubic(a,first,approach,waypoint,p/split):cubic(waypoint,depart,{x:source.x+side*core.offsetWidth*.4,y:source.y+10},source,(p-split)/(1-split));
      return cubic(a,first,{x:source.x+(a.y-source.y)*.2,y:source.y-(a.x-source.x)*.15},source,p);
    },angle(time){
      // On a phone text turns edge-on around the wide wordmark, preserving
      // full-sized letters until actual core contact.
      if(!narrow||!below)return 0;
      const u=clamp((time-start)/TIMING.pullDuration);
      return -side*90*smooth(u/.32);
    }};
  });
  return {width,height,source,logoSize:core.offsetWidth,gate:core.offsetWidth*.29,wordmark,flights,
    beamFrom:{x:source.x,y:source.y+core.offsetHeight*.43},impact:{x:wordmark.x+wordmark.width/2,y:wordmark.y+wordmark.height*.38}};
}

export function renderPhrases(root:HTMLElement,scene:Scene,time:number){
  root.querySelectorAll<HTMLElement>('.outcome').forEach((el,i)=>{
    const flight=scene.flights[i],p=flight.position(time);
    const distance=Math.hypot(p.x-scene.source.x,p.y-scene.source.y);
    const squeeze=smooth((scene.gate+72-distance)/72);
    const xScale=1-squeeze*.78,yScale=1-squeeze*.22;
    el.style.transform=`translate(${p.x}px,${p.y}px) translate(-50%,-50%) rotate(${flight.angle(time)}deg) scale(${xScale},${yScale})`;
    el.style.visibility=time>=flight.end?'hidden':'visible';
    el.dataset.pullRank=String(flight.rank);el.dataset.absorbed=String(time>=flight.end);
  });
}
