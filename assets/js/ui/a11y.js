/* Accessibility panel, accessibility statement and privacy dialogs, subathon bar, share and the dolphin easter egg.
   Uses the helpers from app.js ($, $$, RM, toast, copyText, goTo, lenis). */

(function() {
  const H = document.documentElement, btn = $("#a11yBtn"), pan = $("#a11yPanel");
  const TOG = ["kbd", "regions", "voice", "light", "dark", "mono", "cmeter", "sathi", "satlo", "readable", "links", "alt", "heads", "struct", "magnify", "cbig", "mask", "guide", "mute", "summary", "vkbd", "dict", "tts", "calm", "quiet", "hl"];
  const ONESHOT = ["struct", "summary"];
  /* These open a sheet once and never stay switched on. */
  const LIM = { fs: [-3, 6], ls: [0, 5], ws: [0, 5], lh: [0, 5] };
  const DEF = () => ({ on: [], fs: 0, ls: 0, ws: 0, lh: 0, hue: 0, cur: "" });
  let st = DEF();
  RMQ.addEventListener && RMQ.addEventListener("change", () => {
    RM = RMQ.matches || st.on.includes("calm");
  });
  try {
    const v = JSON.parse(localStorage.getItem("osvr-a11y2") || "{}");
    if (v && typeof v === "object") {
      st.on = Array.isArray(v.on) ? v.on.filter((k) => TOG.includes(k) && !ONESHOT.includes(k)) : [];
      for (const k in LIM) st[k] = clamp(Math.round(+v[k]) || 0, LIM[k][0], LIM[k][1]);
      st.hue = clamp(Math.round(+v.hue) || 0, 0, 360);
      st.cur = ["", "black", "white"].includes(v.cur) ? v.cur : "";
    }
  } catch (e) {
  }
  const save = () => {
    try {
      localStorage.setItem("osvr-a11y2", JSON.stringify(st));
    } catch (e) {
    }
  };
  const has = (k) => st.on.includes(k);
  const say = (t) => {
    const v = $(".ax-voice");
    v.hidden = false;
    v.textContent = t;
    clearTimeout(say.t);
    say.t = setTimeout(() => {
      if (!has("voice")) v.hidden = true;
    }, 2600);
  };
  /* Apply all settings */
  function apply() {
    TOG.forEach((k) => H.classList.toggle("axon-" + k, has(k)));
    H.classList.toggle("a11y-contrast", has("dark"));
    H.classList.toggle("a11y-calm", has("calm"));
    H.classList.toggle("a11y-links", has("links"));
    $$(".ax__opt").forEach((b) => {
      if (ONESHOT.includes(b.dataset.ax)) b.removeAttribute("aria-pressed");
      else b.setAttribute("aria-pressed", has(b.dataset.ax));
    });
    const f = [];
    if (has("light")) f.push("invert(1) hue-rotate(180deg)");
    if (has("mono")) f.push("grayscale(1)");
    if (has("cmeter")) f.push("contrast(1.45)");
    if (has("sathi")) f.push("saturate(2)");
    if (has("satlo")) f.push("saturate(.35)");
    if (st.hue) f.push(`hue-rotate(${st.hue}deg)`);
    H.style.filter = f.join(" ");
    const z = 1 + st.fs * 0.1;
    H.style.setProperty("--ax-tz", String(z));
    H.classList.toggle("ax-tz-up", z > 1.05);
    H.classList.toggle("ax-tz-xl", z > 1.35);
    document.body.style.zoom = "";
    RM = RMQ.matches || has("calm");
    H.classList.toggle("a11y-rm", RM);
    H.style.setProperty("--ax-ls", st.ls * 0.04 + "em");
    H.style.setProperty("--ax-ws", st.ws * 0.12 + "em");
    H.style.setProperty("--ax-lh", 1.5 + st.lh * 0.25);
    H.classList.toggle("axon-ls", st.ls > 0);
    H.classList.toggle("axon-ws", st.ws > 0);
    H.classList.toggle("axon-lh", st.lh > 0);
    const out = (k, t) => {
      const o = $("#axo-" + k);
      if (o) o.textContent = t;
    };
    out("fs", Math.round(z * 100) + "%");
    ["ls", "ws", "lh"].forEach((k) => out(k, st[k] ? "+" + st[k] : "רגיל"));
    $("#axHue").value = st.hue;
    H.classList.toggle("axon-cur-black", st.cur === "black");
    H.classList.toggle("axon-cur-white", st.cur === "white");
    $$(".ax__seg [data-cur]").forEach((b) => b.setAttribute("aria-checked", b.dataset.cur === st.cur));
    altLabels(has("alt"));
    regions(has("regions"));
    voice(has("voice"));
    vkbd(has("vkbd"));
    if (has("mute")) muteAll();
    if (!has("tts") && "speechSynthesis" in window) speechSynthesis.cancel();
    if (!has("magnify")) tip.style.display = "none";
  }
  /* Open and close */
  const open = (o) => {
    pan.hidden = false;
    requestAnimationFrame(() => pan.classList.toggle("is-open", o));
    btn.setAttribute("aria-expanded", o);
    if (o) {
      let n = 0;
      const f = () => {
        const t = $(".ax__head", pan);
        if (!pan.classList.contains("is-open")) return;
        t.focus();
        if (document.activeElement !== t && n++ < 12) setTimeout(f, 40);
      };
      setTimeout(f, 60);
    } else setTimeout(() => {
      if (!pan.classList.contains("is-open")) pan.hidden = true;
    }, 260);
  };
  btn.addEventListener("click", () => open(!pan.classList.contains("is-open")));
  $("#axClose").addEventListener("click", () => {
    open(false);
    btn.focus();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && pan.classList.contains("is-open") && !document.querySelector("dialog[open]")) {
      open(false);
      btn.focus();
    }
  });
  document.addEventListener("pointerdown", (e) => {
    if (pan.classList.contains("is-open") && !pan.contains(e.target) && !btn.contains(e.target) && !e.target.closest(".ax-sheet,.ax-vkbd")) open(false);
  });
  $$(".ax__head", pan).forEach((h) => h.addEventListener("click", () => {
    const s = h.closest(".ax__sec"), o = !s.classList.contains("is-open");
    s.classList.toggle("is-open", o);
    h.setAttribute("aria-expanded", o);
  }));
  /* Controls */
  const EXCL = { light: ["dark"], dark: ["light"], sathi: ["satlo"], satlo: ["sathi"] };
  $$(".ax__opt").forEach((b) => b.addEventListener("click", () => {
    const k = b.dataset.ax;
    if (k === "struct") {
      sheetStructure();
      return;
    }
    if (k === "summary") {
      sheetSummary();
      return;
    }
    if (k === "voice" && !SR) {
      say("הדפדפן הזה לא תומך בפקודות קוליות");
      return;
    }
    st.on = has(k) ? st.on.filter((x) => x !== k) : [...st.on.filter((x) => !(EXCL[k] || []).includes(x)), k];
    apply();
    save();
  }));
  $$(".ax__step").forEach((row) => $$("button", row).forEach((b) => b.addEventListener("click", () => {
    const k = row.dataset.step;
    st[k] = clamp(st[k] + +b.dataset.d, LIM[k][0], LIM[k][1]);
    apply();
    save();
  })));
  $("#axHue").addEventListener("input", (e) => {
    st.hue = +e.target.value;
    apply();
    save();
  });
  $("#axColorReset").addEventListener("click", () => {
    st.on = st.on.filter((k) => !["light", "dark", "mono", "cmeter", "sathi", "satlo"].includes(k));
    st.hue = 0;
    apply();
    save();
  });
  $$(".ax__seg [data-cur]").forEach((b) => b.addEventListener("click", () => {
    st.cur = b.dataset.cur;
    apply();
    save();
  }));
  $("#a11yReset").addEventListener("click", () => {
    st = DEF();
    apply();
    save();
    say("כל הגדרות הנגישות אופסו");
  });
  /* Sheet: page structure, summary, dictionary */
  const sh = $("#axSheet"), shT = $("#axSheetT"), shB = $(".ax-sheet__body", sh);
  let shFrom = null;
  sh.addEventListener("close", () => {
    const t = shFrom;
    shFrom = null;
    if (t && t.isConnected && document.activeElement === document.body && !t.closest("[hidden]")) t.focus();
  });
  function sheet(title, node) {
    shT.textContent = title;
    shB.replaceChildren(node);
    if (!sh.open) {
      shFrom = document.activeElement;
      try {
        sh.showModal();
      } catch (e) {
        sh.setAttribute("open", "");
      }
    }
  }
  $("[data-close]", sh).addEventListener("click", () => sh.close());
  sh.addEventListener("click", (e) => {
    if (e.target === sh) sh.close();
  });
  const visible = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length) && !el.closest("[hidden],.ax,.ax-sheet,dialog:not([open])");
  const goTo = (el) => {
    sh.close();
    open(false);
    const y = el.getBoundingClientRect().top + scrollY - 90;
    typeof lenis !== "undefined" && lenis ? lenis.scrollTo(y, { duration: 1 }) : scrollTo({ top: y, behavior: "smooth" });
    el.setAttribute("tabindex", "-1");
    setTimeout(() => el.focus({ preventScroll: true }), 700);
  };
  function sheetStructure() {
    const ol = document.createElement("ol");
    ol.className = "ax-list";
    $$("main h1,main h2,main h3,section h2,section h3,footer h2").filter(visible).forEach((h) => {
      const li = document.createElement("li");
      li.className = "lv" + h.tagName[1];
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = h.textContent.replace(/\s+/g, " ").trim();
      b.addEventListener("click", () => goTo(h));
      li.append(b);
      ol.append(li);
    });
    sheet("מבנה העמוד", ol);
  }
  function sheetSummary() {
    const d = document.createElement("div");
    d.className = "ax-sum";
    const p = document.createElement("p");
    p.textContent = "האתר הרשמי של OdedSVR, סטרימר ב-Kick. כאן תמצאו את:";
    d.append(p);
    const ul = document.createElement("ul");
    $$("main > section, main section[id], footer").filter((s) => s.id && visible(s)).forEach((s) => {
      const h = $("h2,h3", s);
      if (!h) return;
      const intro = $(".sec__intro,p", s);
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.type = "button";
      b.innerHTML = "";
      const t = document.createElement("strong");
      t.textContent = h.textContent.trim();
      b.append(t);
      if (intro && intro.textContent.trim()) {
        const sp = document.createElement("span");
        sp.textContent = " · " + intro.textContent.trim().slice(0, 120);
        b.append(sp);
      }
      b.addEventListener("click", () => goTo(s));
      li.append(b);
      ul.append(li);
    });
    d.append(ul);
    sheet("סיכום העמוד", d);
  }
  /* Image descriptions */
  function altLabels(on) {
    $$(".ax-alt").forEach((x) => x.remove());
    if (!on) return;
    $$("img[alt]").filter((i) => i.alt.trim() && visible(i)).forEach((i) => {
      const s = document.createElement("span");
      s.className = "ax-alt";
      s.textContent = i.alt;
      const p = i.parentElement;
      if (getComputedStyle(p).position === "static") p.style.position = "relative";
      p.append(s);
    });
  }
  /* Region navigation */
  const REG = [["#top", "ראש הדף"], ["#collabs", "שיתופי פעולה"], ["#links", "לינקים"], ["#videos", "סרטונים"], ["#leaderboard", "לידרבורד"], ["#info", "סטאפ ופקודות"], ["footer", "סוף הדף"]];
  const regBox = $(".ax-regions");
  REG.forEach(([sel, l], i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = `${i + 1}. ${l}`;
    b.addEventListener("click", () => {
      const el = $(sel) || document.body;
      goTo(el);
    });
    regBox.append(b);
  });
  function regions(on) {
    regBox.hidden = !on;
  }
  document.addEventListener("keydown", (e) => {
    if (!has("regions") && !has("kbd")) return;
    if (e.altKey && /^[1-7]$/.test(e.key)) {
      e.preventDefault();
      const r = REG[+e.key - 1];
      const el = $(r[0]);
      if (el) goTo(el);
    }
  });
  /* Keyboard navigation: every card and tile is focusable */
  const kbdTargets = () => $$(".vid,.link,.spw__panel,.row,.pod,.cmd");
  H.addEventListener("ax-kbd", () => {
  });
  new MutationObserver(() => {
    if (has("kbd")) kbdTargets().forEach((el) => {
      if (!el.hasAttribute("tabindex") && !/^(A|BUTTON)$/.test(el.tagName)) el.tabIndex = 0;
    });
  }).observe(H, { attributes: true, attributeFilter: ["class"] });
  /* Voice commands */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null;
  const CMD = [
    [/למטה|גלול/, () => scrollBy({ top: innerHeight * 0.8, behavior: "smooth" })],
    [/למעלה/, () => scrollBy({ top: -innerHeight * 0.8, behavior: "smooth" })],
    [/התחלה|ראש/, () => goTo($("#top") || document.body)],
    [/שיתופי|ספונסר|שותפ/, () => goTo($("#collabs"))],
    [/לינק|קישור/, () => goTo($("#links"))],
    [/סרטונ|וידאו/, () => goTo($("#videos"))],
    [/לידרבורד|גיפט/, () => goTo($("#leaderboard"))],
    [/סטאפ|פקוד/, () => goTo($("#info"))],
    [/קיק|שידור/, () => window.open("https://kick.com/" + DATA.channel, "_blank", "noopener")],
    [/סגור|עצור/, () => {
      st.on = st.on.filter((k) => k !== "voice");
      apply();
      save();
    }]
  ];
  function voice(on) {
    const box = $(".ax-voice");
    if (!SR) {
      return;
    }
    if (on && !rec) {
      rec = new SR();
      rec.lang = "he-IL";
      rec.continuous = true;
      rec.interimResults = false;
      rec.onresult = (e) => {
        const t = e.results[e.results.length - 1][0].transcript.trim();
        const c = CMD.find(([r]) => r.test(t));
        say(c ? "✓ " + t : "לא זוהה: " + t);
        if (c) c[1]();
      };
      rec.onend = () => {
        if (has("voice") && rec) try {
          rec.start();
        } catch (e) {
        }
      };
      rec.onerror = () => {
      };
      try {
        rec.start();
        box.hidden = false;
        box.textContent = 'מקשיב… אמרו "סרטונים", "למטה", "סגור"';
      } catch (e) {
      }
    }
    if (!on && rec) {
      const r = rec;
      rec = null;
      try {
        r.stop();
      } catch (e) {
      }
      box.hidden = true;
    }
  }
  /* Magnifier */
  const tip = $(".ax-tip");
  document.addEventListener("pointermove", (e) => {
    if (has("mask") || has("guide")) {
      H.style.setProperty("--ax-y", e.clientY + "px");
    }
    if (!has("magnify")) return;
    const el = e.target.closest("h1,h2,h3,h4,p,li,a,button,span,label,b,strong,small,output");
    if (!el || el.closest(".ax,.ax-tip")) {
      tip.style.display = "none";
      return;
    }
    const t = (el.innerText || "").replace(/\s+/g, " ").trim();
    if (!t || t.length > 220) {
      tip.style.display = "none";
      return;
    }
    tip.textContent = t;
    tip.style.display = "block";
    const x = Math.min(innerWidth - tip.offsetWidth - 12, Math.max(12, e.clientX - tip.offsetWidth / 2));
    tip.style.transform = `translate(${x}px,${Math.max(12, e.clientY - tip.offsetHeight - 24)}px)`;
  }, { passive: true });
  /* Media, text-to-speech, dictionary */
  function muteAll() {
    $$("video,audio").forEach((m) => {
      m.muted = true;
      try {
        m.pause();
      } catch (e) {
      }
    });
  }
  document.addEventListener("play", (e) => {
    if (has("mute") && e.target.matches("video,audio")) {
      e.target.muted = true;
    }
  }, true);
  function speak(t) {
    if (!("speechSynthesis" in window) || !t) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.lang = "he-IL";
    u.rate = 1;
    const v = speechSynthesis.getVoices().find((v2) => /^he/i.test(v2.lang));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest(".ax,.ax-sheet,#a11yBtn,.ax-vkbd")) return;
    if (has("tts")) {
      const sel = String(getSelection() || "").trim();
      const el = e.target.closest("h1,h2,h3,p,li,a,button,.row,.pod,.vid,.link,span");
      const t = sel || el && (el.innerText || el.getAttribute("aria-label") || "").trim();
      if (t) {
        speak(t.slice(0, 600));
      }
    }
  }, true);
  document.addEventListener("dblclick", (e) => {
    if (!has("dict") || e.target.closest(".ax,.ax-sheet")) return;
    const w = String(getSelection() || "").trim().replace(/[^\p{L}\p{N}'"\-]/gu, "");
    if (!w) return;
    const d = document.createElement("div");
    d.className = "ax-dict";
    const h = document.createElement("p");
    h.className = "ax-dict__w";
    h.textContent = w;
    d.append(h);
    const heb = /[֐-׿]/.test(w);
    [[heb ? "מורפיקס" : "Morfix", `https://www.morfix.co.il/${encodeURIComponent(w)}`], ["ויקימילון", `https://he.wiktionary.org/wiki/${encodeURIComponent(w)}`], ["Google Translate", `https://translate.google.com/?sl=auto&tl=${heb ? "en" : "iw"}&text=${encodeURIComponent(w)}`]].forEach(([l, u]) => {
      const a = document.createElement("a");
      a.href = u;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = l + " ↗";
      d.append(a);
    });
    if ("speechSynthesis" in window) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = "🔊 השמעה";
      b.addEventListener("click", () => speak(w));
      d.append(b);
    }
    sheet("מילון", d);
  });
  const kb = $(".ax-vkbd");
  let kbTarget = null;
  document.addEventListener("focusin", (e) => {
    if (e.target.matches('input:not([type=range]):not([type=checkbox]),textarea,[contenteditable="true"]')) kbTarget = e.target;
  });
  const ROWS = [["/", "'", "ק", "ר", "א", "ט", "ו", "ן", "ם", "פ"], ["ש", "ד", "ג", "כ", "ע", "י", "ח", "ל", "ך", "ף"], ["ז", "ס", "ב", "ה", "נ", "מ", "צ", "ת", "ץ", "."], ["⌫", "רווח", "↵", "EN"]];
  const ROWS_EN = [["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], ["a", "s", "d", "f", "g", "h", "j", "k", "l", "@"], ["z", "x", "c", "v", "b", "n", "m", ",", ".", "-"], ["⌫", "רווח", "↵", "עב"]];
  let en = false;
  function drawKb() {
    kb.replaceChildren();
    const hd = document.createElement("div");
    hd.className = "ax-vkbd__hd";
    hd.textContent = kbTarget ? "מקלדת וירטואלית" : "מקלדת וירטואלית — לחצו קודם על שדה טקסט";
    kb.append(hd);
    (en ? ROWS_EN : ROWS).forEach((r) => {
      const row = document.createElement("div");
      row.className = "ax-vkbd__r";
      r.forEach((k) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = k;
        if (k.length > 1) b.className = "w";
        b.addEventListener("mousedown", (e) => e.preventDefault());
        b.addEventListener("click", () => key(k));
        row.append(b);
      });
      kb.append(row);
    });
  }
  function key(k) {
    if (k === "EN" || k === "עב") {
      en = !en;
      drawKb();
      return;
    }
    const t = kbTarget;
    if (!t) return;
    t.focus();
    const ins = (s) => {
      if (typeof t.setRangeText === "function") {
        const a = t.selectionStart, b = t.selectionEnd;
        t.setRangeText(s, a, b, "end");
      } else document.execCommand("insertText", false, s);
      t.dispatchEvent(new Event("input", { bubbles: true }));
    };
    if (k === "⌫") {
      if (typeof t.setRangeText === "function") {
        const a = t.selectionStart, b = t.selectionEnd;
        if (a === b && a > 0) t.setRangeText("", a - 1, a, "end");
        else t.setRangeText("", a, b, "end");
        t.dispatchEvent(new Event("input", { bubbles: true }));
      }
      return;
    }
    if (k === "רווח") return ins(" ");
    if (k === "↵") {
      if (t.form) t.form.requestSubmit ? t.form.requestSubmit() : t.form.submit();
      else ins("\n");
      return;
    }
    ins(k);
  }
  function vkbd(on) {
    kb.hidden = !on;
    if (on) drawKb();
  }
  try {
    if (!localStorage.getItem("osvr-a11y-seen")) {
      btn.classList.add("is-hint");
      setTimeout(() => btn.classList.remove("is-hint"), 6e3);
      localStorage.setItem("osvr-a11y-seen", "1");
    }
  } catch (e) {
  }
  apply();
})();
