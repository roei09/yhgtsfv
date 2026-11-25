/* Decorative animations pause off-screen. "zz" switches as soon as a block leaves the viewport (CSS pauses
   its loops); "is-idle" waits until it is 300px away (CSS stops rendering whole scenes). */
function markOffscreen(selector, className, margin) {
  const io = new IntersectionObserver((es) => {
    for (const e of es) e.target.classList.toggle(className, !e.isIntersecting);
  }, { rootMargin: margin });
  $$(selector).forEach((el) => io.observe(el));
}
markOffscreen(".frame,.foot2__frame,.tour,.nav,.subbar,.intro", "zz", "80px 0px");
markOffscreen("#collabs,.stage>.frame,.foot2__frame", "is-idle", "300px 0px");

/* Decode sponsor images ahead of time so the first switch to a slide does not stall */
(function() {
  const run = () => {
    const imgs = [...document.querySelectorAll("#collabs img")];
    let i = 0;
    const next = () => {
      if (i >= imgs.length) return;
      const im = imgs[i++];
      (im.decode ? im.decode() : Promise.resolve()).catch(() => {
      }).then(() => setTimeout(next, 60));
    };
    next();
  };
  /* only once the partners section is getting close, not on page load */
  const t = document.getElementById("collabs");
  if (!t) return;
  const io = new IntersectionObserver((es) => {
    if (es[0].isIntersecting) {
      io.disconnect();
      "requestIdleCallback" in window ? requestIdleCallback(run, { timeout: 1500 }) : setTimeout(run, 300);
    }
  }, { rootMargin: "100% 0px" });
  io.observe(t);
})();

/* Sponsor quick menu: one chip per sponsor, in sync with the dots */
(function() {
  const m = document.getElementById("tmenu");
  if (!m) return;
  const dots = [...document.querySelectorAll("#collabs .tdot")];
  const C = ["#ffb88a", "#ffd23a", "#c9b0ff", "#5ff7e6"], N = { "LÜZ X SVR": "LÜZ" };
  const bs = dots.map((d, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "tmenu__b";
    b.style.setProperty("--c", C[i % C.length]);
    const lab = d.getAttribute("aria-label") || "";
    b.innerHTML = '<i aria-hidden="true"></i>';
    b.append(N[lab] || lab);
    b.setAttribute("aria-label", "מעבר ל" + lab);
    b.addEventListener("click", () => d.click());
    m.appendChild(b);
    return b;
  });
  const sync = () => dots.forEach((d, i) => {
    const v = d.getAttribute("aria-current") === "true" ? "true" : "false";
    if (bs[i].getAttribute("aria-current") === v) return;
    bs[i].setAttribute("aria-current", v);
    if (v === "true" && m.scrollWidth > m.clientWidth) m.scrollTo({ left: bs[i].offsetLeft - (m.clientWidth - bs[i].offsetWidth) / 2, behavior: "smooth" });
  });
  const mo = new MutationObserver(sync);
  dots.forEach((d) => mo.observe(d, { attributes: true, attributeFilter: ["aria-current"] }));
  sync();
})();

/* CardPull pack: tilt and glare follow the pointer */
(function() {
  const sl = document.querySelector(".spw--cards"), t = sl && sl.querySelector(".cpk__tilt");
  if (!t || !matchMedia("(pointer:fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let raf = 0, ev = null;
  const set = (k, v) => t.style.setProperty(k, v);
  sl.addEventListener("pointermove", (e) => {
    ev = e;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const r = t.getBoundingClientRect(), dx = (ev.clientX - (r.left + r.width / 2)) / innerWidth, dy = (ev.clientY - (r.top + r.height / 2)) / innerHeight;
      set("--ry", (dx * 30).toFixed(2) + "deg");
      set("--rx", (-dy * 18).toFixed(2) + "deg");
      set("--gx", (50 + dx * 110).toFixed(1) + "%");
      set("--gy", (30 + dy * 90).toFixed(1) + "%");
    });
  });
  sl.addEventListener("pointerleave", () => {
    set("--ry", "0deg");
    set("--rx", "0deg");
    set("--gx", "50%");
    set("--gy", "30%");
  });
})();

