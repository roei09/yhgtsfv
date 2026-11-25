/* Decorative motion, split by scene (hero, tour, nuggets, ambient, sponsors, runtime); loaded in that order after the core and UI scripts.
   Nothing here is needed to use the site; every block respects RM, LITE and FINE and pauses off-screen.
   This file: film grain, stars, the hero entrance, the flight and the pointer parallax. */

/* Hero: film grain, stars, the flight, the cockpit */
/* film grain: one tiny tile rendered once */
(function() {
  if (LITE) return;
  try {
    const c = document.createElement("canvas");
    c.width = c.height = 180;
    const x = c.getContext("2d"), d = x.createImageData(180, 180);
    for (let i = 0; i < d.data.length; i += 4) {
      const v = Math.random();
      if (v > 0.5) {
        d.data[i] = d.data[i + 1] = d.data[i + 2] = 255;
        d.data[i + 3] = (v - 0.5) * 46;
      } else {
        d.data[i + 3] = (0.5 - v) * 60;
      }
    }
    x.putImageData(d, 0, 0);
    document.body.style.setProperty("--grain", `url(${c.toDataURL("image/png")})`);
  } catch (e) {
  }
})();

/* stars: drawn once, static */
(function() {
  const s = $("#stars");
  if (!s) return;
  const W = 1e3, H = 600;
  s.setAttribute("viewBox", `0 0 ${W} ${H}`);
  let h = "";
  let seed = 7;
  const r = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  for (let i = 0; i < 110; i++) {
    const x = r() * W, y = r() * H, z = r();
    h += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(z * 1.4 + 0.3).toFixed(2)}" fill="#fff" opacity="${(0.25 + z * 0.6).toFixed(2)}"/>`;
  }
  s.innerHTML = h;
  const t = document.createElement("div");
  t.className = "twk";
  t.setAttribute("aria-hidden", "true");
  let k = "";
  for (let i = 0; i < 12; i++) k += `<i style="left:${(r() * 100).toFixed(1)}%;top:${(r() * 100).toFixed(1)}%;animation-delay:${(-r() * 3).toFixed(2)}s"></i>`;
  t.innerHTML = k;
  s.after(t);
})();

