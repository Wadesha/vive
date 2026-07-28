(function () {
  'use strict';

  if (!window.TimeCapsule) return;

  var currentFilter = 'all';
  var observer = null;

  // ── 工具 ──
  function esc(str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function fmtDate(ts) {
    var d = new Date(ts);
    return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
  }

  function remain(ts) {
    var now = Date.now();
    var diff = ts - now;
    if (diff <= 0) return '已到期';
    var days = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    if (days > 365) return Math.floor(days / 365) + ' 年后';
    if (days > 30) return Math.floor(days / 30) + ' 个月后';
    if (days > 0) return days + ' 天后';
    return hours + ' 小时后';
  }

  function typeLabel(t) {
    var m = { self: '给自己', memory: '记忆', anniversary: '纪念日', child: '给孩子', love: '给爱人', letter: '给某人' };
    return m[t] || t;
  }

  function statusOf(cap) {
    if (cap.opened) return 'opened';
    if (Date.now() >= cap.unlockAt) return 'unlocked';
    return 'locked';
  }

  // ── 渲染胶囊卡片 ──
  function renderGrid() {
    var grid = document.getElementById('capGrid');
    if (!grid) return;

    var all = TimeCapsule.listCapsules();
    var list = all.filter(function (c) {
      if (currentFilter === 'all') return true;
      return statusOf(c) === currentFilter;
    });

    if (!list.length) {
      grid.innerHTML = '<div class="cap-empty">还没有胶囊，点击右上角"封存一颗胶囊"开始吧</div>';
      return;
    }

    var html = '';
    list.forEach(function (cap) {
      var status = statusOf(cap);
      var cls = 'cap-card ' + cap.mood + ' ' + status;
      var canOpen = status === 'unlocked' || status === 'opened';
      var lockBadge = status === 'locked'
        ? '<div class="cap-lock">🔒 ' + remain(cap.unlockAt) + '</div>'
        : (status === 'opened'
          ? '<div class="cap-lock opened-badge">已开启</div>'
          : '<div class="cap-lock unlocked-badge">✦ 可开启</div>');

      html += '<div class="' + cls + '" data-id="' + cap.id + '">';
      html += '<div class="cap-card-top">';
      html += '<span class="cap-type">' + typeLabel(cap.type) + '</span>';
      html += lockBadge;
      html += '</div>';
      html += '<div class="cap-card-mid">';
      html += '<div class="cap-silhouette">';
      html += '<div class="mini-cap"><div class="mini-cap-top"></div><div class="mini-cap-body"><div class="mini-cap-seal">印</div></div></div>';
      html += '</div>';
      html += '<h3 class="cap-card-title">' + esc(cap.title) + '</h3>';
      html += '</div>';
      html += '<div class="cap-card-bot">';
      html += '<span class="cap-date">' + fmtDate(cap.createdAt) + ' 封存</span>';
      if (canOpen) {
        html += '<button class="cap-open-btn" data-id="' + cap.id + '">拆开</button>';
      } else {
        html += '<span class="cap-date">开启：' + fmtDate(cap.unlockAt) + '</span>';
      }
      html += '</div>';
      html += '<button class="cap-del-btn" data-id="' + cap.id + '" title="删除">×</button>';
      html += '</div>';
    });

    grid.innerHTML = html;

    // 绑定
    grid.querySelectorAll('.cap-open-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        openCapsuleModal(this.getAttribute('data-id'));
      });
    });

    grid.querySelectorAll('.cap-del-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (confirm('确认删除这颗胶囊？')) {
          TimeCapsule.deleteCapsule(this.getAttribute('data-id'));
          renderGrid();
        }
      });
    });

    observeCards();
  }

  // ── 渐入动画 ──
  function observeCards() {
    if (!observer) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      }, { threshold: 0.1 });
    }
    document.querySelectorAll('.cap-card').forEach(function (el) {
      if (!el.classList.contains('visible')) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        observer.observe(el);
      }
    });
  }

  // ── 开启胶囊弹窗 ──
  function openCapsuleModal(id) {
    var cap = TimeCapsule.getCapsule(id);
    if (!cap) return;

    var overlay = document.getElementById('openOverlay');
    var titleEl = document.getElementById('openTitle');
    var bodyEl = document.getElementById('openBody');
    if (!overlay || !bodyEl) return;

    titleEl.textContent = cap.title;

    var firstTime = !cap.opened;
    if (firstTime) {
      bodyEl.innerHTML = '<div class="cap-unseal"><div class="unseal-cap"><div class="unseal-top"></div><div class="unseal-body"><div class="unseal-seal">印</div></div></div><p class="unseal-tip">轻轻按下，拆开这封信</p><button class="unseal-btn" id="unsealBtn">拆 封</button></div>';
      overlay.classList.add('open');
      document.getElementById('unsealBtn').addEventListener('click', function () {
        TimeCapsule.openCapsule(id);
        showLetter(cap, true);
      });
    } else {
      showLetter(cap, false);
      overlay.classList.add('open');
    }
  }

  function showLetter(cap, isFirst) {
    var bodyEl = document.getElementById('openBody');
    if (!bodyEl) return;

    var paragraphs = cap.letter.split('\n\n').filter(function (p) { return p.trim(); });
    var html = '<div class="cap-letter' + (isFirst ? ' reveal' : '') + '">';
    html += '<div class="letter-header">';
    html += '<span class="letter-type">' + typeLabel(cap.type) + '</span>';
    html += '<span class="letter-date">' + fmtDate(cap.createdAt) + ' 封存</span>';
    html += '</div>';
    html += '<div class="letter-body">';
    paragraphs.forEach(function (p) {
      html += '<p>' + esc(p).replace(/\n/g, '<br>') + '</p>';
    });
    html += '</div>';
    html += '<div class="letter-footer">';
    html += '<span class="letter-mood">心情：' + moodLabel(cap.mood) + '</span>';
    html += '<span class="letter-unlock">开启：' + fmtDate(cap.unlockAt) + '</span>';
    html += '</div>';
    html += '</div>';
    bodyEl.innerHTML = html;
  }

  function moodLabel(m) {
    var map = { warm: '温暖', soft: '柔软', happy: '开心', sad: '难过', calm: '平静' };
    return map[m] || m;
  }

  // ── 筛选器 ──
  function bindFilter() {
    document.querySelectorAll('.filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentFilter = this.getAttribute('data-filter');
        document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        renderGrid();
      });
    });
  }

  // ── 关闭弹窗 ──
  function closeModal(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('open');
  }

  // ── 创建胶囊表单 ──
  function bindCreate() {
    var overlay = document.getElementById('createOverlay');
    var createBtn = document.getElementById('createBtn');
    var closeBtn = document.getElementById('createClose');
    var form = document.getElementById('createForm');

    if (createBtn) createBtn.addEventListener('click', function () {
      overlay.classList.add('open');
      var dateInput = form.querySelector('[name="unlockDate"]');
      if (dateInput && !dateInput.value) {
        var d = new Date();
        d.setFullYear(d.getFullYear() + 1);
        dateInput.value = d.toISOString().split('T')[0];
      }
    });
    if (closeBtn) closeBtn.addEventListener('click', function () { closeModal('createOverlay'); });
    overlay.addEventListener('click', function (e) { if (e.target === this) closeModal('createOverlay'); });

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(this);
        var dateStr = fd.get('unlockDate');
        var unlockAt = new Date(dateStr).getTime();

        var cap = TimeCapsule.addCapsule({
          title: fd.get('title'),
          type: fd.get('type'),
          mood: fd.get('mood'),
          letter: fd.get('letter'),
          unlockAt: unlockAt
        });

        closeModal('createOverlay');
        form.reset();
        renderGrid();

        // 轻微提示
        setTimeout(function () {
          showToast('胶囊已封存，' + remain(cap.unlockAt) + '可开启');
        }, 300);
      });
    }

    // 开启弹窗关闭
    document.getElementById('openClose').addEventListener('click', function () { closeModal('openOverlay'); });
    document.getElementById('openOverlay').addEventListener('click', function (e) { if (e.target === this) closeModal('openOverlay'); });
  }

  // ── Toast 提示 ──
  function showToast(msg) {
    var t = document.createElement('div');
    t.className = 'cap-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('show'); }, 10);
    setTimeout(function () {
      t.classList.remove('show');
      setTimeout(function () { t.remove(); }, 400);
    }, 2500);
  }

  // ── 初始化 ──
  function init() {
    renderGrid();
    bindFilter();
    bindCreate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
