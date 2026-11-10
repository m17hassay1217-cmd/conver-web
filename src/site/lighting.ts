import { CompressedCubeTexture, CompressedTexture, HalfFloatType, LinearFilter, LinearMipmapLinearFilter, LinearSRGBColorSpace } from 'three';
import lightingUrl from '../assets/industrial-room-pmrem.bin.gz?url';
import metadata from '../assets/industrial-room-pmrem.json';

let decoded: Promise<ArrayBuffer> | undefined;
function lightingBytes() {
  return decoded ??= fetch(lightingUrl).then(async response => {
    if (!response.ok || !response.body) throw new Error('Lighting asset unavailable');
    // Native streaming decompression keeps a worker/WASM dependency out of the app.
    return new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
  }).catch(error => { decoded = undefined; throw error; });
}

/** Precomputed Three RoomEnvironment: all six faces and roughness levels preserved. */
export async function createIndustrialLighting() {
  const bytes = await lightingBytes();
  const faces = Array.from({length:6}, (_,face) => {
    const mipmaps = metadata.levels.map(level => {
      const {offset,length} = level.faces[face];
      return {data:new Uint16Array(bytes,offset*2,length),width:level.size,height:level.size};
    });
    return new CompressedTexture(mipmaps,metadata.levels[0].size,metadata.levels[0].size,undefined,HalfFloatType);
  });
  // Three's compressed-container path explicitly supports RGBA half-float data;
  // it uploads the supplied mip levels without regenerating the environment.
  const texture = new CompressedCubeTexture(faces,undefined,HalfFloatType);
  texture.isPMREMTexture = true;
  texture.colorSpace = LinearSRGBColorSpace;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}
