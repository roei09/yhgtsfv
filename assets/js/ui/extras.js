/* Statement and privacy dialogs, subathon bar, share, the dolphin easter egg, offers, phone sponsor layout, leaderboard tab scroll */
(function() {
  let opener = null;
  const open = (k) => {
    const d = $("#doc-" + k);
    if (!d || d.open) return;
    opener = document.activeElement && document.activeElement !== document.body ? document.activeElement : null;
    try {
      d.showModal();
    } catch (e) {
      d.setAttribute("open", "");
    }
    d.querySelector(".doc__x").focus();
  };
  const back = () => {
    const t = opener;
    opener = null;
    const ok = t && t.isConnected && !t.closest("[hidden],.ax:not(.is-open)") && (t.offsetWidth || t.offsetHeight);
    (ok ? t : $("#a11yBtn") || document.body).focus({ preventScroll: !ok });
  };
  $$("[data-doc]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    const p = $("#a11yPanel");
    if (p && p.classList.contains("is-open")) $("#a11yBtn").click();
    open(a.dataset.doc);
    try {
      history.replaceState(null, "", "#" + a.dataset.doc);
    } catch (_) {
    }
  }));
  $$(".doc").forEach((d) => {
    d.addEventListener("click", (e) => {
      if (e.target === d) d.close();
    });
    $("[data-close]", d).addEventListener("click", () => d.close());
    d.addEventListener("close", () => {
      setTimeout(back, 0);
      if (/^#(accessibility|privacy)$/.test(location.hash)) try {
        history.replaceState(null, "", location.pathname + location.search);
      } catch (_) {
      }
    });
  });
  const h = location.hash.slice(1);
  if (h === "accessibility" || h === "privacy") open(h);
  addEventListener("hashchange", () => {
    const k = location.hash.slice(1);
    if (k === "accessibility" || k === "privacy") open(k);
  });
})();
(function() {
  const bar = $("#subbar"), out = $("#subDays"), t = Date.parse(DATA.subathon);
  if (!bar) return;
  if (!Number.isFinite(t)) {
    bar.remove();
    return;
  }
  document.body.classList.add("has-subbar");
  new MutationObserver((_, o) => {
    if (!bar.isConnected) {
      document.body.classList.remove("has-subbar");
      o.disconnect();
    }
  }).observe(bar.parentNode, { childList: true });
  const il = new Intl.DateTimeFormat("he-IL", { timeZone: "Asia/Jerusalem", day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date(t)).reduce((o, p) => (o[p.type] = p.value, o), {});
  $("#subLbl").textContent = `הסאבתון מתחיל ב-${il.day}.${il.month} בשעה ${il.hour}:${il.minute}`;
  const p2 = (n) => String(n).padStart(2, "0");
  let iv;
  const tick = () => {
    const ms = t - Date.now();
    if (ms <= 0) {
      clearInterval(iv);
      bar.remove();
      return;
    }
    const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
    out.textContent = (d > 0 ? `עוד ${d === 1 ? "יום" : d + " ימים"} · ` : "עוד ") + `${p2(h)}:${p2(m)}:${p2(s)}`;
  };
  tick();
  iv = setInterval(() => {
    if (!document.hidden) tick();
  }, 1e3);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) tick();
  });
})();
$("#shareBtn").addEventListener("click", async () => {
  const url = "https://odedsvr.com/";
  try {
    if (navigator.share) {
      await navigator.share({ title: "OdedSVR", text: "הבית הרשמי של OdedSVR", url });
      return;
    }
  } catch (e) {
    if (e && e.name === "AbortError") return;
  }
  copyText(url, null, "הקישור הועתק");
});
(function() {
  let n = 0, tm;
  const d = $("#dolphin");
  if (!d) return;
  const splash = () => {
    toast("פיסטוקי פוסטקה 🐬");
    if (RM) return;
    const cols = ["#3fd2ff", "#a06bff", "#eef2ff", "#53fc18"];
    for (let i = 0; i < 70; i++) {
      const c = document.createElement("i");
      c.className = "drop";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = cols[i % 4];
      document.body.appendChild(c);
      c.animate([{ transform: "translateY(0)" }, { transform: `translateY(${innerHeight + 40}px) translateX(${(Math.random() - 0.5) * 160}px)` }], { duration: 1500 + Math.random() * 1300, easing: "cubic-bezier(.3,.1,.5,1)", delay: Math.random() * 300 }).onfinish = () => c.remove();
    }
  };
  const hit = () => {
    n++;
    clearTimeout(tm);
    tm = setTimeout(() => n = 0, 1500);
    if (!RM) d.animate([{ transform: "scale(.9) rotate(6deg)" }, { transform: "none" }], { duration: 350, easing: "cubic-bezier(.22,1,.36,1)" });
    if (n >= 5) {
      n = 0;
      splash();
    }
  };
  d.addEventListener("click", hit);
  d.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      hit();
    }
  });
})();
const IDLE = window.requestIdleCallback ? (f) => requestIdleCallback(f, { timeout: 1200 }) : (f) => setTimeout(f, 300);
(function() {
  const D = DATA.deals || {};
  $$(".deal__terms[data-deal]").forEach((p) => {
    const d = D[p.dataset.deal] || {};
    const until = Date.parse(d.until || "");
    if (Number.isFinite(until)) {
      const u = $(".deal__until", p);
      const end = until + 864e5;
      if (Date.now() > end) {
        const box = p.closest(".spw__panel");
        box && $$(".lcode", box).forEach((c) => c.classList.add("is-expired"));
        u.textContent = "ההטבה הסתיימה. ";
      } else u.textContent = `בתוקף עד ${new Date(until).toLocaleDateString("he-IL", { day: "numeric", month: "numeric", year: "numeric" })}. `;
    }
    if (/^https:\/\//.test(d.terms || "")) {
      const a = document.createElement("a");
      a.href = d.terms;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = "לתנאים המלאים";
      $(".deal__more", p).appendChild(a);
    }
  });
})();
(function() {
  const T = document.getElementById("collabs"), menu = document.getElementById("tmenu");
  if (!T || !menu) return;
  const mq = matchMedia("(max-width:860px)"), H = document.documentElement;
  const tx = (el) => {
    const v = getComputedStyle(el).translate;
    if (!v || v === "none") return 0;
    const p = v.split(" ")[0];
    return p.endsWith("%") ? parseFloat(p) / 100 * el.offsetWidth : parseFloat(p) || 0;
  };
  let sig = "";
  function fit() {
    if (!mq.matches || H.classList.contains("tour-stack")) {
      T.classList.remove("has-zones");
      sig = "";
      return;
    }
    const slides = $$(".spw", T).map((s) => ({ s, p: $(".spw__panel", s), pz: $(".pzi", s), cw: $(".cpw", s) })).filter((o) => o.p);
    const wasOn = T.classList.contains("has-zones");
    if (!wasOn) T.classList.add("has-zones");
    const vw = T.clientWidth, sk = $(".tour__skip", T), skOn = sk && sk.offsetParent !== null && sk.offsetHeight > 0, top = skOn ? sk.offsetTop + sk.offsetHeight + 10 : menu.offsetTop + menu.offsetHeight + 12;
    slides.forEach((o) => {
      o.h = Math.max(150, o.p.offsetTop - top - 14);
    });
    const key = vw + "|" + innerHeight + "|" + top + "|" + slides.map((o) => o.h).join(",") + "|" + (H.getAttribute("style") || "");
    if (key === sig && wasOn) return;
    sig = key;
    slides.forEach((o) => {
      o.s.style.setProperty("--zT", top + "px");
      o.s.style.setProperty("--zH", o.h + "px");
    });
    slides.forEach((o) => {
      const h = o.h;
      if (o.pz) {
        o.sg = $(".psg", o.pz);
        if (o.sg) {
          o.sgW = Math.min(vw * 0.92, h * 1.62);
          o.sgX0 = o.pz.offsetLeft + tx(o.pz);
          o.sgTop = o.pz.offsetTop;
        }
      }
      if (o.cw) {
        o.pk = $(".cpk", o.cw);
        o.pd = $(".cpod", o.cw);
        if (o.pk && o.pd) {
          o.k = Math.min(0.52 * h, 0.5 * vw);
          o.cx = vw / 2 - (o.cw.offsetLeft + tx(o.cw));
          o.bottom = o.cw.offsetHeight - (top + h - o.cw.offsetTop) + 0.03 * h;
        }
      }
    });
    slides.forEach((o) => {
      const h = o.h;
      if (o.sg) {
        const w = o.sgW;
        o.sg.style.setProperty("--sgW", w + "px");
        o.sg.style.setProperty("--sgL", vw / 2 - o.sgX0 + "px");
        o.sg.style.setProperty("--sgT", top + h / 2 - 0.38 * w - o.sgTop + "px");
      }
      if (o.pk && o.pd) {
        const k = o.k, cx = o.cx, bottom = o.bottom;
        o.pk.style.setProperty("--pkW", k + "px");
        o.pk.style.setProperty("--pkL", cx - k / 2 + "px");
        o.pk.style.setProperty("--pkB", bottom + 0.471 * k + "px");
        o.pd.style.setProperty("--pdW", 1.714 * k + "px");
        o.pd.style.setProperty("--pdL", cx - 0.857 * k + "px");
        o.pd.style.setProperty("--pdB", bottom + "px");
      }
    });
  }
  let q = 0;
  const later = () => {
    cancelAnimationFrame(q);
    q = requestAnimationFrame(fit);
  };
  addEventListener("resize", later, { passive: true });
  mq.addEventListener && mq.addEventListener("change", later);
  let stk = H.classList.contains("tour-stack"), sty = H.getAttribute("style");
  new MutationObserver(() => {
    const a = H.classList.contains("tour-stack"), b = H.getAttribute("style");
    if (a !== stk || b !== sty) {
      stk = a;
      sty = b;
      later();
    }
  }).observe(H, { attributes: true, attributeFilter: ["class", "style"] });
  addEventListener("load", later);
  document.fonts && document.fonts.ready.then(later);
  later();
})();
(function() {
  const wrap = $("#leaderboard .tabs-wrap"), lb = $("#lbTab");
  if (!wrap || !lb) return;
  $$("#leaderboard .tab").forEach((t) => t.addEventListener("click", () => requestAnimationFrame(() => {
    const under = wrap.getBoundingClientRect().bottom + 8, top = lb.getBoundingClientRect().top;
    if (top < under - 4) {
      const y = scrollY + top - under;
      if (lenis) lenis.scrollTo(y, { duration: 0.5 });
      else scrollTo({ top: y, behavior: RM ? "auto" : "smooth" });
    }
    {
      const tb = t.parentElement, tr = t.getBoundingClientRect(), br = tb.getBoundingClientRect();
      if (tr.left < br.left) tb.scrollLeft -= br.left - tr.left + 12;
      else if (tr.right > br.right) tb.scrollLeft += tr.right - br.right + 12;
    }
  })));
})();
