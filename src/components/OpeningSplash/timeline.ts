export const OUTCOMES = [
  'Less Admin', 'Less Owner Chasing', 'Pipeline Control',
  'More Sales Capacity', 'Faster Responses', 'Fewer Missed Enquiries',
  'Reliable Follow-Ups',
] as const;

/** Milliseconds. Dependencies keep impact, conversion and exit causally ordered. */
const attract = 3050;
const pullStagger = 170;
const pullDuration = 1020;
const converted = attract + 6 * pullStagger + pullDuration;
const rotate = converted + 30;
const beam = rotate + 500;
const beamTravel = 300;
const beamImpact = beam + beamTravel;
export const TIMING = {
  logo: 50, logoEnter: 480, wordmark: 230, wordmarkEnter: 520,
  firstPhrase: 420, phraseStagger: 120, phraseEnter: 280,
  allVisible: 1420, prepare: 780, attract, pullStagger, pullDuration,
  converted, intensify: converted, rotate, rotationDuration: 460,
  beam, beamTravel, beamImpact, beamDuration: 780,
  wordmarkExit: beamImpact + 130, wordmarkExitDuration: 260,
  statement: beamImpact + 400, lineStagger: 120, lineEnter: 450,
  resolved: 7300, slide: 7650, complete: 8200,
} as const;
export const REVIEW_STAGES = [
  ['Logo', 200], ['Outcomes', 1500], ['Orbit', 2500], ['Magnet', 3500],
  ['Absorption', 4500], ['Rotation', 5400], ['Beam', 6000],
  ['Transform', 6800], ['Final', 7600], ['Handoff', 7950],
] as const;
export function phaseAt(time: number) {
  if (time >= TIMING.complete) return 'complete';
  if (time >= TIMING.slide) return 'handoff';
  if (time >= TIMING.resolved) return 'resolved';
  if (time >= TIMING.statement) return 'positioning';
  if (time >= TIMING.beam) return 'beam';
  if (time >= TIMING.converted) return 'concentration';
  if (time >= TIMING.attract) return 'attraction';
  if (time >= TIMING.allVisible) return 'orbit';
  return 'arrival';
}
