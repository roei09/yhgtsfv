/* Links, videos, business contact and the leaderboard */
{
  const lg = $("#linksGrid");
  const html = DATA.links.map((l) => {
    const a = APP[l.key];
    return `<a class="link reveal ${l.main ? "link--main" : ""}" style="--lc:${/^#[0-9a-f]{3,8}$/i.test(l.color) ? l.color : "#a06bff"}" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer"><span class="app" aria-hidden="true" style="--tile:${a.tile};--side:${a.side};--shadow:${a.sh}"><span class="app__side"></span><span class="app__tile"></span><span class="app__glyph">${a.g}</span></span>
    <span><b>${esc(l.name)}</b><small>${esc(l.main ? l.sub : l.handle)}</small></span>${l.main ? '<span class="link__cta" aria-hidden="true">לצפייה בשידור ←</span>' : ""}${ICONS.arrow}</a>`;
  }).join("");
  const same = [...lg.querySelectorAll("a.link")].map((a) => a.getAttribute("href")).join("|") === DATA.links.map((l) => l.url).join("|") && !!lg.querySelector(".link__cta");
  if (!same) lg.innerHTML = html;
}
if (FINE && !RM) $$(".link").forEach((el) => {
  const app = $(".app", el);
  let r = null;
  el.addEventListener("pointerenter", () => {
    r = el.getBoundingClientRect();
  });
  let ax = null, q = 0, ex = 0, ey = 0;
  el.addEventListener("pointerenter", () => {
    ax = app.getBoundingClientRect();
  });
  el.addEventListener("pointermove", (e) => {
    if (!r) r = el.getBoundingClientRect();
    if (!ax) ax = app.getBoundingClientRect();
    ex = e.clientX;
    ey = e.clientY;
    if (!q) q = requestAnimationFrame(() => {
      q = 0;
      if (!r || !ax) return;
      const dx = (ex - (ax.left + ax.width / 2)) / r.width, dy = (ey - (ax.top + ax.height / 2)) / r.height;
      app.style.transform = `perspective(420px) rotateX(${clamp(-dy * 50, -22, 22)}deg) rotateY(${clamp(dx * 50, -28, 28)}deg)`;
    });
  }, { passive: true });
  el.addEventListener("pointerleave", () => {
    app.style.transform = "";
    r = null;
    ax = null;
  });
});
let VKEY = (() => {
  const b = document.getElementById("vids");
  return b ? [...b.querySelectorAll("a.vid")].map((a) => (a.href.match(/v=([\w-]{11})/) || [])[1]).join(",") : "";
})();
function renderVideos(list) {
  const key = list.slice(0, 6).map((v) => v.id + (v.fresh ? "*" : "")).join(",");
  if (key === VKEY) return;
  VKEY = key;
  const box = $("#vids");
  const keepH = box.offsetHeight;
  if (keepH) box.style.minHeight = keepH + "px";
  box.textContent = "";
  requestAnimationFrame(() => box.style.minHeight = "");
  list.slice(0, 6).forEach((v, i) => {
    const a = document.createElement("a");
    a.className = "vid reveal is-in";
    a.href = "https://www.youtube.com/watch?v=" + v.id;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    const th = document.createElement("div");
    th.className = "vid__thumb";
    const img = new Image();
    img.alt = "";
    img.width = 800;
    img.height = 450;
    img.decoding = "async";
    img.loading = "lazy";
    th.classList.add("is-loading");
    img.addEventListener("load", () => th.classList.remove("is-loading"), { once: true });
    if (DATA.thumbs[v.id]) img.src = "assets/img/videos/" + v.id + ".webp";
    else {
      const alts = [`https://i.ytimg.com/vi/${v.id}/hq720.jpg`, `https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`];
      let k = 0;
      img.src = alts[0];
      img.onerror = () => {
        k++;
        if (k < alts.length) img.src = alts[k];
        else {
          img.remove();
          th.classList.add("is-missing");
        }
      };
    }
    th.appendChild(img);
    const pl = document.createElement("span");
    pl.className = "vid__play";
    pl.innerHTML = ICONS.play;
    th.appendChild(pl);
    if (i === 0 && v.fresh) {
      const n = document.createElement("span");
      n.className = "vid__new";
      n.textContent = "חדש";
      th.appendChild(n);
    }
    const body = document.createElement("div");
    body.className = "vid__body";
    const h = document.createElement("h3");
    h.textContent = v.t;
    const s2 = document.createElement("span");
    s2.textContent = "";
    body.append(h, s2);
    a.append(th, body);
    box.appendChild(a);
  });
}
renderVideos(DATA.videos);
$$("#vids .vid__thumb img").forEach((img) => {
  if (img.dataset.fb) return;
  img.dataset.fb = "1";
  const th = img.parentElement;
  img.addEventListener("error", () => {
    const m = img.src.match(/\/vi\/([\w-]{11})\/hq720/);
    if (m) img.src = `https://i.ytimg.com/vi/${m[1]}/mqdefault.jpg`;
    else {
      img.remove();
      th.classList.add("is-missing");
    }
  });
});
(function() {
  const row = $("#bizRow"), em = String((DATA.business || {}).email || "").trim();
  if (!row) return;
  row.textContent = "";
  if (/^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i.test(em)) {
    const a = document.createElement("a");
    a.className = "btn btn--light";
    a.href = "mailto:" + em + "?subject=" + encodeURIComponent("פנייה עסקית – OdedSVR");
    a.textContent = "שליחת מייל";
    const ad = document.createElement("span");
    ad.className = "biz__addr";
    ad.textContent = em;
    const cp = document.createElement("button");
    cp.type = "button";
    cp.className = "copy";
    cp.textContent = "העתק";
    cp.setAttribute("aria-label", "העתקת כתובת המייל לפניות עסקיות");
    cp.addEventListener("click", () => copyText(em, cp, "כתובת המייל הועתקה"));
    row.append(a, ad, cp);
  } else {
    const p = document.createElement("p");
    p.className = "biz__todo";
    p.textContent = "כתובת לפניות עסקיות תתווסף כאן בקרוב.";
    row.appendChild(p);
  }
})();
let VMODE = "latest", LATEST = null;
(function() {
  const tg = $("#vtog");
  const F = (DATA.featured || []).filter((v) => v && /^[\w-]{11}$/.test(v.id) && typeof v.t === "string");
  if (!tg || !F.length) return;
  tg.hidden = false;
  tg.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b || b.getAttribute("aria-pressed") === "true") return;
    VMODE = b.dataset.v;
    $$("button", tg).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $("#vdEm").textContent = VMODE === "featured" ? "מומלצים" : "אחרונים";
    $("#vdIntro").textContent = VMODE === "featured" ? "נקודת פתיחה טובה למי שרק מגיע לערוץ." : "קטעים מהלייבים, ישר מהערוץ ביוטיוב.";
    renderVideos(VMODE === "featured" ? F : LATEST || DATA.videos);
    $("#vdLive").textContent = VMODE === "featured" ? `מוצגים ${Math.min(6, F.length)} סרטונים מומלצים` : "מוצגים הסרטונים האחרונים";
  });
})();
const SHORT_KEY = "osvr-shorts";
let SHORTS = {};
try {
  SHORTS = JSON.parse(sessionStorage.getItem(SHORT_KEY) || "{}") || {};
} catch (e) {
}
const KNOWN = new Set(DATA.videos.map((v) => v.id));
function isShort(id) {
  if (KNOWN.has(id)) return Promise.resolve(false);
  if (id in SHORTS) return Promise.resolve(SHORTS[id]);
  return new Promise((res) => {
    const i = new Image();
    let done = false;
    const end = (v) => {
      if (done) return;
      done = true;
      clearTimeout(t);
      if (v !== null) {
        SHORTS[id] = v;
        try {
          sessionStorage.setItem(SHORT_KEY, JSON.stringify(SHORTS));
        } catch (e) {
        }
      }
      res(!!v);
    };
    const t = setTimeout(() => end(null), 5e3);
    i.onload = () => end(i.naturalHeight > i.naturalWidth);
    i.onerror = () => end(false);
    i.src = `https://i.ytimg.com/vi/${id}/oardefault.jpg`;
  });
}
async function refreshVideos() {
  try {
    const y = await getJSON(WORKER_URL + "/youtube");
    if (!Array.isArray(y)) return;
    const list = y.filter((v) => v && /^[\w-]{11}$/.test(v.id) && typeof v.title === "string").map((v) => ({ id: v.id, t: str(v.title, 160) }));
    const flags = await Promise.all(list.map((v) => isShort(v.id)));
    const fresh2 = list.filter((v, i) => !flags[i]);
    if (!fresh2.length) return;
    const ids = new Set(fresh2.map((v) => v.id));
    let at = -1;
    fresh2.forEach((v) => {
      const k = DATA.videos.findIndex((d) => d.id === v.id);
      if (k > at) at = k;
    });
    const rest = (at >= 0 ? DATA.videos.slice(at + 1) : DATA.videos).filter((v) => !ids.has(v.id));
    const merged = [...fresh2, ...rest].slice(0, 6);
    if (merged[0].id !== DATA.videos[0].id) merged[0].fresh = true;
    LATEST = merged;
    if (VMODE === "latest") renderVideos(merged);
  } catch (e) {
  }
}
idle(refreshVideos);
setInterval(() => {
  if (!document.hidden) refreshVideos();
}, 15 * 6e4);
const toHours = (s) => {
  const m = String(s).match(/(\d+)d\s*(\d+)h/);
  return m ? +m[1] * 24 + +m[2] : +s;
};
function renderLB(range, animate = true) {
  const data = (DATA.board[range] || []).filter((r) => r && !HIDDEN.has(String(r[0]).toLowerCase())), isW = range === "watch";
  if (!data || data.length < 3) return;
  const unit = { weekly: "גיפטים", month: "גיפטים", all: "גיפטים", chat: "הודעות", watch: "" }[range];
  const val = (v) => isW ? String(v).replace(/^(\d+)d\s*(\d+)h$/, (_, d, h) => `${d} ימים ${h} שע׳`) : fmt(v);
  const max = toHours(data[0][1]);
  const [a, b, c] = data;
  const mv = rankMoves(range, data);
  const pod = $("#podium");
  const srv = (v) => `<span class="sr">${esc(String(val(v)))}${unit ? " " + unit : " צפייה"}</span>`;
  pod.innerHTML = [[a, 1], [b, 2], [c, 3]].map(([p, r]) => `<li class="pod pod--${r}"><span class="sr">מקום ${r}: </span><div class="pod__av" aria-hidden="true">${esc(initials(p[0]))}</div><div class="pod__name">${esc(p[0])}</div><div class="pod__val"><span class="cnt" aria-hidden="true" data-n="${isW ? "" : esc(p[1])}">${esc(val(p[1]))}</span><span aria-hidden="true"> ${unit}</span>${srv(p[1])}</div>${mvTag(mv[p[0]])}<div class="pod__block" aria-hidden="true">${r}</div></li>`).join("");
  $("#lbPanel").innerHTML = data.slice(3).map((p, i) => `<li class="row ${animate ? "lb-anim" : ""}" style="animation-delay:${i * 45}ms"><span class="row__rank"><span class="sr">מקום </span>${i + 4}</span><span class="row__name">${esc(p[0])}${mvTag(mv[p[0]])}</span><span class="row__val"><span class="cnt" aria-hidden="true" data-n="${isW ? "" : esc(p[1])}">${esc(val(p[1]))}</span>${unit ? `<span class="row__unit" aria-hidden="true">${unit}</span>` : ""}${srv(p[1])}</span><span class="row__bar" data-p="${(toHours(p[1]) / max).toFixed(3)}"></span></li>`).join("");
  if (animate && !RM) {
    pod.classList.remove("pod-anim");
    void pod.offsetWidth;
    pod.classList.add("pod-anim");
  }
  requestAnimationFrame(() => requestAnimationFrame(() => $$("#lbPanel .row__bar").forEach((x) => x.style.setProperty("--p", x.dataset.p))));
  if (animate) countUp();
  else {
    const w = $(".lb");
    if (w && !RM) {
      w.classList.remove("lb-swap");
      void w.offsetWidth;
      w.classList.add("lb-swap");
    }
  }
}
function rankMoves(range, data) {
  const out = {};
  let st = null;
  const names = data.slice(0, 10).map((r) => r[0]);
  try {
    st = JSON.parse(localStorage.getItem("osvr-rank-" + range) || "null");
  } catch (e) {
  }
  if (!st || !Array.isArray(st.cur)) st = { prev: null, cur: names };
  else if (st.cur.join("|") !== names.join("|")) st = { prev: st.cur, cur: names };
  try {
    localStorage.setItem("osvr-rank-" + range, JSON.stringify(st));
  } catch (e) {
  }
  if (Array.isArray(st.prev)) names.forEach((n, i) => {
    const j = st.prev.indexOf(n);
    out[n] = j < 0 ? "new" : j > i ? "up" : j < i ? "down" : "";
  });
  return out;
}
function mvTag(m) {
  return m === "up" ? '<span class="mv mv--up" aria-hidden="true">▲</span><span class="sr">, עלה בדירוג</span>' : m === "down" ? '<span class="mv mv--down" aria-hidden="true">▼</span><span class="sr">, ירד בדירוג</span>' : "";
}
function countUp() {
  if (RM) return;
  $$("#leaderboard .cnt").forEach((el) => {
    const n = +el.dataset.n;
    if (!el.dataset.n || !Number.isFinite(n) || n <= 0) return;
    const t0 = performance.now(), D = 1100;
    el.textContent = fmt(0);
    (function f(t) {
      const k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(Math.round(n * e));
      if (k < 1) requestAnimationFrame(f);
    })(t0);
  });
}
{
  const sec = $("#leaderboard");
  if (sec && "IntersectionObserver" in window) {
    const io2 = new IntersectionObserver((es) => {
      if (es[0].isIntersecting) {
        countUp();
        io2.disconnect();
      }
    }, { threshold: 0.35 });
    io2.observe(sec);
  }
}
let boardBusy = false, boardTry = 0;
async function loadLive() {
  if (boardBusy) return;
  boardBusy = true;
  boardTry = Date.now();
  try {
    await loadBoards();
  } finally {
    boardBusy = false;
  }
}
async function loadBoards() {
  const ok = (x) => x && typeof x.username === "string" && /^[\w.\-]{1,32}$/.test(x.username) && !HIDDEN.has(x.username.toLowerCase()) && Number.isFinite(+x.quantity) && +x.quantity >= 0;
  const map = (a) => (Array.isArray(a) ? a : []).filter(ok).slice(0, 10).map((x) => [x.username, Math.floor(+x.quantity)]);
  const valid = (j2) => j2 && typeof j2 === "object" && (Array.isArray(j2.gifts) || Array.isArray(j2.gifts_week) || Array.isArray(j2.gifts_month));
  const srcs = [`https://kick.com/api/v2/channels/${DATA.channel}/leaderboards`, WORKER_URL + "/leaderboards", "/data.json?t=" + Date.now()];
  let j = null;
  for (const u of srcs) {
    try {
      const d = await getJSON(u);
      if (valid(d)) {
        j = d;
        break;
      }
    } catch (e) {
    }
  }
  if (!j) {
    fresh();
    return;
  }
  if (j.gifts_week_enabled !== false && Array.isArray(j.gifts_week)) DATA.board.weekly = map(j.gifts_week);
  if (j.gifts_enabled !== false && Array.isArray(j.gifts)) DATA.board.all = map(j.gifts);
  if (j.gifts_month_enabled !== false && Array.isArray(j.gifts_month)) DATA.board.month = map(j.gifts_month);
  boardOK = Date.now();
  fresh();
  const t = $('.tab[aria-selected="true"]');
  if (t && /^(weekly|month|all)$/.test(t.dataset.r)) renderLB(t.dataset.r, false);
}
const tabs = $$(".tab"), pill = $(".tabs__pill");
var repill;
function movePill(t) {
  const r = t.getBoundingClientRect(), pr = t.parentElement.getBoundingClientRect();
  pill.style.width = r.width + "px";
  pill.style.right = pr.right - r.right + "px";
  pill.style.top = r.top - pr.top + "px";
}
function selectTab(t) {
  tabs.forEach((x) => {
    const on = x === t;
    x.setAttribute("aria-selected", on);
    x.tabIndex = on ? 0 : -1;
  });
  $("#lbTab").setAttribute("aria-labelledby", t.id);
  movePill(t);
  renderLB(t.dataset.r);
}
tabs.forEach((t) => {
  t.addEventListener("click", () => selectTab(t));
  t.addEventListener("keydown", (e) => {
    const v = tabs.filter((x) => !x.hidden), i = v.indexOf(t);
    let j = null;
    if (e.key === "ArrowLeft") j = (i + 1) % v.length;
    if (e.key === "ArrowRight") j = (i - 1 + v.length) % v.length;
    if (e.key === "Home") j = 0;
    if (e.key === "End") j = v.length - 1;
    if (j !== null) {
      e.preventDefault();
      v[j].focus();
      selectTab(v[j]);
    }
  });
});
renderLB("weekly", false);
loadLive();
setInterval(() => {
  if (!document.hidden) {
    loadLive();
    refreshWorker();
  }
}, 12e4);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && Date.now() - boardTry > 3e4) loadLive();
});
function rerender() {
  const t = $('.tab[aria-selected="true"]');
  if (t && (t.dataset.r === "watch" || t.dataset.r === "chat")) renderLB(t.dataset.r, false);
}
repill = () => movePill($('.tab[aria-selected="true"]'));
requestAnimationFrame(repill);
addEventListener("resize", repill);
document.fonts && document.fonts.ready.then(repill);
$("#specs").innerHTML = DATA.specs.map(([k, v]) => `<li><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></li>`).join("");
/* Discount codes: the code boxes inside the sponsor slides read their codes from data.js */
{
  const C = Array.isArray(DATA.codes) ? DATA.codes.filter((c) => c && typeof c.code === "string" && /^[\w-]{2,24}$/.test(c.code)) : [];
  $$("[data-code-ref]").forEach((box) => {
    const c = C[+box.dataset.codeRef];
    if (!c) {
      box.hidden = true;
      return;
    }
    const v = $(".lcode__v", box), b = $(".copy", box);
    if (v) v.textContent = c.code;
    if (b) {
      b.dataset.code = c.code;
      b.setAttribute("aria-label", `העתק קוד ${c.code}`);
    }
  });
}
$("#cmds").innerHTML = DATA.commands.map(([c, d]) => `<div class="cmd"><span class="mono">${esc(c)}</span><span>${esc(d)}</span><button class="copy" type="button" data-code="${c}" aria-label="העתקת הפקודה ${c}">העתק</button></div>`).join("");
$$(".copy[data-code]").forEach((b) => b.addEventListener("click", () => copyText(b.dataset.code, b, `${b.dataset.code} הועתק`)));
if (FINE && !RM) $$(".magnetic").forEach((b) => {
  b.addEventListener("pointermove", (e) => {
    const r = b.getBoundingClientRect();
    b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px,${(e.clientY - r.top - r.height / 2) * 0.28}px)`;
  });
  b.addEventListener("pointerleave", () => b.style.transform = "");
});
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add("is-in");
  io.unobserve(e.target);
}), { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
$$(".reveal").forEach((el) => {
  const sib = [...el.parentElement.children].filter((x) => x.classList.contains("reveal"));
  if (!el.closest("#links,#videos")) el.style.transitionDelay = sib.indexOf(el) % 6 * 80 + "ms";
  io.observe(el);
});