/* hero entrance: letters rise, the field drifts in */
(function() {
  const h = $("#heroTitle");
  $$(".wl", h).forEach((r) => {
    r.replaceChildren(...[...r.textContent].map((c) => {
      const x = document.createElement("span");
      x.className = "ch";
      x.textContent = c;
      return x;
    }));
  });
  function run() {
    if (RM) return;
    const E = "cubic-bezier(.22,1,.36,1)";
    $$(".ch", h).forEach((c, i) => c.animate([{ opacity: 0, transform: "translate3d(0,.35em,0) scale(.96)", filter: "blur(14px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }], { duration: 1300, delay: 120 + i * 45, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" }));
    $$(".hero-in").forEach((el, i) => el.animate([{ opacity: 0, transform: "translate3d(0,14px,0)" }, { opacity: 1, transform: "none" }], { duration: 700, delay: 600 + i * 120, easing: E, fill: "backwards" }));
    $$("#field .ast").forEach((a, i) => a.firstElementChild.animate([{ opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1 }], { duration: 1100, delay: 80 + i * 40, easing: E, fill: "backwards" }));
    const pod = $("#pod .ship__bob");
    pod && pod.animate([{ opacity: 0, translate: "0 24px" }, { opacity: 1, translate: "0 0" }], { duration: 1200, delay: 250, easing: "cubic-bezier(.34,1.3,.64,1)", fill: "backwards" });
  }
  run();
})();

/* the flight: scroll moves the camera through the field, into the pod, into the cockpit */
(function() {
  const sc = $("#top");
  if (!sc) return;
  const asts = $$("#field .ast").map((el) => {
    const cs = el.style;
    return { el, x: parseFloat(cs.getPropertyValue("--x")), y: parseFloat(cs.getPropertyValue("--y")), z: +el.dataset.z || 1 };
  });
  const pod = $("#pod"), rings = $("#rings"), copy = $("#heroCopy"), warp = $("#warp"), live = $("#livecard"), cue = $("#cue");
  /* afterimages that trail the pod as it swoops away */
  const ghosts = RM || PERF !== "full" ? [] : [0, 1].map(() => {
    const g = pod.cloneNode(true);
    g.removeAttribute("id");
    g.classList.add("ship--ghost");
    $$("[id]", g).forEach((n) => n.removeAttribute("id"));
    g.style.opacity = "0";
    pod.after(g);
    return g;
  });
  const ss = (a, b, x) => {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };
  const lerp = (a, b, t) => a + (b - a) * t;
  let top0 = 0, span = 1, W = innerWidth, H = innerHeight, raf = 0, lastP = -1, on = true;
  const measure = () => {
    SY = scrollY;
    const r = sc.getBoundingClientRect();
    top0 = r.top + scrollY;
    span = Math.max(1, sc.offsetHeight - innerHeight);
    W = innerWidth;
    H = innerHeight;
    lastP = -1;
    tick();
  };
  /* The swoop: right and slightly up, a tight U-turn near the edge, then a long dive down-left toward the camera */
  const bz = (a, b, c, d, u) => {
    const v = 1 - u;
    return v * v * v * a + 3 * v * v * u * b + 3 * v * u * u * c + u * u * u * d;
  };
  function pos(t) {
    t = clamp(t, 0, 1);
    const A = 0.4;
    if (t < A) {
      const u2 = t / A;
      return [bz(0, 0.18 * W, 0.31 * W, 0.36 * W, u2), bz(0, -0.02 * H, -0.12 * H, -0.06 * H, u2)];
    }
    const u = (t - A) / (1 - A);
    return [bz(0.36 * W, 0.41 * W, 0.04 * W, -0.72 * W, u), bz(-0.06 * H, 0, 0.6 * H, 0.95 * H, u)];
  }
  function at(t, s1, by) {
    const p0 = pos(t), p1 = pos(t + 4e-3), vx = p1[0] - p0[0], vy = p1[1] - p0[1], l = Math.hypot(vx, vy) || 1, bank = 20 * (vx / l) + 6 * (vy / l) * (vx >= 0 ? 1 : -1), sc2 = s1 * (1 - 0.14 * Math.sin(Math.PI * clamp(t / 0.42, 0, 1)) + 0.75 * Math.pow(clamp((t - 0.45) / 0.55, 0, 1), 1.6));
    return `translate3d(${p0[0].toFixed(1)}px,${(p0[1] + by).toFixed(1)}px,0) rotate(${(bank * Math.min(1, t * 12)).toFixed(2)}deg) scale(${sc2.toFixed(3)})`;
  }
  function frame() {
    raf = 0;
    const p = clamp((SY - top0) / span, 0, 1);
    if (Math.abs(p - lastP) < 5e-4) return;
    lastP = p;
    const fly = Math.pow(p, 1.35), fade = 1 - ss(0.78, 0.92, p);
    for (const a of asts) {
      const k = a.z * fly;
      const dx = (a.x - 50) / 50 * W * 0.62 * k, dy = (a.y - 50) / 50 * H * 0.62 * k, s = 1 + k * 1.9;
      a.el.style.transform = `translate3d(${dx.toFixed(1)}px,${dy.toFixed(1)}px,0) scale(${s.toFixed(3)})`;
      a.el.style.opacity = fade.toFixed(3);
      a.el.style.visibility = fade < 5e-3 ? "hidden" : "";
    }
    const s1 = lerp(1, 1.35, ss(0.06, 0.36, p)), lin = clamp((p - 0.36) / 0.5, 0, 1), t = lin * lin * (3 - 2 * lin) * 0.35 + lin * 0.65, by = lerp(-H * 0.03, 0, ss(0.06, 0.36, p));
    pod.style.transform = at(t, s1, by);
    pod.style.willChange = p > 0.01 && p < 0.995 ? "transform" : "auto";
    ghosts.forEach((g, i) => {
      const k = t - (i + 1) * 0.03, on2 = t > 5e-3 && t < 0.995 && k > 0;
      g.style.opacity = on2 ? ([0.2, 0.1][i] * Math.sin(Math.PI * t)).toFixed(3) : "0";
      g.style.visibility = on2 ? "" : "hidden";
      if (on2) g.style.transform = at(k, s1, by);
    });
    const c = copy.contains(document.activeElement) ? 0 : ss(0.04, 0.22, p);
    copy.style.opacity = (1 - c).toFixed(3);
    copy.style.transform = `translate3d(0,${(-90 * c).toFixed(1)}px,0) scale(${(1 - 0.08 * c).toFixed(3)})`;
    copy.style.visibility = c > 0.99 ? "hidden" : "visible";
    const lc = live.contains(document.activeElement) ? 0 : ss(0.02, 0.16, p);
    live.style.opacity = (1 - lc).toFixed(3);
    live.style.visibility = lc > 0.99 ? "hidden" : "visible";
    cue.style.opacity = (1 - ss(0, 0.05, p)).toFixed(3);
    const ro = ss(0.16, 0.32, p) * (1 - ss(0.4, 0.5, p));
    rings.style.opacity = ro.toFixed(3);
    rings.style.transform = `scale(${(lerp(0.55, 1, ss(0.14, 0.38, p)) * (1 + ss(0.4, 0.56, p) * 0.5)).toFixed(3)})`;
    const wo = ss(0.88, 0.98, p);
    /* opacity only: hiding the warp would drop its rendered star field, and painting it again as it fades in cost a ~100ms stall */
    warp.style.opacity = wo.toFixed(3);
    if (window.__ws && wo > 0) {
      const k = ss(0.8, 1, p);
      __ws[0].style.transform = `translate3d(0,${(-140 * k).toFixed(1)}px,0)`;
      __ws[1].style.transform = `translate3d(0,${(-300 * k).toFixed(1)}px,0)`;
    }
  }
  const tick = () => {
    if (on && !raf) raf = requestAnimationFrame(frame);
  };
  onScrollWrite(() => {
    if (on) {
      cancelAnimationFrame(raf);
      frame();
    }
  });
  addEventListener("resize", measure, { passive: true });
  new ResizeObserver(measure).observe(document.body);
  const pin_ = sc.querySelector(".scene__pin");
  new IntersectionObserver((es) => {
    on = es[0].isIntersecting;
    document.documentElement.classList.toggle("hero-off", !on);
    if (pin_) pin_.classList.toggle("is-off", !on);
    if (on) tick();
  }).observe(sc);
  measure();
})();

/* pointer parallax on the field (desktop only, transform on a wrapper) */
(function() {
  const f = $("#field"), pod = $("#pod .ship__bob");
  if (!f || !FINE || RM || LITE) return;
  let tx = 0, ty = 0, q = 0;
  addEventListener("pointermove", (e) => {
    tx = e.clientX / innerWidth - 0.5;
    ty = e.clientY / innerHeight - 0.5;
    if (!q) q = requestAnimationFrame(() => {
      q = 0;
      f.style.transform = `translate3d(${(-tx * 22).toFixed(1)}px,${(-ty * 16).toFixed(1)}px,0)`;
    });
  }, { passive: true });
})();
