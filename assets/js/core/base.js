/* Core behaviour, split in four files loaded in order: base (helpers, performance tier, the scroll pipeline, smooth scroll, toast),
   live (navigation and live status), content (links, videos, leaderboard) and scroll (scroll-bound UI).
   They share top-level names, so the order in index.html matters. */

document.documentElement.classList.add("js");

/* The font stylesheet is linked with media="print" so it never blocks the first paint; switch it on now. */
{
  const gf = document.getElementById("gfonts");
  if (gf) gf.media = "all";
}

/* Always open on the hero: no restored scroll position, no jump to an old #section.
   Only the in-page documents (#accessibility, #privacy) may open from a link. */
try {
  history.scrollRestoration = "manual";
} catch (_) {
}
(function() {
  const doc = () => /^#(accessibility|privacy)$/.test(location.hash);
  if (location.hash && !doc()) {
    try {
      history.replaceState(null, "", location.pathname + location.search);
    } catch (_) {
    }
  }
  const top = () => {
    if (!doc()) scrollTo({ top: 0, left: 0, behavior: "instant" });
  };
  top();
  addEventListener("DOMContentLoaded", top, { once: true });
  addEventListener("load", () => {
    top();
    setTimeout(top, 60);
  }, { once: true });
})();
addEventListener("error", () => document.documentElement.classList.add("js-err"));
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RMQ = matchMedia("(prefers-reduced-motion: reduce)");
let RM = RMQ.matches;

/* true for reduced-motion users AND while "עצירת אנימציות" is on (kept in sync by the a11y panel) */
const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;

/* performance tier: full / balanced / lite (html[data-perf]; .lite kept for older rules). ?perf=full|balanced|lite forces a tier for testing; the auto-downgrade below may lower it for this tab. */
const PERF = (() => {
  let q = null, st = null;
  try {
    q = new URLSearchParams(location.search).get("perf");
    st = sessionStorage.getItem("osvr-perf");
  } catch (_) {
  }
  if (/^(full|balanced|lite)$/.test(q || "")) return q;
  const c = navigator.hardwareConcurrency || 8, m = navigator.deviceMemory || 8, sd = !!(navigator.connection && navigator.connection.saveData);
  let t = RM || sd || c <= 2 || m <= 2 ? "lite" : c <= 4 || m <= 4 || matchMedia("(pointer: coarse)").matches ? "balanced" : "full";
  const rank = { full: 0, balanced: 1, lite: 2 };
  if (/^(balanced|lite)$/.test(st || "") && rank[st] > rank[t]) t = st;
  return t;
})();
document.documentElement.dataset.perf = PERF;
const LITE = PERF === "lite";
if (LITE) document.documentElement.classList.add("lite");

/* one scroll pipeline for the whole site: a single passive listener and one rAF per frame.
   Every handler that measures runs first (onScrollRead), every handler that changes styles runs after (onScrollWrite),
   so the browser lays the page out at most once per frame. SY = the scroll position for this frame. */
