export const OUTCOMES = [
  "Less Admin",
  "Less Owner Chasing",
  "Pipeline Control",
  "More Sales Capacity",
  "Faster Responses",
  "Fewer Missed Enquiries",
  "Reliable Follow-Ups",
] as const;

export const TIMING = {
  logo: 120,
  wordmark: 650,
  firstPhrase: 1100,
  phraseStagger: 200,
  phraseEnter: 320,
  allVisible: 2620,
  prepare: 5400,
  attract: 6600,
  pullStagger: 220,
  pullDuration: 920,
  converted: 8840,
  intensify: 8950,
  rotate: 9400,
  beam: 10100,
  statement: 10800,
  lineStagger: 210,
  lineEnter: 620,
  beamDuration: 1100,
  beamImpact: 10480,
  slide: 13200,
  complete: 14400,
} as const;

export function phaseAt(time: number) {
  if (time >= TIMING.complete) return "complete";
  if (time >= TIMING.slide) return "handoff";
  if (time >= TIMING.statement) return "positioning";
  if (time >= TIMING.beam) return "beam";
  if (time >= TIMING.rotate) return "rotation";
  if (time >= TIMING.converted) return "conversion";
  if (time >= TIMING.attract) return "attraction";
  if (time >= TIMING.prepare) return "preparing";
  if (time >= TIMING.allVisible) return "reading";
  return "arrival";
}
