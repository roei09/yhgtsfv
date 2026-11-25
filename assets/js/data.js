/* All site content. Edit this file to change text, links, videos, setup and commands; the scripts only read it. */

const DATA = {
  channel: "odedsvr",
  /* names removed from the leaderboards on request (case-insensitive) */
  hiddenNames: [],
  /* Next subathon start, e.g. "2026-12-24T17:00:00+02:00". Empty hides the countdown bar. */
  subathon: "",
  links: [
    { key: "kick", name: "Kick", handle: "kick.com/odedsvr", url: "https://kick.com/odedsvr", color: "#53fc18", main: true, sub: "לשידורים החיים" },
    { key: "youtube", name: "YouTube", handle: "@OdedSVRLive", url: "https://www.youtube.com/@OdedSVRLive", color: "#ff4d4d" },
    { key: "clips", name: "Clips", handle: "@OdedSVRLiveTwo", url: "https://www.youtube.com/@OdedSVRLiveTwo", color: "#ff7a59" },
    { key: "tiktok", name: "TikTok", handle: "@odedsvrlive", url: "https://www.tiktok.com/@odedsvrlive", color: "#25f4ee" },
    { key: "instagram", name: "Instagram", handle: "@odedsvr", url: "https://www.instagram.com/odedsvr/", color: "#ff5fa2" },
    { key: "discord", name: "Discord", handle: "שרת הקהילה", url: "https://discord.gg/75dSkgFKkr", color: "#7c8cff" },
    { key: "reddit", name: "Reddit", handle: "r/OdedSVRR", url: "https://www.reddit.com/r/OdedSVRR/", color: "#ff7a1a" }
  ],
  videos: [
    { id: "WRpZI4SDQUw", t: "עודד מגיב לבתי הספר הכי מוזרים בעולם! (משוגע)" },
    { id: "WtgXbQ2nJUQ", t: "התחלתי לייב ואני לא יודע מתי הוא יגמר.. (הסאבתון חזר!)" },
    { id: "edv8uZuAao4", t: "עודד ביגי וסנסיי פותחים יותר מ100 חבילות פוקימון וכל פגיעה הם שותים!" },
    { id: "Rcf9-UvGC78", t: "זה הסרטון הכי טוב של מיסטר ביסט! (משחקי הרעב על 250,000$)" },
    { id: "Sm_UAFg6Zi4", t: "עודד וחברה שלו מבשלים ביחד בלייב! (שאלות תשובות)" },
    { id: "jatB18igo-s", t: "עודד מגיב לאוכל במקומות הכי ויראלים באילת! (מטורף!)" },
    { id: "UckojDWuEYM", t: "חזרתי לדרג את החיות מחמד של הצופים שלי.. (מתתי מצחוק)" },
    { id: "xZKK0UhrfTc", t: "עודד מגיב לאוכל במסעדות שמדורגות הכי נמוך בדובאי .. (הזוי!)" }
  ],
  thumbs: { "xZKK0UhrfTc": 1 },
  /* מקור: kick.com/api/v2/channels/odedsvr/leaderboards. באתר עצמו הנתונים נמשכים חי מ-Kick; אלה הנתונים השמורים לגיבוי */
  /* Date of the saved board below; shown whenever live data is unavailable. Update it together with the board. */
  boardAsOf: "2026-11-19",
  board: {
    weekly: [["OmriMizrahi", 5], ["liav_penta", 5], ["1St3pBr0", 5], ["eylon1", 1], ["Twenty1N0am", 1], ["HilaiCohen", 1], ["stavhikri", 1]],
    month: [["natanelf", 70], ["artishok2", 35], ["Redeye1yt", 34], ["Macabitelaviv", 27], ["Thekoa1a", 25], ["1St3pBr0", 21], ["Divine245", 20], ["iamlewis_openfront", 15], ["SukunaV01", 10], ["OmriMizrahi", 10]],
    all: [["Krav0n", 4220], ["mrdavid465", 1630], ["natanelf", 1230], ["eylon1", 1209], ["TheFl1k", 1062], ["Thekoa1a", 885], ["Oliverremez", 513], ["yohay32", 461], ["absolute_alamo", 429], ["thebigSheshMan", 413]],
    watch: [["SuperBib1", "62d 12h"], ["electro_V", "59d 23h"], ["Piker_r", "58d 8h"], ["Liad1010", "57d 1h"], ["Pilpeli", "53d 22h"], ["SukunaV01", "52d 5h"], ["0rsha", "50d 18h"], ["noamqqww", "49d 9h"], ["TumbaLumba", "48d 3h"], ["SuperM", "46d 4h"]],
    chat: [["Liad1010", 20188], ["SHMUFTZIK", 17868], ["Marcelo987", 16200], ["Bolbol1248", 11484], ["tost_taim", 8510], ["roie1234", 8336], ["LimeTaf", 7363], ["eylon1", 7325], ["Yarinov", 7068]]
  },
  /* Recommended videos for new visitors: [{ id: "YouTubeID", t: "title" }]. Empty hides the switch. */
  featured: [],
  /* Business inquiries address, from Oded's Kick bio (checked 21.11.2026). Empty shows a placeholder. */
  business: { email: "sahivrcontact@gmail.com" },
  /* Discount codes shown inside the sponsor slides: change a code here (each slide box points at a row by its position, data-code-ref).
     Removing a row hides that code box. */
  codes: [
    { partner: "libero", name: "ליברו", code: "OSVR10", what: "10% הנחה על כל האתר", url: "https://libero-il.co.il/" },
    { partner: "libero", name: "ליברו", code: "OSVR", what: "למבצעי הבשמים", url: "https://libero-il.co.il/" },
    { partner: "cardpull", name: "CardPull", code: "OSVR", what: "קוד הנחה · כל 299₪ = חבילה חינם", url: "https://cardpull.store/" }
  ],
  /* Partner offers: fill "until" (YYYY-MM-DD) and "terms" (link to the partner's terms page) when the partner gives them.
     Empty = the site shows only the general note that the offer is run by the partner and may change. */
  deals: {
    libero: { until: "", terms: "" },
    cardpull: { until: "", terms: "" }
  },
  specs: [["CPU", "Intel Core i7 14700KF"], ["GPU", "NVIDIA GeForce RTX 5070Ti"], ["MEMORY", "Corsair 32GB DDR5"], ["MB", "B760 Motherboard"], ["KEYBOARD", "SteelSeries Apex 7"], ["MOUSE", "Razer Basilisk X"], ["MIC", "Elgato Wave 3"], ["HEADPHONES", "HyperX Cloud Stinger 2 Wireless"]],
  commands: [["!watchtime", "כמה זמן צפיתם בשידורים"], ["!followage", "כמה זמן אתם עוקבים ב-Kick"], ["!clip", "קליפ של 30 השניות האחרונות"], ["!discord", "לינק לשרת הדיסקורד"]]
};
