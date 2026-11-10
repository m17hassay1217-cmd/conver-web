import { DoubleSide, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, SphereGeometry } from 'three';

/** One material kit per mounted installation; all repeated parts share it. */
export function createIndustrialKit() {
  return {
    beadGeometry: new SphereGeometry(.165, 24, 16),
    glass: new MeshPhysicalMaterial({
      color: '#b9d5df', metalness: 0, roughness: .1,
      transmission: .94, thickness: .065, ior: 1.46,
      transparent: true, opacity: .18, depthWrite: false,
      side: DoubleSide, envMapIntensity: .4,
    }),
    steel: new MeshStandardMaterial({ color: '#9bb3bf', metalness: .94, roughness: .24, envMapIntensity: 1.1 }),
    darkSteel: new MeshStandardMaterial({ color: '#365260', metalness: .86, roughness: .3, envMapIntensity: .8 }),
    base: new MeshStandardMaterial({ color: '#10232d', metalness: .25, roughness: .53, envMapIntensity: .3 }),
    housing: new MeshStandardMaterial({ color: '#162b36', metalness: .85, roughness: .28, envMapIntensity: .7 }),
    bead: new MeshPhysicalMaterial({ color: '#80aebb', metalness: .78, roughness: .22, clearcoat: .65, clearcoatRoughness: .18, envMapIntensity: 1.1 }),
    warmBead: new MeshPhysicalMaterial({ color: '#b4c9ca', metalness: .78, roughness: .22, clearcoat: .65, clearcoatRoughness: .18, envMapIntensity: 1.1 }),
    transferBead: new MeshPhysicalMaterial({ color: '#c3e1e8', metalness: .75, roughness: .2, clearcoat: .7, emissive: '#65BEDB', emissiveIntensity: .08 }),
    cyan: new MeshBasicMaterial({ color: '#65BEDB', transparent: true, opacity: .65, toneMapped: false }),
    warm: new MeshBasicMaterial({ color: '#D6A980', transparent: true, opacity: .65, toneMapped: false }),
    scale: new MeshBasicMaterial({ color: '#aac3cc', transparent: true, opacity: .55 }),
    field: new MeshBasicMaterial({ color: '#65BEDB', transparent: true, opacity: .06, depthWrite: false, side: DoubleSide }),
  };
}

export type IndustrialKit = ReturnType<typeof createIndustrialKit>;
