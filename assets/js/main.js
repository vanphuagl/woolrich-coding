"use strict";

// ===== globals =====
const isMobile = window.matchMedia("(max-width: 1024px)");
const eventsTrigger = ["pageshow", "scroll"];

// ===== init =====
const init = () => {
  // # gsap
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.clearScrollMemory("manual");
  ScrollTrigger.refresh();
  // # app height
  appHeight();
  // # lazy load
  const ll = new LazyLoad({
    threshold: 100,
    elements_selector: ".lazy",
  });
};

// ===== lenis =====
const lenis = new Lenis({
  duration: 1.0,
  easing: (t) => Math.min(1, 1.001 - Math.pow(1 - t, 2.5)),
  // easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  mouseMultiplier: 1.0,
  smoothTouch: true,
  touchMultiplier: 1.5,
  infinite: false,
  direction: "vertical",
  gestureDirection: "vertical",
});
const raf = (t) => {
  lenis.raf(t);
  requestAnimationFrame(raf);
};
requestAnimationFrame(raf);
lenis.on("scroll", () => {
  ScrollTrigger.update();
});

// ===== app height =====
const appHeight = () => {
  const doc = document.documentElement;
  const menuH = Math.max(doc.clientHeight, window.innerHeight || 0);

  if (isMobile.matches) {
    doc.style.setProperty("--app-height", `${doc.clientHeight}px`);
    doc.style.setProperty("--menu-height", `${menuH}px`);
  } else {
    doc.style.removeProperty("--app-height");
    doc.style.removeProperty("--menu-height");
  }
};
window.addEventListener("resize", appHeight);

// ===== scroll trigger =====
gsap.registerPlugin(ScrollTrigger);

// # change bg
const defaultColor = getComputedStyle(document.body).backgroundColor;
document.querySelectorAll("[data-bg]").forEach((panel) => {
  let color = panel.dataset.bg;
  ScrollTrigger.create({
    trigger: panel,
    start: "top top",
    markers: false,
    onEnter: () =>
      gsap.to("body", {
        duration: 0.3,
        ease: "power1.inOut",
        backgroundColor: color,
      }),
    onLeaveBack: () =>
      gsap.to("body", {
        duration: 0.3,
        ease: "power1.inOut",
        backgroundColor: defaultColor,
      }),
  });
});

// # hide tree
gsap.to("[data-fv-tree]", {
  autoAlpha: 0,
  duration: 0.3,
  ease: "sine.inOut",
  scrollTrigger: {
    trigger: "[data-diary]",
    start: "top bottom",
    markers: false,
    toggleActions: "play reverse play reverse",
  },
});

// ### ===== DOMCONTENTLOADED ===== ###
window.addEventListener("DOMContentLoaded", init);
window.addEventListener("pageshow", () => {
  document.body.classList.remove("fadeout");
});
