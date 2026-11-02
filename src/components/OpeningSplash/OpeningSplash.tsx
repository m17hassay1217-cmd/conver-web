import { useCallback, useEffect, useRef, useState } from "react";
import { BrandIdentity } from "../BrandIdentity";
import { Arrow } from "../Arrow";
import { OUTCOMES, phaseAt, TIMING } from "./timeline";
import "./opening-splash.css";

export type IntroCompletion = "played" | "skipped";
export type OpeningSplashProps = {
  logoSrc?: string;
  onComplete: (reason: IntroCompletion) => void;
  review?: boolean;
};

const ENTER = "cubic-bezier(.16,1,.3,1)";
const SMOOTH = "cubic-bezier(.4,0,.2,1)";

export function OpeningSplash({
  logoSrc,
  onComplete,
  review = false,
}: OpeningSplashProps) {
  const root = useRef<HTMLElement>(null);
  const animations = useRef<Animation[]>([]);
  const clock = useRef(0);
  const playing = useRef(true);
  const done = useRef(false);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [geometry, setGeometry] = useState(0);
  const range = useRef<HTMLInputElement>(null);

  const finish = useCallback(
    (reason: IntroCompletion) => {
      if (done.current) return;
      done.current = true;
      onComplete(reason);
    },
    [onComplete],
  );

  // One clock controls every animation. Pausing, seeking and background tabs
  // cannot let the text, energy and page exit drift apart.
  const renderTime = useCallback((time: number) => {
    clock.current = Math.max(0, Math.min(time, TIMING.complete));
    for (const animation of animations.current)
      animation.currentTime = clock.current;
    if (root.current) {
      root.current.dataset.phase = phaseAt(clock.current);
      root.current.style.setProperty(
        "--progress",
        String(clock.current / TIMING.complete),
      );
    }
    if (range.current) range.current.value = String(clock.current);
  }, []);

  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => {
      if (preference.matches) finish("skipped");
    };
    change();
    preference.addEventListener("change", change);
    return () => preference.removeEventListener("change", change);
  }, [finish]);

  useEffect(() => {
    if (!ready || !root.current) return;
    const scene = root.current;
    let frame = 0;
    let previous = performance.now();
    const list: Animation[] = [];
    const animate = (
      element: Element | null,
      keyframes: Keyframe[],
      delay: number,
      duration: number,
      easing = SMOOTH,
    ) => {
      if (!element) return;
      const animation = element.animate(keyframes, {
        delay,
        duration,
        easing,
        fill: "both",
      });
      animation.pause();
      list.push(animation);
    };
    const identity = scene.querySelector(".central-identity")!;
    const box = identity.getBoundingClientRect();
    scene.style.setProperty("--identity-half-height", `${box.height / 2}px`);
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    const phrases = [...scene.querySelectorAll<HTMLElement>(".outcome")];
    const measurements = phrases.map((element, index) => {
      const rect = element.getBoundingClientRect();
      const dx = cx - (rect.x + rect.width / 2);
      const dy = cy - (rect.y + rect.height / 2);
      return { element, index, dx, dy, distance: Math.hypot(dx, dy) };
    });
    const nearest = [...measurements].sort((a, b) => a.distance - b.distance);
    const transfer = scene.querySelector(".transfer-paths")!;
    const paths: SVGPathElement[] = [];
    const colors = ["#68dfeb", "#a48bea", "#d889d3"];
    for (const { element, index, dx, dy } of measurements) {
      animate(
        element.querySelector(".outcome-label"),
        [
          { opacity: 0, transform: "translateY(12px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        TIMING.firstPhrase + index * TIMING.phraseStagger,
        TIMING.phraseEnter,
        ENTER,
      );
      const rank = nearest.findIndex((item) => item.element === element);
      element.dataset.pullRank = String(rank);
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      path.setAttribute(
        "d",
        `M ${cx - dx} ${cy - dy} Q ${cx - dx * 0.46} ${cy - dy * 0.6} ${cx} ${cy}`,
      );
      path.setAttribute("stroke", colors[rank % colors.length]);
      transfer.appendChild(path);
      paths.push(path);
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length} ${length}`;
      animate(
        path,
        [
          { strokeDashoffset: length, opacity: 0, offset: 0 },
          { strokeDashoffset: length * 0.8, opacity: 0.16, offset: 0.3 },
          { strokeDashoffset: 0, opacity: 0.42, offset: 0.8 },
          { strokeDashoffset: -length * 0.15, opacity: 0, offset: 1 },
        ],
        TIMING.attract + rank * TIMING.pullStagger,
        TIMING.pullDuration,
      );
      // Small outward anticipation, then an accelerating, gently curved pull.
      animate(
        element,
        [
          {
            transform: "translate(-50%, -50%) scale(1)",
            opacity: 1,
            offset: 0,
          },
          {
            transform: `translate(calc(-50% - ${dx * 0.018}px), calc(-50% - ${dy * 0.018}px)) scale(1)`,
            opacity: 1,
            offset: 0.18,
          },
          {
            transform: `translate(calc(-50% + ${dx * 0.46}px), calc(-50% + ${dy * 0.39}px)) scale(.82)`,
            opacity: 0.95,
            offset: 0.63,
          },
          {
            transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(.08)`,
            opacity: 0,
            offset: 1,
          },
        ],
        TIMING.attract + rank * TIMING.pullStagger,
        TIMING.pullDuration,
        "cubic-bezier(.55,0,.9,.5)",
      );
    }
    animate(
      identity,
      [
        { opacity: 0, transform: "translate(-50%,-50%) scale(.97)" },
        { opacity: 1, transform: "translate(-50%,-50%) scale(1)" },
      ],
      100,
      600,
      ENTER,
    );
    animate(
      scene.querySelector(".magnetic-field"),
      [
        { opacity: 0, transform: "translate(-50%,-50%) scale(.68)", offset: 0 },
        {
          opacity: 0.55,
          transform: "translate(-50%,-50%) scale(1)",
          offset: 0.26,
        },
        {
          opacity: 0.85,
          transform: "translate(-50%,-50%) scale(.9)",
          offset: 0.62,
        },
        { opacity: 0, transform: "translate(-50%,-50%) scale(.42)", offset: 1 },
      ],
      TIMING.prepare,
      2550,
    );
    animate(
      scene.querySelector(".identity-energy"),
      [
        { opacity: 0, transform: "scale(.95)", offset: 0 },
        { opacity: 0.45, transform: "scale(1)", offset: 0.3 },
        { opacity: 0.85, transform: "scale(1.02)", offset: 0.6 },
        { opacity: 0.12, transform: "scale(1)", offset: 1 },
      ],
      TIMING.attract,
      2300,
    );
    animate(
      scene.querySelector(".energy-thread"),
      [
        { opacity: 0, transform: "scaleX(.04)", offset: 0 },
        { opacity: 0.85, transform: "scaleX(.7)", offset: 0.45 },
        { opacity: 0.25, transform: "scaleX(1)", offset: 1 },
      ],
      TIMING.energy,
      900,
    );
    animate(
      scene.querySelector(".positioning"),
      [
        { opacity: 0, transform: "translate(-50%, 18px)" },
        { opacity: 1, transform: "translate(-50%, 0)" },
      ],
      TIMING.statement,
      650,
      ENTER,
    );
    animate(
      scene.querySelector(".intro-scene"),
      [
        { transform: "translateY(0)", offset: 0 },
        { transform: "translateY(-29%)", offset: 0.42 },
        { transform: "translateY(-100%)", offset: 1 },
      ],
      TIMING.slide,
      TIMING.complete - TIMING.slide,
    );
    animate(
      scene.querySelector(".intro-chrome"),
      [{ opacity: 1 }, { opacity: 0 }],
      TIMING.slide,
      250,
    );
    animations.current = list;
    renderTime(clock.current);
    const tick = (now: number) => {
      // Hidden tabs preserve reading time rather than jumping to the end.
      const delta = document.hidden ? 0 : Math.min(now - previous, 80);
      previous = now;
      if (playing.current) renderTime(clock.current + delta);
      if (clock.current >= TIMING.complete && !review) finish("played");
      if (!done.current) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    // Re-measure responsive distances while preserving the current clock.
    const resize = new ResizeObserver(() => {
      // A viewport change is handled by rebuilding the measured choreography.
      if (
        scene.clientWidth !== measuredWidth ||
        scene.clientHeight !== measuredHeight
      )
        setGeometry((value) => value + 1);
    });
    const measuredWidth = scene.clientWidth;
    const measuredHeight = scene.clientHeight;
    resize.observe(scene);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      list.forEach((animation) => animation.cancel());
      paths.forEach((path) => path.remove());
      animations.current = [];
    };
  }, [ready, geometry, finish, renderTime, review]);

  function togglePause() {
    playing.current = !playing.current;
    setPaused(!playing.current);
  }

  return (
    <section
      ref={root}
      className="opening-splash"
      aria-label="Converdive introduction"
      data-testid="opening-splash"
      data-phase="arrival"
    >
      <div className="intro-scene">
        <div className="asphalt" aria-hidden="true" />
        <svg
          className="racing-lines"
          width="100%"
          height="100%"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="track"
              width="100%"
              height="100%"
              patternUnits="userSpaceOnUse"
            >
              <path d="M-140 345 Q65 350 158 155 T400 -90 M-130 378 Q88 380 190 170 T432 -80 M-130 411 Q110 410 222 185 T464 -70" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#track)" />
          <g
            transform="translate(0,0) rotate(180)"
            style={{ transformOrigin: "center" }}
          >
            <rect width="100%" height="100%" fill="url(#track)" />
          </g>
        </svg>
        <div className="magnetic-field" aria-hidden="true" />
        <svg className="transfer-paths" aria-hidden="true" />
        <div className="central-identity">
          <div className="identity-energy" aria-hidden="true" />
          <BrandIdentity logoSrc={logoSrc} />
          <span className="energy-thread" aria-hidden="true" />
        </div>
        <div className="outcomes" aria-hidden="true">
          {OUTCOMES.map((outcome, index) => (
            <div
              className={`outcome outcome-${index}`}
              key={outcome}
              data-outcome={index}
            >
              <span className="outcome-label">
                <span className="outcome-dot" />
                {outcome}
              </span>
            </div>
          ))}
        </div>
        <p className="positioning">
          For UK Commercial
          <br className="mobile-break" /> Cleaning Companies
        </p>
      </div>
      <div className="intro-chrome">
        <div className="intro-top">
          <span />
          <button className="skip-intro" onClick={() => finish("skipped")}>
            Skip Intro <Arrow />
          </button>
        </div>
        <div className="intro-bottom">
          <span />
          <button
            className="pause-intro"
            aria-label={paused ? "Play introduction" : "Pause introduction"}
            onClick={togglePause}
          >
            {paused ? "Play" : "Pause"}{" "}
            <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
          </button>
        </div>
        <div className="intro-progress" aria-hidden="true" />
      </div>
      <p className="sr-only">
        Converdive. {OUTCOMES.join(". ")}. For UK Commercial Cleaning Companies.
      </p>
      {review && (
        <div className="review-controls" aria-label="Animation review controls">
          <span>Intro review</span>
          <button onClick={togglePause}>{paused ? "Play" : "Pause"}</button>
          <input
            ref={range}
            type="range"
            min="0"
            max={TIMING.complete}
            defaultValue="0"
            step="10"
            aria-label="Animation time in milliseconds"
            onChange={(event) => {
              playing.current = false;
              setPaused(true);
              renderTime(Number(event.target.value));
            }}
          />
          {[
            ["Outcomes", 2450],
            ["Magnet", 3850],
            ["Positioning", 6100],
            ["Handoff", 7300],
          ].map(([label, time]) => (
            <button
              key={label}
              onClick={() => {
                playing.current = false;
                setPaused(true);
                renderTime(Number(time));
              }}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => {
              renderTime(0);
              playing.current = true;
              setPaused(false);
            }}
          >
            Replay
          </button>
        </div>
      )}
    </section>
  );
}
