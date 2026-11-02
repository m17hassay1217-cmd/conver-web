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
  firstPhrase: 700,
  phraseStagger: 200,
  phraseEnter: 280,
  allVisible: 2180,
  prepare: 2680,
  attract: 3180,
  pullStagger: 160,
  pullDuration: 460,
  energy: 4600,
  statement: 5200,
  slide: 6800,
  complete: 7900,
} as const;

export function phaseAt(time: number) {
  if (time >= TIMING.complete) return "complete";
  if (time >= TIMING.slide) return "handoff";
  if (time >= TIMING.statement) return "positioning";
  if (time >= TIMING.energy) return "energy";
  if (time >= TIMING.attract) return "attraction";
  if (time >= TIMING.prepare) return "preparing";
  if (time >= TIMING.allVisible) return "reading";
  return "arrival";
}
