/* Nuggets in zero gravity: a soft body that ripples, cruises, turns smoothly and can be thrown */
(function() {
  const el = $("#nug");
  if (!el) return;
  const body = $("#nugBody"), pin = $(".scene__pin"), head = $("#nugHead"), halo = $("#nugHalo");
  const skin = $("#nugSkin"), ink = $("#nugInk"), clipP = $("#nugClipP"), belly = $("#nugBelly"), scutes = $("#nugScutes"), blotch = $("#nugBlotch"), flecks = $("#nugFlecks"), shine = $("#nugShine");
  /* Body: a snake's taper along a slowly undulating spine */
  const N = 40, X0 = 22, X1 = 292;
  const width = (s) => s < 0.55 ? 0.9 + Math.pow(s / 0.55, 0.72) * 16.6 : s > 0.84 ? 17.5 - Math.pow((s - 0.84) / 0.16, 1.3) * 6.5 : 17.5;
  function spine(t) {
    const P = [];
    for (let i = 0; i <= N; i++) {
      const s = i / N, x2 = X0 + (X1 - X0) * s, amp = 12 + 16 * (1 - s);
      P.push([x2, 104 + amp * Math.sin(s * 5.6 - t * 0.55) + 5 * Math.sin(s * 2.3 + t * 0.23)]);
    }
    return P;
  }
  const f = (v) => v.toFixed(1);
  const smooth = (P) => {
    let d = `M${f(P[0][0])} ${f(P[0][1])}`;
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2;
      d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
    }
    return d;
  };
  function draw(t) {
    const P = spine(t), Nm = [], W2 = [];
    for (let i = 0; i <= N; i++) {
      const a2 = P[Math.max(0, i - 1)], b = P[Math.min(N, i + 1)], dx = b[0] - a2[0], dy = b[1] - a2[1], l = Math.hypot(dx, dy) || 1;
      Nm.push([-dy / l, dx / l]);
      W2.push(width(i / N));
    }
    const off = (i, k) => [P[i][0] + Nm[i][0] * W2[i] * k, P[i][1] + Nm[i][1] * W2[i] * k];
    const line = (k, a2 = 0, b = N) => {
      const Q = [];
      for (let i = a2; i <= b; i++) Q.push(off(i, k));
      return Q;
    };
    const outline = smooth(line(-1)) + smooth(line(1).reverse()).replace("M", "L") + "Z";
    skin.setAttribute("d", outline);
    ink.setAttribute("d", outline);
    clipP.setAttribute("d", outline);
    /* pale belly on the underside, crossed by ventral scales */
    belly.setAttribute("d", smooth(line(1.2, 2)) + smooth(line(0.38, 2).reverse()).replace("M", "L") + "Z");
    let sc = "";
    for (let i = 3; i < N; i++) {
      const p = off(i, 0.4), q = off(i, 1.1);
      sc += `M${f(p[0])} ${f(p[1])}L${f(q[0])} ${f(q[1])}`;
      if (i < N - 1) {
        const m0 = [(P[i][0] + P[i + 1][0]) / 2, (P[i][1] + P[i + 1][1]) / 2], nx = (Nm[i][0] + Nm[i + 1][0]) / 2, ny = (Nm[i][1] + Nm[i + 1][1]) / 2, w2 = (W2[i] + W2[i + 1]) / 2;
        sc += `M${f(m0[0] + nx * w2 * 0.4)} ${f(m0[1] + ny * w2 * 0.4)}L${f(m0[0] + nx * w2 * 1.1)} ${f(m0[1] + ny * w2 * 1.1)}`;
      }
    }
    scutes.setAttribute("d", sc);
    /* dorsal saddles, like a corn snake */
    const offF = (u, k) => {
      const i = Math.floor(u), r = u - i, j = Math.min(N, i + 1), a2 = off(i, k), b = off(j, k);
      return [a2[0] + (b[0] - a2[0]) * r, a2[1] + (b[1] - a2[1]) * r];
    };
    let bl = "";
    for (let u = 7.5, n = 0; u < N - 3; u += 3.6, n++) {
      const L = 1.9, c = u + L / 2, top = -1.25, bot = n % 2 ? 0.05 : 0.22;
      const p0 = offF(u, bot), p1 = offF(u - 0.35, -0.55), p2 = offF(u + 0.1, top), p3 = offF(c, top - 0.05), p4 = offF(u + L - 0.1, top), p5 = offF(u + L + 0.35, -0.55), p6 = offF(u + L, bot), p7 = offF(c, bot + 0.12);
      bl += `M${f(p0[0])} ${f(p0[1])}C${f(p1[0])} ${f(p1[1])} ${f(p2[0])} ${f(p2[1])} ${f(p3[0])} ${f(p3[1])}C${f(p4[0])} ${f(p4[1])} ${f(p5[0])} ${f(p5[1])} ${f(p6[0])} ${f(p6[1])}Q${f(p7[0])} ${f(p7[1])} ${f(p0[0])} ${f(p0[1])}Z`;
    }
    blotch.setAttribute("d", bl);
    flecks.setAttribute("d", smooth(line(-0.55, 6, N - 1)));
    shine.setAttribute("d", smooth(line(-0.62, 10, N - 2)));
    const end = P[N], pre = P[N - 2], ang = Math.atan2(end[1] - pre[1], end[0] - pre[0]) * 180 / Math.PI;
    head.setAttribute("transform", `translate(${f(end[0] - 9)} ${f(end[1])}) rotate(${f(ang)}) scale(1.28)`);
    halo.setAttribute("transform", `translate(${f(end[0] + 22)} ${f(end[1] - 38 + 3 * Math.sin(t * 0.9))}) rotate(${f(-6 + 4 * Math.sin(t * 0.7))})`);
  }
  /* Drifting */
  let W = 0, H = 0, w = 0, h = 0, x = 0, y = 0, vx = 0, vy = 0, th = 0, a = -6, raf = 0, last = 0, vis = true, drag = null, avoid = [], T = 0;
  let pinA = 0, pinB = 0;
  function measure() {
    W = pin.clientWidth;
    H = pin.clientHeight;
    w = el.offsetWidth;
    h = el.offsetHeight;
    {
      const sc = pin.parentElement, st = sc.getBoundingClientRect().top + scrollY;
      pinA = st;
      pinB = st + sc.offsetHeight - pin.offsetHeight;
    }
    avoid = $$("#heroTitle,.hero__copy .hero__ctas,.livecard,.ship", pin).map((n) => {
      const r = n.getBoundingClientRect(), p = pin.getBoundingClientRect();
      return { l: r.left - p.left - 40, t: r.top - p.top - 40, r: r.right - p.left + 40, b: r.bottom - p.top + 40 };
    });
  }
  measure();
  addEventListener("resize", measure);
  setTimeout(measure, 2500);
  const small = () => W < 700, CRUISE = () => small() ? 7 : 11;
  x = W * (small() ? 0.62 : 0.705);
  y = H * (small() ? 0.14 : 0.26);
  th = Math.PI * (0.85 + Math.random() * 0.3);
  vx = Math.cos(th) * CRUISE();
  vy = Math.sin(th) * CRUISE();
  const place = () => {
    el.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0)`;
    body.style.transform = `rotate(${a.toFixed(2)}deg)`;
  };
  const lerpA = (p, q, k) => {
    let d = Math.atan2(Math.sin(q - p), Math.cos(q - p));
    return p + d * k;
  };
  let fr = 0;
  /* touch screens: the drift (a few px per second) updates ~30 times a second and the soft body reshapes ~5 times a second;
     at this speed it looks the same and halves the work on phones */
  const TOUCH = matchMedia("(hover: none)").matches;
  const DRAW_EVERY = TOUCH ? 6 : PERF === "full" ? 3 : PERF === "balanced" ? 4 : 6;
  const next = () => {
    if (!TOUCH) return requestAnimationFrame(step);
    setTimeout(() => {
      if (raf === -1) raf = requestAnimationFrame(step);
    }, 22);
    return -1;
  };
  function step(now) {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1e3) : 0;
    last = now;
    T += dt;
    /* The body shape changes slowly, so it is redrawn every 3rd frame (full), 4th (balanced) or 6th (lite); the position updates every frame. */
    if (fr++ % DRAW_EVERY === 0) draw(T);
    if (!drag) {
      /* steer gently away from edges and from the title/buttons */
      const pt = Math.max(0, clamp(SY, pinA, pinB)), top = small() ? 98 : innerHeight * 0.186 - pt + h * 0.12, L = W * (small() ? 0.5 : 0.688) + w * 0.05, Rt = W * (small() ? 0.97 : 0.828) - w * 0.05, B = small() ? H * 0.27 - h * 0.42 : innerHeight * 0.447 - pt - h * 0.14, m = Math.max(12, Math.min(small() ? 30 : 40, (Rt - L - w) / 3, (B - top - h) / 3)), cx = x + w / 2, cy = y + h / 2;
      let rx = 0, ry = 0;
      if (x < L + m) rx += (L + m - x) / m;
      if (x + w > Rt - m) rx -= (x + w - (Rt - m)) / m;
      if (y < top + m * 0.5) ry += (top + m * 0.5 - y) / m;
      if (y + h > B - m * 0.5) ry -= (y + h - (B - m * 0.5)) / m;
      avoid.forEach((r) => {
        if (cx > r.l - 60 && cx < r.r + 60 && cy > r.t - 60 && cy < r.b + 60) {
          const ox = cx - (r.l + r.r) / 2, oy = cy - (r.t + r.b) / 2, l = Math.hypot(ox, oy) || 1;
          rx += ox / l * 0.9;
          ry += oy / l * 0.9;
        }
      });
      th += (0.18 * Math.sin(T * 0.11) + 0.12 * Math.sin(T * 0.053 + 1.7)) * dt;
      if (rx || ry) th = lerpA(th, Math.atan2(ry, rx), Math.min(1, dt * 0.9 * Math.min(1.5, Math.hypot(rx, ry))));
      const c = CRUISE(), tx = Math.cos(th) * c, ty = Math.sin(th) * c, k = Math.min(1, dt * 0.55);
      vx += (tx - vx) * k;
      vy += (ty - vy) * k;
      x += vx * dt;
      y += vy * dt;
      x = clamp(x, L, Math.max(L, Rt - w));
      y = clamp(y, top, Math.max(top, B - h));
      /* a slow, lazy turn of the whole body */
      a = -4 + 9 * Math.sin(T * 0.17) + 4 * Math.sin(T * 0.07 + 1.1);
    }
    place();
    if (vis && !gone) raf = next();
  }
  let gone = false;
  function wake() {
    if (!raf && vis && !gone) {
      last = 0;
      raf = requestAnimationFrame(step);
    }
  }
  draw(0);
  place();
  if (RM) {
    vis = false;
  }
  new IntersectionObserver((es) => {
    vis = es[0].isIntersecting && !RM;
    if (vis) {
      measure();
      wake();
    }
  }, { threshold: 0 }).observe(pin);
  const vis2 = () => {
    const g = SY > 8;
    if (g !== gone) {
      gone = g;
      el.classList.toggle("is-gone", g);
      if (!g) wake();
    }
  };
  onScrollWrite(vis2);
  vis2();
  const show = () => {
    el.classList.add("is-on");
    wake();
  };
  setTimeout(show, 600);
})();
