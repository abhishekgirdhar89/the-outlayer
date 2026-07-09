"use client";

import { useEffect } from "react";

/**
 * Drives all motion on a service page with plain CSS + IntersectionObserver
 * (no animation library), faithfully ported from the design prototype:
 *  - nav solidifies once scrolled off the first screen
 *  - the fixed LayerStage morphs to whichever story panel fills the viewport
 *  - scroll-snap holds across the 5 story panels + the form, then releases
 *  - the scroll cue appears during the story and flips to its "final" state
 *  - reveal-on-scroll (.reveal → .on) for story (re-triggers) and .r2 (once)
 * Everything is disabled / shown-final under prefers-reduced-motion.
 * Renders nothing; operates on the DOM the server already rendered.
 */
export function ServicePageMotion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const html = document.documentElement;

    // Hero scroll cue: fades the moment the reader starts scrolling.
    const heroCue = document.getElementById("heroCue");
    const onHeroScroll = () => heroCue?.classList.toggle("hide", window.scrollY > 4);
    if (heroCue) {
      window.addEventListener("scroll", onHeroScroll, { passive: true });
      onHeroScroll();
    }

    const screens = Array.from(document.querySelectorAll<HTMLElement>("[data-story]"));
    const stage = document.getElementById("layerStage");
    const cap = document.getElementById("lsCap");
    const formSec = document.getElementById("start");
    const scrollCue = document.getElementById("scrollCue");
    const cueLbl = scrollCue?.querySelector<HTMLElement>(".lbl") ?? null;
    const snapEls = formSec ? [...screens, formSec] : screens;
    const canSnap = !reduce;

    const setSnap = (on: boolean) => {
      if (!canSnap) return;
      const v = on ? "y mandatory" : "none";
      if (html.style.scrollSnapType !== v) html.style.scrollSnapType = v;
    };
    const applyScreen = (el: HTMLElement) => {
      if (!stage) return;
      const pose = el.getAttribute("data-pose") || "3";
      stage.className = "layer-stage show pose-" + pose;
      if (cap) cap.textContent = el.getAttribute("data-cap") || "";
    };
    const hideStage = () => stage?.classList.remove("show");
    const updateCue = (el: HTMLElement | null) => {
      if (!scrollCue || !cueLbl) return;
      // The hero-cue owns the first screen; this story cue starts from screen 2.
      if (!el || screens.indexOf(el) === 0) { scrollCue.classList.remove("on"); return; }
      scrollCue.classList.add("on");
      if (screens.indexOf(el) < screens.length - 1) { scrollCue.classList.remove("final"); cueLbl.textContent = "scroll"; }
      else { scrollCue.classList.add("final"); cueLbl.textContent = "keep scrolling"; }
    };

    // ---- reduced motion: show everything in final state ----
    if (reduce || !("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal, .r2").forEach((r) => r.classList.add("on"));
      if (screens[0]) applyScreen(screens[0]);
      return () => window.removeEventListener("scroll", onHeroScroll);
    }

    // ---- story reveals: re-trigger on re-entry ----
    const rio = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          en.target.querySelectorAll(".reveal").forEach((r) => r.classList.toggle("on", en.isIntersecting));
        });
      },
      { threshold: 0.55 }
    );
    screens.forEach((s) => rio.observe(s));

    // ---- movement-two reveals: once ----
    const r2io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add("on"); r2io.unobserve(en.target); }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -7% 0px" }
    );
    document.querySelectorAll(".r2").forEach((e) => r2io.observe(e));

    // ---- scroll-driven controller: which snap target owns the viewport ----
    let curActive: HTMLElement | null = null;
    let ticking = false;
    const controlNow = () => {
      ticking = false;
      const H = window.innerHeight;
      let best: HTMLElement | null = null;
      let bestV = 0;
      for (const el of snapEls) {
        const r = el.getBoundingClientRect();
        const v = Math.min(r.bottom, H) - Math.max(r.top, 0);
        if (v > bestV) { bestV = v; best = el; }
      }
      const isStory = !!(best && best.hasAttribute("data-story"));
      if (best !== curActive) {
        curActive = best;
        if (isStory && best) applyScreen(best);
        else hideStage();
        updateCue(isStory ? best : null);
      }
      setSnap(isStory);
    };
    const control = () => { if (!ticking) { ticking = true; requestAnimationFrame(controlNow); } };
    window.addEventListener("scroll", control, { passive: true });
    window.addEventListener("resize", control);
    controlNow();

    const onCue = () => {
      const i = curActive ? screens.indexOf(curActive) : -1;
      const target = i >= 0 && i < screens.length - 1 ? screens[i + 1] : formSec;
      if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY, behavior: "smooth" });
    };
    scrollCue?.addEventListener("click", onCue);

    return () => {
      window.removeEventListener("scroll", onHeroScroll);
      window.removeEventListener("scroll", control);
      window.removeEventListener("resize", control);
      scrollCue?.removeEventListener("click", onCue);
      rio.disconnect();
      r2io.disconnect();
      html.style.scrollSnapType = "";
    };
  }, []);

  return null;
}
