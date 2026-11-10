import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };
export const MOTION = Object.freeze({ hover: .22, reveal: .5, reposition: .85, scrub: .65, enterEase: 'power2.out', moveEase: 'power2.inOut', quietEase: 'sine.inOut' });
