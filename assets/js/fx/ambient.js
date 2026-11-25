/* Scene depth, headings and the dolphin */
IDLE(function() {
  const fine = matchMedia("(pointer:fine)").matches;
  /* Scroll depth: each scene's layers drift at their own speed */
  const scenes = $$(".frame--lake").map((s) => ({ s, L: [[$(".pod2", s), 34, 0.4]].filter((x) => x[0]) })), live = /* @__PURE__ */ new Set();
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const o = scenes.find((x) => x.s === e.target);
    e.isIntersecting ? live.add(o) : live.delete(o);
  }), { rootMargin: "120px 0px" });
  scenes.forEach((o) => io.observe(o.s));
  const dp = /* @__PURE__ */ new Map();
  const depthRead = () => {
    if (RM) return;
    const vh = innerHeight;
    live.forEach((o) => {
      const r = o.s.getBoundingClientRect();
      dp.set(o, clamp((r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2), -1, 1));
    });
  };
  const depthWrite = () => {
    if (RM) return;
    live.forEach((o) => {
      const p = dp.get(o);
      if (p === void 0) return;
      o.L.forEach(([el, k, off]) => {
        el.style.translate = `0 ${((p + (off || 0)) * k).toFixed(1)}px`;
      });
    });
  };
  onScrollRead(depthRead);
  onScrollWrite(depthWrite);
  depthRead();
  depthWrite();
  /* Headings rise word by word */
  const heads = $$(".frame .h2,.foot2__h,.tour__title");
  heads.forEach((h) => {
    let i = 0;
    const walk = (n) => {
      [...n.childNodes].forEach((c) => {
        if (c.nodeType === 3) {
          const parts = c.textContent.split(/(\s+)/);
          const f = document.createDocumentFragment();
          parts.forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) {
              f.appendChild(document.createTextNode(p));
              return;
            }
            const w = document.createElement("span");
            w.className = "w";
            w.style.setProperty("--i", i++);
            w.textContent = p;
            f.appendChild(w);
          });
          c.replaceWith(f);
        } else if (c.nodeType === 1) walk(c);
      });
    };
    walk(h);
    h.classList.add("wsplit");
  });
  const hio = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("w-in");
      hio.unobserve(e.target);
    }
  }), { threshold: 0.3 });
  heads.forEach((h) => hio.observe(h));
  /* The astronaut dolphin: a tap rolls it and blows bubbles */
  const astro = $("#astro");
  if (astro) {
    let n = 0, tm, busy = false;
    const inn = $(".astro__in", astro), frame = astro.parentElement;
    astro.addEventListener("click", () => {
      n++;
      clearTimeout(tm);
      tm = setTimeout(() => n = 0, 1600);
      if (!RM && !busy) {
        busy = true;
        inn.animate([{ transform: "rotate(0) scale(1)" }, { transform: "rotate(-200deg) scale(1.08)", offset: 0.55 }, { transform: "rotate(-360deg) scale(1)" }], { duration: 900, easing: "cubic-bezier(.45,0,.2,1)" }).onfinish = () => busy = false;
        const r = astro.getBoundingClientRect(), f = frame.getBoundingClientRect();
        for (let i = 0; i < 10; i++) {
          const b = document.createElement("span");
          b.className = "bub";
          const sz = 6 + Math.random() * 16;
          b.style.setProperty("--b", sz + "px");
          const x = r.left - f.left + r.width * (0.25 + Math.random() * 0.5), y = r.top - f.top + r.height * 0.25;
          b.style.left = x + "px";
          b.style.top = y + "px";
          frame.appendChild(b);
          b.animate([{ transform: "translate3d(0,0,0) scale(.3)", opacity: 1 }, { transform: `translate3d(${(Math.random() - 0.5) * 160}px,${-60 - Math.random() * 140}px,0) scale(1)`, opacity: 0 }], { duration: 1400 + Math.random() * 900, easing: "cubic-bezier(.2,.7,.3,1)" }).onfinish = () => b.remove();
        }
      }
      if (n >= 5) {
        n = 0;
        if (typeof toast === "function") toast("פיסטוקי פוסטקה 🐬");
      }
    });
  }
});

/* Aurora, motes and hyperspace */
IDLE(function() {
  if (document.documentElement.classList.contains("lite")) return;
  const A = [];
  A.forEach((s) => $$(s).forEach((f) => {
    const a = document.createElement("div");
    a.className = "aurora";
    a.setAttribute("aria-hidden", "true");
    a.innerHTML = "<i></i><i></i><i></i>";
    f.insertBefore(a, f.firstChild.nextSibling);
  }));
  const pal = { "frame--lake": ["#fff", "rgba(255,200,250,.7)"], "frame--desert": ["#fff6d8", "rgba(255,220,140,.6)"], "spw--pay": ["#fff6d8", "rgba(255,220,140,.6)"], "spw--luz": ["#fff", "rgba(255,200,250,.7)"] };
  $$(".scene__pin").forEach((f) => {
    const m = document.createElement("div");
    m.className = "motes";
    m.setAttribute("aria-hidden", "true");
    const k = Object.keys(pal).find((c2) => f.classList.contains(c2)), c = k ? pal[k] : ["#e8fbff", "rgba(166,236,255,.6)"];
    const n = innerWidth < 700 ? 5 : 9;
    let h = "";
    for (let i = 0; i < n; i++) {
      const s = (1.5 + Math.random() * 3.5).toFixed(1);
      h += `<span class="mote" style="--x:${(Math.random() * 100).toFixed(1)}%;--y:${(10 + Math.random() * 80).toFixed(1)}%;--s:${s}px;--d:${(9 + Math.random() * 10).toFixed(1)}s;--dl:${(-Math.random() * 18).toFixed(1)}s;--dx:${((Math.random() - 0.5) * 160).toFixed(0)}px;--dy:${(-40 - Math.random() * 140).toFixed(0)}px;--o:${(0.5 + Math.random() * 0.5).toFixed(2)};--mc:${c[0]};--mg:${c[1]}"></span>`;
    }
    m.innerHTML = h;
    f.appendChild(m);
  });
});

/* Hero depth: star layers follow the pointer at different depths */
(function() {
  const pin = $(".scene__pin"), A = $(".starlayer--a"), B = $(".starlayer--b");
  if (!pin || !A || RM || !matchMedia("(pointer:fine)").matches) return;
  let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
  const loop = () => {
    x += (tx - x) * 0.06;
    y += (ty - y) * 0.06;
    A.style.transform = `translate3d(${(x * -10).toFixed(2)}px,${(y * -8).toFixed(2)}px,0)`;
    B.style.transform = `translate3d(${(x * -24).toFixed(2)}px,${(y * -18).toFixed(2)}px,0)`;
    raf = Math.abs(tx - x) + Math.abs(ty - y) > 2e-3 ? requestAnimationFrame(loop) : 0;
  };
  pin.addEventListener("pointermove", (e) => {
    tx = e.clientX / innerWidth - 0.5;
    ty = e.clientY / innerHeight - 0.5;
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
})();
window.__ws = [document.getElementById("warpStars"), document.getElementById("warpStarsB")];
if (!__ws[0]) window.__ws = null;
