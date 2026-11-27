/* Lucian UX/UI Prompt #207 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#207 */
/* 편씨 아트머그 페이지 양옆 여백에 '흐르는 후기 벽' 위젯을 띄워요.
   - 아트머그 '이용 후기' 표(#cont_after)에서 후기를 읽어서 카드로 만들어요 (첫 페이지 최대 10개)
   - 왼쪽 줄은 위로, 오른쪽 줄은 아래로 흐르고, 화면을 내려도 그 자리에 따라와요 (position:fixed)
   - 양옆 여백이 좁은 화면(노트북 · 폰)에서는 자동으로 숨어요
   - 후기가 하나도 없으면 아무것도 안 보여요
   아트머그 커스텀 코드 맨 아래 한 줄이 이 파일을 불러와요. */
(function () {
  if (window.__pyRW) return; window.__pyRW = 1;
  var doc = document;

  /* ---------- 아트머그 박스 테두리 다듬기 (후기와 상관없이 항상 적용) ----------
     아트머그 커스텀 코드의 물방울 바인더 테두리(14px)를 반(7px)으로 줄이고, 물방울을 더 연하게 해요.
     커스텀 코드는 그대로 두고 여기서 덮어써요. */
  var FRAME = 'linear-gradient(#fff,#fff) padding-box,'
    + 'radial-gradient(circle,#fac6dc 1.4px,transparent 1.9px) 0 0/12px 12px border-box,'
    + 'radial-gradient(circle,#fac6dc 1.4px,transparent 1.9px) 6px 6px/12px 12px border-box,#f6a9c9 border-box';
  var boxes = ['#rightInfo #profile', '#goodsInfo', '#goodsOrder', '#cont_qna', '#cont_after'].map(function (s) { return 'html body ' + s; }).join(',');
  var fs = doc.createElement('style');
  fs.textContent = boxes + '{border-width:7px !important;border-style:solid !important;border-color:transparent !important;background:' + FRAME + ' !important;'
    + 'box-shadow:0 0 0 1.5px #e589b0,inset 0 0 0 1.5px #e589b0 !important}';
  (doc.head || doc.documentElement).appendChild(fs);
  var rm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W = 248, MIN_GAP = 28;   // 위젯 너비 · 본문과 최소 간격

  /* ---------- 후기 읽기 ---------- */
  function readReviews() {
    var rows = doc.querySelectorAll('#list_after > tr[align="center"]');
    var out = [];
    Array.prototype.forEach.call(rows, function (tr) {
      var td = tr.children; if (td.length < 5) return;
      var no = parseInt(td[0].textContent, 10);
      var st = tr.querySelector('.starBg > div');
      var pct = st ? parseFloat(st.style.width) : 100;
      var full = doc.getElementById('afterContent' + no), ul = full && full.querySelector('ul');
      // 작가 본인이 로그인하면 후기 아래에 '댓글쓰기' 버튼 글자가 붙어 있어서 빼요
      var text = (((ul || full) && (ul || full).textContent) || td[2].textContent || '').replace(/\s+/g, ' ').replace(/\s*댓글\s*쓰기\s*$/, '').trim();
      if (!text) return;
      out.push({no: no, star: isNaN(pct) ? 5 : Math.round(pct / 20 * 10) / 10, text: text, who: td[3].textContent.trim(), date: td[4].textContent.trim()});
    });
    return out;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]; }); }
  /* 첫 문장(40자 안쪽)에 형광펜 */
  function body(t) {
    if (t.length > 96) t = t.slice(0, 94).replace(/\s+\S*$/, '') + '…';
    var m = t.match(/^(.{6,40}?[.!?~]+)(\s|$)/);
    return m ? '<mark>' + esc(m[1]) + '</mark>' + esc(t.slice(m[1].length)) : esc(t);
  }

  /* ---------- 스타일 ---------- */
  var css = ''
    + '.pyrw{position:fixed;top:50%;z-index:900;width:' + W + 'px;height:min(560px,calc(100vh - 140px));transform:translateY(-50%);box-sizing:border-box;'
    + 'border:7px solid transparent;border-radius:14px;background:' + FRAME + ';'
    + 'box-shadow:0 0 0 1.5px #e589b0,inset 0 0 0 1.5px #e589b0,0 24px 40px -28px rgba(196,82,126,.55);color:#2a2a2a;font-family:"Paperozi",sans-serif;opacity:0;transition:opacity .4s;display:flex;flex-direction:column}'
    + '.pyrw.on{opacity:1}.pyrw[hidden]{display:none}'
    + '.pyrw *{box-sizing:border-box}'
    + '.pyrw-hd{position:relative;flex:none;margin:0 12px;z-index:2;padding:18px 0 13px;text-align:center;background:#fff;border-bottom:1.5px dashed #f6c3d8}'
    + '.pyrw-hd::after{content:"♥";position:absolute;left:50%;bottom:-9px;transform:translateX(-50%);padding:0 6px;background:#fff;color:#f6a9c9;font-size:10px;line-height:16px}'
    + '.pyrw-hd h3{margin:0;font:italic 700 24px/1.1 "Playfair Display",serif;color:#c4527e;letter-spacing:.5px}'
    + '.pyrw-st{display:flex;justify-content:center;flex-wrap:wrap;gap:5px;margin-top:10px}'
    + '.pyrw-st span{display:inline-flex;align-items:center;gap:3px;padding:3px 7px 2px;border:1px solid #ffd6e7;border-radius:3px;background:#fff5f9;font:400 10.5px/1.3 "Galmuri11","Paperozi",sans-serif;color:#8a8086;white-space:nowrap}'
    + '.pyrw-st b{color:#e0457f;font-weight:700}.pyrw-st i{font-style:normal;color:#ef94bc}'
    /* 머리글 아래 남은 칸만 카드 자리예요 (위치를 계산하지 않고 칸을 나눠서, 글꼴이 늦게 떠도 위로 삐져나가지 않아요) */
    + '.pyrw-wl{position:relative;flex:1;min-height:0;margin:6px 10px 10px;overflow:hidden;'
    + '-webkit-mask-image:linear-gradient(transparent 0,#000 7%,#000 86%,transparent);mask-image:linear-gradient(transparent 0,#000 7%,#000 86%,transparent)}'
    + '.pyrw-tr{display:flex;flex-direction:column;gap:9px;animation:pyrw-up var(--t) linear infinite;animation-direction:var(--dir)}'
    + '.pyrw-wl:hover .pyrw-tr,.pyrw-wl.is-hold .pyrw-tr{animation-play-state:paused}'
    + '@keyframes pyrw-up{to{transform:translateY(calc(-50% - 4.5px))}}'
    + '.pyrw-cd{margin:0;padding:12px 11px;border-radius:6px;background:#fff5f9;box-shadow:inset 0 0 0 1.5px #ffd6e7;cursor:pointer;'
    + 'transition:transform .3s cubic-bezier(.3,1.4,.5,1),box-shadow .3s,background .3s}'
    + '.pyrw-cd.is-hl{transform:translateY(-3px) scale(1.02);background:#fff;box-shadow:0 0 0 1.5px #f6a9c9,0 14px 26px -14px rgba(196,82,126,.55)}'
    + '.pyrw-cd:focus-visible{outline:2px solid #e0457f;outline-offset:2px}'
    + '.pyrw-cd i{display:block;font-style:normal;font-size:10px;color:#ef94bc;letter-spacing:-1px}'
    + '.pyrw-cd p{margin:5px 0 0;font-size:11.5px;line-height:1.55;font-weight:500;color:#5a5257;word-break:keep-all;overflow-wrap:break-word}'
    + '.pyrw-cd mark{background:linear-gradient(transparent 55%,#ffd1e3 55%);color:#2a2a2a;font-weight:700}'
    + '.pyrw-pp{display:flex;align-items:center;gap:7px;margin-top:9px}'
    + '.pyrw-av{flex:none;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;color:#fff;font:400 10px/1 "Galmuri11",sans-serif}'
    + '.pyrw-pp b{display:block;font-size:10.5px;font-weight:700;color:#2a2a2a}'
    + '.pyrw-pp small{display:block;font:400 9px/1.3 "Galmuri11",sans-serif;color:#b2aaae}'
    + '@media (prefers-reduced-motion:reduce){.pyrw-tr{animation:none}.pyrw-wl{overflow-y:auto}}';
  var AC = ['#f08ab5', '#e0457f', '#c4527e', '#ef94bc', '#d9709c', '#b85a85'];

  function card(r, dup) {
    var d = doc.createElement('figure'); d.className = 'pyrw-cd';
    if (dup) d.setAttribute('aria-hidden', 'true'); else d.tabIndex = 0;
    var full = Math.round(r.star), stars = '★★★★★'.slice(0, full) + '☆☆☆☆☆'.slice(0, 5 - full);
    var who = r.who || '의뢰자', ini = who.replace(/\*/g, '').slice(-1) || '♡';
    d.innerHTML = '<i aria-label="별점 ' + r.star + '점">' + stars + '</i><p>' + body(r.text) + '</p>'
      + '<figcaption class="pyrw-pp"><span class="pyrw-av" style="background:' + AC[r.no % AC.length] + '" aria-hidden="true">' + esc(ini) + '</span>'
      + '<span><b>' + esc(who) + '</b><small>' + esc(r.date) + '</small></span></figcaption>';
    return d;
  }

  function build() {
    var list = readReviews();
    if (!list.length) return;
    var st = doc.createElement('style'); st.textContent = css; doc.head.appendChild(st);
    var fl = doc.createElement('link'); fl.rel = 'stylesheet'; fl.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&display=swap'; doc.head.appendChild(fl);
    var total = list[0].no || list.length;
    var avg = list.reduce(function (s, r) { return s + r.star; }, 0) / list.length;
    var ans = doc.querySelector('#cont_qna .answer_per');
    var ansM = ans && ans.textContent.match(/(\d+)\s*%/);
    // 왼쪽 여백에 위젯 하나만 띄워요 (후기 전체가 한 줄로 위로 흘러요)
    var cols = [list];
    var panels = cols.map(function (rs) {
      var p = doc.createElement('aside'); p.className = 'pyrw pyrw-l';
      p.setAttribute('aria-label', '이용 후기 모음');
      p.innerHTML = '<div class="pyrw-hd"><h3>Reviews.</h3><div class="pyrw-st">'
        + '<span><i aria-hidden="true">★</i> <b>' + avg.toFixed(1) + '</b></span>'
        + '<span>후기 <b>' + total + '</b></span>'
        + (ansM ? '<span>답변 <b>' + ansM[1] + '%</b></span>' : '')
        + '</div></div><div class="pyrw-wl"></div>';
      var wl = p.querySelector('.pyrw-wl');
      var tr = doc.createElement('div'); tr.className = 'pyrw-tr';
      tr.style.setProperty('--dir', 'normal');
      wl.appendChild(tr); doc.body.appendChild(p);
      p._fill = function () {   // 한 세트가 칸 높이보다 짧으면 반복해서 채운 뒤, 같은 세트를 한 번 더 이어 붙여 끊김 없이 돌게 해요
        tr.innerHTML = '';
        var set = [], h = wl.clientHeight || 400, k = 0;
        do { rs.forEach(function (r) { var n = card(r, k > 0); tr.appendChild(n); set.push(r); }); k++; } while (tr.scrollHeight < h && k < 12);
        tr.style.setProperty('--t', Math.max(20, Math.round(tr.scrollHeight / 26)) + 's');   // 카드 수와 상관없이 비슷한 속도(초당 약 26px)
        if (!rm) set.forEach(function (r) { tr.appendChild(card(r, true)); });
      };
      wl.addEventListener('focusin', function () { wl.classList.add('is-hold'); });
      wl.addEventListener('focusout', function () { wl.classList.remove('is-hold'); });
      var hl = null;
      function mark(n) { if (hl === n) return; if (hl) hl.classList.remove('is-hl'); hl = n; if (n) n.classList.add('is-hl'); }
      wl.addEventListener('pointermove', function (e) { var y = e.clientY; mark(Array.prototype.filter.call(tr.children, function (n) { var r = n.getBoundingClientRect(); return y >= r.top && y <= r.bottom; })[0] || null); });
      wl.addEventListener('pointerleave', function () { mark(null); });
      // 카드를 누르면 아트머그 '이용 후기' 칸으로 이동
      function go() { var t = doc.getElementById('cont_after'); if (t) scrollTo({top: t.getBoundingClientRect().top + scrollY - 20, behavior: 'smooth'}); }
      wl.addEventListener('click', function (e) { if (e.target.closest('.pyrw-cd')) go(); });
      wl.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.pyrw-cd')) { e.preventDefault(); go(); } });
      p.querySelector('.pyrw-hd').addEventListener('click', go);
      p.querySelector('.pyrw-hd').style.cursor = 'pointer';
      return p;
    });

    /* 본문(1080px) 양옆 여백 가운데에 놓고, 여백이 모자라면 숨겨요 */
    var lastH = 0;
    function place() {
      var ref = doc.getElementById('cont_after') || doc.body, r = ref.getBoundingClientRect();
      var vw = doc.documentElement.clientWidth, left = r.left, right = vw - r.right;
      var ok = left >= W + MIN_GAP * 2;
      panels.forEach(function (p) {
        p.hidden = !ok;
        if (!ok) return;
        p.style.left = (left - W) / 2 + 'px';
        p.classList.add('on');
      });
      var h = innerHeight;
      if (ok && h !== lastH) { lastH = h; panels.forEach(function (p) { p._fill(); }); }
    }
    /* 혹시 여백에 아트머그 광고 배너(.ad_banner*)가 겹치면, 겹치는 동안만 위젯을 잠깐 숨겨요 */
    var raf = 0;
    function dodge() {
      raf = 0;
      var p = panels[0]; if (!p || p.hidden) return;
      var pr = p.getBoundingClientRect(), hit = false;
      Array.prototype.forEach.call(doc.querySelectorAll('[class*="ad_banner"]'), function (a) {
        if (a.closest('.pyrw')) return;
        var r = a.getBoundingClientRect();
        if (r.width && r.height && r.right > pr.left && r.left < pr.right && r.bottom > pr.top - 12 && r.top < pr.bottom + 12) hit = true;
      });
      p.classList.toggle('on', !hit);
      p.style.pointerEvents = hit ? 'none' : '';
    }
    addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(dodge); }, {passive: true});
    place(); dodge();
    var t; addEventListener('resize', function () { clearTimeout(t); t = setTimeout(function () { place(); dodge(); }, 150); });
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', build); else build();
})();
