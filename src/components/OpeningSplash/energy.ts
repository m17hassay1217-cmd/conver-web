import { clamp, smooth, type Scene } from './scene';
import { TIMING } from './timeline';
import type { Point } from './geometry';
const TAU=Math.PI*2;
const PALETTE=['#668cdd','#668cdd','#72cde5','#7d6ac2','#587aba','#a467b0'];

/** Procedural 2D VFX. No timers, random state, assets or independent clock. */
export function createEnergy(canvas: HTMLCanvasElement, scene: Scene) {
  const ctx=canvas.getContext('2d')!;
  const dpr=Math.min(devicePixelRatio||1,1.5);
  canvas.width=Math.round(scene.width*dpr); canvas.height=Math.round(scene.height*dpr);
  ctx.scale(dpr,dpr);
  const {source,beamFrom,impact}=scene;
  const stroke=(points:Point[],color:string,width:number,alpha:number)=>{
    if(alpha<=.001||!points.length)return;
    ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);
    for(let i=1;i<points.length;i++)ctx.lineTo(points[i].x,points[i].y);
    ctx.lineWidth=width;ctx.strokeStyle=color;ctx.globalAlpha=alpha;ctx.stroke();
  };
  const glow=(point:Point,radius:number,alpha:number,color='100,155,245',stretch=1)=>{
    if(alpha<=.001)return;
    ctx.save();ctx.translate(point.x,point.y);ctx.scale(stretch,1);
    const light=ctx.createRadialGradient(0,0,0,0,0,radius);
    light.addColorStop(0,`rgba(${color},${alpha})`);light.addColorStop(.3,`rgba(${color},${alpha*.35})`);light.addColorStop(1,`rgba(${color},0)`);
    ctx.globalAlpha=1;ctx.fillStyle=light;ctx.fillRect(-radius,-radius,radius*2,radius*2);ctx.restore();
  };
  function render(time:number){
    ctx.clearRect(0,0,scene.width,scene.height);
    ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.lineJoin='round';
    const seconds=time/1000;
    const flightSamples=scene.flights.map(f=>({p:f.position(time), influence:smooth((time-f.start)/350)*(1-smooth((time-f.end)/160))}));
    const activation=smooth((time-TIMING.prepare)/1100);
    const attraction=smooth((time-TIMING.attract)/(TIMING.converted-TIMING.attract));
    const concentration=smooth((time-TIMING.converted)/460);
    const dissipate=1-smooth((time-TIMING.beam)/1050);
    const strength=activation*(.42+attraction*.38)*dissipate;
    const radius=scene.logoSize*(1.28+.035*Math.sin(seconds*2))*(1-concentration*.32);
    const count=scene.width<700?4:6;
    let responses=0;
    scene.flights.forEach(f=>{responses+=Math.exp(-Math.pow((time-(f.end-45))/100,2));});
    glow(source,scene.logoSize*.67,(.10+concentration*.24+responses*.08)*activation*dissipate);
    for(let plane=0;plane<count;plane++){
      const angle=(plane*29-72)*Math.PI/180+Math.sin(seconds*.38+plane)*.045;
      const reaction=scene.flights.reduce((sum,f)=>sum+Math.exp(-Math.pow((time-f.end+80)/160,2))*(f.rank%count===plane?1:.1),0);
      const ellipse=(theta:number):Point=>{
        const a=radius*(1+(plane%2)*.07),b=radius*(.23+plane*.014);
        const pull=flightSamples.reduce((v,{p,influence})=>{const direction=Math.atan2(p.y-source.y,p.x-source.x)-angle; return v+Math.exp(-Math.pow(Math.sin((theta-direction)/2)*4,2))*influence*3;},0);
        const ripple=Math.sin(theta*3-seconds*1.7+plane)*(.65+reaction*1.4)+pull;
        const x=Math.cos(theta)*a, y=Math.sin(theta)*b+ripple;
        const verticalExtent=Math.hypot(a*Math.sin(angle),b*Math.cos(angle));
        const fit=Math.min(1,(scene.wordmark.y-source.y-24)/verticalExtent);
        return {x:source.x+x*Math.cos(angle)-y*Math.sin(angle),y:source.y+(x*Math.sin(angle)+y*Math.cos(angle))*fit};
      };
      const points=Array.from({length:97},(_,i)=>ellipse(i/96*TAU));
      stroke(points,PALETTE[plane],3.5,strength*.035);
      stroke(points,PALETTE[plane],.8,strength*(.65+reaction*.4));
      // A short, dim illuminated arc travels on each plane; no rainbow strokes.
      const lead=seconds*(.55+plane*.06)+plane*1.5;
      const moving=Array.from({length:24},(_,i)=>ellipse(lead+i/23*.58));
      stroke(moving,plane%3===0?'#9ad4ea':PALETTE[plane],1,strength*.76);
    }
    scene.flights.forEach((f,i)=>{
      if(time<f.start || time>f.end+270)return;
      const tail=Array.from({length:16},(_,j)=>f.position(Math.max(f.start,time-90+j*6)));
      const envelope=smooth((time-f.start)/450)*(1-smooth((time-f.end)/140));
      stroke(tail,PALETTE[i%PALETTE.length],.8,envelope*.25);
      const pulse=clamp((time-(f.end-75))/330);
      if(pulse>0&&pulse<1){
        const r=scene.gate*(.5+pulse*.55);
        const points=Array.from({length:49},(_,j)=>({x:source.x+Math.cos(j/48*TAU)*r,y:source.y+Math.sin(j/48*TAU)*r*.63}));
        stroke(points,'#9bd5ed',.8,Math.sin(pulse*Math.PI)*.40);
      }
    });
    const beamTime=time-TIMING.beam;
    if(beamTime>=0&&beamTime<TIMING.beamDuration+330){
      const head=smooth(beamTime/TIMING.beamTravel);
      const power=smooth(beamTime/75)*(1-smooth((beamTime-500)/430));
      const length=Math.hypot(impact.x-beamFrom.x,impact.y-beamFrom.y);
      const direction={x:(impact.x-beamFrom.x)/length,y:(impact.y-beamFrom.y)/length};
      const normal={x:-direction.y,y:direction.x};
      const beamPoint=(s:number,offset=0):Point=>({x:beamFrom.x+direction.x*length*s+normal.x*offset,y:beamFrom.y+direction.y*length*s+normal.y*offset});
      const core=Array.from({length:65},(_,i)=>{
        const s=i/64*head;
        const noise=(Math.sin(s*33-seconds*29)*.6+Math.sin(s*71+seconds*43)*.25)*Math.sin(Math.PI*s);
        return beamPoint(s,noise);
      });
      stroke(core,'#647ddb',15,power*.035);
      stroke(core,'#7796e9',6,power*.12);
      stroke(core,'#99ddeb',2.4,power*.64);
      stroke(core,'#f2fbff',.95,power);
      const filaments=scene.width<700?4:7;
      for(let k=0;k<filaments;k++){
        const points=Array.from({length:49},(_,i)=>{
          const s=i/48*head;
          const traveling=Math.sin(s*19-seconds*(12+k*2)+k*1.8)+.35*Math.sin(s*57+seconds*23+k)+.18*Math.sin(s*117-seconds*41+k);
          const offset=traveling*(1.3+k*.75)*Math.sin(Math.PI*s);
          return beamPoint(s,offset);
        });
        stroke(points,k===4?'#ae79c0':k%2?'#7788db':'#81cfe7',.55,power*(.35+(Math.sin(seconds*24+k)*.5+.5)*.20));
      }
      // Advected sparks are deterministic samples of the shared clock.
      for(let k=0;k<18;k++){const s=((seconds*(.7+k*.021)+k*.137)%1)*head; const spread=Math.sin(s*Math.PI)*(2+k%4); const p=beamPoint(s,Math.sin(k*3+seconds*9)*spread); stroke([p,beamPoint(Math.max(0,s-.024),Math.sin(k*3+seconds*9)*spread)],k%4===0?'#b18acb':'#b4e7f4',.65,power*.46);}
      const tip=beamPoint(head);
      glow(tip,16,power*.35,'167,213,255');
      if(time>=TIMING.beamImpact){
        const age=time-TIMING.beamImpact;
        const hit=(1-smooth(age/500));
        glow(impact,30,hit*.56,'191,218,255',1.4);
        // Energy runs beneath the original letters, which keep their own colors.
        for(const side of [-1,1]){
          const distance=smooth(age/370)*scene.wordmark.width*.47;
          const p={x:impact.x+side*distance,y:impact.y};
          glow(p,17,hit*.23,'132,164,237',1.8);
          for(let k=0;k<3;k++){
            const phase=clamp((age-k*22)/300);
            const start={x:p.x+side*k*3,y:p.y};
            const end={x:start.x+side*(6+phase*9),y:start.y+Math.sin(k*2+side)*11*phase};
            stroke([start,end],k%2?'#83c9df':'#afa3dd',.65,hit*.48);
          }
        }
      }
    }
    ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
  }
  return {render,destroy(){ctx.clearRect(0,0,scene.width,scene.height);canvas.width=0;canvas.height=0;}};
}
