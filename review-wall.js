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
      var full = doc.getElementById('afterContent' + no);
      var text = ((full && full.textContent) || td[2].textContent || '').replace(/\s+/g, ' ').trim();
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
    + 'border:10px solid transparent;border-radius:16px;background:linear-gradient(#fff,#fff) padding-box,radial-gradient(circle,#fff 1.6px,transparent 2.2px) 0 0/14px 14px border-box,radial-gradient(circle,#fff 1.6px,transparent 2.2px) 7px 7px/14px 14px border-box,#f6a9c9 border-box;'
    + 'box-shadow:0 0 0 2px #e589b0,inset 0 0 0 2px #e589b0,0 24px 40px -28px rgba(196,82,126,.55);color:#2a2a2a;font-family:"Paperozi",sans-serif;opacity:0;transition:opacity .4s}'
    + '.pyrw.on{opacity:1}.pyrw[hidden]{display:none}'
    + '.pyrw *{box-sizing:border-box}'
    + '.pyrw-hd{position:absolute;left:0;right:0;top:0;z-index:2;padding:16px 14px 8px;text-align:center;background:#fff;border-radius:6px 6px 0 0}'
    + '.pyrw-hd h3{margin:0;font:italic 700 22px/1.1 "Playfair Display",serif;color:#c4527e;letter-spacing:.5px}'
    + '.pyrw-hd p{margin:6px 0 0;font:400 11px/1.4 "Galmuri11","Paperozi",sans-serif;color:#8a8086}'
    + '.pyrw-hd p b{color:#e0457f;font-weight:700}.pyrw-hd p i{font-style:normal;color:#ef94bc}'
    + '.pyrw-wl{position:absolute;left:10px;right:10px;top:74px;bottom:10px;overflow:hidden;'
    + '-webkit-mask-image:linear-gradient(transparent,#000 14%,#000 82%,transparent);mask-image:linear-gradient(transparent,#000 14%,#000 82%,transparent)}'
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
    var ansTxt = ans ? ans.textContent.replace(/\s+/g, ' ').replace(/\s+%/, '%').trim() : '';
    // 후기가 적으면 두 줄 모두 전체 후기를, 많으면 번갈아 나눠 담아요
    var cols = list.length < 6 ? [list, list.slice().reverse()] : [list.filter(function (_, i) { return !(i % 2); }), list.filter(function (_, i) { return i % 2; })];
    var panels = cols.map(function (rs, c) {
      var p = doc.createElement('aside'); p.className = 'pyrw pyrw-' + (c ? 'r' : 'l');
      p.setAttribute('aria-label', '이용 후기 모음');
      p.innerHTML = c
        ? '<div class="pyrw-hd"><h3>Thanks ♡</h3><p>눌러서 후기 전체 보기 ↓</p></div><div class="pyrw-wl"></div>'
        : '<div class="pyrw-hd"><h3>Reviews.</h3><p><i aria-hidden="true">★</i> <b>' + avg.toFixed(1) + '</b> · 후기 <b>' + total + '</b>개' + (ansTxt ? ' · ' + esc(ansTxt) : '') + '</p></div><div class="pyrw-wl"></div>';
      var wl = p.querySelector('.pyrw-wl');
      var tr = doc.createElement('div'); tr.className = 'pyrw-tr';
      tr.style.setProperty('--t', c ? '30s' : '24s'); tr.style.setProperty('--dir', c ? 'reverse' : 'normal');
      wl.appendChild(tr); doc.body.appendChild(p);
      p._fill = function () {   // 한 세트가 칸 높이보다 짧으면 반복해서 채운 뒤, 같은 세트를 한 번 더 이어 붙여 끊김 없이 돌게 해요
        tr.innerHTML = '';
        var set = [], h = wl.clientHeight || 400, k = 0;
        do { rs.forEach(function (r) { var n = card(r, k > 0); tr.appendChild(n); set.push(r); }); k++; } while (tr.scrollHeight < h && k < 12);
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
      var ok = Math.min(left, right) >= W + MIN_GAP * 2;
      panels.forEach(function (p, c) {
        p.hidden = !ok;
        if (!ok) return;
        p.style.left = (c ? r.right + (right - W) / 2 : (left - W) / 2) + 'px';
        p.classList.add('on');
      });
      var h = innerHeight;
      if (ok && h !== lastH) { lastH = h; panels.forEach(function (p) { p._fill(); }); }
    }
    /* 오른쪽 여백 위쪽에는 아트머그 광고 배너(.ad_banner*)가 있어서, 배너와 겹치는 동안엔 오른쪽 위젯을 잠깐 숨겨요 */
    var raf = 0;
    function dodge() {
      raf = 0;
      var p = panels[1]; if (!p || p.hidden) return;
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
