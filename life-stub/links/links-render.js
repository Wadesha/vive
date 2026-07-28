(function () {
  'use strict';

  var state = { view: 'refs' };

  var $stats = document.getElementById('linksStats');
  var $view = document.getElementById('linksView');
  var $empty = document.getElementById('linksEmpty');
  var $tabs = document.getElementById('linksTabs');

  var SOURCES = LinkNet.SOURCES;

  function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function sourceLabel(key) {
    return (SOURCES[key] && SOURCES[key].label) || key;
  }

  function sourceHref(key) {
    return (SOURCES[key] && SOURCES[key].href) || '#';
  }

  function sourceColor(key) {
    return (SOURCES[key] && SOURCES[key].color) || '#888';
  }

  // ── 统计总览 ──
  function renderStats() {
    var s = LinkNet.stats();
    var html = '<div class="links-stats-row">';
    html += '<div class="links-stat-card"><b>' + s.totalEntries + '</b><span>条目（除回声库）</span></div>';
    html += '<div class="links-stat-card"><b>' + s.echoTotal + '</b><span>回声库归档</span></div>';
    html += '<div class="links-stat-card links-stat-card--accent"><b>' + s.totalReferences + '</b><span>引用关系</span></div>';
    html += '<div class="links-stat-card"><b>' + s.referencedEchoCount + '</b><span>被引用的回声</span></div>';
    html += '</div>';

    html += '<div class="links-stats-sources">';
    Object.keys(s.counts).forEach(function (k) {
      html += '<a class="links-source-chip" href="' + sourceHref(k) + '" style="border-color:' + sourceColor(k) + '">';
      html += '<span class="links-source-dot" style="background:' + sourceColor(k) + '"></span>';
      html += '<span class="links-source-name">' + sourceLabel(k) + '</span>';
      html += '<span class="links-source-count">' + s.counts[k] + '</span>';
      html += '</a>';
    });
    html += '</div>';

    $stats.innerHTML = html;
  }

  // ── 视图：引用关系 ──
  function renderRefs() {
    var refs = LinkNet.getReferences();
    refs.sort(function (a, b) {
      // 按被引用的回声分组
      return a.to.id < b.to.id ? -1 : (a.to.id > b.to.id ? 1 : 0);
    });

    if (!refs.length) {
      $empty.hidden = false;
      $view.innerHTML = '';
      return;
    }
    $empty.hidden = true;

    var html = '<p class="links-view-hint">共 <b>' + refs.length + '</b> 条引用。每一行 = 一条记录，挂到了一条回声上。点"去这条记录"跳转。</p>';
    refs.forEach(function (r) {
      html += '<article class="links-ref-card">';
      // from
      html += '<div class="links-ref-from">';
      html += '<a class="links-source-tag" href="' + sourceHref(r.from.source) + '" style="border-color:' + sourceColor(r.from.source) + ';color:' + sourceColor(r.from.source) + '">' + sourceLabel(r.from.source) + '</a>';
      html += '<div class="links-ref-text">';
      html += '<div class="links-ref-title">' + escapeHtml(r.from.title) + '</div>';
      html += '<div class="links-ref-preview">' + escapeHtml(r.from.preview.slice(0, 60)) + (r.from.preview.length > 60 ? '…' : '') + '</div>';
      html += '</div>';
      html += '</div>';
      // arrow
      html += '<div class="links-ref-arrow">引用 →</div>';
      // to (echo)
      html += '<a class="links-ref-to" href="' + sourceHref('echo') + '">';
      html += '<div class="links-ref-echo-title">《' + escapeHtml(r.to.title) + '》</div>';
      html += '<div class="links-ref-echo-author">— ' + escapeHtml(r.to.author || '佚名') + ' · ' + escapeHtml(r.to.theme || '') + '</div>';
      html += '<blockquote class="links-ref-echo-excerpt">' + escapeHtml(r.to.excerpt.slice(0, 70)) + (r.to.excerpt.length > 70 ? '…' : '') + '</blockquote>';
      html += '</a>';
      html += '</article>';
    });
    $view.innerHTML = html;
  }

  // ── 视图：反向引用（被引用的回声）──
  function renderReverse() {
    var echoItems = LinkNet.getEchoItems();
    var reverseMap = {};
    LinkNet.getReferences().forEach(function (r) {
      if (!reverseMap[r.to.id]) reverseMap[r.to.id] = [];
      reverseMap[r.to.id].push(r.from);
    });

    var referenced = echoItems.filter(function (e) { return reverseMap[e.id]; });

    if (!referenced.length) {
      $empty.hidden = false;
      $view.innerHTML = '';
      return;
    }
    $empty.hidden = true;

    // 按被引用次数倒序
    referenced.sort(function (a, b) { return reverseMap[b.id].length - reverseMap[a.id].length; });

    var html = '<p class="links-view-hint">这些回声被你的记录引用过——它们替你说出了话，又被你接住。共 <b>' + referenced.length + '</b> 条。</p>';
    referenced.forEach(function (e) {
      var refs = reverseMap[e.id];
      html += '<article class="links-rev-card">';
      html += '<a class="links-rev-echo" href="' + sourceHref('echo') + '">';
      html += '<div class="links-rev-echo-title">《' + escapeHtml(e.title) + '》</div>';
      html += '<div class="links-rev-echo-author">— ' + escapeHtml(e.author || '佚名') + ' · ' + escapeHtml(e.theme || '') + '</div>';
      html += '<blockquote class="links-rev-echo-excerpt">' + escapeHtml(e.excerpt.slice(0, 80)) + (e.excerpt.length > 80 ? '…' : '') + '</blockquote>';
      html += '</a>';
      html += '<div class="links-rev-count">被引用 <b>' + refs.length + '</b> 次</div>';
      html += '<div class="links-rev-backrefs">';
      refs.forEach(function (from) {
        html += '<a class="links-backref" href="' + sourceHref(from.source) + '">';
        html += '<span class="links-source-tag" style="border-color:' + sourceColor(from.source) + ';color:' + sourceColor(from.source) + '">' + sourceLabel(from.source) + '</span>';
        html += '<span class="links-backref-title">' + escapeHtml(from.title) + '</span>';
        html += '</a>';
      });
      html += '</div>';
      html += '</article>';
    });
    $view.innerHTML = html;
  }

  // ── 视图：全部条目 ──
  function renderAll() {
    var entries = LinkNet.getAllEntries();
    entries.sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });

    if (!entries.length) {
      $empty.hidden = false;
      $view.innerHTML = '';
      return;
    }
    $empty.hidden = true;

    // 按来源分组
    var groups = {};
    entries.forEach(function (en) {
      if (!groups[en.source]) groups[en.source] = [];
      groups[en.source].push(en);
    });

    var html = '<p class="links-view-hint">六大子产品的全部条目一览（回声库见其子站）。共 <b>' + entries.length + '</b> 条。点击跳转对应子产品。</p>';
    Object.keys(groups).forEach(function (src) {
      html += '<section class="links-group">';
      html += '<h3 class="links-group-title"><span class="links-source-dot" style="background:' + sourceColor(src) + '"></span>' + sourceLabel(src) + ' · ' + groups[src].length + '</h3>';
      groups[src].forEach(function (en) {
        var refBadge = en.refEcho ? '<span class="links-ref-badge">已挂回声</span>' : '';
        html += '<a class="links-entry-row" href="' + sourceHref(src) + '">';
        html += '<span class="links-entry-title">' + escapeHtml(en.title) + '</span>';
        html += '<span class="links-entry-preview">' + escapeHtml((en.preview || '').slice(0, 50)) + (en.preview && en.preview.length > 50 ? '…' : '') + '</span>';
        html += refBadge;
        html += '<span class="links-entry-go">→</span>';
        html += '</a>';
      });
      html += '</section>';
    });
    $view.innerHTML = html;
  }

  function renderView() {
    if (state.view === 'refs') renderRefs();
    else if (state.view === 'reverse') renderReverse();
    else renderAll();
  }

  function renderAllViews() {
    renderStats();
    renderView();
  }

  // ── 事件 ──
  $tabs.addEventListener('click', function (e) {
    var btn = e.target.closest('.links-tab');
    if (!btn) return;
    state.view = btn.getAttribute('data-view');
    $tabs.querySelectorAll('.links-tab').forEach(function (b) {
      b.classList.toggle('active', b === btn);
    });
    renderView();
  });

  // ── 初始化 ──
  renderAllViews();
})();
