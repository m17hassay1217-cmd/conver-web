/** Deterministic layout sampled once per resize; playback only changes transforms. */
export type Box = { x: number; y: number; width: number; height: number };
export type Point = { x: number; y: number };
const PHASES = [-1.78, -.91, .04, .96, 1.99, 2.83, 3.70];
export function orbitalLayout(time: number, width: number, height: number, labels: Box[], obstacles: Box[]): Point[] {
  const mobile = width < 700;
  const progress = Math.max(0, time - 400) / 2600;
  const points = labels.map((_, i) => {
    const angle = PHASES[i] + progress * (.68 + i * .012);
    const expansion = 1 + Math.min(progress, 1.4) * .10;

    return { x: width / 2 + Math.cos(angle) * width * (mobile ? .34 : .33) * expansion,
      y: mobile ? ([105,148,height*.59,height*.66,height*.73,height*.80,148][i] + (Math.sin(angle)-Math.sin(PHASES[i]))*16) : height * .44 + Math.sin(angle) * height * .31 * expansion + Math.sin(time / 1300 + i * 1.7) * 5 + [0,-12,9,16,-7,8,-14][i] };
  });
  const bound = (p: Point, i: number) => {
    const pad = mobile ? 18 : 44;
    p.x = Math.max(pad + labels[i].width/2, Math.min(width - pad - labels[i].width/2, p.x));
    p.y = Math.max(100, Math.min(height - (mobile ? 140 : 100), p.y));
  };
  // Rectangular safe areas use actual label widths, not only particle centers.
  for (let pass=0; pass<10; pass++) {
    points.forEach((p,i) => {
      bound(p,i);
      for (const b of obstacles) {
        const gap = mobile ? 22 : 38;
        const dx = p.x - b.x - b.width/2, dy = p.y - b.y - b.height/2;
        const ox = (b.width + labels[i].width)/2 + gap - Math.abs(dx);
        const oy = (b.height + labels[i].height)/2 + gap - Math.abs(dy);
        if (ox > 0 && oy > 0) {
          // On narrow screens route around the top/bottom of the identity.
          if (mobile || oy < ox) p.y += Math.sign(dy || 1) * oy;
          else p.x += Math.sign(dx || 1) * ox;
        }
      }
      for (let j=0;j<i;j++) {
        const q=points[j], dx=p.x-q.x, dy=p.y-q.y;
        const ox=(labels[i].width+labels[j].width)/2 + 24 - Math.abs(dx);
        const oy=(labels[i].height+labels[j].height)/2 + 25 - Math.abs(dy);
        if (!mobile && ox>0 && oy>0) {
          const shift=oy/2;
          p.y += Math.sign(dy || i-j)*shift; q.y -= Math.sign(dy || i-j)*shift;
        }
      }
      bound(p,i);
    });
  }
  return points;
}
export function cubic(a:Point,b:Point,c:Point,d:Point,t:number):Point {
  const u=1-t;
  return {x:u*u*u*a.x+3*u*u*t*b.x+3*u*t*t*c.x+t*t*t*d.x,y:u*u*u*a.y+3*u*u*t*b.y+3*u*t*t*c.y+t*t*t*d.y};
}
