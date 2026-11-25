/* Navigation, live status from Kick, the tab title and live notifications */
const nav = $("#nav"), burger = $("#burger");
burger.addEventListener("click", () => {
  const o = nav.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", o);
  burger.setAttribute("aria-label", o ? "סגירת תפריט" : "פתיחת תפריט");
});
$$("#navLinks a").forEach((a) => a.addEventListener("click", () => {
  nav.classList.remove("is-open");
  burger.setAttribute("aria-expanded", "false");
  burger.setAttribute("aria-label", "פתיחת תפריט");
}));
const navClose = () => {
  nav.classList.remove("is-open");
  burger.setAttribute("aria-expanded", "false");
  burger.setAttribute("aria-label", "פתיחת תפריט");
};
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("is-open")) {
    navClose();
    burger.focus();
  }
});
const WORKER_URL = "https://links.odedlink26.workers.dev";
const SAME = (u) => u.startsWith("/");
async function getJSON(u, ms = 7e3) {
  const c = new AbortController();
  const tm = setTimeout(() => c.abort(), ms);
  try {
    const r = await fetch(u, { signal: c.signal, cache: "no-store", credentials: SAME(u) ? "same-origin" : "omit", referrerPolicy: "no-referrer", headers: { accept: "application/json" } });
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } finally {
    clearTimeout(tm);
  }
}
const str = (v, max = 140) => typeof v === "string" ? v.replace(/[\u0000-\u001f‪-‮]/g, "").trim().slice(0, max) : "";
const HIDDEN = new Set((DATA.hiddenNames || []).map((n) => String(n).toLowerCase()));
const okName = (n) => typeof n === "string" && /^[\w.\-]{1,32}$/.test(n) && !HIDDEN.has(n.toLowerCase());
const dh = (min) => {
  min = Math.max(0, Math.floor(+min || 0));
  const d = Math.floor(min / 1440), h = Math.floor(min % 1440 / 60);
  return `${d}d ${h}h`;
};
let LIVE = null, liveOK = 0, boardOK = 0;
function setStatus(live, known = true) {
  document.body.classList.toggle("is-live-mode", live);
  $$(".status").forEach((el) => {
    el.classList.toggle("is-live", live);
    el.classList.toggle("is-unknown", !known);
    const t = $(".status__txt", el);
    if (t) t.textContent = !known ? "KICK" : live ? "בשידור" : "לא בשידור";
  });
  const hs = $("#heroStatus");
  if (hs) hs.textContent = !known ? "Kick" : live ? "בשידור עכשיו" : "לא בשידור";
  $$(".js-watch").forEach((el) => el.textContent = live ? "צפו עכשיו בלייב" : "לשידור ב-Kick");
  $("#liveInfo").hidden = !live;
  const hl = $("#heroLive");
  if (hl) hl.hidden = true;
  $$(".nav-watch__t").forEach((el) => el.textContent = live ? "בשידור חי" : "צפו ב-Kick");
  const ds = $("#dockSt");
  if (ds) ds.textContent = !known ? ", צפייה בערוץ" : live ? ", בשידור עכשיו" : ", לא בשידור";
}
(function() {
  const c = document.getElementById("livecard");
  if (!c) return;
  const go = () => window.open("https://kick.com/odedsvr", "_blank", "noopener");
  c.addEventListener("click", (e) => {
    if (e.target.closest("button,a")) return;
    go();
  });
})();
function applyLive(ls) {
  const was = !!LIVE;
  LIVE = ls && typeof ls === "object" ? ls : null;
  setStatus(!!LIVE);
  if (LIVE) {
    $("#liveTitle").textContent = str(LIVE.session_title) || "OdedSVR בשידור חי";
    const cat = Array.isArray(LIVE.categories) && LIVE.categories[0] && LIVE.categories[0].name || LIVE.category && LIVE.category.name || "Kick";
    $("#liveCat").textContent = str(cat, 40);
    const hc = $("#heroLiveCat");
    if (hc) hc.textContent = str(cat, 40);
    const th = LIVE.thumbnail && (LIVE.thumbnail.url || LIVE.thumbnail.src), im = $("#liveThumb");
    if (im) {
      const tb = im.parentElement;
      im.onerror = () => {
        im.hidden = true;
        tb.classList.add("no-img");
      };
      im.onload = () => {
        im.hidden = false;
        tb.classList.remove("no-img");
      };
      if (typeof th === "string" && /^https:\/\/[\w.-]*kick\.com\//.test(th)) {
        if (im.getAttribute("src") !== th) im.src = th;
      } else im.hidden = true;
    }
    if (!was) notifyLive();
  }
  tickUp();
}
function tickUp() {
  const el = $("#liveUp");
  if (!LIVE) {
    el.textContent = "";
    return;
  }
  const t = Date.parse(String(LIVE.start_time || LIVE.created_at || "").replace(" ", "T") + (/[zZ+]/.test(String(LIVE.start_time || "")) ? "" : "Z"));
  if (!Number.isFinite(t)) {
    el.textContent = "LIVE";
    return;
  }
  const m = Math.max(0, Math.floor((Date.now() - t) / 6e4));
  el.textContent = `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")} בשידור`;
  const hu = $("#heroLiveUp");
  if (hu) hu.textContent = el.textContent;
}
setInterval(() => {
  if (LIVE && !document.hidden) tickUp();
}, 3e4);
/* the tab keeps one fixed title and the channel picture as its icon, live or not */
function applyWorker(w) {
  if (!w || typeof w !== "object") return;
  if (Array.isArray(w.botrix)) {
    const rows = w.botrix.filter((x) => x && okName(x.name) && Number.isFinite(+x.watchtime)).sort((a, b) => b.watchtime - a.watchtime).slice(0, 10).map((x) => [x.name, dh(x.watchtime)]);
    if (rows.length >= 3) DATA.board.watch = rows;
  }
  const k = w.kicklogz;
  if (k && Array.isArray(k.labels) && Array.isArray(k.data)) {
    const rows = k.labels.map((n, i) => [n, Math.floor(+k.data[i])]).filter((r) => okName(r[0]) && Number.isFinite(r[1]) && !/^botrix$/i.test(r[0])).slice(0, 10);
    if (rows.length >= 3) DATA.board.chat = rows;
  }
}
const LIVE_EVERY = 6e4, LIVE_MAX = 5 * 6e4, LIVE_STALE = 3 * 6e4, WORKER_EVERY = 5 * 6e4, BOARD_STALE = 10 * 6e4;
const isChannel = (j) => j && typeof j === "object" && "livestream" in j;
let liveBusy = false, liveFails = 0, liveTimer = 0, liveTry = 0, workerAt = 0, workerBusy = null;
function refreshWorker(force) {
  if (workerBusy) return workerBusy;
  if (!force && Date.now() - workerAt < WORKER_EVERY) return Promise.resolve(null);
  return workerBusy = getJSON(WORKER_URL).then((w) => {
    workerAt = Date.now();
    applyWorker(w);
    rerender();
    boardOK = Date.now();
    fresh();
    return w;
  }).catch(() => null).finally(() => {
    workerBusy = null;
  });
}
async function fetchChannel() {
  try {
    const j = await getJSON(`https://kick.com/api/v2/channels/${DATA.channel}`);
    if (isChannel(j)) return j;
  } catch (e) {
  }
  const w = await refreshWorker(true);
  if (w && isChannel(w.kickChannel)) return w.kickChannel;
  try {
    const j = await getJSON(`https://kick.com/api/v1/channels/${DATA.channel}`);
    if (isChannel(j)) return j;
  } catch (e) {
  }
  return null;
}
function scheduleLive() {
  clearTimeout(liveTimer);
  const d = liveFails ? Math.min(LIVE_MAX, LIVE_EVERY * 2 ** Math.min(liveFails, 3)) : LIVE_EVERY;
  liveTimer = setTimeout(() => {
    if (document.hidden) scheduleLive();
    else refreshLive();
  }, d);
}
async function refreshLive() {
  if (location.hash === "#live-preview") {
    applyLive({ session_title: "בדיקת תצוגת לייב — כך זה ייראה", categories: [{ name: "Just Chatting" }], start_time: new Date(Date.now() - 504e4).toISOString() });
    return;
  }
  if (liveBusy) return;
  liveBusy = true;
  liveTry = Date.now();
  try {
    const ch = await fetchChannel();
    if (ch) {
      applyLive(ch.livestream);
      liveOK = Date.now();
      liveFails = 0;
    } else {
      liveFails++;
      if (!liveOK || Date.now() - liveOK > LIVE_STALE) {
        LIVE = null;
        setStatus(false, false);
        tickUp();
      }
    }
  } finally {
    liveBusy = false;
    scheduleLive();
  }
}
const hhmm = (t) => new Date(t).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
const asOf = (() => {
  const d = Date.parse(DATA.boardAsOf || "");
  return Number.isFinite(d) ? new Date(d).toLocaleDateString("he-IL", { day: "numeric", month: "numeric", year: "numeric" }) : "";
})();
function fresh() {
  const f = $("#fresh"), t = $("#freshTxt");
  if (!f || !t) return;
  const set = (state, txt) => {
    f.dataset.state = state;
    f.classList.toggle("is-live", state === "live");
    t.textContent = txt;
  };
  if (!boardOK) {
    set("saved", asOf ? `נתונים שמורים מ-${asOf} · לא בזמן אמת` : "נתונים שמורים · לא בזמן אמת");
    return;
  }
  const age = Date.now() - boardOK, m = Math.floor(age / 6e4);
  if (age > BOARD_STALE) {
    set("stale", `לא עודכן מאז ${hhmm(boardOK)} · ייתכן שהנתונים לא עדכניים`);
    return;
  }
  set("live", m < 1 ? "נתונים חיים מ-Kick · עודכן עכשיו" : `נתונים חיים מ-Kick · עודכן לפני ${m} דק׳`);
}
setInterval(fresh, 3e4);
let wantNotify = false;
$("#notifyBtn").addEventListener("click", async () => {
  if (!("Notification" in window)) {
    toast("הדפדפן הזה לא תומך בהתראות");
    return;
  }
  try {
    const p = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
    if (p !== "granted") {
      toast("לא אושרו התראות בדפדפן");
      return;
    }
    wantNotify = !wantNotify;
    $("#notifyBtn").setAttribute("aria-pressed", wantNotify);
    $("#notifyBtn span").textContent = wantNotify ? "נודיע לכם כשעודד עולה (כל עוד הדף פתוח)" : "תודיעו לי כשעודד עולה";
    toast(wantNotify ? "מעולה! נקפיץ התראה כשהלייב מתחיל" : "ההתראה בוטלה");
  } catch (e) {
    toast("לא ניתן להפעיל התראות כאן");
  }
});
function notifyLive() {
  if (!wantNotify || !("Notification" in window) || Notification.permission !== "granted") return;
  try {
    const n = new Notification("OdedSVR עלה לשידור! 🔴", { body: $("#liveTitle").textContent, tag: "osvr-live" });
    n.onclick = () => {
      window.open("https://kick.com/odedsvr", "_blank", "noopener");
      n.close();
    };
  } catch (e) {
  }
}
setStatus(false, false);
refreshLive();
refreshWorker(true);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && Date.now() - liveTry > 2e4) refreshLive();
});
addEventListener("hashchange", () => {
  if (location.hash === "#live-preview") refreshLive();
});