let SY = scrollY;
const _rd = [], _wr = [];
let _q = false;
function _frame() {
  _q = false;
  SY = scrollY;
  for (const f of _rd) f(SY);
  for (const f of _wr) f(SY);
}
addEventListener("scroll", () => {
  if (!_q) {
    _q = true;
    requestAnimationFrame(_frame);
  }
}, { passive: true });
/* html.is-scrolling while the page moves; CSS holds the slow ambient loops still meanwhile */
{
  const H = document.documentElement;
  let idleT = 0;
  addEventListener("scroll", () => {
    if (!idleT) H.classList.add("is-scrolling");
    clearTimeout(idleT);
    idleT = setTimeout(() => {
      idleT = 0;
      H.classList.remove("is-scrolling");
    }, 180);
  }, { passive: true });
}
const onScrollRead = (f) => {
  _rd.push(f);
}, onScrollWrite = (f) => {
  _wr.push(f);
};
const fmt = (n) => Number(n).toLocaleString("he-IL");
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const initials = (s) => s.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase() || s.slice(0, 2);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
$("#yr").textContent = (/* @__PURE__ */ new Date()).getFullYear();
const ICONS = {
  arrow: '<svg class="link__arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 17 7 7M7 17V7h10"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>'
};
const APP = {
  kick: { tile: "linear-gradient(160deg,#7dff4d,#3fd60f)", side: "#2a9b09", sh: "rgba(83,252,24,.55)", g: '<svg viewBox="0 0 24 24"><path fill="#061100" d="M4.5 3h5.2v5.2h1.75V6.45h1.75V4.7h1.75V3h5.1v5.25h-1.75V10h-1.75v4h1.75v1.75h1.75V21h-5.1v-1.7h-1.75v-1.75h-1.75V15.8H9.7V21H4.5z"/></svg>' },
  youtube: { tile: "linear-gradient(160deg,#ff3b4f,#d9001b)", side: "#8a0012", sh: "rgba(255,0,51,.5)", g: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M23.5 6.19a3 3 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3 3 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3 3 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3 3 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>' },
  clips: { tile: "linear-gradient(160deg,#ff8a5c,#e2482a)", side: "#93290f", sh: "rgba(255,122,89,.5)", g: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="14" rx="3"/><path d="m3 10 18-0M7 6l2 4M12 6l2 4M17 6l2 4"/><path d="M10.5 13v4l3.5-2z" fill="#fff" stroke="none"/></svg>' },
  tiktok: { tile: "linear-gradient(160deg,#2a2a2e,#050506)", side: "#000", sh: "rgba(37,244,238,.35)", g: (() => {
    const p = "M12.53.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z";
    return `<svg viewBox="-1 -1 26 26"><path fill="#25f4ee" transform="translate(-.9 -.7)" d="${p}"/><path fill="#fe2c55" transform="translate(.9 .7)" d="${p}"/><path fill="#fff" d="${p}"/></svg>`;
  })() },
  instagram: { tile: "radial-gradient(circle at 30% 107%,#fdf497 0%,#fdf497 5%,#fd5949 45%,#d6249f 60%,#285aeb 90%)", side: "#7a1460", sh: "rgba(214,36,159,.5)", g: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.2" fill="#fff" stroke="none"/></svg>' },
  discord: { tile: "linear-gradient(160deg,#7b86ff,#4d5bf0)", side: "#2c35a3", sh: "rgba(88,101,242,.55)", g: '<svg viewBox="0 0 24 24"><path fill="#fff" d="M20.32 4.37a19.8 19.8 0 0 0-4.89-1.52.07.07 0 0 0-.08.04c-.21.38-.44.87-.61 1.25a18.27 18.27 0 0 0-5.49 0 12.64 12.64 0 0 0-.62-1.25.08.08 0 0 0-.08-.04 19.74 19.74 0 0 0-4.88 1.52.07.07 0 0 0-.03.03C.53 9.05-.32 13.58.1 18.06a.08.08 0 0 0 .03.06 19.9 19.9 0 0 0 5.99 3.03.08.08 0 0 0 .09-.03c.46-.63.87-1.3 1.22-1.99a.08.08 0 0 0-.04-.11 13.1 13.1 0 0 1-1.87-.89.08.08 0 0 1-.01-.13c.13-.09.25-.19.37-.29a.07.07 0 0 1 .08-.01c3.93 1.79 8.18 1.79 12.06 0a.07.07 0 0 1 .08.01c.12.1.25.2.37.29a.08.08 0 0 1-.01.13c-.6.35-1.22.64-1.87.89a.08.08 0 0 0-.04.11c.36.7.77 1.36 1.22 1.99a.08.08 0 0 0 .09.03 19.84 19.84 0 0 0 6-3.03.08.08 0 0 0 .03-.06c.5-5.18-.84-9.67-3.55-13.66a.06.06 0 0 0-.03-.03zM8.02 15.33c-1.18 0-2.16-1.09-2.16-2.42 0-1.33.96-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.33-.96 2.42-2.16 2.42zm7.97 0c-1.18 0-2.15-1.09-2.15-2.42 0-1.33.95-2.42 2.15-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.33-.95 2.42-2.16 2.42z"/></svg>' },
  reddit: { tile: "linear-gradient(160deg,#ff6a2a,#ff3d00)", side: "#9a2400", sh: "rgba(255,69,0,.5)", g: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="14.5" rx="8.2" ry="5.8" fill="#fff"/><circle cx="4.3" cy="11.6" r="2" fill="#fff"/><circle cx="19.7" cy="11.6" r="2" fill="#fff"/><path d="M12 8.8 13.2 3.6l3.6.8" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/><circle cx="17.9" cy="4.6" r="1.6" fill="#fff"/><circle cx="8.9" cy="13.6" r="1.35" fill="#ff4500"/><circle cx="15.1" cy="13.6" r="1.35" fill="#ff4500"/><path d="M8.9 16.7c1.8 1.3 4.4 1.3 6.2 0" fill="none" stroke="#ff4500" stroke-width="1.1" stroke-linecap="round"/></svg>' }
};
const LIBS = { lenis: ["https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js", "sha384-B2WBjDzEjJpYvhmi2UyEn7rektqkf5suS6sNoyyrf0EBAwBHdkiXxIlU0V5Ru2ed"] };
const _lib = {};
function loadLib(k) {
  return _lib[k] || (_lib[k] = new Promise((ok, no) => {
    const s = document.createElement("script");
    s.src = LIBS[k][0];
    s.integrity = LIBS[k][1];
    s.crossOrigin = "anonymous";
    s.referrerPolicy = "no-referrer";
    s.async = true;
    s.onload = ok;
    s.onerror = no;
    document.head.appendChild(s);
  }));
}
const idle = (cb) => "requestIdleCallback" in window ? requestIdleCallback(cb, { timeout: 2500 }) : setTimeout(cb, 1200);
let lenis = null;
if (!RM && FINE) {
  loadLib("lenis").then(() => {
    lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95, touchMultiplier: 1.2, syncTouch: false });
    document.documentElement.classList.add("lenis");
    let r = 0, still = 0;
    const loop = (t) => {
      lenis.raf(t);
      still = lenis.isScrolling ? 0 : still + 1;
      r = still > 30 ? 0 : requestAnimationFrame(loop);
    };
    const wake = () => {
      still = 0;
      if (!r) r = requestAnimationFrame(loop);
    };
    ["wheel", "touchstart", "keydown", "pointerdown"].forEach((e) => addEventListener(e, wake, { passive: true }));
    const st = lenis.scrollTo.bind(lenis);
    lenis.scrollTo = (...a) => {
      wake();
      return st(...a);
    };
    wake();
  }).catch(() => {
  });
}
function goTo(hash) {
  const el = $(hash);
  if (!el) return;
  try {
    history.replaceState(null, "", location.pathname + location.search);
  } catch (_) {
  }
  if (el.classList.contains("spw") && window.__tourGo) {
    window.__tourGo(+el.dataset.i);
    return;
  }
  /* the contact card opens centred on the screen; other sections line up under the top bar */
  const off = el.id === "collabs" ? 0 : el.id === "business" && el.offsetHeight < innerHeight - 100 ? -Math.round((innerHeight - el.offsetHeight) / 2) : -84;
  const settle = (n) => {
    const d = el.getBoundingClientRect().top + off;
    if (Math.abs(d) < 3 || n > 3) return;
    if (lenis) lenis.scrollTo(el, { offset: off, duration: 0.35, onComplete: () => settle(n + 1) });
    else {
      scrollTo({ top: scrollY + d, behavior: "auto" });
      requestAnimationFrame(() => settle(n + 1));
    }
  };
  if (lenis) lenis.scrollTo(el, { offset: off, onComplete: () => settle(0) });
  else {
    el.scrollIntoView({ behavior: RM ? "auto" : "smooth" });
    setTimeout(() => settle(0), RM ? 50 : 900);
  }
  if (el.tagName === "SECTION" || el.tagName === "MAIN") {
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
}
$$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
  const h = a.getAttribute("href");
  if (h.length > 1 && $(h)) {
    e.preventDefault();
    goTo(h);
  }
}));
let toastT;
function toast(m) {
  const t = $("#toast");
  t.textContent = "";
  t.classList.add("is-on");
  setTimeout(() => {
    t.textContent = m;
  }, 40);
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove("is-on"), 2600);
}
function sparks(el) {
  if (RM) return;
  for (let i = 0; i < 10; i++) {
    const s = document.createElement("span");
    s.className = "spark";
    el.appendChild(s);
    const a = Math.random() * Math.PI * 2, d = 24 + Math.random() * 26;
    s.style.left = "50%";
    s.style.top = "50%";
    s.animate([{ transform: "translate(-50%,-50%) scale(1)", opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * d}px),calc(-50% + ${Math.sin(a) * d}px)) scale(0)`, opacity: 0 }], { duration: 700, easing: "cubic-bezier(.22,1,.36,1)" }).onfinish = () => s.remove();
  }
}
async function copyText(txt, btn, label) {
  let ok = false;
  try {
    await navigator.clipboard.writeText(txt);
    ok = true;
  } catch (e) {
    try {
      const ta = document.createElement("textarea");
      ta.value = txt;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      ok = document.execCommand("copy");
      ta.remove();
    } catch (_) {
    }
  }
  if (ok) {
    toast(label || "הועתק!");
    if (btn) {
      sparks(btn);
      const o = btn.textContent;
      btn.classList.add("is-done");
      btn.textContent = "הועתק ✓";
      setTimeout(() => {
        btn.textContent = o;
        btn.classList.remove("is-done");
      }, 1800);
    }
  } else toast("לא הצלחנו להעתיק: " + txt);
}
