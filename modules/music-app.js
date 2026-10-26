export function createMusicApp({ P, h, esc, G, push, pop, toast }) {
  /* ================= 음악 ================= */
  function musicApp() {
    const el = h(`<section class="scr"><div class="tbar">음악<small>${(P.music || []).length}곡</small></div>
      <div class="scroll list">${(P.music || []).map((s, i) => `<button class="row" data-song="${i}" style="width:100%;text-align:left"><span class="ph" style="background:linear-gradient(135deg,#3b2a5c,#121019);align-items:center"><svg viewBox="0 0 34 34" style="width:26px;height:26px">${G.music}</svg></span><span class="tx"><b>${esc(s.title)}</b><small>${esc(s.artist)}</small></span></button>`).join("") || `<div class="empty">음악이 없습니다.</div>`}</div></section>`);
    el.addEventListener("click", e => { const b = e.target.closest("[data-song]"); if (b) push(nowPlaying(+b.dataset.song)); });
    return el;
  }

  function nowPlaying(i) {
    const s = P.music[i];
    if (!s) return null;

    const hasAudio = Boolean(s.sound);
    const lines = Array.isArray(s.lines) ? s.lines : [];

    let playing = hasAudio;
    let progress = 0;
    let timer = null;
    let lastLine = null;
    let closed = false;

    const el = h(`
    <section class="scr">
      <div class="tbar">재생 중</div>

      <div class="mus-art${hasAudio ? " rec" : ""}">
        <svg viewBox="0 0 34 34">${G.music}</svg>
      </div>

      <div class="mus-t">
        <b>${esc(s.title || "")}</b>
        <small>${esc(s.artist || "")}</small>
      </div>

      <div class="mus-bar"><i></i></div>

      <div class="mus-tm">
        <span data-cur>0:00</span>
        <span data-dur>${hasAudio ? "--:--" : ""}</span>
      </div>

      <div class="mus-ctl">
        <button data-pv aria-label="이전 곡">
          <svg viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zM20 6v12L9 12z"/>
          </svg>
        </button>

        <button data-pp aria-label="재생 또는 일시정지"></button>

        <button data-nx aria-label="다음 곡">
          <svg viewBox="0 0 24 24">
            <path d="M16 6h2v12h-2zM4 6v12l11-6z"/>
          </svg>
        </button>
      </div>

      ${lines.length ? '<div class="mus-cap" data-cap></div>' : ""}
    </section>
  `);

    const $ = selector => el.querySelector(selector);

    const bar = $(".mus-bar");
    const fill = $(".mus-bar i");
    const pp = $("[data-pp]");
    const cur = $("[data-cur]");
    const dur = $("[data-dur]");
    const cap = $("[data-cap]");

    let au = null;

    function fmt(seconds) {
      if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

      const total = Math.floor(seconds);
      return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
    }

    function setPlaying(value) {
      playing = value;

      pp.innerHTML = playing ? `<svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>` : `<svg viewBox="0 0 24 24"><path d="M7 5v14l12-7z"/></svg>`;
      pp.setAttribute("aria-label", playing ? "일시정지" : "재생");
    }

    function setProgress(value) {
      progress = Math.max(0, Math.min(100, value));
      fill.style.width = `${progress}%`;
    }

    function updateCaption(time) {
      if (!cap) return;

      const ms = time * 1000;
      let active = null;

      // Preserve the original behavior: the last matching line wins.
      for (let n = lines.length - 1; n >= 0; n--) {
        const line = lines[n];
        const start = Number(line.at);
        const duration = Number(line.ms) || 3500;

        if (Number.isFinite(start) && ms >= start && ms < start + duration) {
          active = line;
          break;
        }
      }

      // Avoid rebuilding the caption when the line hasn't changed.
      if (active === lastLine) return;
      lastLine = active;

      if (!active) {
        cap.replaceChildren();
        return;
      }

      const fragment = document.createDocumentFragment();

      if (active.who) {
        const speaker = document.createElement("b");
        speaker.textContent = active.who;
        fragment.appendChild(speaker);
      }

      const text = document.createElement("span");
      text.textContent = active.text || "";
      if (active.fx) text.classList.add("fx");

      fragment.appendChild(text);
      cap.replaceChildren(fragment);
    }

    function updateAudioUI() {
      if (!au || closed) return;

      const time = au.currentTime;
      cur.textContent = fmt(time);

      if (Number.isFinite(au.duration) && au.duration > 0) {
        dur.textContent = fmt(au.duration);
        setProgress(time / au.duration * 100);
      }
      updateCaption(time);
    }

    function stopAudio() {
      if (!au) return;

      au.pause();
      au.removeAttribute("src");
      au.load();

      au.onplay = null;
      au.onpause = null;
      au.onended = null;
      au.onerror = null;
      au.ontimeupdate = null;
      au.onloadedmetadata = null;
      au.onloadeddata = null;
    }

    function playAudio() {
      if (!au || closed) return;

      const result = au.play();

      if (result && typeof result.catch === "function") {
        result.catch(() => {
          if (!closed) setPlaying(false);
        });
      }
    }

    function togglePlayback() {
      if (closed) return;

      if (au) {
        if (au.paused || au.ended) {
          // Restart finished tracks from the beginning.
          if (au.ended) au.currentTime = 0;
          playAudio();
        } else au.pause();

        return;
      }

      setPlaying(!playing);
    }

    function navigateTo(index) {
      if (closed || index < 0 || index >= P.music.length) return;
      pop();
      push(nowPlaying(index));
    }

    // Audio playback
    if (hasAudio) {
      au = new Audio(s.sound);
      au.preload = "metadata";

      au.onplay = () => setPlaying(true);
      au.onpause = () => setPlaying(false);

      au.onloadedmetadata = () => {
        dur.textContent = Number.isFinite(au.duration) ? fmt(au.duration) : "--:--";
        updateAudioUI();
      };

      au.ontimeupdate = updateAudioUI;

      au.onended = () => {
        setPlaying(false);
        cur.textContent = fmt(au.duration);
        setProgress(100);
        updateCaption(au.duration);
      };

      au.onerror = () => {
        setPlaying(false);
        toast("파일을 재생할 수 없습니다.");
      };

      bar.addEventListener("click", ev => {
        if (closed || !au || !Number.isFinite(au.duration) || au.duration <= 0) return;

        const rect = bar.getBoundingClientRect();
        if (rect.width <= 0) return;

        const ratio = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
        au.currentTime = ratio * au.duration;
        updateAudioUI();
      });

      playAudio();
    } else {
      // Simulated progress for tracks without an audio file.
      timer = setInterval(() => {
        if (closed || !playing) return;

        setProgress(progress + 0.5);

        if (progress >= 100) {
          clearInterval(timer);
          timer = null;
          setPlaying(false);
        }
      }, 1000);
    }

    // Controls
    pp.addEventListener("click", togglePlayback);

    $("[data-pv]").addEventListener("click", () => {
      if (au && au.currentTime > 3) {
        au.currentTime = 0;
        updateAudioUI();
        return;
      }

      navigateTo(i - 1);
    });

    $("[data-nx]").addEventListener("click", () => {
      navigateTo(i + 1);
    });

    // Initialize the playback icon.
    setPlaying(playing);

    // Called by the UI when this screen is closed.
    el._onClose = () => {
      if (closed) return;

      closed = true;

      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }

      stopAudio();
    };
    return el;
  }

  return { musicApp };
}