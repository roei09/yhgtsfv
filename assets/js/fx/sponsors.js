/* Libero: glass perfume carousel (drag to spin, click a bottle to bring it forward) */
(function() {
  const st = document.getElementById("lbwStage");
  if (!st) return;
  const room = st.closest(".spw"), bs = [...st.querySelectorAll(".lbw__b")], cap = st.querySelector(".lbw__cap");
  const N = bs.length, TAU = Math.PI * 2, live = document.getElementById("lbwLive");
  bs.forEach((b) => {
    const im = b.querySelector("img");
    b.querySelector(".lbw__gl").style.setProperty("--m", `url("${im.src}")`);
  });
  let ang = 0, vel = 0, auto = 0, hover = false, drag = null, target = null, raf = 0, last = 0, front = -1, W = 0, H = 0, vis = false;
  const nat = bs.map((b) => {
    const i = b.querySelector("img");
    return [+i.getAttribute("width"), +i.getAttribute("height")];
  });
  const maxH = Math.max(...nat.map((n) => n[1])), st_ = [];
  function measure() {
    W = st.clientWidth;
    H = st.clientHeight;
  }
  function place() {
    const bw = Math.min(0.94 * W, 1.2 * H), bh = bw * 260 / 600, y0 = H - 0.03 * H - bh, cx = W / 2, cy = y0 + bw * 92 / 600, rx = bw * 286 / 600 * 0.62, ry = bw * 50 / 600 * 0.62;
    const ph = W < 520, k = Math.min((ph ? 0.7 : 0.62) * H / maxH, bw * (ph ? 0.34 : 0.28) / nat[1][0]);
    let best = -2, bi = 0;
    bs.forEach((b, i) => {
      const t = ang + i * TAU / N, z = Math.cos(t), s = 0.74 + 0.26 * (z + 1) / 2;
      if (!st_[i] || st_[i].k !== k) st_[i] = { k, s0: 1, w: -1, z: -1, o: "" };
      const w = Math.round(nat[i][0] * k), h = Math.round(nat[i][1] * k);
      const x = cx + rx * Math.sin(t) - w / 2, y = cy + ry * z - h * 0.985 - (1 - s) * h * -0;
      const o = st_[i];
      if (o.w !== w) {
        o.w = w;
        b.style.width = w + "px";
        b.style.height = h + "px";
      }
      b.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${(s / o.s0).toFixed(4)})`;
      const zi = 2 + Math.round((z + 1) * 10);
      if (zi !== o.z) {
        o.z = zi;
        b.style.zIndex = String(zi);
      }
      const op = (0.78 + 0.22 * (z + 1) / 2).toFixed(2);
      if (op !== o.o) {
        o.o = op;
        b.style.opacity = op;
      }
      if (z > best) {
        best = z;
        bi = i;
      }
    });
    if (bi !== front) {
      front = bi;
      const b = bs[bi];
      {
        const nb = document.createElement("b"), ns = document.createElement("span");
        nb.textContent = b.dataset.n || "";
        ns.textContent = b.dataset.d || "";
        cap.replaceChildren(nb, ns);
      }
      cap.classList.remove("is-swap");
      void cap.offsetWidth;
      cap.classList.add("is-swap");
    }
  }
  function frame(t) {
    raf = 0;
    const dt = Math.min(0.05, (t - (last || t)) / 1e3);
    last = t;
    if (target !== null) {
      const d = target - ang;
      ang += RM ? d : d * Math.min(1, dt * 6);
      if (Math.abs(d) < 2e-3) {
        ang = target;
        target = null;
      }
    } else if (!drag) {
      vel += ((hover ? auto * 0.6 : auto) - vel) * Math.min(1, dt * 2.6);
      ang += vel * dt;
    }
    place();
    const moving = drag || target !== null || Math.abs(vel) > 2e-3;
    if (!moving) vel = 0;
    if (moving && vis && (room.classList.contains("is-on") || room.classList.contains("is-leaving"))) raf = requestAnimationFrame(frame);
    else last = 0;
  }
  const go = () => {
    if (!raf && vis) raf = requestAnimationFrame(frame);
  };
  st.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse") hover = true;
  });
  st.addEventListener("pointerleave", () => {
    hover = false;
  });
  st.addEventListener("pointerdown", (e) => {
    drag = { x: e.clientX, a: ang, t: performance.now(), moved: false, lx: e.clientX, lt: performance.now() };
    target = null;
    try {
      st.setPointerCapture(e.pointerId);
    } catch (_) {
    }
  });
  st.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 4) {
      drag.moved = true;
      st.classList.add("is-drag");
    }
    const now = performance.now();
    vel = (e.clientX - drag.lx) / Math.max(1, now - drag.lt) * 1e3 / (W * 0.35);
    drag.lx = e.clientX;
    drag.lt = now;
    ang = drag.a + dx / (W * 0.35);
    go();
  });
  const up = (e) => {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    st.classList.remove("is-drag");
    if (!moved) {
      const b = e.target.closest && e.target.closest(".lbw__b");
      if (b) bring(bs.indexOf(b));
    }
    go();
  };
  st.addEventListener("pointerup", up);
  st.addEventListener("pointercancel", up);
  st.addEventListener("lostpointercapture", (e) => {
    if (drag) {
      drag.moved = true;
      up(e);
    }
  });
  setInterval(() => {
    if (drag && performance.now() - drag.lt > 2500) {
      drag = null;
      st.classList.remove("is-drag");
    }
    if (target !== null && !raf) target = null;
    go();
  }, 1500);
  function bring(i) {
    const cur = ang + i * TAU / N;
    let d = -Math.atan2(Math.sin(cur), Math.cos(cur));
    target = ang + d;
    vel = 0;
    go();
    if (live) {
      const b = bs[i];
      live.textContent = `${b.dataset.n} בחזית: ${b.dataset.d}`;
    }
  }
  bs.forEach((b, i) => b.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      bring(i);
    }
  }));
  new ResizeObserver(() => {
    measure();
    place();
  }).observe(st);
  new IntersectionObserver((es) => {
    vis = es[0].isIntersecting;
    if (vis) {
      measure();
      place();
      go();
    }
  }).observe(room);
  new MutationObserver(() => go()).observe(room, { attributes: true, attributeFilter: ["class"] });
  measure();
  place();
})();

/* מחסני חשמל: small electric arcs between the neon ring and the coin */
/* LÜZ shirt: product photos with a gentle 3D sway; tap or drag to flip front and back */
(function() {
  const el = document.getElementById("tee3");
  if (!el) return;
  const body = document.getElementById("tee3Body"), room = el.closest(".spw");
  const srcF = body.querySelector(".tee3__f").src, srcB = body.querySelector(".tee3__b").src;
  const face = (src, cls) => {
    const w = document.createElement("div");
    w.className = "tee3__face " + cls;
    const i = document.createElement("img");
    i.src = src;
    i.alt = "";
    i.draggable = false;
    const g = document.createElement("span");
    g.className = "tee3__gloss";
    g.style.webkitMaskImage = g.style.maskImage = `url("${src}")`;
    w.append(i, g);
    body.appendChild(w);
    return w;
  };
  const F = face(srcF, "tee3__face--one"), Fi = F.querySelector("img"), Fg = F.querySelector(".tee3__gloss");
  let cur = 1;
  const stEl = document.getElementById("tee3St");
  let shown = 1;
  let a = 0, target = 0, drag = null, raf = 0, last = 0, vis = false, clock = 0, side = 0, tx = 0, ty = 0, px = 0, py = 0;
  const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  let flip = null;
  /* touch screens: no idle sway (it needed a new frame 60 times a second); the shirt still turns around every few seconds */
  const STILL = matchMedia("(hover: none)").matches;
  let nextFlip = 0;
  function put() {
    const sw = RM || STILL ? 0 : Math.sin(clock * 0.9) * 9, bob = RM || STILL ? 0 : Math.sin(clock * 1.3) * 3;
    const ry = a + sw + tx * 14, rx = -ty * 8 + 2;
    body.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    const n = (ry % 360 + 360) % 360, front = n < 90 || n > 270;
    if (+front !== cur) {
      cur = +front;
      const u = front ? srcF : srcB;
      Fi.src = u;
      Fg.style.webkitMaskImage = Fg.style.maskImage = `url("${u}")`;
    }
    F.style.transform = front ? "none" : "scaleX(-1)";
    const g = (50 + Math.sin(ry * Math.PI / 180) * 60).toFixed(1) + "%";
    F.style.setProperty("--g", g);
    el.style.setProperty("--sh", (0.75 + 0.25 * Math.abs(Math.cos(ry * Math.PI / 180))).toFixed(3));
  }
  function frame(t) {
    raf = 0;
    const dt = Math.min(0.05, (t - (last || t)) / 1e3);
    last = t;
    clock += dt;
    tx += (px - tx) * Math.min(1, dt * 4);
    ty += (py - ty) * Math.min(1, dt * 4);
    if (!drag) {
      if (flip) {
        flip.t += RM ? 1 : dt / 1.1;
        const k = ease(Math.min(1, flip.t));
        a = flip.a0 + (flip.a1 - flip.a0) * k;
        if (flip.t >= 1) {
          a = flip.a1;
          flip = null;
          side = 0;
        }
      } else if (!RM && !document.documentElement.classList.contains("axon-calm")) {
        side += dt;
        if (side > 3.6) {
          flip = { a0: a, a1: Math.round(a / 180) * 180 + 180, t: 0 };
        }
      }
    }
    put();
    const on = vis && (room.classList.contains("is-on") || room.classList.contains("is-leaving")) && !document.hidden;
    if (on && STILL && !drag && !flip) {
      last = 0;
      clearTimeout(nextFlip);
      if (!RM && !document.documentElement.classList.contains("axon-calm")) nextFlip = setTimeout(() => {
        if (drag || flip) return;
        flip = { a0: a, a1: Math.round(a / 180) * 180 + 180, t: 0 };
        go();
      }, 3600);
    } else if (on) raf = requestAnimationFrame(frame);
    else last = 0;
  }
  const go = () => {
    if (!raf && vis) raf = requestAnimationFrame(frame);
  };
  el.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    flip = null;
    drag = { x: e.clientX, a };
    el.classList.add("is-drag");
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener("pointermove", (e) => {
    if (drag) {
      a = drag.a + (e.clientX - drag.x) * 0.6;
      side = 0;
      go();
      return;
    }
    if (e.pointerType === "mouse") {
      const r = el.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width - 0.5) * 2;
      py = ((e.clientY - r.top) / r.height - 0.5) * 2;
      go();
    }
  });
  el.addEventListener("pointerleave", () => {
    px = py = 0;
  });
  const end = () => {
    if (!drag) return;
    drag = null;
    el.classList.remove("is-drag");
    flip = { a0: a, a1: Math.round(a / 180) * 180, t: 0 };
    side = 0;
    go();
  };
  el.addEventListener("pointerup", end);
  el.addEventListener("pointercancel", end);
  const say = (a1) => {
    const n = (a1 % 360 + 360) % 360, f = n < 90 || n > 270;
    if (stEl && +f !== shown) {
      shown = +f;
      stEl.textContent = f ? "מוצגת החזית" : "מוצג הגב";
    }
  };
  el.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      flip = { a0: a, a1: Math.round(a / 180) * 180 + (e.key === "ArrowLeft" ? -180 : 180), t: 0 };
      say(flip.a1);
      go();
    }
  });
  el.__set = (x) => {
    a = x;
    flip = null;
    side = -1e9;
    put();
  };
  new IntersectionObserver((es) => {
    vis = es[0].isIntersecting;
    go();
  }).observe(room);
  new MutationObserver(go).observe(room, { attributes: true, attributeFilter: ["class"] });
  document.addEventListener("visibilitychange", go);
  put();
})();
