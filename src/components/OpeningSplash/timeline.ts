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
  prepare: 3120,
  attract: 3700,
  pullStagger: 190,
  pullDuration: 540,
  converted: 5380,
  intensify: 5600,
  rotate: 5980,
  beam: 6630,
  statement: 7240,
  slide: 8700,
  complete: 9800,
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
