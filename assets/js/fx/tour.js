/* Sponsor tour: one full screen; partners change only with the arrows, dots, arrow keys or a swipe (the mouse wheel just scrolls the page) */
(function() {
  const T = $("#collabs");
  if (!T || !T.classList.contains("tour")) return;
  const ws = $$(".spw", T), n = ws.length, dots = $$(".tdot", T);
  let cur = -1, top0 = 0;
  const measure = () => {
    top0 = T.getBoundingClientRect().top + scrollY;
  };
  const SQ = matchMedia("(max-height:500px)");
  let stack = false;
  function setStack() {
    stack = SQ.matches;
    document.documentElement.classList.toggle("tour-stack", stack);
    ws.forEach((w, k) => {
      const on = stack || k === cur;
      w.setAttribute("aria-hidden", String(!on));
      w.inert = !on;
    });
    T.setAttribute("aria-roledescription", stack ? "רשימת שותפים" : "קרוסלה");
    ws.forEach((w) => stack ? w.removeAttribute("aria-roledescription") : w.setAttribute("aria-roledescription", "שקופית"));
  }
  SQ.addEventListener && SQ.addEventListener("change", () => {
    setStack();
    measure();
  });
  /* CardPull: keep the booster box in the shop picture fully clear of the info panel (box spans 40.6% to 47.9% of the picture) */
  const shop = $(".cpw", T), shopPanel = $(".cpw__panel", T);
  function fitShop() {
    if (!shop || !shopPanel) return;
    if (innerWidth < 900 || stack) {
      shop.style.removeProperty("--L");
      return;
    }
    const W = Math.max(innerWidth, innerHeight * 2560 / 1086), pl = shopPanel.getBoundingClientRect().left;
    if (!(pl > 0)) return;
    const L0 = Math.min(0, Math.max(innerWidth - W, innerWidth / 2 - W * 0.3));
    /* already fully behind the panel (taller screens): leave the picture where it is */
    if (L0 + W * 0.4065 >= pl + 16) {
      shop.style.removeProperty("--L");
      return;
    }
    const L = Math.min(0, Math.max(innerWidth - W, pl - 24 - W * 0.479));
    shop.style.setProperty("--L", L.toFixed(1) + "px");
  }
  function set(i) {
    if (i === cur) return;
    const old = cur;
    cur = i;
    ws.forEach((w, k) => {
      const on = k === i;
      if (k === old && !on) {
        w.classList.add("is-leaving");
        setTimeout(() => w.classList.remove("is-leaving"), 450);
      }
      w.classList.toggle("is-on", on);
      w.classList.toggle("is-past", k < i);
      if (!stack) {
        w.setAttribute("aria-hidden", String(!on));
        w.inert = !on;
      }
    });
    dots.forEach((d, k) => d.setAttribute("aria-current", String(k === i)));
    if (old >= 0 && !stack) {
      const lv = $("#tourLive");
      if (lv) lv.textContent = `שותף ${i + 1} מתוך ${n}: ${dots[i] ? dots[i].getAttribute("aria-label") : ""}`;
    }
    {
      const cb = T.querySelector(".tour__cnt b");
      if (cb) cb.textContent = i + 1;
    }
    if (i > 0) {
      T.classList.remove("is-new");
      T.classList.add("has-moved");
    }
    T.classList.toggle("is-last", i === n - 1);
    T.classList.toggle("is-first", i === 0);
    T.classList.toggle("is-luz", i === 0 || i === n - 1);
    if (ws[i] && ws[i].id === "cardpull") {
      fitShop();
      setTimeout(fitShop, 650);
    }
  }
  function goI(i) {
    set(Math.max(0, Math.min(n - 1, i)));
  }
  addEventListener("resize", () => {
    measure();
    if (ws[cur] && ws[cur].id === "cardpull") fitShop();
  });
  addEventListener("load", measure);
  if (window.ResizeObserver) new ResizeObserver(() => {
    measure();
  }).observe(document.body);
  const pv = $("#tourPrev"), nx = $("#tourNext");
  pv && pv.addEventListener("click", () => {
    measure();
    goI(cur - 1);
  });
  nx && nx.addEventListener("click", () => {
    measure();
    goI(cur + 1);
  });
  dots.forEach((d, k) => d.addEventListener("click", () => {
    measure();
    goI(k);
  }));
  T.addEventListener("keydown", (e) => {
    if (stack || e.target.closest(".spin3,.tee3")) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      measure();
      goI(cur + 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      measure();
      goI(cur - 1);
    }
  });
  /* touch: a horizontal swipe also steps (RTL: swipe left → next) */
  let sx = null, sy = 0;
  T.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" || e.target.closest(".spin3,a,button")) return;
    sx = e.clientX;
    sy = e.clientY;
  }, { passive: true });
  T.addEventListener("pointerup", (e) => {
    if (sx === null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    sx = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      measure();
      goI(cur + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });
  measure();
  set(0);
  setStack();
  /* direct links: #luz, #mahsanei-hashmal, #libero, #cardpull open that partner */
  window.__tourGo = (k) => {
    measure();
    if (stack) {
      ws[k].scrollIntoView({ behavior: RM ? "auto" : "smooth" });
      return;
    }
    goI(k);
    const y = top0;
    if (Math.abs(scrollY - y) > 4) {
      if (typeof lenis !== "undefined" && lenis) lenis.scrollTo(y);
      else scrollTo({ top: y, behavior: RM ? "auto" : "smooth" });
    }
  };
  const fromHash = () => {
    const w = location.hash.length > 1 && ws.find((x) => x.id === location.hash.slice(1));
    if (!w) return;
    measure();
    const k = +w.dataset.i;
    if (stack) {
      w.scrollIntoView();
      return;
    }
    set(k);
    scrollTo(0, top0);
  };
  addEventListener("hashchange", fromHash);
  if (location.hash) addEventListener("load", () => setTimeout(fromHash, 0));
})();
