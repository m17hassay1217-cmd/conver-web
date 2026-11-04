async page => {
  const checks=[],errors=[];
  const check=(value,name)=>{if(!value)throw new Error(name);checks.push(name);};
  page.on('pageerror',error=>errors.push(error.message));
  const base='http://127.0.0.1:4173/';
  const seek=async t=>{await page.getByRole('slider').fill(String(t));await page.waitForTimeout(25);};
  const capture=async t=>page.screenshot({path:`work/reconstruction/1440-${t}.jpg`,type:'jpeg',quality:90,style:'.review-controls{visibility:hidden}'});
  await page.setViewportSize({width:1440,height:900});await page.goto(base+'?intro=review');
  await page.getByRole('button',{name:'Outcomes',exact:true}).click();
  check(await page.locator('.outcome-label').evaluateAll(els=>els.every(el=>+getComputedStyle(el).opacity>.99)),'all seven phrases readable at 1.5 seconds');
  await capture(1500);
  const before=await page.locator('.outcome').first().evaluate(el=>getComputedStyle(el).transform);
  await page.getByRole('button',{name:'Play',exact:true}).last().click();await page.waitForTimeout(250);
  check(before!==await page.locator('.outcome').first().evaluate(el=>getComputedStyle(el).transform),'orbital directional travel during playback');
  await seek(4500);
  const count=Number(await page.locator('.opening-splash').getAttribute('data-absorbed'));
  check(count>0&&count<7,'staggered absorption underway at 4.5 seconds');
  check((await page.locator('.outcomes').evaluate(el=>getComputedStyle(el).maskImage)).includes('radial-gradient'),'shared spatial absorption mask');
  await capture(4500);await seek(5400);
  check(Number(await page.locator('.opening-splash').getAttribute('data-absorbed'))===7,'all seven absorbed before discharge');await capture(5400);
  await seek(5600);
  check(await page.locator('.logo-turn').evaluate(el=>Math.abs(new DOMMatrix(getComputedStyle(el).transform).b-1)<.001),'90 degree clockwise logo rotation');
  await seek(5750);const head1=Number(await page.locator('.opening-splash').getAttribute('data-beam-progress'));
  await seek(5850);const head2=Number(await page.locator('.opening-splash').getAttribute('data-beam-progress'));
  check(head1>0&&head1<head2&&head2<1,'beam propagates from origin rather than appearing full length');
  const geometry=await page.evaluate(()=>{
    const root=document.querySelector('.opening-splash'),name=document.querySelector('.intro-wordmark').getBoundingClientRect(),logo=document.querySelector('.logo-core').getBoundingClientRect();
    return {from:root.dataset.beamOrigin.split(',').map(Number),to:root.dataset.beamImpact.split(',').map(Number),cx:name.x+name.width/2,y:name.y+name.height*.38,tip:logo.y+logo.height*.93};
  });
  check(Math.abs(geometry.to[0]-geometry.cx)<1&&Math.abs(geometry.to[1]-geometry.y)<1&&Math.abs(geometry.from[1]-geometry.tip)<1,'beam endpoints follow measured logo and wordmark geometry');
  await seek(6000);await capture(6000);
  const canvas=await page.locator('canvas').evaluate(el=>el.toDataURL());
  await seek(6100);check(canvas!==await page.locator('canvas').evaluate(el=>el.toDataURL()),'procedural filaments change over time');
  await seek(6000);check(canvas===await page.locator('canvas').evaluate(el=>el.toDataURL()),'deterministic VFX when scrubbing backwards');
  await seek(6800);await capture(6800);
  check(await page.locator('.intro-wordmark').evaluate(el=>+getComputedStyle(el).opacity)<.01,'wordmark clears before the secondary text');
  await seek(7600);await capture(7600);
  const tokens=await page.locator('.intro-wordmark,.positioning span').evaluateAll(els=>els.map(el=>({color:getComputedStyle(el).color,font:getComputedStyle(el).fontFamily,filter:getComputedStyle(el).filter})));
  check(JSON.stringify(tokens.map(t=>t.color))===JSON.stringify(['rgb(241, 241, 237)','rgb(187, 206, 217)','rgb(240, 249, 255)','rgb(241, 241, 237)']),'original company and final text colors preserved exactly');
  check(tokens[0].font.includes('Bespoke Stencil')&&tokens.slice(1).every(t=>t.font.includes('Cabinet Grotesk')&&t.filter==='none'),'original typography preserved without color-changing filters');
  check(JSON.stringify(await page.locator('.positioning span').allTextContents())===JSON.stringify(['For','UK','Cleaning Companies']),'exact three-line final statement');
  check(await page.locator('canvas').evaluate(el=>!el.getContext('2d').getImageData(0,0,el.width,el.height).data.some((v,i)=>i%4===3&&v>0)),'energy fully dissipates before exit');
  const layouts=[];
  for(const [width,height]of [[1366,768],[1440,900],[1920,1080],[390,844]]){
    await page.setViewportSize({width,height});await page.goto(base+'?intro=review');await page.getByRole('button',{name:'Outcomes',exact:true}).click();
    for(let t=1500;t<5100;t+=100){await seek(t);const issues=await page.evaluate(t=>{
      const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};};
      const labels=[...document.querySelectorAll('.outcome')].filter(el=>el.dataset.absorbed!=='true').map(rect),word=rect(document.querySelector('.intro-wordmark'));
      const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
      const issues=[];labels.forEach((r,i)=>{if(r.x<0||r.x+r.w>innerWidth||r.y<0||r.y+r.h>innerHeight)issues.push('clip');if(overlap(r,word))issues.push('name');if(t<3050)labels.forEach((s,j)=>{if(j<i&&overlap(r,s))issues.push('pair');});});return issues;
    },t);if(issues.length)throw new Error(`${width}x${height} at ${t}: ${issues}`);}
    layouts.push([width,height]);check(true,`readable orbit and clear name/edges through attraction at ${width}x${height}`);
  }
  await page.getByRole('button',{name:'Skip Intro'}).click();check(await page.locator('.opening-splash').count()===0,'Skip Intro works in review mode');
  await page.goto(base+'?intro=1');await page.getByRole('button',{name:'Skip Intro'}).click();await page.goto(base);
  check(await page.locator('.opening-splash').count()===0,'returning visitor skips automatically');
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'?intro=review');
  check(await page.locator('.opening-splash').count()===0,'reduced motion bypasses even forced playback');
  await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(base+'?intro=1');
  await page.locator('.opening-splash').waitFor({state:'detached',timeout:14000});
  check(await page.locator('.homepage-handoff').isVisible(),'uninterrupted full playback reaches existing homepage handoff');
  check(errors.length===0,'no browser runtime errors');
  return {checksPassed:checks.length,checks,layouts,errors};
}
