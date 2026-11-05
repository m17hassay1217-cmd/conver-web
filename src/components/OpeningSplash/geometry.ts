/** Scene coordinates are CSS pixels. Geometry is deterministic at every timestamp. */
export type Box = { x: number; y: number; width: number; height: number };
export type Point = { x: number; y: number };
const PHASES = [-1.68, -.88, .10, .98, 1.98, 2.78, 3.88];
const PHONE_PHASES = [-1.64, -.91, .43, 1.43, 2.15, 2.76, 4.08];

export function orbitalLayout(time:number,width:number,height:number,labels:Box[],obstacles:Box[]):Point[] {
  const phone=width<700,short=height<500;
  const center={x:width/2,y:height*(phone?.44:.43)};
  const pad=phone?18:38;
  const radiusX=Math.min(width*(phone?.36:.33),650);
  const radiusY=Math.min(height*(phone?.34:.29),center.y-(short?68:92),height-(phone?122:80)-center.y);
  const elapsed=Math.max(0,time-350)/1000;
  const points=labels.map((label,i)=>{
    const angle=(phone?PHONE_PHASES:PHASES)[i]+elapsed*(phone?.022:.045)*(1+[.06,-.07,.04,-.03,.09,-.05,.02][i]);
    // Each label has a different ellipse radius; no rigid carousel or fixed y rows.
    const rx=Math.min(radiusX*(1+[.02,-.04,.03,-.02,.05,-.03,.01][i]),(width/2-pad-label.width/2)/Math.max(.1,Math.abs(Math.cos(angle))));
    return {x:center.x+Math.cos(angle)*rx+Math.sin(elapsed*.75+i*1.9)*2,
      y:center.y+Math.sin(angle)*radiusY+Math.sin(elapsed*.9+i*1.7)*3+[0,-8,8,3,-6,5,-4][i]};
  });
  const bound=(p:Point,i:number)=>{
    p.x=Math.max(pad+labels[i].width/2,Math.min(width-pad-labels[i].width/2,p.x));
    p.y=Math.max(short?64:80,Math.min(height-(phone?116:74),p.y));
  };
  // Resolve measured rectangles, not imaginary point particles. Small corrections
  // retain the oval while preventing labels from touching the approved identity.
  for(let pass=0;pass<8;pass++)points.forEach((p,i)=>{
    bound(p,i);
    for(const b of obstacles){
      const dx=p.x-b.x-b.width/2,dy=p.y-b.y-b.height/2;
      const ox=(b.width+labels[i].width)/2+12-Math.abs(dx);
      const oy=(b.height+labels[i].height)/2+14-Math.abs(dy);
      if(ox>0&&oy>0){
        const canMoveX=p.x+Math.sign(dx||1)*ox>pad+labels[i].width/2&&p.x+Math.sign(dx||1)*ox<width-pad-labels[i].width/2;
        if(canMoveX&&ox<oy)p.x+=Math.sign(dx||1)*ox;
        else p.y+=Math.sign(dy||-1)*oy;
      }
    }
    for(let j=0;j<i;j++){
      const q=points[j],dx=p.x-q.x,dy=p.y-q.y;
      const ox=(labels[i].width+labels[j].width)/2+14-Math.abs(dx);
      const oy=(labels[i].height+labels[j].height)/2+14-Math.abs(dy);
      if(ox>0&&oy>0){p.y+=Math.sign(dy||i-j)*oy*.5;q.y-=Math.sign(dy||i-j)*oy*.5;}
    }
    bound(p,i);
  });
  return points;
}

export function cubic(a:Point,b:Point,c:Point,d:Point,t:number):Point {
  const u=1-t;
  return {x:u*u*u*a.x+3*u*u*t*b.x+3*u*t*t*c.x+t*t*t*d.x,y:u*u*u*a.y+3*u*u*t*b.y+3*u*t*t*c.y+t*t*t*d.y};
}
