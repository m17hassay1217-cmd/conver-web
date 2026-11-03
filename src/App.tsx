import { useCallback, useEffect, useRef, useState } from "react";
import { BrandIdentity } from "./components/BrandIdentity";
import { Arrow } from "./components/Arrow";
import { OpeningSplash } from "./components/OpeningSplash/OpeningSplash";
import approvedLogo from "./assets/converdive-logo.svg";

const VISIT_KEY = "converdive:intro-seen:v1";
const mode = new URLSearchParams(window.location.search).get("intro");
const review = mode === "review";
const forceIntro = mode === "1" || review;

function hasSeenIntro() {
  try {
    return localStorage.getItem(VISIT_KEY) === "true";
  } catch {
    return false;
  }
}
function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function App() {
  const [intro, setIntro] = useState(
    () => !reducedMotion() && (forceIntro || !hasSeenIntro()),
  );
  const main = useRef<HTMLElement>(null);
  const complete = useCallback(() => {
    if (!review) {
      try {
        localStorage.setItem(VISIT_KEY, "true");
      } catch {
        /* Private mode remains usable. */
      }
    }
    setIntro(false);
    requestAnimationFrame(() => main.current?.focus({ preventScroll: true }));
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    if (intro) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [intro]);

  return (
    <>
      <div
        className="site-shell"
        inert={intro}
        aria-hidden={intro || undefined}
      >
        <header className="site-header">
          <a href="./" aria-label="Converdive home">
            <BrandIdentity />
          </a>
          <span className="header-positioning">
            For UK Commercial Cleaning Companies
          </span>
        </header>
        <main
          ref={main}
          tabIndex={-1}
          id="main-content"
          className="homepage-handoff"
        >
          <span className="handoff-eyebrow">Converdive</span>
          <h1>
            For UK Commercial
            <br />
            Cleaning Companies
          </h1>
          <p>The next chapter starts here.</p>
          <a className="replay-link" href="?intro=1">
            Replay introduction <Arrow />
          </a>
          <small>Homepage handoff preview</small>
        </main>
      </div>
      {intro && (
        <OpeningSplash
          onComplete={complete}
          logoSrc={approvedLogo}
          review={review}
        />
      )}
    </>
  );
}
