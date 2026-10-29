export function createMediaApps({ P, h, esc, push }) {
  /* ================= 갤러리 ================= */
  const tint = k => `linear-gradient(135deg,hsl(${(k * 67) % 360} 35% 38%),hsl(${(k * 67 + 40) % 360} 30% 18%))`;
  function galleryApp() {
    const el = h(`<section class="scr"><div class="tbar">갤러리</div><div class="scroll list">${(P.gallery || []).map((a, i) => `<button class="row" data-album="${i}" style="width:100%;text-align:left"><span class="ph" style="background:${a.photos[0] && a.photos[0].img ? `url('${esc(a.photos[0].img)}') center/cover` : tint(i)}"></span><span class="tx"><b>${esc(a.album)}</b><small>${a.photos.length}개</small></span></button>`).join("")}</div></section>`);
    el.addEventListener("click", e => {
      const b = e.target.closest("[data-album]"); if (!b) return; const A = P.gallery[+b.dataset.album];
      const g = h(`<section class="scr"><div class="tbar">${esc(A.album)}</div><div class="scroll"><div class="gal-grid">${A.photos.map((p, k) => `<button data-ph="${k}" style="background:${p.img ? `url('${esc(p.img)}') center/cover` : tint(k + 3)}">${p.img ? "" : esc(p.caption || "")}</button>`).join("")}</div></div></section>`);
      g.addEventListener("click", ev => {
        const q = ev.target.closest("[data-ph]"); if (!q) return; const p = A.photos[+q.dataset.ph];
        push(h(`<section class="scr viewer"><div class="pic" style="${p.img ? `background-image:url('${esc(p.img)}')` : `background:${tint(+q.dataset.ph + 3)}`}">${p.img ? "" : esc(p.caption || "")}</div></section>`));
      });
      push(g);
    });
    return el;
  }

  /* ================= 인터넷 ================= */
  function internetApp() {
    const N = P.portal || { news: [], trends: [], comments: [] };
    const isOff = n => n.disable_comment === true;

    const page = (url, inner) => h(`<section class="scr web"><div class="urlbar"><span>http://${esc(url)}</span></div><div class="scroll wb">${inner}</div></section>`);
    const thumb = i => `<span class="wb-th" style="background:${tint(i + 5)}"></span>`;
    const el = page(N.url, `
      <div class="wb-top"><b class="wb-logo">${esc(N.name)}</b><div class="wb-search"><span>검색어를 입력하세요</span><i>검색</i></div></div>
      <nav class="wb-tabs"><b>뉴스</b><span>연예</span><span>스크립트</span><span>바이러스</span><span>블로그</span></nav>
      <div class="wb-box"><h3>실시간 급상승 검색어</h3><ol class="wb-rank">${N.trends.map((t, i) => `<li><em>${i + 1}</em>${esc(t)}<small>${i < 3 ? "▲" : i % 3 ? "NEW" : "▲"}</small></li>`).join("")}</ol></div>
      <div class="wb-box"><h3>많이 본 뉴스</h3>${N.news.map((n, i) => `<button class="wb-news" data-art="${i}">${thumb(i)}<span><b>${esc(n.title)}</b><small>${esc(n.press)} · ${esc(n.time)}${isOff(n) ? "" : ` · 댓글 ${n.cm.toLocaleString()}`}</small></span></button>`).join("")}</div>
      <div class="wb-foot">${esc(N.name)} · PC버전 · 666 · 로그인</div>`);
    el.addEventListener("click", e => { const b = e.target.closest("[data-art]"); if (b) push(article(+b.dataset.art)); });

    function article(i) {
      const n = N.news[i];
      const NICKS = N["nicks"];
      const cm = (n.comments || []).map(c => typeof c === "string" ? { text: c } : c);
      const off = isOff(n);
      const nick = k => NICKS[(i * 5 + k * 7) % NICKS.length];
      const ago = k => ["방금 전", "3분 전", "12분 전", "27분 전", "41분 전", "1시간 전", "1시간 전", "2시간 전", "3시간 전"][k] || "5시간 전";

      const likes = (c, k) => c.likes ?? (k < 2 ? 1800 - k * 430 : 0) + (((i + 3) * (k + 7) * 37) % 600 + 12);
      const dislikes = (c, k) => c.dislikes ?? ((i + 1) * (k + 2) * 13) % (c.text.includes("ㅋ") ? 40 : 260);
      const replys = (c, k) => c.replys ?? ((i + k) * 7) % 40 + 2;

      const commentBox = off ? "" : `<div class="wb-box"><h3>댓글 <em>${n.cm.toLocaleString()}</em></h3>
        ${cm.map((c, k) => `<div class="wb-cm${k < 2 ? " best" : ""}">${k < 2 ? `<em class="bst">BEST</em>` : ""}<b>${nick(k)}</b><small>${ago(k)}</small><p>${esc(c.text)}</p><span>공감 ${likes(c, k)} · 비공감 ${dislikes(c, k)}${(c.replys || k % 3 === 1) ? ` · 답글 ${replys(c, k)}` : ""}</span></div>`).join("")}
        <div class="wb-more">댓글 더보기 ▼</div></div>`;

      return page(`${N.url}/news.html?id=${i}`, `
        <div class="wb-top sm"><b class="wb-logo">${esc(N.name)} 뉴스</b></div>
        <article class="wb-art"><h1>${esc(n.title)}</h1><p class="wb-meta">${esc(n.press)} | 입력 ${esc(n.time)}</p>
          <div class="wb-img" style="background:${tint(i + 5)}">사진</div>
          ${n.body.map(p => `<p>${esc(p)}</p>`).join("")}
          <p class="wb-rep">${esc(n.press)} 기자 · 무단 전재 및 재배포 금지</p></article>` + (off ? "" : commentBox));
    }
    return el;
  }

  return { galleryApp, internetApp };
}