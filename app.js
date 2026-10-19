(() => {
  const P = window.PHONE, S = window.STORY || {};
  const DIRECT = !(S.paragraphs || []).some(p => p);   // 본문이 비어 있으면 바로 휴대폰
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
  function setBat() { bat.querySelector("i").style.height = Math.max(P.battery > 0 ? 8 : 0, P.battery ?? 60) + "%"; bat.classList.toggle("low", (P.battery ?? 60) < 20); }
  setBat();
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
      <div class="lk-pat"><p data-msg>잠금 해제 패턴을 그리세요</p><div class="pat" data-pat><svg data-svg></svg>${[0,1,2,3,4,5,6,7,8].map(i => `<i data-d="${i}"></i>`).join("")}</div></div>
    </section>`);
    /* 3×3 패턴 잠금: 점 두 개 이상만 이으면 어떤 모양이든 열림 */
    const pat = el.querySelector("[data-pat]"), svg = el.querySelector("[data-svg]"), msg = el.querySelector("[data-msg]"), dots = [...pat.querySelectorAll("i")];
    let path = null, cur = null, done = false;
    const ctr = i => { const r = pat.getBoundingClientRect(), d = dots[i].getBoundingClientRect(); return [d.left + d.width / 2 - r.left, d.top + d.height / 2 - r.top]; };
    const draw = state => {
      const r = pat.getBoundingClientRect(); svg.setAttribute("viewBox", `0 0 ${r.width} ${r.height}`);
      const pts = (path || []).map(ctr); if (cur && pts.length && !state) pts.push(cur);
      svg.innerHTML = pts.length > 1 ? `<polyline points="${pts.map(p => p.join(",")).join(" ")}" class="${state || ""}"/>` : "";
      dots.forEach((d, i) => { d.className = path && path.includes(i) ? "on " + (state || "") : ""; });
    };
    const hit = (x, y) => { const r = pat.getBoundingClientRect(); for (let i = 0; i < 9; i++) { const [cx, cy] = ctr(i); if (Math.hypot(x - r.left - cx, y - r.top - cy) < r.width / 7.5) return i; } return -1; };
    const add = i => { if (i < 0 || path.includes(i)) return;
      const l = path[path.length - 1];   // 사이에 낀 점은 자동으로 포함
      if (l !== undefined) { const m = (l + i) / 2; if ((l + i) % 2 === 0 && Math.abs((l % 3) - (i % 3)) !== 1 && Math.abs(Math.floor(l / 3) - Math.floor(i / 3)) !== 1 && !path.includes(m)) path.push(m); }
      path.push(i); if (navigator.vibrate) try { navigator.vibrate(12); } catch (e) {} };
    pat.addEventListener("pointerdown", e => { if (done) return; path = []; pat.setPointerCapture(e.pointerId); const r = pat.getBoundingClientRect(); cur = [e.clientX - r.left, e.clientY - r.top]; add(hit(e.clientX, e.clientY)); msg.textContent = "완료되면 손가락을 떼세요"; draw(); });
    pat.addEventListener("pointermove", e => { if (!path || done) return; const r = pat.getBoundingClientRect(); cur = [e.clientX - r.left, e.clientY - r.top]; add(hit(e.clientX, e.clientY)); draw(); });
    const up = () => { if (!path || done) return; cur = null;
      if (path.length >= 2) { done = true; msg.textContent = "패턴이 맞습니다"; draw("ok"); setTimeout(unlock, 350); }
      else { msg.textContent = path.length ? "점을 2개 이상 연결하세요. 다시 시도하세요." : "잠금 해제 패턴을 그리세요"; draw("bad"); setTimeout(() => { if (!done) { path = null; draw(); } }, 900); } };
    pat.addEventListener("pointerup", up); pat.addEventListener("pointercancel", up);
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
    const page = `<div class="wg wg-clock"><div><div class="t" data-now></div><div class="d">${dateLabel(TODAY)}</div></div><div class="w">서울<b>9°</b>맑음</div></div>${["internet", "calendar", "memo", "clock", "gallery", "music"].map(id => appBtn(id)).join("")}`;
    const el = h(`<section class="scr home">${wallHTML()}
      <div class="hm-dots"></div>
      <div class="hm-pages"><div class="hm-track"><div class="hm-page">${page}</div></div></div>
      <nav class="dock">${appBtn("phone")}${appBtn("contacts")}${appBtn("message")}${appBtn("apps")}</nav>
    </section>`);
    el._refresh = sbIcons;
    return el;
  }
  function drawer() {
    const ids = ["phone", "contacts", "message", "internet", "gallery", "calendar", "clock", "memo", "music"];
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
        bodyEl.querySelectorAll("[data-k]").forEach(b => {
          let lp = null, fired = false;
          b.onpointerdown = () => { fired = false; if (b.dataset.k === "1" && !num) lp = setTimeout(() => { fired = true; placeCall("1"); }, 650); };   // 1번 길게: 음성사서함
          b.onpointerup = b.onpointerleave = () => clearTimeout(lp);
          b.onclick = () => { if (fired) return; dtmf(b.dataset.k); if (num.length < 16) num += b.dataset.k; show(); };
        });
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
  function pickup(hard) {   // 전화 받을 때 '달—칵' (두 번에 나눠 느리게). hard: 급하게 낚아채듯 크게 '덜컥'
    const ctx = audioCtx; if (!ctx) return;
    const tick = (t, vol, freq, tau, dur, thump) => {
      const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate), ch = buf.getChannelData(0);
      for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * tau));
      const s = ctx.createBufferSource(); s.buffer = buf;
      const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = freq; f.Q.value = .8;
      const g = ctx.createGain(); g.gain.value = vol; s.connect(f); f.connect(g); g.connect(ctx.destination); s.start(t);
      const o = ctx.createOscillator(), og = ctx.createGain(); o.frequency.setValueAtTime(thump, t); o.frequency.exponentialRampToValueAtTime(thump * .45, t + .2);
      og.gain.setValueAtTime(vol * .4, t); og.gain.exponentialRampToValueAtTime(.001, t + .22); o.connect(og); og.connect(ctx.destination); o.start(t); o.stop(t + .25);
    };
    const t = ctx.currentTime;
    if (hard) {   // 덜컥 — 수화기를 급히 들며 부딪히는 소리 (크게, 붙어서)
      tick(t, .9, 900, .03, .2, 90); tick(t + .06, 1, 1700, .022, .2, 130); tick(t + .2, .45, 2400, .012, .12, 160); return;
    }
    tick(t, .25, 1500, .012, .12, 110);          // 달—
    tick(t + .17, .5, 2000, .016, .16, 150);     // 칵
  }
  function lineHum() {   // 통화 중 수화기 너머 은은한 '웅—' (아주 작게)
    const ctx = audioCtx; if (!ctx) return () => {};
    const len = ctx.sampleRate * 3, buf = ctx.createBuffer(1, len, ctx.sampleRate), ch = buf.getChannelData(0);
    let last = 0; for (let i = 0; i < len; i++) { last = (last + .02 * (Math.random() * 2 - 1)) / 1.02; ch[i] = last * 3.5; }   // 낮게 깔리는 잡음
    const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 420;
    const hum = ctx.createOscillator(); hum.frequency.value = 110; const hg = ctx.createGain(); hg.gain.value = .012;
    const g = ctx.createGain(), t = ctx.currentTime; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.11, t + .6);
    s.connect(lp); lp.connect(g); hum.connect(hg); hg.connect(g); g.connect(ctx.destination); s.start(); hum.start();
    let done = false;
    return () => { if (done) return; done = true; const t2 = ctx.currentTime; g.gain.cancelScheduledValues(t2); g.gain.setValueAtTime(g.gain.value, t2); g.gain.linearRampToValueAtTime(0, t2 + .25); try { s.stop(t2 + .3); hum.stop(t2 + .3); } catch (e) {} };
  }
  /* 통화 화면 (갤럭시 S 스타일): 이름·번호 / 일시중단·시간 / 녹음·다이얼·통화 종료·스피커·송화음 차단·Bluetooth */
  const DTMF = { 1: [697, 1209], 2: [697, 1336], 3: [697, 1477], 4: [770, 1209], 5: [770, 1336], 6: [770, 1477], 7: [852, 1209], 8: [852, 1336], 9: [852, 1477], "*": [941, 1209], 0: [941, 1336], "#": [941, 1477] };
  function dtmf(k) {
    const ctx = audioCtx, f = DTMF[k]; if (!ctx || !f) return; const t = ctx.currentTime, g = ctx.createGain();
    g.gain.setValueAtTime(.05, t); g.gain.setValueAtTime(0, t + .14); g.connect(ctx.destination);
    f.forEach(fr => { const o = ctx.createOscillator(); o.frequency.value = fr; o.connect(g); o.start(t); o.stop(t + .15); });
  }
  const callShell = (name, sub, incoming) => `<section class="scr callscr tw${incoming ? " incall" : ""}">
      <div class="tw-head"><div class="tw-name">${esc(name)}</div><div class="tw-sub">${esc(sub || "")}</div></div>
      <div class="cs-line" data-line></div>
      <div class="tw-bar"><button class="tw-hold" data-hold><i></i><span>일시중단</span></button><span class="cs-state" data-state>${incoming ? "수신 전화" : "발신 중…"}</span></div>
      <div class="tw-grid" data-grid${incoming ? " hidden" : ""}>
        <button data-tk="rec"><i class="tw-rec"></i>녹음</button>
        <button data-tk="pad"><i class="tw-padic">${[1, 2, 3, 4].map(n => `<b>${n}</b>`).join("")}</i>다이얼</button>
        <button class="tw-end" data-end>${IC.handset}통화 종료</button>
        <button data-tk="spk">스피커</button>
        <button data-tk="mute">송화음 차단</button>
        <button data-tk="bt">Bluetooth</button>
      </div>
      ${incoming ? `<div class="ic-btns" data-btns><button class="ic-ok" data-ok>${IC.handset}통화</button><button class="ic-no" data-no>${IC.handset}거절</button></div>` : ""}
      <div class="tw-pad" data-pad hidden><div class="tw-digits" data-digits></div>
        <div class="tw-keys">${["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map(k => `<button data-dk="${k}">${k}</button>`).join("")}</div>
        <button class="tw-hide" data-hide>숨기기</button></div>
    </section>`;
  function wireCall(el, onKey) {
    const pad = el.querySelector("[data-pad]"), digits = el.querySelector("[data-digits]");
    el.querySelectorAll("[data-tk]").forEach(b => b.onclick = () => {
      const k = b.dataset.tk;
      if (k === "pad") { pad.hidden = false; return; }
      if (k === "bt") { toast("연결된 Bluetooth 기기가 없습니다."); return; }
      b.classList.toggle("on");
      if (k === "rec") toast(b.classList.contains("on") ? "통화 녹음을 시작합니다." : "통화 녹음을 저장했습니다.");
    });
    el.querySelector("[data-hold]").onclick = e => { const b = e.currentTarget; b.classList.toggle("on"); b.querySelector("span").textContent = b.classList.contains("on") ? "통화 재개" : "일시중단"; };
    el.querySelector("[data-hide]").onclick = () => { pad.hidden = true; };
    el.querySelectorAll("[data-dk]").forEach(b => b.onclick = () => { const k = b.dataset.dk; dtmf(k); digits.textContent = (digits.textContent + k).slice(-14); onKey && onKey(k); });
  }
  function placeCall(target) {
    const isVM = target === "1" || target === "음성사서함";
    const name = isVM ? "음성사서함" : nameOf(target), number = isVM ? "소리샘" : numberOf(target);
    if (!isVM && !((P.msgReplies || {})[name] || {}).allowCall && P.messages.some(t => t.blocked && (t.name === name || t.name === number))) {   // 나를 차단한 사람에겐 전화도 안 걸림
      dialog("통화 연결 실패", "상대방의 요청으로 이 번호와의 통화가 제한되었습니다. 전화를 걸 수 없습니다."); return;
    }
    inCall = true;
    const dg = s => String(s).replace(/\D/g, "");
    let sc = isVM ? { ringMs: 1500, voicemail: true, lines: [] } : (P.callScripts || {})[name] || (P.callScripts || {})[number] || Object.entries(P.callScripts || {}).find(([k]) => dg(k) && dg(k) === dg(number))?.[1];
    if (sc) {   // 두 번째 전화부터는 again 대본 (reject: 짧게 울리다 끊김)
      sc._n = (sc._n || 0) + 1;
      if (sc._n >= 2 && sc.again) sc = sc.again.reject ? { ringMs: sc.again.ringMs || 1800, dead: true, lines: [] } : sc.again;
    }
    const el = h(callShell(name, name === number ? "" : number));
    let onKey = null; wireCall(el, k => onKey && onKey(k));
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
      st.textContent = "통화 종료"; setTimeout(() => { if (stack.includes(el)) pop(); }, 900); inCall = false;
    };
    el._onClose = () => { inCall = false; stopRing(); stops.forEach(f => f()); if (!ended) { ended = true; timers.forEach(clearTimeout); clearInterval(tmr); } };
    el.querySelector("[data-end]").onclick = end;
    if (sc) {
      timers.push(setTimeout(() => {
        stopRing();
        if (!sc.dead) {   // dead: 없는 번호 안내만 나오고 통화는 연결되지 않음
          pickup(sc.hardPickup); if (!sc.voicemail) stops.push(lineHum());   // 음성사서함은 안내 중엔 조용, 메시지 재생부터 웅— if (sc.pickupSound) stops.push(playSound(sc.pickupSound));
          t1 = Date.now(); const draw = () => { const s = Math.floor((Date.now() - t1) / 1000); st.textContent = `통화 중  ${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
          draw(); tmr = setInterval(draw, 1000);
        }
        if (sc.voicemail) {   // 소리샘. 전체 사서함(1번 길게)은 메시지를 번호로 골라 듣고, 번호별 메시지는 걸기만 해도 안내
          const box = sc.voicemail === true;   // 전체 사서함. 항목은 "이름" 또는 "이름#번호"(그 사람의 n번째 메시지)
          const vmOf = e => { const [n, k] = e.split("#"), v = (P.callScripts[n] || {}).voicemail; return v ? [].concat(v)[k ? +k - 1 : 0] : null; };
          const list = box ? (P.voicemailBox || []).map(vmOf).filter(Boolean) : [].concat(sc.voicemail);
          const multi = box || list.length > 1;
          const ORD = ["첫", "두", "세", "네", "다섯", "여섯", "일곱", "여덟", "아홉"];
          let stage = 0, stopMsg = null;
          const guide = (txt, ms, then) => { say(txt); timers.push(setTimeout(() => then && then(), ms)); };
          const menu = () => { stage = 2; say(`새 메시지가 ${list.length}건 있습니다. ` + list.map((_, i) => `${ORD[i]} 번째 메시지는 ${i + 1}번`).join(", ") + "을 눌러 주세요."); };
          const playMsg = (VM, intro) => {
            stage = 1; if (stopMsg) stopMsg();
            const go = () => guide(VM.label || "", 3000, () => {
              say(""); const stopSnd = VM.sound ? playSound(VM.sound) : () => {}, stopHum = lineHum();
              stopMsg = () => { stopSnd(); stopHum(); }; stops.push(stopMsg);
              (VM.lines || []).forEach(l => timers.push(setTimeout(() => { if (stage === 1) { say(l.text); line.classList.toggle("me", !!l.me); } }, l.at)));
              timers.push(setTimeout(() => { stage = 3; if (stopMsg) stopMsg(); line.classList.remove("me"); say(multi ? "메시지가 끝났습니다. 다른 메시지를 들으시려면 번호를, 종료하시려면 통화 종료를 눌러 주세요." : "메시지가 끝났습니다. 다시 들으시려면 1번, 종료하시려면 통화 종료를 눌러 주세요."); }, (VM.ms || 19000) + 400));
            });
            intro ? guide(intro, 2200, go) : go();
          };
          timers.push(setTimeout(() => say(box ? "음성 사서함 열람을 원하시면 1번을 눌러 주세요." : `이 번호로 남겨진 음성 메시지가 ${list.length}건 있습니다. 열람을 원하시면 1번을 눌러 주세요.`), 900));
          onKey = k => {
            if (stage === 1) return;
            const n = +k;
            if (!multi) { if (k === "1") playMsg(list[0], "새 메시지가 1건 있습니다."); else say("잘못 누르셨습니다. 다시 눌러 주세요."); return; }
            if (stage === 0) { if (k === "1") menu(); else say("잘못 누르셨습니다. 다시 눌러 주세요."); return; }
            if (n >= 1 && n <= list.length) playMsg(list[n - 1], `${ORD[n - 1]} 번째 메시지입니다.`); else say("잘못 누르셨습니다. 다시 눌러 주세요.");
          };
          return;
        }
        let at = sc.firstAt || 900;
        (sc.lines || []).forEach(l => { const txt = typeof l === "string" ? l : l.text, ms = (l && l.ms) || 2600; timers.push(setTimeout(() => { if (l && l.beep) beep(); if (l && l.sob) sob(ms); if (l && l.sound) stops.push(playSound(l.sound)); say(txt); line.classList.toggle("me", !!(l && l.me)); }, at)); at += ms; });
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
    return P.messages.map((t, i) => { const lm = [...t.msgs].reverse().find(m => m.text || m.file || m.audio) || {}, last = lm.file || lm.audio ? { text: "[파일] " + (lm.file || lm.audio), time: lm.time } : lm; const d = [...t.msgs].reverse().find(m => m.date);
      return `<button class="row${t.unread ? " unread" : ""}" data-thread="${i}" style="width:100%;text-align:left"><span class="ph">${AV}</span><span class="tx"><b>${esc(nameOf(t.name))}</b><small>${esc(last.text || "")}</small></span><span class="rt">${esc((() => { const md = d && d.date.match(/(\d+)월 (\d+)일/); return md && !(+md[1] === TODAY.getMonth() + 1 && +md[2] === TODAY.getDate()) ? `${md[1]}월 ${md[2]}일` : (last.time || ""); })())}${t.unread ? `<br><span class="cnt">${t.unread}</span>` : ""}</span></button>`; }).join("") || `<div class="empty">메시지가 없습니다.</div>`;
  }
  function messagesApp() {
    const el = h(`<section class="scr"><div class="tbar">메시지</div><div class="scroll list" data-list>${threadRows()}</div></section>`);
    el.addEventListener("click", e => { const r = e.target.closest("[data-thread]"); if (r) push(convScreen(P.messages[+r.dataset.thread])); });
    el._refresh = () => { el.querySelector("[data-list]").innerHTML = threadRows(); }; el._msgList = true;
    return el;
  }
  function convScreen(T) {
    T.unread = 0; sbIcons();
    const bubble = m => m.date ? `<div class="date"><span>${esc(m.date)}</span></div>` : `<div class="bub${m.me ? " me" : ""}">${m.file || m.audio ? `<button class="b fileb${m.audio ? " aud" : ""}" data-file="${esc(m.file || m.audio)}"><i>${m.audio ? "♪" : "PDF"}</i><span><b>${esc(m.file || m.audio)}</b><small>${esc(m.size || "")}</small></span></button>` : `<div class="b">${esc(m.text)}</div>`}<small>${esc(m.time || "")}</small></div>`;
    const el = h(`<section class="scr"><div class="tbar">${esc(nameOf(T.name))}<small>${esc(numberOf(T.name) === T.name ? "" : numberOf(T.name))}</small></div>
      <div class="scroll conv" data-conv>${T.msgs.map(bubble).join("")}</div>
      <form class="compose"><input placeholder="메시지 입력" enterkeyhint="send" autocomplete="off"><button>전송</button></form></section>`);
    const conv = el.querySelector("[data-conv]"), inp = el.querySelector("input"), sendBtn = el.querySelector(".compose button");
    const lockCompose = () => { inp.disabled = sendBtn.disabled = true; inp.value = ""; inp.placeholder = "메시지를 보낼 수 없습니다"; el.querySelector(".compose").classList.add("off"); };
    if (T.blocked) lockCompose();
    requestAnimationFrame(() => conv.scrollTop = conv.scrollHeight);
    const add = m => { T.msgs.push(m); conv.insertAdjacentHTML("beforeend", bubble(m)); conv.scrollTop = conv.scrollHeight; };
    conv.addEventListener("click", e => { const f = e.target.closest("[data-file]"); if (f) push(fileViewer(f.dataset.file)); });
    el._thread = T; el._show = m => { conv.insertAdjacentHTML("beforeend", bubble(m)); conv.scrollTop = conv.scrollHeight; };
    el.querySelector("form").onsubmit = e => {
      e.preventDefault(); const text = inp.value.trim(); if (!text) return; inp.value = "";
      const dl = `${TODAY.getFullYear()}년 ${dateLabel(TODAY)}`;
      if (([...T.msgs].reverse().find(m => m.date) || {}).date !== dl) add({ date: dl });
      add({ me: true, text, time: nowLabel() });
      if (T._new) { delete T._new; } const i = P.messages.indexOf(T); if (i >= 0) P.messages.splice(i, 1); P.messages.unshift(T);
      if (T.blocked) return;
      const C = (P.msgReplies || {})[T.name];   // 답장 설정. 없으면 (이미 세상을 떠난 사람 등) 아무 답도 오지 않음
      if (!C) { if (harassFrom.has(T.name)) swearBack(T.name, text); return; }
      const k = T._ri = (T._ri ?? -1) + 1;
      if (C.block && k + 1 >= C.block) {   // 차단: 이번 메시지부터 전송 실패
        T.blocked = true; lockCompose();
        setTimeout(() => { const last = conv.querySelector(".bub.me:last-child"); if (last) last.classList.add("fail"); dialog("메시지 전송 실패", "상대방이 회원님의 메시지 수신을 차단하였습니다. 더 이상 메시지를 보낼 수 없습니다."); }, 1300);
        return;
      }
      const batch = k < (C.replies || []).length ? C.replies[k] : (C.loop ? [C.loop[Math.floor(Math.random() * C.loop.length)]] : null);
      if (!batch) return;
      let at = 1400 + Math.random() * 1200;
      [].concat(batch).forEach(r => { setTimeout(() => deliverSMS(T.name, r), at); at += smsGap(r); });
      if (C.call && !T._called && k === (C.replies || []).length - 1) { T._called = true; setTimeout(() => followCall(T.name, C.call, 0), at + (C.call.after || 6000)); }   // 답장이 한 바퀴 돌면 그 사람에게서 전화
    };
    return el;
  }
  const smsGap = t => 1100 + Math.min(2600, t.length * 45) + Math.random() * 700;   // 연달아 오는 문자 사이 간격 (글자 수에 비례)
  function dialog(title, body) {   // 안드로이드 2.x 스타일 알림창
    const d = h(`<div class="dlg"><div class="dlg-box"><div class="dlg-t"><i>!</i>${esc(title)}</div><div class="dlg-b">${esc(body)}</div><div class="dlg-k"><button>확인</button></div></div></div>`);
    d.querySelector("button").onclick = () => d.remove(); $("#screen").appendChild(d);
  }

  /* ================= 문자 수신 (모르는 번호의 협박 문자) ================= */
  function smsTone() {
    const ctx = audioCtx; if (!ctx) return; const t = ctx.currentTime;
    [[0, 1320], [.16, 990]].forEach(([d, f]) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = f; g.gain.setValueAtTime(0, t + d); g.gain.linearRampToValueAtTime(.06, t + d + .01); g.gain.exponentialRampToValueAtTime(.001, t + d + .14); o.connect(g); g.connect(ctx.destination); o.start(t + d); o.stop(t + d + .16); });
  }
  let tickerT;
  function ticker(name, text) {
    let tk = $("#ticker"); if (!tk) { tk = h(`<div id="ticker" class="ticker"></div>`); $("#screen").appendChild(tk); }
    tk.innerHTML = `${IC.sms}<b>${esc(nameOf(name))}</b><span>${esc(text)}</span>`;
    tk.classList.remove("show"); void tk.offsetWidth; tk.classList.add("show");
    clearTimeout(tickerT); tickerT = setTimeout(() => tk.classList.remove("show"), 3200);
  }
  function deliverSMS(name, text) {
    if (dead) return;
    let T = P.messages.find(t => t.name === name);
    if (T) P.messages.splice(P.messages.indexOf(T), 1); else T = { name, msgs: [] };
    const dl = `${TODAY.getFullYear()}년 ${dateLabel(TODAY)}`, m = { text, time: nowLabel() }, top = stack[stack.length - 1];
    const needDate = ([...T.msgs].reverse().find(x => x.date) || {}).date !== dl;
    if (needDate) T.msgs.push({ date: dl });
    T.msgs.push(m); P.messages.unshift(T);
    if (top && top._thread === T && layer.classList.contains("open")) { if (needDate) top._show({ date: dl }); top._show(m); }
    else T.unread = (T.unread || 0) + 1;
    stack.forEach(s => s._msgList && s._refresh());
    sbIcons();
    if (layer.classList.contains("open")) { smsTone(); if (!(top && top._thread === T) && !(top && top.classList.contains("callscr"))) ticker(name, text); }
  }
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  function randomNumber() {
    let n;
    do { n = Math.random() < .8 ? `010-${rnd(2000, 9999)}-${rnd(1000, 9999)}` : `0${["11", "16", "17", "19"][rnd(0, 3)]}-${rnd(200, 999)}-${rnd(1000, 9999)}`; }
    while (contactBy(n) || P.messages.some(t => t.name === n));
    return n;
  }
  let harassOn = false, lastH = -1;
  const harassFrom = new Set();   // 협박 문자를 보낸 번호들
  /* 협박 번호에 욕(시발·씨발·좆·개새끼·지랄)을 보내면 그 욕을 받아서 되받아침 */
  const SWEARS = ["씨발", "시발", "개새끼", "지랄", "좆", "느금마", "병신", "ㅅㅂ", "줴줴이야", "줴줴"];
  const SOLO = ["엄"];   // 다른 말 속(엄마·엄청 등)에서는 무시하고, 따로 쓴 경우만
  const batchim = w => { const c = w.charCodeAt(w.length - 1); return c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 > 0; };
  function swearBack(num, text) {
    let w = null, at = Infinity;
    SWEARS.forEach(x => { const i = text.indexOf(x); if (i >= 0 && i < at) { at = i; w = x; } });
    SOLO.forEach(x => { const m = new RegExp(`(^|[\\s.,!?~ㅋㅎ…])${x}(?=$|[\\s.,!?~ㅋㅎ…])`).exec(text); if (m && m.index < at) { at = m.index; w = x; } });
    const L = P.swearReplies || []; if (!w || !L.length) return;
    const b = batchim(w), fill = t => t.replace(/\{w\}/g, w).replace(/\{이라고\}/g, b ? "이라고" : "라고").replace(/\{이야\}/g, b ? "이야" : "야");
    let t = 1200 + Math.random() * 1500;
    [].concat(L[rnd(0, L.length - 1)]).forEach(r => { const msg = fill(r); setTimeout(() => deliverSMS(num, msg), t); t += smsGap(msg); });
  }
  function harassLoop() {
    if (harassOn || !(P.harass || []).length) return; harassOn = true;
    const next = () => setTimeout(burst, rnd(7, 14) * 1000);   // 7초~14초 간격
    function burst() {
      const n = rnd(1, 3), num = randomNumber(); let at = 0;   // 한 번에 한 명이 1~3개
      for (let i = 0; i < n; i++) {
        let k; do { k = rnd(0, P.harass.length - 1); } while (k === lastH && P.harass.length > 1); lastH = k;
        const who = num, txt = P.harass[k]; harassFrom.add(num);
        setTimeout(() => deliverSMS(who, txt), at); at += smsGap(txt);
      }
      next();
    }
    next();
  }

  /* ================= 모르는 번호의 협박 전화 (30초~2분마다) ================= */
  let inCall = false, lastC = -1;
  function ringtone() {   // 수신 벨소리 (짧은 마림바 같은 반복음) + 진동
    const ctx = audioCtx; let iv = null, done = false;
    const play = () => {
      try { navigator.vibrate && navigator.vibrate([400, 200, 400]); } catch (e) {}
      if (!ctx) return; const t = ctx.currentTime;
      [659, 784, 988, 784, 659, 523].forEach((f, i) => { const o = ctx.createOscillator(), g = ctx.createGain(), s = t + i * .16;
        o.type = "triangle"; o.frequency.value = f; g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(.09, s + .01); g.gain.exponentialRampToValueAtTime(.001, s + .3);
        o.connect(g); g.connect(ctx.destination); o.start(s); o.stop(s + .32); });
    };
    play(); iv = setInterval(play, 2200);
    return () => { if (done) return; done = true; clearInterval(iv); try { navigator.vibrate && navigator.vibrate(0); } catch (e) {} };
  }
  function incomingThreat() {
    const L = P.threatCalls || []; if (!L.length) return;
    let k; do { k = rnd(0, L.length - 1); } while (k === lastC && L.length > 1); lastC = k;
    const lines = L[k], number = randomNumber();
    inCall = true;
    const el = h(callShell(number, "저장되지 않은 번호", true));
    wireCall(el);
    const st = el.querySelector("[data-state]"), line = el.querySelector("[data-line]"), timers = [], stops = [];
    let stopRing = ringtone(), t1 = null, tmr = null, done = false;
    const close = (dir) => {
      if (done) return; done = true; stopRing(); timers.forEach(clearTimeout); clearInterval(tmr); stops.forEach(f => f());
      const sec = t1 ? Math.floor((Date.now() - t1) / 1000) : 0;
      P.calls.unshift(t1 ? { name: number, dir: "in", when: nowLabel(), length: `${Math.floor(sec / 60)}분 ${sec % 60}초` } : { name: number, dir: "missed", when: nowLabel() });
      sbIcons(); stack.forEach(s => s._refresh && s !== el && s._refresh());
      st.textContent = dir || "통화 종료"; el.querySelector("[data-btns]").hidden = true;
      setTimeout(() => { if (stack.includes(el)) { const i = stack.indexOf(el); if (i === stack.length - 1) pop(); else { stack.splice(i, 1); el.remove(); } } inCall = false; }, 900);
    };
    el._onClose = () => { if (!done) close(); };
    el.querySelector("[data-no]").onclick = () => close("거절됨");
    el.querySelector("[data-end]").onclick = () => close();
    el.querySelector("[data-ok]").onclick = () => {
      stopRing(); el.querySelector("[data-btns]").hidden = true; el.querySelector("[data-grid]").hidden = false;
      pickup(); stops.push(lineHum());
      t1 = Date.now(); const draw = () => { const s = Math.floor((Date.now() - t1) / 1000); st.textContent = `통화 중  ${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
      draw(); tmr = setInterval(draw, 1000);
      let at = 1200;
      lines.forEach(txt => { timers.push(setTimeout(() => { line.textContent = txt; line.classList.add("show"); }, at)); at += Math.max(2200, txt.length * 120); });
      timers.push(setTimeout(() => line.classList.remove("show"), at)); timers.push(setTimeout(() => close(), at + 700));
    };
    timers.push(setTimeout(() => { if (!t1) close("부재중 전화"); }, 30000));
    push(el);
  }
  /* 문자 답장이 다 돌면 걸려 오는 전화 (예: 강민재) */
  function followCall(name, CALL, tries) {
    if (dead) return;
    if (inCall) return setTimeout(() => followCall(name, CALL, tries), 4000);
    inCall = true;
    const number = numberOf(name);
    const el = h(callShell(name, number, true));
    wireCall(el);
    const st = el.querySelector("[data-state]"), line = el.querySelector("[data-line]"), timers = [], stops = [];
    let stopRing = ringtone(), t1 = null, tmr = null, done = false, answered = false;
    const close = (dir, cut) => {
      if (done) return; done = true; stopRing(); timers.forEach(clearTimeout); clearInterval(tmr); stops.forEach(f => f());
      const sec = t1 ? Math.floor((Date.now() - t1) / 1000) : 0;
      P.calls.unshift(t1 ? { name, dir: "in", when: nowLabel(), length: `${Math.floor(sec / 60)}분 ${sec % 60}초` } : { name, dir: "missed", when: nowLabel() });
      sbIcons(); stack.forEach(s => s._refresh && s !== el && s._refresh());
      if (cut) { line.classList.remove("show"); [0, .25, .5].forEach(d => setTimeout(beep, d * 1000)); }
      st.textContent = dir || "통화 종료"; el.querySelector("[data-btns]").hidden = true;
      setTimeout(() => { if (stack.includes(el)) { const i = stack.indexOf(el); if (i === stack.length - 1) pop(); else { stack.splice(i, 1); el.remove(); } } inCall = false;
        if (!answered && tries < 2) setTimeout(() => followCall(name, CALL, tries + 1), 15000); }, cut ? 1600 : 900);
    };
    el._onClose = () => { if (!done) close(); };
    el.querySelector("[data-no]").onclick = () => close("거절됨");
    el.querySelector("[data-end]").onclick = () => close();
    el.querySelector("[data-ok]").onclick = () => {
      answered = true; stopRing(); el.querySelector("[data-btns]").hidden = true; el.querySelector("[data-grid]").hidden = false;
      pickup(true); stops.push(lineHum()); if (CALL.sound) stops.push(playSound(CALL.sound));
      t1 = Date.now(); const draw = () => { const s = Math.floor((Date.now() - t1) / 1000); st.textContent = `통화 중  ${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
      draw(); tmr = setInterval(draw, 1000);
      let at = CALL.firstAt || 1200;
      CALL.lines.forEach(l => { timers.push(setTimeout(() => { line.textContent = l.text; line.classList.toggle("me", !!l.me); line.classList.add("show"); }, at)); at += l.ms || Math.max(2200, l.text.length * 120); });
      timers.push(setTimeout(() => close("통화 종료", true), at));   // 마지막 말에서 뚝 끊김
    };
    timers.push(setTimeout(() => { if (!t1) close("부재중 전화"); }, 30000));
    push(el);
  }

  /* ================= 배터리: 4분에 1%씩, 0%가 되면 전원이 꺼지고 다시 켜지지 않음 ================= */
  let dead = false;
  function batteryLoop() {
    const iv = setInterval(() => {
      if (dead) return clearInterval(iv);
      P.battery = Math.max(0, (P.battery ?? 3) - 1); setBat();
      if (P.battery > 0) { beep(); toast(`배터리가 부족합니다 (${P.battery}%). 충전하세요.`); }
      else { clearInterval(iv); shutdown(); }
    }, 4 * 60 * 1000);
  }
  function shutdown() {
    dead = true; inCall = true;
    const off = h(`<div class="dead"><p>배터리가 부족합니다.<br>전원이 꺼집니다.</p></div>`);
    $("#screen").appendChild(off);
    beep(); setTimeout(beep, 300);
    setTimeout(() => {
      stack.forEach(s => { try { s._onClose && s._onClose(); } catch (e) {} });
      off.classList.add("black");
      try { const ctx = audioCtx, t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(880, t); o.frequency.exponentialRampToValueAtTime(110, t + .8); g.gain.setValueAtTime(.06, t); g.gain.linearRampToValueAtTime(0, t + .85); o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + .9); } catch (e) {}
    }, 2600);
  }

  let threatOn = false;
  function threatLoop() {
    if (threatOn) return; threatOn = true;
    const next = () => setTimeout(() => { if (dead) return; if (!inCall && layer.classList.contains("open")) incomingThreat(); next(); }, rnd(30, 120) * 1000);   // 30초~2분 간격
    next();
  }

  function recPlayer(name, F) {   // 녹음 파일: 재생하면 잡음 위로 대화가 한 줄씩
    const el = h(`<section class="scr"><div class="tbar" style="font-size:14px">${esc(name)}</div>
      <div class="rp"><div class="rp-art">♪</div><div class="rp-bar"><i data-bar></i></div><div class="rp-t"><span data-cur>0:00</span><span>${esc(F.length || "")}</span></div>
      <button class="rp-play" data-play>▶</button><div class="rp-lines scroll" data-lines></div></div></section>`);
    const lines = el.querySelector("[data-lines]"), bar = el.querySelector("[data-bar]"), cur = el.querySelector("[data-cur]"), btn = el.querySelector("[data-play]");
    const [mm, ss] = (F.length || "1:00").split(":").map(Number), total = (mm * 60 + ss) * 1000;
    let timers = [], stopHum = null, t0r = 0, tick = null, playing = false;
    const stop = () => { timers.forEach(clearTimeout); timers = []; clearInterval(tick); if (stopHum) stopHum(); stopHum = null; playing = false; btn.textContent = "▶"; };
    btn.onclick = () => {
      if (playing) { stop(); return; }
      playing = true; btn.textContent = "■"; lines.innerHTML = ""; t0r = Date.now(); stopHum = lineHum();
      tick = setInterval(() => { const e = Math.min(total, Date.now() - t0r), s = Math.floor(e / 1000); cur.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; bar.style.width = (e / total * 100) + "%"; if (e >= total) stop(); }, 250);
      const step = total / (F.lines.length + 1);
      F.lines.forEach((l, i) => timers.push(setTimeout(() => { lines.insertAdjacentHTML("beforeend", `<p class="${l.who ? "" : "rp-sys"}">${l.who ? `<b class="w${l.who.length}">${esc(l.who)}</b>` : ""}${esc(l.text)}</p>`); lines.scrollTop = lines.scrollHeight; }, step * (i + .6))));
    };
    el._onClose = stop;
    return el;
  }
  function fileViewer(name) {
    if (((P.files || {})[name] || {}).audio) return recPlayer(name, P.files[name]);
    const F = (P.files || {})[name] || { blocks: [{ p: "파일을 열 수 없습니다." }] };
    const B = b => b.stamp ? `<div class="dv-stamp">${esc(b.stamp)}</div>` : b.small ? `<p class="dv-small">${esc(b.small)}</p>` : b.h ? `<h1>${esc(b.h).replace(/\n/g, "<br>")}</h1>` : b.h2 ? `<h2>${esc(b.h2)}</h2>`
      : b.quote ? `<blockquote>${esc(b.quote)}</blockquote>` : b.table ? `<table>${b.table.map((r, i) => `<tr>${r.map(c => i ? `<td>${esc(c)}</td>` : `<th>${esc(c)}</th>`).join("")}</tr>`).join("")}</table>` : `<p>${esc(b.p || "")}</p>`;
    const el = h(`<section class="scr"><div class="tbar" style="font-size:14px">${esc(name)}</div><div class="scroll dv"><div class="dv-page">${F.blocks.map(B).join("")}</div></div></section>`);
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
      <div class="mus-art${s.sound ? " rec" : ""}"><svg viewBox="0 0 34 34">${G.music}</svg></div>
      <div class="mus-t"><b>${esc(s.title)}</b><small>${esc(s.artist || "")}</small></div>
      <div class="mus-bar"><i></i></div>
      <div class="mus-tm"><span data-cur>0:00</span><span data-dur>${s.sound ? "--:--" : ""}</span></div>
      <div class="mus-ctl"><button data-pv><svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zM20 6v12L9 12z"/></svg></button><button data-pp></button><button data-nx><svg viewBox="0 0 24 24"><path d="M16 6h2v12h-2zM4 6v12l11-6z"/></svg></button></div>
      ${s.lines ? `<div class="mus-cap" data-cap></div>` : ""}</section>`);
    const bar = el.querySelector(".mus-bar i"), pp = el.querySelector("[data-pp]"), cap = el.querySelector("[data-cap]");
    const ico = () => pp.innerHTML = on ? `<svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>` : `<svg viewBox="0 0 24 24"><path d="M7 5v14l12-7z"/></svg>`;
    const fmt = x => Math.floor(x / 60) + ":" + String(Math.floor(x % 60)).padStart(2, "0");
    let au = null, t;
    if (s.sound) {
      au = new Audio(s.sound); au.preload = "auto";
      const cur = el.querySelector("[data-cur]"), dur = el.querySelector("[data-dur]");
      au.onloadedmetadata = () => dur.textContent = fmt(au.duration);
      au.ontimeupdate = () => {
        const c = au.currentTime; cur.textContent = fmt(c); if (au.duration) bar.style.width = (c / au.duration * 100) + "%";
        if (cap) { let L = null; s.lines.forEach(l => { if (c * 1000 >= l.at && c * 1000 < l.at + (l.ms || 3500)) L = l; });
          const html = L ? (L.who ? `<b>${esc(L.who)}</b>` : "") + `<span${L.fx ? ' class="fx"' : ""}>${esc(L.text)}</span>` : "";
          if (cap.innerHTML !== html) cap.innerHTML = html; }
      };
      au.onended = () => { on = false; ico(); };
      au.onerror = () => { on = false; ico(); toast("파일을 재생할 수 없습니다."); };
      au.play().catch(() => { on = false; ico(); });
      pp.onclick = () => { on = !on; on ? au.play() : au.pause(); ico(); };
      el.querySelector(".mus-bar").onclick = ev => { if (!au.duration) return; const r = ev.currentTarget.getBoundingClientRect(); au.currentTime = (ev.clientX - r.left) / r.width * au.duration; };
    } else {
      pp.onclick = () => { on = !on; ico(); };
      t = setInterval(() => { if (on) { p = Math.min(100, p + .5); bar.style.width = p + "%"; } }, 1000);
    }
    ico();
    el._onClose = () => { clearInterval(t); if (au) { au.pause(); au.src = ""; } };
    el.querySelector("[data-pv]").onclick = () => { if (au && au.currentTime > 3) { au.currentTime = 0; return; } if (i > 0) { pop(); push(nowPlaying(i - 1)); } };
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
    const N = P.portal || { news: [], trends: [], comments: [] };
    const page = (url, inner) => h(`<section class="scr web"><div class="urlbar"><span>http://${esc(url)}</span></div><div class="scroll wb">${inner}</div></section>`);
    const thumb = i => `<span class="wb-th" style="background:${tint(i + 5)}"></span>`;
    const el = page(N.url, `
      <div class="wb-top"><b class="wb-logo">${esc(N.name)}</b><div class="wb-search"><span>검색어를 입력하세요</span><i>검색</i></div></div>
      <nav class="wb-tabs"><b>뉴스</b><span>연예</span><span>스포츠</span><span>경제</span><span>블로그</span></nav>
      <div class="wb-box"><h3>실시간 급상승 검색어</h3><ol class="wb-rank">${N.trends.map((t, i) => `<li><em>${i + 1}</em>${esc(t)}<small>${i < 3 ? "▲" : i % 3 ? "NEW" : "▲"}</small></li>`).join("")}</ol></div>
      <div class="wb-box"><h3>많이 본 뉴스</h3>${N.news.map((n, i) => `<button class="wb-news" data-art="${i}">${thumb(i)}<span><b>${esc(n.title)}</b><small>${esc(n.press)} · ${esc(n.time)} · 댓글 ${n.cm.toLocaleString()}</small></span></button>`).join("")}</div>
      <div class="wb-foot">${esc(N.name)} · PC버전 · 로그인<br>© NURI Corp.</div>`);
    el.addEventListener("click", e => { const b = e.target.closest("[data-art]"); if (b) push(article(+b.dataset.art)); });
    function article(i) {
      const n = N.news[i], cm = n.comments || [];   // 기사마다 다른 댓글
      const NICKS = ["kjh7****", "정의로운****", "sky_****", "lee0****", "달빛고양****", "anon****", "parkm****", "서울시민****", "hjk9****", "무명****", "jjang****", "엄마는강하****", "bluew****", "소시민****", "dkfk****", "yoon****", "현실주****", "mnb1****", "강남구****", "qwer****", "새벽세시****", "ch0i****", "그냥지나가****", "zzzz****"];
      const nick = k => NICKS[(i * 5 + k * 7) % NICKS.length];
      const ago = k => ["방금 전", "3분 전", "12분 전", "27분 전", "41분 전", "1시간 전", "1시간 전", "2시간 전", "3시간 전"][k] || "5시간 전";
      const a = page(`${N.url}/news/${2018040300 + i}`, `
        <div class="wb-top sm"><b class="wb-logo">${esc(N.name)} 뉴스</b></div>
        <article class="wb-art"><h1>${esc(n.title)}</h1><p class="wb-meta">${esc(n.press)} | 입력 ${esc(n.time)}</p>
          <div class="wb-img" style="background:${tint(i + 5)}">사진</div>
          ${n.body.map(p => `<p>${esc(p)}</p>`).join("")}
          <p class="wb-rep">${esc(n.press)} 기자 · 무단 전재 및 재배포 금지</p></article>
        <div class="wb-box"><h3>댓글 <em>${n.cm.toLocaleString()}</em></h3>
          ${cm.map((c, k) => `<div class="wb-cm${k < 2 ? " best" : ""}">${k < 2 ? `<em class="bst">BEST</em>` : ""}<b>${nick(k)}</b><small>${ago(k)}</small><p>${esc(c)}</p><span>공감 ${(k < 2 ? 1800 - k * 430 : 0) + (((i + 3) * (k + 7) * 37) % 600 + 12)} · 비공감 ${(((i + 1) * (k + 2) * 13) % (c.includes("ㅋ") ? 40 : 260))}${k % 3 === 1 ? ` · 답글 ${((i + k) * 7) % 40 + 2}` : ""}</span></div>`).join("")}
          <div class="wb-more">댓글 더보기 ▼</div></div>`);
      return a;
    }
    return el;
  }

  /* ================= 하드웨어 버튼 ================= */
  document.querySelectorAll("[data-key]").forEach(b => b.addEventListener("click", () => {
    const k = b.dataset.key;
    if (dead) return;
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
    if (t0 === null) { t0 = Date.now(); batteryLoop(); }
    harassLoop(); threatLoop();
    try { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); else if (audioCtx.state === "suspended") audioCtx.resume(); } catch (e) {}
    Object.values(P.callScripts || {}).forEach(s => { (s.lines || []).forEach(l => l && l.sound && loadSound(l.sound)); s.pickupSound && loadSound(s.pickupSound); });
    fit();
    if (!stack.length) { push(lockScreen()); }
    sbIcons(); tick();
    layer.classList.add("open"); layer.setAttribute("aria-hidden", "false");
    if (!DIRECT) try { history.pushState({ phone: 1 }, "", "#phone"); } catch (e) {}
  }
  function closePhone(fromPop) {
    if (DIRECT) return;   // 본문 없이 휴대폰만 보여 주는 모드: 닫히지 않음
    if (!layer.classList.contains("open")) return;
    layer.classList.remove("open"); layer.setAttribute("aria-hidden", "true");
    if (!fromPop) { try { if (location.hash === "#phone") history.back(); } catch (e) {} }
  }
  story.addEventListener("click", e => { if (e.target.closest("[data-open]")) { e.preventDefault(); openPhone(); } });
  layer.addEventListener("click", e => { if (e.target.closest("[data-close]")) closePhone(); });
  addEventListener("popstate", () => closePhone(true));
  addEventListener("keydown", e => { if (e.key === "Escape") closePhone(); });
  if (DIRECT) {   // 본문이 없으면 페이지를 열자마자 휴대폰 화면. 소리는 첫 터치 때 켜짐 (브라우저 정책)
    document.body.classList.add("direct"); story.remove();
    const wake = () => { try { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === "suspended") audioCtx.resume(); } catch (e) {} };
    addEventListener("pointerdown", wake, { capture: true }); addEventListener("keydown", wake, { capture: true });
    openPhone();
  }
})();