/* Automatic downgrade: full to balanced below ~48fps, balanced to lite below ~38fps (3 s in a row, after a 2 s warm-up), measured only while the hero or the sponsor tour is on screen. Never upgrades; stored for this tab only. */
(function() {
  const H = document.documentElement;
  if (H.dataset.perf === "lite") return;
  const zones = [document.getElementById("collabs"), document.getElementById("top")].filter(Boolean);
  /* samples at most ~12 s in all: after that the tier is settled and the meter stops asking for frames */
  let vis = 0, r = 0, frames = 0, t0 = 0, bad = 0, warm = 2, spent = 0;
  const set = (t) => {
    H.dataset.perf = t;
    if (t === "lite") H.classList.add("lite");
    try {
      sessionStorage.setItem("osvr-perf", t);
    } catch (_) {
    }
  };
  const io = new IntersectionObserver((es) => {
    for (const e of es) vis += e.isIntersecting ? 1 : -1;
    vis = Math.max(0, vis);
    if (vis && !r && !document.hidden) {
      t0 = 0;
      frames = 0;
      warm = 2;
      r = requestAnimationFrame(tick);
    }
  }, { threshold: 0.5 });
  zones.forEach((z) => io.observe(z));
  function tick(t) {
    if (!vis || document.hidden) {
      r = 0;
      return;
    }
    if (!t0) {
      t0 = t;
      frames = 0;
      r = requestAnimationFrame(tick);
      return;
    }
    frames++;
    if (t - t0 >= 1e3) {
      const fps = frames * 1e3 / (t - t0);
      t0 = t;
      frames = 0;
      if (++spent > 14) {
        io.disconnect();
        r = 0;
        return;
      }
      if (warm > 0) {
        warm--;
      } else {
        const lim = H.dataset.perf === "full" ? 48 : 38;
        bad = fps < lim ? bad + 1 : 0;
        if (bad >= 3) {
          bad = 0;
          warm = 2;
          set(H.dataset.perf === "full" ? "balanced" : "lite");
          if (H.dataset.perf === "lite") {
            io.disconnect();
            r = 0;
            return;
          }
        }
      }
    }
    r = requestAnimationFrame(tick);
  }
})();

/* The first time the tour is reached, nudge the next arrow */
(function() {
  const t = document.querySelector("#collabs .tour") || document.getElementById("collabs");
  if (!t) return;
  const T = t.classList.contains("tour") ? t : t.querySelector(".tour");
  if (!T) return;
  const io = new IntersectionObserver((es) => {
    if (es[0].isIntersecting) {
      T.classList.add("is-new");
      setTimeout(() => T.classList.remove("is-new"), 6e3);
      io.disconnect();
    }
  }, { threshold: 0.6 });
  io.observe(T);
})();

/* perf probe (off by default). Run osvrPerf() in the console, or open the page with #perf.
   Scrolls the page and reports long frames per section. */
window.osvrPerf = function(ms) {
  ms = ms || 8e3;
  const secs = [...document.querySelectorAll("#top,#collabs,.stage>.frame,.foot2")];
  const tops = secs.map((el) => [el.getBoundingClientRect().top + scrollY, el.id || el.className.split(" ")[0]]);
  const name = (y) => {
    let n = "?";
    for (const [t, k] of tops) if (y + innerHeight / 2 >= t) n = k;
    return n;
  };
  const H = document.documentElement.scrollHeight - innerHeight, st = {}, de = document.documentElement, sb = de.style.scrollBehavior;
  let last = 0, t0 = 0;
  const go = (y) => {
    if (typeof lenis !== "undefined" && lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else scrollTo(0, y);
  };
  de.style.scrollBehavior = "auto";
  return new Promise((res) => {
    go(0);
    requestAnimationFrame(function f(t) {
      if (!t0) t0 = last = t;
      const dt = t - last;
      last = t;
      const y = scrollY, k = name(y), o = st[k] || (st[k] = { frames: 0, long: 0, worst: 0, sum: 0 });
      o.frames++;
      o.sum += dt;
      if (dt > 20) o.long++;
      o.worst = Math.max(o.worst, dt);
      if (t - t0 < ms) {
        go((t - t0) / ms * H);
        requestAnimationFrame(f);
      } else {
        const rows = Object.entries(st).map(([k2, o2]) => ({ section: k2, avgMs: +(o2.sum / o2.frames).toFixed(1), fps: Math.round(1e3 / (o2.sum / o2.frames)), longFrames: o2.long, worstMs: Math.round(o2.worst) })).sort((a, b) => b.longFrames - a.longFrames);
        de.style.scrollBehavior = sb;
        console.table(rows);
        res(rows);
      }
    });
  });
};
if (location.hash === "#perf") addEventListener("load", () => setTimeout(() => osvrPerf(), 1200));
