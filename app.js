(() => {
  const P = window.PHONE, S = window.STORY;
  const $ = s => document.querySelector(s);
  const h = html => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const WD = "일월화수목금토";
  const parseD = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const TODAY = P.today ? parseD(P.today) : new Date();
  const key = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  /* ================= 시계 ================= */
  const [H0, M0, S0] = (P.time || "12:00:00").split(":").map(Number);
  let t0 = null;
  const now = () => { const sec = Math.floor(((H0 * 3600 + M0 * 60 + (S0 || 0)) * 1000 + (t0 ? Date.now() - t0 : 0)) / 1000) % 86400; return { h: Math.floor(sec / 3600), m: Math.floor(sec / 60) % 60 }; };
  const ampm = o => (o.h < 12 ? "오전" : "오후");
  const hm = o => `${(o.h % 12) || 12}:${String(o.m).padStart(2, "0")}`;
  const nowLabel = () => { const o = now(); return `${ampm(o)} ${hm(o)}`; };
  const dateLabel = d => `${d.getMonth() + 1}월 ${d.getDate()}일 ${WD[d.getDay()]}요일`;

  /* ================= 본문 ================= */
  const story = $("#story");
  story.innerHTML = (S.title ? `<h1>${esc(S.title)}</h1>` : "") + (S.paragraphs || []).map(p => p === "" ? `<p class="gap"></p>` :
    `<p>${esc(p).replace(/\[\[(.+?)\]\]/g, (_, t) => `<a class="phone-link" data-open>${t}</a>`)}</p>`).join("");

  /* ================= 아이콘 ================= */
  const W = "#fff";
  const G = {
    phone: `<path d="M10 5.5c1-.6 2.2-.4 2.8.6l2.1 3.3c.6 1 .4 2.1-.5 2.8l-1.6 1.2c1.1 2.7 3.2 5 5.9 6.4l1.2-1.5c.7-.9 2-1 2.9-.4l3.2 2.2c1 .6 1.1 2 .5 2.9l-1.1 1.5c-1.1 1.5-3.1 2-4.8 1.3-6.1-2.4-10.7-7.1-12.9-13.2-.6-1.7-.1-3.7 1.3-4.8z" fill="${W}"/>`,
    contacts: `<rect x="6" y="4" width="22" height="26" rx="2" fill="${W}" opacity=".95"/><circle cx="17" cy="13" r="4.2" fill="#d1561b"/><path d="M9.5 25c.8-4 3.8-6.2 7.5-6.2s6.7 2.2 7.5 6.2z" fill="#d1561b"/>`,
    message: `<rect x="4" y="8" width="26" height="18" rx="2" fill="${W}"/><path d="M4.8 9l12.2 9.5L29.2 9" fill="none" stroke="#c98a12" stroke-width="2"/>`,
    apps: [0, 1, 2].flatMap(r => [0, 1, 2].map(c => `<rect x="${6 + c * 8}" y="${6 + r * 8}" width="6" height="6" rx="1.2" fill="${W}"/>`)).join(""),
    internet: `<circle cx="17" cy="17" r="11" fill="none" stroke="${W}" stroke-width="2"/><ellipse cx="17" cy="17" rx="5" ry="11" fill="none" stroke="${W}" stroke-width="1.6"/><path d="M6 17h22M8 11h18M8 23h18" stroke="${W}" stroke-width="1.4"/>`,
    camera: `<circle cx="17" cy="17" r="10" fill="#111" stroke="#9aa3ad" stroke-width="2"/><circle cx="17" cy="17" r="6" fill="#1d3b6b"/><circle cx="15" cy="15" r="2" fill="#bfe0ff"/>`,
    gallery: `<rect x="5" y="7" width="24" height="20" rx="1.5" fill="${W}"/><rect x="7.5" y="9.5" width="19" height="13" fill="#5ab0f0"/><path d="M7.5 22.5l6-7 4 4.5 3-3 6 5.5z" fill="#3c8f1e"/><circle cx="22" cy="13" r="1.8" fill="#ffe36b"/>`,
    clock: `<circle cx="17" cy="17" r="12" fill="#fff" stroke="#555" stroke-width="1.5"/><path d="M17 9v8l5 3" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round"/>`,
    memo: `<rect x="7" y="5" width="20" height="24" rx="1.5" fill="#fffbe0"/><path d="M10 11h14M10 15h14M10 19h14M10 23h9" stroke="#b08a10" stroke-width="1.5"/>`,
    music: `<path d="M13 23.5V9l12-3v14.5" fill="none" stroke="${W}" stroke-width="2.2"/><ellipse cx="10.5" cy="23.5" rx="3.6" ry="2.8" fill="${W}"/><ellipse cx="22.5" cy="20.5" rx="3.6" ry="2.8" fill="${W}"/>`,
    calc: `<rect x="7" y="4" width="20" height="26" rx="2" fill="#2b2f35"/><rect x="9.5" y="6.5" width="15" height="6" fill="#bfe3b0"/>${[0, 1, 2].flatMap(r => [0, 1, 2].map(c => `<rect x="${9.5 + c * 5.3}" y="${15 + r * 4.8}" width="4" height="3.4" rx=".6" fill="#ddd"/>`)).join("")}`,
    email: `<rect x="4" y="8" width="26" height="18" rx="2" fill="${W}"/><path d="M4.8 9l12.2 9.5L29.2 9" fill="none" stroke="#2e8f3a" stroke-width="2"/><circle cx="26" cy="24" r="5" fill="#ffd34d"/>`,
    settings: `<circle cx="17" cy="17" r="5" fill="none" stroke="${W}" stroke-width="3"/>${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<rect x="15.5" y="4" width="3" height="6" rx="1" fill="${W}" transform="rotate(${a} 17 17)"/>`).join("")}`,
    radio: `<rect x="5" y="11" width="24" height="16" rx="2" fill="${W}"/><circle cx="12" cy="19" r="4" fill="#7a4a20"/><rect x="19" y="15" width="7" height="2" fill="#7a4a20"/><rect x="19" y="19" width="7" height="2" fill="#7a4a20"/><path d="M8 11l14-6" stroke="${W}" stroke-width="1.6"/>`,
    diary: `<rect x="8" y="5" width="18" height="24" rx="1.5" fill="#f3e2c3"/><rect x="8" y="5" width="4" height="24" fill="#8a5a2b"/><path d="M15 11h8M15 15h8M15 19h6" stroke="#8a5a2b" stroke-width="1.4"/>`,
    market: `<path d="M8 12h18l-1.5 16h-15z" fill="${W}"/><path d="M12 12a5 5 0 0 1 10 0" fill="none" stroke="${W}" stroke-width="2"/><circle cx="14" cy="18" r="1.3" fill="#3c8f1e"/><circle cx="20" cy="18" r="1.3" fill="#3c8f1e"/>`,
    files: `<path d="M5 10h9l2 2.5h13V27H5z" fill="#fff3c9"/><path d="M5 14h24v13H5z" fill="#ffe08a"/>`,
    briefing: `<circle cx="13" cy="13" r="5.5" fill="#ffe36b"/><path d="M11 26h14a4.5 4.5 0 0 0-1-8.9 6 6 0 0 0-11.4 1.6A3.7 3.7 0 0 0 11 26z" fill="${W}"/>`
  };
  const APPS = {
    phone: { label: "전화", a: "#7ddc5a", b: "#2a8a18" },
    contacts: { label: "연락처", a: "#f9ad5c", b: "#d1561b" },
    message: { label: "메시지", a: "#fde27a", b: "#e2a21b" },
    apps: { label: "애플리케이션", a: "#62b8f5", b: "#1d5fc0" },
    internet: { label: "인터넷", a: "#5cbcff", b: "#0b4fae" },
    camera: { label: "카메라", a: "#6f757e", b: "#22252a" },
    gallery: { label: "갤러리", a: "#ffd46a", b: "#de830c" },
    calendar: { label: "캘린더", a: "#fafafa", b: "#cfd6cc" },
    clock: { label: "시계", a: "#e9ecef", b: "#9aa1a8" },
    memo: { label: "메모", a: "#fff27c", b: "#d9b425" },
    music: { label: "음악", a: "#d991f2", b: "#7f27ad" },
    calc: { label: "계산기", a: "#a5aeb8", b: "#4a525c" },
    email: { label: "이메일", a: "#7fd87f", b: "#2a8a36" },
    settings: { label: "환경 설정", a: "#a6acb4", b: "#4f5660" },
    radio: { label: "FM 라디오", a: "#d39a62", b: "#74441b" },
    diary: { label: "미니 다이어리", a: "#c49465", b: "#6b4523" },
    market: { label: "마켓", a: "#98d958", b: "#3a8a1a" },
    files: { label: "내 파일", a: "#ffc95a", b: "#d9820a" },
    briefing: { label: "데일리 브리핑", a: "#86c8ff", b: "#2a6fc6" }
  };
  const badge = id => {
    if (id === "phone") { const n = P.calls.filter(c => c.dir === "missed" && !c.seen).length; return n || 0; }
    if (id === "message") return P.messages.reduce((a, t) => a + (t.unread || 0), 0);
    return 0;
  };
  const tile = id => {
    const A = APPS[id], n = badge(id);
    const inner = id === "calendar" ? `<i class="caltop"></i><span class="calnum">${TODAY.getDate()}</span>` : `<svg viewBox="0 0 34 34">${G[id] || ""}</svg>`;
    return `<span class="ti" style="--a:${A.a};--b:${A.b}">${inner}${n ? `<b data-badge="${id}">${n}</b>` : ""}</span>`;
  };
  const appBtn = (id, label) => `<button class="ap" data-app="${id}">${tile(id)}<span>${esc(label || APPS[id].label)}</span></button>`;
  const AV = `<svg viewBox="0 0 40 40"><circle cx="20" cy="15" r="8" fill="#c9ced6"/><path d="M4 41c1-9 8-14 16-14s15 5 16 14z" fill="#c9ced6"/></svg>`;
  const IC = {
    in: `<svg class="call-ic" viewBox="0 0 20 20"><path d="M15 5L6 14M6 8v6h6" fill="none" stroke="#5fd34a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    out: `<svg class="call-ic" viewBox="0 0 20 20"><path d="M5 15l9-9M8 6h6v6" fill="none" stroke="#f5a623" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    missed: `<svg class="call-ic" viewBox="0 0 20 20"><path d="M3 7l6 6 8-8" fill="none" stroke="#ff4b3e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    handset: `<svg viewBox="0 0 34 34">${G.phone}</svg>`,
    back: `<svg viewBox="0 0 24 24"><path d="M20 7H9l-5 5 5 5h11z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/><path d="M11 10l4 4M15 10l-4 4" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    sms: `<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="1.5" fill="#fff"/><path d="M3.5 7l8.5 6.5L20.5 7" fill="none" stroke="#c98a12" stroke-width="1.6"/></svg>`,
    keypad: `<svg viewBox="0 0 24 24" fill="currentColor">${[5, 12, 19].flatMap(y => [5, 12, 19].map(x => `<circle cx="${x}" cy="${y}" r="2.1"/>`)).join("")}</svg>`,
    log: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" stroke-linecap="round"/></svg>`,
    person: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8.5" r="4"/><path d="M4 21c.6-4.5 3.8-7 8-7s7.4 2.5 8 7z"/></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>`,
    alarm: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="13" r="7.5"/><path d="M12 9v4h3M4 6l3-2.5M20 6l-3-2.5" stroke-linecap="round"/></svg>`,
    globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg>`,
    watch: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="13" r="8"/><path d="M12 13V8M10 2h4" stroke-linecap="round"/></svg>`,
    timer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9"/></svg>`
  };

  /* ================= 화면 스택 ================= */
  const layer = $("#phoneLayer"), body = $("#body"), screens = $("#screens");
  let stack = [], locked = true;
  function push(el) {
    const prev = stack[stack.length - 1];
    el.classList.add("enter"); screens.appendChild(el); stack.push(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove("enter")));
    if (prev) setTimeout(() => { if (stack.includes(prev) && stack[stack.length - 1] !== prev) prev.style.visibility = "hidden"; }, 240);
    return el;
  }
  function pop() {
    if (stack.length <= 1) return;
    const el = stack.pop(), prev = stack[stack.length - 1];
    prev.style.visibility = ""; if (prev._refresh) prev._refresh();
    el.classList.add("leave"); setTimeout(() => el.remove(), 230);
    if (el._onClose) el._onClose();
  }
  function popToRoot() { while (stack.length > 1) pop(); }
  const toastEl = $("#toast"); let toastT;
  function toast(msg) { toastEl.textContent = msg; toastEl.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => toastEl.hidden = true, 1800); }

  /* ================= 상태 표시줄 ================= */
  const bat = $("#bat");
  bat.querySelector("i").style.height = Math.max(8, P.battery ?? 60) + "%"; bat.classList.toggle("low", (P.battery ?? 60) < 20);
  function sbIcons() {
    const missed = badge("phone"), unread = badge("message");
    $("#sbLeft").innerHTML = (missed ? `<svg viewBox="0 0 20 20"><path d="M3 7l6 6 8-8" fill="none" stroke="#ff4b3e" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>` : "") + (unread ? IC.sms : "");
    document.querySelectorAll("[data-badge]").forEach(b => { const n = badge(b.dataset.badge); b.textContent = n; b.hidden = !n; });
  }
  function tick() {
    $("#sbTime").textContent = nowLabel();
    document.querySelectorAll("[data-now]").forEach(e => { const o = now(); e.innerHTML = `${hm(o)}<small class="lk-ampm">${ampm(o)}</small>`; });
  }
  setInterval(tick, 1000);

  /* ================= 가로 넘기기(홈·서랍) ================= */
  function pager(wrap, track, n, start, onChange) {
    let idx = start, sx = null, dx = 0, moved = false;
    const set = (i, anim = true) => { idx = Math.max(0, Math.min(n - 1, i)); track.style.transition = anim ? "" : "none"; track.style.transform = `translateX(${-idx * 100}%)`; onChange(idx); };
    set(start, false);
    wrap.addEventListener("pointerdown", e => { sx = e.clientX; dx = 0; moved = false; track.style.transition = "none"; });
    wrap.addEventListener("pointermove", e => { if (sx === null) return; dx = e.clientX - sx; if (Math.abs(dx) > 8) moved = true; track.style.transform = `translateX(calc(${-idx * 100}% + ${dx}px))`; });
    const up = () => { if (sx === null) return; sx = null; const w = wrap.clientWidth; set(dx < -w * .18 ? idx + 1 : dx > w * .18 ? idx - 1 : idx); };
    wrap.addEventListener("pointerup", up); wrap.addEventListener("pointercancel", up); wrap.addEventListener("pointerleave", up);
    wrap.addEventListener("click", e => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
  }
  const dots = (box, n, i) => { box.innerHTML = Array.from({ length: n }, (_, k) => `<i class="${k === i ? "on" : ""}">${k === i ? k + 1 : ""}</i>`).join(""); };
  const wallHTML = () => P.wallpaper ? `<div class="wall photo" style="background:url('${esc(P.wallpaper)}') center/cover"></div>` : `<div class="wall"></div>`;

  /* ================= 잠금화면 ================= */
  function lockScreen() {
    const missed = badge("phone"), unread = badge("message");
    const el = h(`<section class="scr lock">${wallHTML()}
      <div class="lk-clock"><div class="lk-time" data-now></div><div class="lk-date">${dateLabel(TODAY)}</div></div>
      <div class="lk-noti">
        ${missed ? `<div>${IC.missed}부재중 전화 ${missed}통</div>` : ""}
        ${unread ? `<div>${IC.sms}새 메시지 ${unread}개</div>` : ""}
      </div>
      <div class="lk-slide"><span>밀어서 잠금 해제</span><div class="lk-knob"><svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor"/><path d="M8 11V8a4 4 0 0 1 8 0" fill="none" stroke="currentColor" stroke-width="2.2"/></svg></div></div>
    </section>`);
    const track = el.querySelector(".lk-slide"), knob = el.querySelector(".lk-knob");
    let sx = null, max = 0;
    knob.addEventListener("pointerdown", e => { sx = e.clientX; max = track.clientWidth - knob.offsetWidth - 10; knob.setPointerCapture(e.pointerId); knob.style.transition = "none"; });
    knob.addEventListener("pointermove", e => { if (sx === null) return; knob.style.transform = `translateX(${Math.max(0, Math.min(max, e.clientX - sx))}px)`; });
    const up = e => { if (sx === null) return; const dx = e.clientX - sx; sx = null; knob.style.transition = "transform .2s";
      if (dx > max * .75) { knob.style.transform = `translateX(${max}px)`; setTimeout(unlock, 150); } else knob.style.transform = ""; };
    knob.addEventListener("pointerup", up); knob.addEventListener("pointercancel", up);
    return el;
  }
  function unlock() {
    locked = false;
    const lk = stack[0]; const home = homeScreen();
    screens.innerHTML = ""; stack = []; push(home); sbIcons(); tick();
    if (lk) lk.remove();
  }

  /* ================= 홈 ================= */
  function homeScreen() {
    const memo = (P.memos || [])[0];
    const pages = [
      `${appBtn("gallery")}${appBtn("music")}${appBtn("camera")}${appBtn("radio")}`,
      `<div class="wg wg-clock"><div><div class="t" data-now></div><div class="d">${dateLabel(TODAY)}</div></div><div class="w">서울<b>3°</b>흐림</div></div>${appBtn("internet")}${appBtn("calendar")}${appBtn("memo")}${appBtn("clock")}`,
      `${memo ? `<button class="wg wg-memo" data-app="memo"><small>${esc(memo.date)}</small>${esc(memo.text)}</button>` : ""}${appBtn("email")}${appBtn("market")}${appBtn("settings")}`
    ];
    const el = h(`<section class="scr home">${wallHTML()}
      <div class="hm-dots"></div>
      <div class="hm-pages"><div class="hm-track">${pages.map(p => `<div class="hm-page">${p}</div>`).join("")}</div></div>
      <nav class="dock">${appBtn("phone")}${appBtn("contacts")}${appBtn("message")}${appBtn("apps")}</nav>
    </section>`);
    pager(el.querySelector(".hm-pages"), el.querySelector(".hm-track"), pages.length, 1, i => dots(el.querySelector(".hm-dots"), pages.length, i));
    el._refresh = sbIcons;
    return el;
  }
  function drawer() {
    const ids = ["phone", "contacts", "message", "internet", "camera", "gallery", "calendar", "clock", "memo", "music", "calc", "email", "settings", "radio", "diary", "market", "files", "briefing"];
    const pages = []; for (let i = 0; i < ids.length; i += 16) pages.push(ids.slice(i, i + 16));
    const el = h(`<section class="scr drawer"><div class="dr-head"></div>
      <div class="hm-pages"><div class="hm-track">${pages.map(p => `<div class="hm-page">${p.map(id => appBtn(id)).join("")}</div>`).join("")}</div></div></section>`);
    pager(el.querySelector(".hm-pages"), el.querySelector(".hm-track"), pages.length, 0, i => dots(el.querySelector(".dr-head"), pages.length, i));
    return el;
  }

  /* ================= 앱 열기 ================= */
  function openApp(id) {
    const f = {
      apps: drawer, phone: () => phoneApp("keypad"), contacts: contactsApp, message: messagesApp, memo: memoApp,
      calendar: calendarApp, clock: clockApp, music: musicApp, gallery: galleryApp, internet: internetApp
    }[id];
    if (f) { push(f()); return; }
    toast(id === "camera" ? "카메라를 시작할 수 없습니다." : "지원하지 않는 기능입니다.");
  }
  screens.addEventListener("click", e => { const b = e.target.closest("[data-app]"); if (b && !locked) openApp(b.dataset.app); });

  /* ================= 연락처 공통 ================= */
  const CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
  const initial = n => { const c = n.charCodeAt(0); if (c >= 0xac00 && c <= 0xd7a3) { const i = CHO[Math.floor((c - 0xac00) / 588)]; return ({ ㄲ: "ㄱ", ㄸ: "ㄷ", ㅃ: "ㅂ", ㅆ: "ㅅ", ㅉ: "ㅈ" })[i] || i; } return /[a-z]/i.test(n[0]) ? n[0].toUpperCase() : "#"; };
  const contactBy = q => P.contacts.find(c => c.name === q || c.number === q);
  const nameOf = q => (contactBy(q) || {}).name || q;
  const numberOf = q => (contactBy(q) || {}).number || q;
  function contactRows() {
    const list = [...P.contacts].sort((a, b) => a.name.localeCompare(b.name, "ko"));
    let last = "", out = "";
    list.forEach(c => { const i = initial(c.name); if (i !== last) { out += `<div class="sec">${i}</div>`; last = i; }
      out += `<button class="row" data-contact="${esc(c.name)}" style="width:100%;text-align:left"><span class="ph">${AV}</span><span class="tx"><b>${esc(c.name)}</b><small>${esc(c.number)}</small></span></button>`; });
    return out || `<div class="empty">연락처가 없습니다.</div>`;
  }
  function contactDetail(name) {
    const c = contactBy(name) || { name, number: name };
    const el = h(`<section class="scr"><div class="tbar">${esc(c.name)}</div>
      <div class="detail"><span class="ph">${AV}</span><div><b>${esc(c.name)}</b></div></div>
      <div class="scroll list"><div class="row"><span class="tx"><small>휴대폰</small><b>${esc(c.number)}</b></span></div></div>
      <div class="btnbar"><button class="green" data-call>통화</button><button data-sms>메시지</button></div></section>`);
    el.querySelector("[data-call]").onclick = () => placeCall(c.name);
    el.querySelector("[data-sms]").onclick = () => push(convScreen(threadFor(c.name)));
    return el;
  }
  function contactsApp() {
    const el = h(`<section class="scr"><div class="tbar">연락처<small>${P.contacts.length}개</small></div><div class="scroll list">${contactRows()}</div></section>`);
    el.addEventListener("click", e => { const r = e.target.closest("[data-contact]"); if (r) push(contactDetail(r.dataset.contact)); });
    return el;
  }

  /* ================= 전화 ================= */
  const LET = { 2: "ABC", 3: "DEF", 4: "GHI", 5: "JKL", 6: "MNO", 7: "PQRS", 8: "TUV", 9: "WXYZ", 0: "+" };
  function callRows() {
    return P.calls.map((c, i) => `<button class="row" data-callrow="${i}" style="width:100%;text-align:left">${IC[c.dir] || IC.in}<span class="tx"><b style="${c.dir === "missed" ? "color:#ff6b5e" : ""}">${esc(nameOf(c.name))}${c.count > 1 ? ` (${c.count})` : ""}</b><small>${esc(contactBy(c.name) ? numberOf(c.name) : "저장되지 않은 번호")}${c.length ? " · " + esc(c.length) : ""}</small></span><span class="rt">${esc(c.when)}</span></button>`).join("") || `<div class="empty">통화 기록이 없습니다.</div>`;
  }
  function phoneApp(tab) {
    const el = h(`<section class="scr">
      <nav class="tabs"><button data-tab="keypad">${IC.keypad}키패드</button><button data-tab="log">${IC.log}통화기록</button><button data-tab="contacts">${IC.person}연락처</button><button data-tab="fav">${IC.star}즐겨찾기</button></nav>
      <div class="dial" data-body></div></section>`);
    const bodyEl = el.querySelector("[data-body]");
    let num = "";
    const render = t => {
      el.querySelectorAll("[data-tab]").forEach(b => b.classList.toggle("on", b.dataset.tab === t));
      if (t === "keypad") {
        bodyEl.innerHTML = `<div class="dial-num" data-num></div><div class="dial-pad">${["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map(k => `<button data-k="${k}">${k}<small>${LET[k] || (k === "1" ? "∞" : "&nbsp;")}</small></button>`).join("")}</div>
          <div class="dial-act"><button data-dsms>${IC.sms}</button><button class="call" data-dcall>${IC.handset}</button><button data-del>${IC.back}</button></div>`;
        const show = () => { const d = bodyEl.querySelector("[data-num]"); d.textContent = num || "번호를 입력하세요"; d.classList.toggle("empty", !num); };
        show();
        bodyEl.querySelectorAll("[data-k]").forEach(b => b.onclick = () => { if (num.length < 16) num += b.dataset.k; show(); });
        bodyEl.querySelector("[data-del]").onclick = () => { num = num.slice(0, -1); show(); };
        bodyEl.querySelector("[data-dcall]").onclick = () => { if (!num) { const last = P.calls.find(c => c.dir === "out"); if (last) { num = numberOf(last.name); show(); } return; } placeCall(num); };
        bodyEl.querySelector("[data-dsms]").onclick = () => { if (num) push(convScreen(threadFor(nameOf(num)))); };
      } else if (t === "log") {
        P.calls.forEach(c => { if (c.dir === "missed") c.seen = true; }); sbIcons();
        bodyEl.innerHTML = `<div class="scroll list">${callRows()}</div>`;
        bodyEl.onclick = e => { const r = e.target.closest("[data-callrow]"); if (r) placeCall(P.calls[+r.dataset.callrow].name); };
      } else if (t === "contacts") {
        bodyEl.innerHTML = `<div class="scroll list">${contactRows()}</div>`;
        bodyEl.onclick = e => { const r = e.target.closest("[data-contact]"); if (r) push(contactDetail(r.dataset.contact)); };
      } else { bodyEl.innerHTML = `<div class="empty">즐겨찾기가 없습니다.</div>`; bodyEl.onclick = null; }
      if (t === "keypad") bodyEl.onclick = null;
      el._tab = t;
    };
    el.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => render(b.dataset.tab));
    el._refresh = () => { if (el._tab === "log") render("log"); };
    render(tab);
    return el;
  }
  /* 통화 소리: 수신음(뚜— 뚜—)과 삐 소리 */
  let audioCtx = null;
  function ringback() {
    const ctx = audioCtx; if (!ctx) return () => {};
    try { if (ctx.state === "suspended") ctx.resume(); } catch (e) {}
    const g = ctx.createGain(); g.gain.value = 0; g.connect(ctx.destination);
    const os = [440, 480].map(f => { const o = ctx.createOscillator(); o.frequency.value = f; o.connect(g); o.start(); return o; });
    const cycle = () => { const t = ctx.currentTime; g.gain.setValueAtTime(.05, t); g.gain.setValueAtTime(0, t + 1); };
    cycle(); const iv = setInterval(cycle, 3000); let done = false;
    return () => { if (done) return; done = true; clearInterval(iv); try { os.forEach(o => o.stop()); g.disconnect(); } catch (e) {} };
  }
  function beep() {
    const ctx = audioCtx; if (!ctx) return;
    const g = ctx.createGain(), o = ctx.createOscillator(); o.frequency.value = 1000; g.gain.value = .06;
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + .6);
  }
  function sob(ms) {   // 흐느끼는 소리 합성: 들숨(헉) + 떨리는 목소리 흐느낌(으, 흐으) + 숨소리, 전화선처럼 대역 제한
    const ctx = audioCtx; if (!ctx) return;
    const out = ctx.createGain(); out.gain.value = 2.6;
    const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 320;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3200;
    out.connect(hp); hp.connect(lp); lp.connect(ctx.destination);
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    const R = (a, b) => a + Math.random() * (b - a);
    const breath = (t, dur, freq, vol, rise) => {   // 숨소리 (들숨은 rise=true)
      const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
      const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.setValueAtTime(freq, t); f.frequency.linearRampToValueAtTime(freq * (rise ? 1.5 : .8), t + dur); f.Q.value = 1.4;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + (rise ? dur * .8 : .04)); g.gain.linearRampToValueAtTime(0, t + dur);
      s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random()); s.stop(t + dur + .05);
    };
    const voice = (t, dur, f0a, f0b, vol) => {   // 떨리는 목소리 한 토막
      const o = ctx.createOscillator(); o.type = "sawtooth";
      o.frequency.setValueAtTime(f0a, t); o.frequency.exponentialRampToValueAtTime(f0b, t + dur);
      const vib = ctx.createOscillator(), vg = ctx.createGain(); vib.frequency.value = R(5, 8); vg.gain.value = R(6, 14); vib.connect(vg); vg.connect(o.frequency);
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .03); g.gain.setValueAtTime(vol * .8, t + dur * .6); g.gain.linearRampToValueAtTime(0, t + dur);
      [[R(600, 800), 5, 1], [R(1050, 1300), 7, .6], [2600, 9, .25]].forEach(([fr, q, amt]) => {   // 모음 '으/어' 포먼트
        const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = fr; bp.Q.value = q;
        const fg = ctx.createGain(); fg.gain.value = amt; o.connect(bp); bp.connect(fg); fg.connect(g);
      });
      g.connect(out); breath(t, dur, 1400, vol * .5, false);
      o.start(t); vib.start(t); o.stop(t + dur + .05); vib.stop(t + dur + .05);
    };
    let t = ctx.currentTime + .15; const end = t + ms / 1000 - .3;
    while (t < end) {
      breath(t, R(.28, .45), 1800, R(.10, .16), true); t += R(.35, .5);           // 헉 (들숨)
      const n = Math.floor(R(2, 5)), base = R(260, 330);
      for (let k = 0; k < n && t < end; k++) { const d = R(.14, .26); voice(t, d, base * R(1, 1.08), base * R(.82, .92), R(.10, .16) * (1 - k * .12)); t += d + R(.05, .11); }
      if (Math.random() < .45 && t < end - 1) { const d = R(.6, 1.1); voice(t, d, R(300, 360), R(190, 230), R(.08, .13)); t += d + .1; }   // 길게 흐으으
      breath(t, R(.4, .7), 900, R(.05, .08), false); t += R(.5, 1.3);              // 내쉬는 숨
    }
  }
  /* 녹음된 소리 재생 (audio 폴더의 mp3). 휴대폰을 열 때 미리 불러 둠 */
  const sounds = {};
  function loadSound(url) {
    if (!audioCtx || sounds[url]) return;
    sounds[url] = fetch(url).then(r => r.arrayBuffer()).then(b => new Promise((res, rej) => audioCtx.decodeAudioData(b, res, rej))).catch(() => null);
  }
  function playSound(url) {
    let src = null, stopped = false;
    if (audioCtx) { loadSound(url); sounds[url].then(buf => { if (!buf || stopped) return; src = audioCtx.createBufferSource(); src.buffer = buf; src.connect(audioCtx.destination); src.start(); }); }
    return () => { stopped = true; try { src && src.stop(); } catch (e) {} };
  }
  function pickup() {   // 전화 받을 때 '달칵'
    const ctx = audioCtx; if (!ctx) return; const t = ctx.currentTime;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * .06), ctx.sampleRate), ch = buf.getChannelData(0);
    for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * .006));
    const s = ctx.createBufferSource(); s.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 2200; f.Q.value = .9;
    const g = ctx.createGain(); g.gain.value = .5; s.connect(f); f.connect(g); g.connect(ctx.destination); s.start(t);
    const o = ctx.createOscillator(), og = ctx.createGain(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(60, t + .08);
    og.gain.setValueAtTime(.18, t); og.gain.exponentialRampToValueAtTime(.001, t + .1); o.connect(og); og.connect(ctx.destination); o.start(t); o.stop(t + .12);
  }
  function lineHum() {   // 통화 중 수화기 너머 은은한 '웅—' (아주 작게)
    const ctx = audioCtx; if (!ctx) return () => {};
    const len = ctx.sampleRate * 3, buf = ctx.createBuffer(1, len, ctx.sampleRate), ch = buf.getChannelData(0);
    let last = 0; for (let i = 0; i < len; i++) { last = (last + .02 * (Math.random() * 2 - 1)) / 1.02; ch[i] = last * 3.5; }   // 낮게 깔리는 잡음
    const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 420;
    const hum = ctx.createOscillator(); hum.frequency.value = 110; const hg = ctx.createGain(); hg.gain.value = .006;
    const g = ctx.createGain(), t = ctx.currentTime; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.05, t + .6);
    s.connect(lp); lp.connect(g); hum.connect(hg); hg.connect(g); g.connect(ctx.destination); s.start(); hum.start();
    let done = false;
    return () => { if (done) return; done = true; const t2 = ctx.currentTime; g.gain.cancelScheduledValues(t2); g.gain.setValueAtTime(g.gain.value, t2); g.gain.linearRampToValueAtTime(0, t2 + .25); try { s.stop(t2 + .3); hum.stop(t2 + .3); } catch (e) {} };
  }
  function placeCall(target) {
    const name = nameOf(target), number = numberOf(target);
    let sc = (P.callScripts || {})[name] || (P.callScripts || {})[number];
    if (sc) {   // 두 번째 전화부터는 again 대본 (reject: 짧게 울리다 끊김)
      sc._n = (sc._n || 0) + 1;
      if (sc._n >= 2 && sc.again) sc = sc.again.reject ? { ringMs: sc.again.ringMs || 1800, dead: true, lines: [] } : sc.again;
    }
    const el = h(`<section class="scr callscr">
      <div class="cs-state" data-state>발신 중…</div>
      <div class="cs-ph">${AV}</div>
      <div class="cs-name">${esc(name)}</div><div class="cs-num">${esc(name === number ? "" : number)}</div>
      <div class="cs-line" data-line></div>
      <button class="cs-end" data-end>${IC.handset}종료</button></section>`);
    const timers = [], st = el.querySelector("[data-state]"), line = el.querySelector("[data-line]");
    let t1 = null, tmr = null, ended = false; const stopRing = ringback(), stops = [];
    const say = txt => {
      if (sc && sc.stack) {   // stack: 앞 대사는 위로 밀려 올라가고 새 대사가 아래에 붙음
        const olds = [...line.children], before = olds.map(n => n.getBoundingClientRect().top);
        const n = document.createElement("div"); n.className = "ln"; n.textContent = txt; line.appendChild(n);
        olds.forEach((o, i) => { const dy = before[i] - o.getBoundingClientRect().top; if (dy) o.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }], { duration: 380, easing: "ease-out" }); });
        requestAnimationFrame(() => n.classList.add("in"));
      } else line.textContent = txt;
      line.classList.add("show");
    };
    const end = () => {
      if (ended) return; ended = true; timers.forEach(clearTimeout); clearInterval(tmr); stopRing(); stops.forEach(f => f());
      const sec = t1 ? Math.floor((Date.now() - t1) / 1000) : 0;
      P.calls.unshift({ name: contactBy(target) ? name : number, dir: "out", when: nowLabel(), length: t1 ? `${Math.floor(sec / 60)}분 ${sec % 60}초` : "" });
      st.textContent = "통화 종료"; setTimeout(() => { if (stack.includes(el)) pop(); }, 900);
    };
    el._onClose = () => { stopRing(); stops.forEach(f => f()); if (!ended) { ended = true; timers.forEach(clearTimeout); clearInterval(tmr); } };
    el.querySelector("[data-end]").onclick = end;
    if (sc) {
      timers.push(setTimeout(() => {
        stopRing();
        if (!sc.dead) {   // dead: 없는 번호 안내만 나오고 통화는 연결되지 않음
          pickup(); stops.push(lineHum());
          t1 = Date.now(); const draw = () => { const s = Math.floor((Date.now() - t1) / 1000); st.textContent = `통화 중  ${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
          draw(); tmr = setInterval(draw, 1000);
        }
        let at = 900;
        (sc.lines || []).forEach(l => { const txt = typeof l === "string" ? l : l.text, ms = (l && l.ms) || 2600; timers.push(setTimeout(() => { if (l && l.beep) beep(); if (l && l.sob) sob(ms); if (l && l.sound) stops.push(playSound(l.sound)); say(txt); }, at)); at += ms; });
        timers.push(setTimeout(() => { line.classList.remove("show"); }, at)); timers.push(setTimeout(end, at + 900));
      }, sc.ringMs || 2600));
    } else {
      timers.push(setTimeout(() => { stopRing(); say("전화를 받지 않아 소리샘으로 연결됩니다."); }, 4200));
      timers.push(setTimeout(end, 7000));
    }
    push(el);
  }

  /* ================= 메시지 ================= */
  const threadFor = name => P.messages.find(t => t.name === name) || { name, msgs: [], _new: true };
  function threadRows() {
    return P.messages.map((t, i) => { const last = [...t.msgs].reverse().find(m => m.text) || {}; const d = [...t.msgs].reverse().find(m => m.date);
      return `<button class="row${t.unread ? " unread" : ""}" data-thread="${i}" style="width:100%;text-align:left"><span class="ph">${AV}</span><span class="tx"><b>${esc(nameOf(t.name))}</b><small>${esc(last.text || "")}</small></span><span class="rt">${esc((() => { const md = d && d.date.match(/(\d+)월 (\d+)일/); return md && !(+md[1] === TODAY.getMonth() + 1 && +md[2] === TODAY.getDate()) ? `${md[1]}월 ${md[2]}일` : (last.time || ""); })())}${t.unread ? `<br><span class="cnt">${t.unread}</span>` : ""}</span></button>`; }).join("") || `<div class="empty">메시지가 없습니다.</div>`;
  }
  function messagesApp() {
    const el = h(`<section class="scr"><div class="tbar">메시지</div><div class="scroll list" data-list>${threadRows()}</div></section>`);
    el.addEventListener("click", e => { const r = e.target.closest("[data-thread]"); if (r) push(convScreen(P.messages[+r.dataset.thread])); });
    el._refresh = () => { el.querySelector("[data-list]").innerHTML = threadRows(); };
    return el;
  }
  function convScreen(T) {
    T.unread = 0; sbIcons();
    const bubble = m => m.date ? `<div class="date"><span>${esc(m.date)}</span></div>` : `<div class="bub${m.me ? " me" : ""}"><div class="b">${esc(m.text)}</div><small>${esc(m.time || "")}</small></div>`;
    const el = h(`<section class="scr"><div class="tbar">${esc(nameOf(T.name))}<small>${esc(numberOf(T.name) === T.name ? "" : numberOf(T.name))}</small></div>
      <div class="scroll conv" data-conv>${T.msgs.map(bubble).join("")}</div>
      <form class="compose"><input placeholder="메시지 입력" enterkeyhint="send" autocomplete="off"><button>전송</button></form></section>`);
    const conv = el.querySelector("[data-conv]"), inp = el.querySelector("input");
    requestAnimationFrame(() => conv.scrollTop = conv.scrollHeight);
    const add = m => { T.msgs.push(m); conv.insertAdjacentHTML("beforeend", bubble(m)); conv.scrollTop = conv.scrollHeight; };
    el.querySelector("form").onsubmit = e => {
      e.preventDefault(); const text = inp.value.trim(); if (!text) return; inp.value = "";
      const dl = `${TODAY.getFullYear()}년 ${dateLabel(TODAY)}`;
      if (([...T.msgs].reverse().find(m => m.date) || {}).date !== dl) add({ date: dl });
      add({ me: true, text, time: nowLabel() });
      if (T._new) { delete T._new; } const i = P.messages.indexOf(T); if (i >= 0) P.messages.splice(i, 1); P.messages.unshift(T);
      const R = T.replies; if (R && (T._ri ?? -1) + 1 < R.length) { const r = R[T._ri = (T._ri ?? -1) + 1]; setTimeout(() => add({ text: r, time: nowLabel() }), 1800); }
    };
    return el;
  }

  /* ================= 메모 ================= */
  function memoApp() {
    const el = h(`<section class="scr"><div class="tbar">메모<small>${(P.memos || []).length}개</small></div>
      <div class="scroll"><div class="memo-grid">${(P.memos || []).map((m, i) => `<button class="memo" data-memo="${i}"><small>${esc(m.date)}</small>${esc(m.text)}</button>`).join("")}</div></div></section>`);
    el.addEventListener("click", e => { const b = e.target.closest("[data-memo]"); if (!b) return; const m = P.memos[+b.dataset.memo];
      push(h(`<section class="scr"><div class="tbar">메모<small>${esc(m.date)}</small></div><div class="memo-full">${esc(m.text)}</div></section>`)); });
    return el;
  }

  /* ================= 캘린더 ================= */
  function calendarApp() {
    let view = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1), sel = new Date(TODAY);
    const el = h(`<section class="scr"><div class="cal-head"><button data-prev>◀</button><span data-title></span><button data-next>▶</button></div>
      <div class="cal-grid" data-grid></div><div class="scroll list" data-day></div></section>`);
    const evs = d => (P.events || []).filter(e => e.date === key(d));
    const render = () => {
      el.querySelector("[data-title]").textContent = `${view.getFullYear()}년 ${view.getMonth() + 1}월`;
      const first = view.getDay(), days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
      let html = [..."일월화수목금토"].map((w, i) => `<span class="wd ${i === 0 ? "sun" : i === 6 ? "sat" : ""}">${w}</span>`).join("");
      for (let i = 0; i < 42; i++) {
        const d = new Date(view.getFullYear(), view.getMonth(), i - first + 1), out = d.getMonth() !== view.getMonth();
        if (i >= 35 && first + days <= 35) break;
        html += `<span data-d="${key(d)}" class="${out ? "out" : ""} ${d.getDay() === 0 ? "sun" : d.getDay() === 6 ? "sat" : ""} ${key(d) === key(TODAY) ? "today" : ""} ${evs(d).length ? "ev" : ""} ${key(d) === key(sel) ? "sel" : ""}">${d.getDate()}</span>`;
      }
      el.querySelector("[data-grid]").innerHTML = html;
      const list = evs(sel);
      el.querySelector("[data-day]").innerHTML = `<div class="sec">${sel.getMonth() + 1}월 ${sel.getDate()}일 ${WD[sel.getDay()]}요일</div>` + (list.map(e => `<div class="row"><span class="tx"><b>${esc(e.title)}</b><small>${esc(e.time || "종일")}</small></span></div>`).join("") || `<div class="empty">일정이 없습니다.</div>`);
    };
    el.querySelector("[data-prev]").onclick = () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); render(); };
    el.querySelector("[data-next]").onclick = () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); render(); };
    el.querySelector("[data-grid]").onclick = e => { const s = e.target.closest("[data-d]"); if (s) { sel = parseD(s.dataset.d); render(); } };
    render();
    return el;
  }

  /* ================= 시계 ================= */
  function clockApp() {
    const el = h(`<section class="scr"><nav class="tabs"><button class="on">${IC.alarm}알람</button><button data-x>${IC.globe}세계 시각</button><button data-x>${IC.watch}스톱워치</button><button data-x>${IC.timer}타이머</button></nav>
      <div class="scroll list">${(P.alarms || []).map((a, i) => `<div class="row"><span class="tx"><b style="font-size:22px;font-weight:300">${esc(a.time)}</b><small>${esc(a.label)} · ${esc(a.repeat || "")}</small></span><button class="tog${a.on ? " on" : ""}" data-al="${i}"></button></div>`).join("") || `<div class="empty">알람이 없습니다.</div>`}</div></section>`);
    el.querySelectorAll("[data-al]").forEach(b => b.onclick = () => { const a = P.alarms[+b.dataset.al]; a.on = !a.on; b.classList.toggle("on", a.on); toast(a.on ? "알람이 설정되었습니다." : "알람이 해제되었습니다."); });
    el.querySelectorAll("[data-x]").forEach(b => b.onclick = () => toast("지원하지 않는 기능입니다."));
    return el;
  }

  /* ================= 음악 ================= */
  function musicApp() {
    const el = h(`<section class="scr"><div class="tbar">음악<small>${(P.music || []).length}곡</small></div>
      <div class="scroll list">${(P.music || []).map((s, i) => `<button class="row" data-song="${i}" style="width:100%;text-align:left"><span class="ph" style="background:linear-gradient(135deg,#3b2a5c,#121019);align-items:center"><svg viewBox="0 0 34 34" style="width:26px;height:26px">${G.music}</svg></span><span class="tx"><b>${esc(s.title)}</b><small>${esc(s.artist)}</small></span></button>`).join("") || `<div class="empty">음악이 없습니다.</div>`}</div></section>`);
    el.addEventListener("click", e => { const b = e.target.closest("[data-song]"); if (b) push(nowPlaying(+b.dataset.song)); });
    return el;
  }
  function nowPlaying(i) {
    const s = P.music[i]; let on = true, p = 0;
    const el = h(`<section class="scr"><div class="tbar">재생 중</div>
      <div class="mus-art"><svg viewBox="0 0 34 34">${G.music}</svg></div>
      <div class="mus-t"><b>${esc(s.title)}</b><small>${esc(s.artist)}</small></div>
      <div class="mus-bar"><i></i></div>
      <div class="mus-ctl"><button data-pv><svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zM20 6v12L9 12z"/></svg></button><button data-pp></button><button data-nx><svg viewBox="0 0 24 24"><path d="M16 6h2v12h-2zM4 6v12l11-6z"/></svg></button></div></section>`);
    const bar = el.querySelector(".mus-bar i"), pp = el.querySelector("[data-pp]");
    const ico = () => pp.innerHTML = on ? `<svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>` : `<svg viewBox="0 0 24 24"><path d="M7 5v14l12-7z"/></svg>`;
    ico(); pp.onclick = () => { on = !on; ico(); };
    const t = setInterval(() => { if (on) { p = Math.min(100, p + .5); bar.style.width = p + "%"; } }, 1000);
    el._onClose = () => clearInterval(t);
    el.querySelector("[data-pv]").onclick = () => { if (i > 0) { pop(); push(nowPlaying(i - 1)); } };
    el.querySelector("[data-nx]").onclick = () => { if (i < P.music.length - 1) { pop(); push(nowPlaying(i + 1)); } };
    return el;
  }

  /* ================= 갤러리 ================= */
  const tint = k => `linear-gradient(135deg,hsl(${(k * 67) % 360} 35% 38%),hsl(${(k * 67 + 40) % 360} 30% 18%))`;
  function galleryApp() {
    const el = h(`<section class="scr"><div class="tbar">갤러리</div><div class="scroll list">${(P.gallery || []).map((a, i) => `<button class="row" data-album="${i}" style="width:100%;text-align:left"><span class="ph" style="background:${a.photos[0] && a.photos[0].img ? `url('${esc(a.photos[0].img)}') center/cover` : tint(i)}"></span><span class="tx"><b>${esc(a.album)}</b><small>${a.photos.length}개</small></span></button>`).join("")}</div></section>`);
    el.addEventListener("click", e => { const b = e.target.closest("[data-album]"); if (!b) return; const A = P.gallery[+b.dataset.album];
      const g = h(`<section class="scr"><div class="tbar">${esc(A.album)}</div><div class="scroll"><div class="gal-grid">${A.photos.map((p, k) => `<button data-ph="${k}" style="background:${p.img ? `url('${esc(p.img)}') center/cover` : tint(k + 3)}">${p.img ? "" : esc(p.caption || "")}</button>`).join("")}</div></div></section>`);
      g.addEventListener("click", ev => { const q = ev.target.closest("[data-ph]"); if (!q) return; const p = A.photos[+q.dataset.ph];
        push(h(`<section class="scr viewer"><div class="pic" style="${p.img ? `background-image:url('${esc(p.img)}')` : `background:${tint(+q.dataset.ph + 3)}`}">${p.img ? "" : esc(p.caption || "")}</div></section>`)); });
      push(g); });
    return el;
  }

  /* ================= 인터넷 ================= */
  function internetApp() {
    const el = h(`<section class="scr"><div class="urlbar"><span data-url>즐겨찾기</span></div><div class="sec">즐겨찾기</div>
      <div class="scroll list" data-body>${(P.bookmarks || []).map((b, i) => `<button class="row" data-bm="${i}" style="width:100%;text-align:left"><span class="tx"><b>${esc(b.title)}</b><small>${esc(b.url)}</small></span></button>`).join("")}</div></section>`);
    el.addEventListener("click", e => { const b = e.target.closest("[data-bm]"); if (!b) return; const B = P.bookmarks[+b.dataset.bm];
      el.querySelector("[data-url]").textContent = "http://" + B.url;
      el.querySelector("[data-body]").innerHTML = `<div class="empty" style="color:#bbb;line-height:1.7">웹 페이지를 사용할 수 없습니다<br><small style="color:#777">네트워크 연결 상태를 확인하세요.</small></div>`; });
    return el;
  }

  /* ================= 하드웨어 버튼 ================= */
  document.querySelectorAll("[data-key]").forEach(b => b.addEventListener("click", () => {
    const k = b.dataset.key;
    if (k === "back" && (locked || stack.length <= 1)) { closePhone(); return; }   // 첫 화면에서 뒤로 = 본문으로
    if (locked) return;
    if (k === "back") pop();
    else if (k === "home") popToRoot();
    else if (k === "menu") toast("메뉴");
  }));

  /* ================= 열기 / 닫기 ================= */
  function fit() {
    if (innerWidth <= 520) { body.style.transform = ""; return; }
    const s = Math.min(1, (innerHeight - 24) / 742, (innerWidth - 24) / 372);
    body.style.transform = `scale(${s})`;
  }
  addEventListener("resize", fit);
  function openPhone() {
    if (layer.classList.contains("open")) return;
    if (t0 === null) t0 = Date.now();
    try { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); else if (audioCtx.state === "suspended") audioCtx.resume(); } catch (e) {}
    Object.values(P.callScripts || {}).forEach(s => (s.lines || []).forEach(l => l && l.sound && loadSound(l.sound)));
    fit();
    if (!stack.length) { push(lockScreen()); }
    sbIcons(); tick();
    layer.classList.add("open"); layer.setAttribute("aria-hidden", "false");
    try { history.pushState({ phone: 1 }, "", "#phone"); } catch (e) {}
  }
  function closePhone(fromPop) {
    if (!layer.classList.contains("open")) return;
    layer.classList.remove("open"); layer.setAttribute("aria-hidden", "true");
    if (!fromPop) { try { if (location.hash === "#phone") history.back(); } catch (e) {} }
  }
  story.addEventListener("click", e => { if (e.target.closest("[data-open]")) { e.preventDefault(); openPhone(); } });
  layer.addEventListener("click", e => { if (e.target.closest("[data-close]")) closePhone(); });
  addEventListener("popstate", () => closePhone(true));
  addEventListener("keydown", e => { if (e.key === "Escape") closePhone(); });
})();
