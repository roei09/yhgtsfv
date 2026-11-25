/* Section tracking, progress, back-to-top, the dock and all scroll-bound UI */
const prog = $(".progress"), totop = $("#totop"), foot = $("#footBig"), secs = $$("main section[id]"), navA = $$("#navLinks a");
let footNear = false, lastActive = "";
new IntersectionObserver((es) => {
  footNear = es[0].isIntersecting;
  requestAnimationFrame(onScroll);
}, { rootMargin: "200px 0px" }).observe(foot);
const inBand = /* @__PURE__ */ new Set();
const secIO = new IntersectionObserver((es) => {
  es.forEach((e) => {
    e.isIntersecting ? inBand.add(e.target) : inBand.delete(e.target);
  });
  {
    const t = bizSeen ? $("#business") : [...inBand].find((s) => ![...inBand].some((o) => o !== s && s.contains(o)));
    if (t) {
      const id = t.id;
      if (id !== lastActive) {
        lastActive = id;
        navA.forEach((a) => {
          const on = a.getAttribute("href") === "#" + id;
          a.classList.toggle("is-active", on);
          on ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current");
        });
        $$("#dock [data-sec]").forEach((a) => {
          a.dataset.sec === id ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current");
        });
      }
    }
  }
}, { rootMargin: "-40% 0px -55% 0px" });
secs.forEach((s) => secIO.observe(s));
let bizSeen = false;
{
  const bz = $("#business");
  if (bz) new IntersectionObserver((es) => {
    bizSeen = es[0].intersectionRatio >= 0.6;
    secIO.takeRecords();
    lastActive = "";
    secs.forEach((s) => {
      secIO.unobserve(s);
      secIO.observe(s);
    });
  }, { threshold: [0, 0.6, 1] }).observe(bz);
}
let maxY = 0;
const measure = () => {
  maxY = document.documentElement.scrollHeight - innerHeight;
};
measure();
addEventListener("resize", measure, { passive: true });
new ResizeObserver(measure).observe(document.body);
let st1 = null, st2 = null, st3 = null, st4 = null;
const dock = $("#dock"), dockMore = $("#dockMore"), dockPop = $("#dockPop"), scene_ = $("#top"), tour_ = $("#collabs"), foot_ = $(".foot2");
const SR = {};
function readScroll(y) {
  SR.y = y;
  SR.fr = footNear ? foot.getBoundingClientRect() : null;
  const tr = tour_ ? tour_.getBoundingClientRect() : null;
  SR.inTour = tr && !H_.classList.contains("tour-stack") && tr.top < innerHeight * 0.55 && tr.bottom > innerHeight * 0.45;
  SR.heroDone = y > (scene_ ? Math.max(1, scene_.offsetHeight - innerHeight) * 0.24 : innerHeight * 0.5);
  SR.atFoot = foot_ && foot_.getBoundingClientRect().top < innerHeight * 0.9;
}
function writeScroll() {
  const y = SR.y, fr = SR.fr;
  prog.style.transform = `scaleX(${maxY > 0 ? Math.min(1, y / maxY) : 0})`;
  {
    const keep = dock && (dock.contains(document.activeElement) || dockPop && !dockPop.hidden);
    const d = keep || SR.heroDone && !SR.inTour && !SR.atFoot;
    if (d !== st4) {
      st4 = d;
      H_.classList.toggle("dock-on", d);
    }
  }
  const a = y > 40, b = y > innerHeight * 0.9;
  if (a !== st1) {
    st1 = a;
    nav.classList.toggle("is-scrolled", a);
  }
  if (b !== st2) {
    st2 = b;
    totop.classList.toggle("is-on", b);
  }
  if (fr) {
    const p = clamp((innerHeight - fr.top) / (fr.height + innerHeight * 0.3), 0, 1);
    const v = Math.round(p * 50) * 2;
    if (v !== st3) {
      st3 = v;
      foot.style.setProperty("--fill", v + "%");
    }
    if (p > 0.8) $("#thanks").classList.add("is-in");
  }
}
function onScroll() {
  readScroll(scrollY);
  writeScroll();
}
let scrollT = 0;
var H_ = document.documentElement;
const AST_ = document.querySelector(".astro");
if (AST_) addEventListener("scroll", () => {
  if (!AST_.classList.contains("scrolling")) AST_.classList.add("scrolling");
  clearTimeout(scrollT);
  scrollT = setTimeout(() => AST_.classList.remove("scrolling"), 160);
}, { passive: true });
onScrollRead(readScroll);
onScrollWrite(writeScroll);
onScroll();
totop.addEventListener("click", () => {
  if (lenis) lenis.scrollTo(0, { duration: 1.4 });
  else scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" });
});
if (dockMore) {
  const setPop = (o) => {
    dockPop.hidden = !o;
    dockMore.setAttribute("aria-expanded", String(o));
  };
  dockMore.addEventListener("click", () => setPop(dockPop.hidden));
  dockPop.addEventListener("click", (e) => {
    if (e.target.closest("a")) setPop(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !dockPop.hidden) {
      setPop(false);
      dockMore.focus();
    }
  });
  document.addEventListener("pointerdown", (e) => {
    if (!dockPop.hidden && !dock.contains(e.target)) setPop(false);
  });
  dock.addEventListener("focusout", (e) => {
    if (!dockPop.hidden && e.relatedTarget && !dock.contains(e.relatedTarget)) setPop(false);
  });
}
