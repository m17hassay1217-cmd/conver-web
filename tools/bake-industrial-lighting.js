import {WebGLRenderer,PMREMGenerator} from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
const renderer=new WebGLRenderer({antialias:false}),generator=new PMREMGenerator(renderer),room=new RoomEnvironment();
const target=generator.fromScene(room,.04),gl=renderer.getContext(),levels=[];let offset=0;const data=[];
for(let lod=0;lod<target.texture.mipmaps.length;lod++){
 const size=target.width>>lod,faces=[];
 for(let face=0;face<6;face++){
  renderer.setRenderTarget(target,face,lod);
  const pixels=new Uint16Array(size*size*4);gl.readPixels(0,0,size,size,gl.RGBA,gl.HALF_FLOAT,pixels);
  const error=gl.getError();if(error)throw Error('Readback error '+error);
  faces.push({offset,length:pixels.length});offset+=pixels.length;for(const value of pixels)data.push(value);
 }
 levels.push({size,faces});
}
window.__bake={levels,data,nonzero:data.some(x=>x>0)};
renderer.setRenderTarget(null);target.dispose();room.dispose();generator.dispose();renderer.dispose();
