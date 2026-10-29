export function createOrganizerApps({ P, h, esc, push, deliverSMS, randomUnicode, toast, IC, WD, TODAY, key, parseD, isSmsStopped, setSmsStopped }) {
  /* ================= 메모 ================= */
  function memoApp() {
    const el = h(`<section class="scr"><div class="tbar">메모<small>${(P.memos || []).length}개</small></div>
      <div class="scroll"><div class="memo-grid">${(P.memos || []).map((m, i) => `<button class="memo" data-memo="${i}"><small>${esc(m.date)}</small>${esc(m.text)}</button>`).join("")}</div></div></section>`);
    el.addEventListener("click", e => {
      const b = e.target.closest("[data-memo]"); if (!b) return; const m = P.memos[+b.dataset.memo];
      push(h(`<section class="scr"><div class="tbar">메모<small>${esc(m.date)}</small></div><div class="memo-full">${esc(m.text)}</div></section>`));
    });
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
      let html = [...WD].map((w, i) => `<span class="wd ${i === 0 ? "sun" : i === 6 ? "sat" : ""}">${w}</span>`).join("");
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

  /* ================= ? ================= */
  function scaryApp() {
    const el = h(`
		  <div class="scary-app">
        데이토
        <br><br>안녕하세요.
        <br>저는 ███이에요.
        <br>저는 ??세, 여성.
        <br>내 기능들을 사용해 보세요.
        <br><br>
        <label for="stop_sms">받는 문자 정지하기
        <input type="checkbox" id="stop_sms" name="stop_sms" />
        <br>
        <button id="erase_messages" type="button">문자 기록 지우기</button>
        <br>
        <button id="unknown_msg" type="button">알 수 없는 메시지에 받기</button>
		  </div>
    `);
    el.querySelector("#erase_messages").onclick = () => P.messages = [];
    el.querySelector("#unknown_msg").onclick = () => deliverSMS("알 수 없음", randomUnicode(10));

    const checkbox = el.querySelector("#stop_sms");
    checkbox.checked = isSmsStopped();
    checkbox.addEventListener("change", () => setSmsStopped(checkbox.checked));

    return el
  }

  /* ================= 시계 ================= */
  function clockApp() {
    const el = h(`<section class="scr"><nav class="tabs"><button class="on">${IC.alarm}알람</button><button data-x>${IC.globe}세계 시각</button><button data-x>${IC.watch}스톱워치</button><button data-x>${IC.timer}타이머</button></nav>
      <div class="scroll list">${(P.alarms || []).map((a, i) => `<div class="row"><span class="tx"><b style="font-size:22px;font-weight:300">${esc(a.time)}</b><small>${esc(a.label)} · ${esc(a.repeat || "")}</small></span><button class="tog${a.on ? " on" : ""}" data-al="${i}"></button></div>`).join("") || `<div class="empty">알람이 없습니다.</div>`}</div></section>`);
    el.querySelectorAll("[data-al]").forEach(b => b.onclick = () => { const a = P.alarms[+b.dataset.al]; a.on = !a.on; b.classList.toggle("on", a.on); toast(a.on ? "알람이 설정되었습니다." : "알람이 해제되었습니다."); });
    el.querySelectorAll("[data-x]").forEach(b => b.onclick = () => toast("지원하지 않는 기능입니다."));
    return el;
  }

  return { memoApp, calendarApp, scaryApp, clockApp };
}