(function () {
  'use strict';

  var TYPE_LABEL = {
    literature: '文学经典',
    personal: '个人分享',
    oral: '口述史'
  };

  var state = {
    type: 'all'
  };

  // ── DOM refs ──
  var $list = document.getElementById('echoList');
  var $stats = document.getElementById('echoStats');
  var $empty = document.getElementById('echoEmpty');
  var $filters = document.getElementById('echoFilters');
  var $addBtn = document.getElementById('echoAddBtn');
  var $resetBtn = document.getElementById('echoResetBtn');
  var $modal = document.getElementById('echoModal');
  var $modalContent = document.getElementById('echoModalContent');
  var $addModal = document.getElementById('echoAddModal');
  var $addForm = document.getElementById('echoAddForm');

  // ── 渲染卡片列表 ──
  function renderList() {
    var items = EchoArchive.listByType(state.type);
    $list.innerHTML = '';

    if (!items.length) {
      $empty.hidden = false;
    } else {
      $empty.hidden = true;
      items.forEach(function (item) {
        $list.appendChild(buildCard(item));
      });
    }
    renderStats();
  }

  function buildCard(item) {
    var card = document.createElement('article');
    card.className = 'echo-card echo-card--' + item.type;

    var typeBadge = document.createElement('span');
    typeBadge.className = 'echo-type-badge echo-type-' + item.type;
    typeBadge.textContent = TYPE_LABEL[item.type] || item.type;

    var theme = document.createElement('span');
    theme.className = 'echo-theme';
    theme.textContent = '· ' + (item.theme || '未分类');

    var header = document.createElement('header');
    header.className = 'echo-card-head';
    header.appendChild(typeBadge);
    header.appendChild(theme);

    var title = document.createElement('h3');
    title.className = 'echo-card-title';
    title.textContent = item.title;

    var excerpt = document.createElement('blockquote');
    excerpt.className = 'echo-card-excerpt';
    excerpt.textContent = item.excerpt;

    var meta = document.createElement('div');
    meta.className = 'echo-card-meta';
    var author = document.createElement('span');
    author.textContent = '— ' + (item.author || '佚名');
    var source = document.createElement('span');
    source.className = 'echo-source';
    source.textContent = '出处：' + (item.source || '未标注');
    meta.appendChild(author);
    meta.appendChild(source);

    var tags = document.createElement('div');
    tags.className = 'echo-card-tags';
    (item.tags || []).forEach(function (t) {
      var tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = t;
      tags.appendChild(tag);
    });

    var footer = document.createElement('footer');
    footer.className = 'echo-card-foot';

    var openBtn = document.createElement('button');
    openBtn.className = 'echo-btn ghost small';
    openBtn.textContent = '展开 / 写笔记';
    openBtn.addEventListener('click', function () { openDetail(item.id); });

    var delBtn = document.createElement('button');
    delBtn.className = 'echo-btn ghost small danger';
    delBtn.textContent = '移除';
    delBtn.addEventListener('click', function () {
      if (confirm('确定把这条从回声库中移除吗？（不会删除原始出处）')) {
        EchoArchive.deleteItem(item.id);
        renderList();
      }
    });

    footer.appendChild(openBtn);
    footer.appendChild(delBtn);

    card.appendChild(header);
    card.appendChild(title);
    card.appendChild(excerpt);
    card.appendChild(meta);
    if ((item.tags || []).length) card.appendChild(tags);
    card.appendChild(footer);
    return card;
  }

  // ── 统计区 ──
  function renderStats() {
    var all = EchoArchive.listAll();
    var counts = { literature: 0, personal: 0, oral: 0 };
    var themes = {};
    all.forEach(function (i) {
      counts[i.type] = (counts[i.type] || 0) + 1;
      if (i.theme) themes[i.theme] = (themes[i.theme] || 0) + 1;
    });

    var themeList = Object.keys(themes).sort(function (a, b) { return themes[b] - themes[a]; });

    var html = '<div class="echo-stat-row">';
    html += '<span class="echo-stat-total">共归档 <b>' + all.length + '</b> 条</span>';
    html += '<span class="echo-stat-sep">|</span>';
    ['literature', 'personal', 'oral'].forEach(function (t) {
      html += '<span class="echo-stat-item echo-type-' + t + '">' + (TYPE_LABEL[t] || t) + ' ' + counts[t] + '</span>';
    });
    html += '</div>';
    if (themeList.length) {
      html += '<div class="echo-stat-themes">主题分布：';
      themeList.forEach(function (t) {
        html += '<span class="echo-theme-chip">' + t + '·' + themes[t] + '</span>';
      });
      html += '</div>';
    }
    $stats.innerHTML = html;
  }

  // ── 详情/笔记弹窗 ──
  function openDetail(id) {
    var item = EchoArchive.getItem(id);
    if (!item) return;
    var userNote = EchoArchive.getNote(id);

    var html = '';
    html += '<div class="echo-detail-type echo-type-' + item.type + '">' + (TYPE_LABEL[item.type] || item.type) + ' · ' + (item.theme || '未分类') + '</div>';
    html += '<h2 class="echo-detail-title">' + escapeHtml(item.title) + '</h2>';
    html += '<div class="echo-detail-author">' + escapeHtml(item.author || '佚名') + '</div>';
    html += '<blockquote class="echo-detail-excerpt">' + escapeHtml(item.excerpt) + '</blockquote>';
    html += '<div class="echo-detail-source">出处：' + escapeHtml(item.source || '未标注') + '</div>';

    if ((item.tags || []).length) {
      html += '<div class="echo-detail-tags">';
      item.tags.forEach(function (t) {
        html += '<span class="tag">' + escapeHtml(t) + '</span>';
      });
      html += '</div>';
    }

    if (item.note) {
      html += '<div class="echo-detail-note-label">归档批注</div>';
      html += '<p class="echo-detail-note">' + escapeHtml(item.note) + '</p>';
    }

    html += '<hr class="echo-divider">';
    html += '<div class="echo-detail-actions">';
    html += '<span class="echo-detail-actions-label">一键摘录到：</span>';
    html += '<button class="echo-detail-btn" data-action="toJourney">📝 存为速记</button>';
    html += '<button class="echo-detail-btn" data-action="toMail">✉️ 写回信</button>';
    html += '<button class="echo-detail-btn" data-action="toWishlist">🎯 许愿关联</button>';
    html += '</div>';

    // 一键心情标记（不用打字）
    html += '<hr class="echo-divider">';
    html += '<div class="echo-mood-mark">';
    html += '<span class="echo-mood-mark-label">读到这里的心情：</span>';
    html += '<div class="echo-mood-mark-tags">';
    var MOOD_MARKS = ['☀️ 共鸣', '🌿 被触动', '💭 想到谁', '😢 心酸', '✨ 被安慰', '📌 收藏'];
    MOOD_MARKS.forEach(function (m) {
      html += '<button class="echo-mood-mark-btn" data-mark="' + escapeHtml(m) + '">' + m + '</button>';
    });
    html += '</div>';
    html += '</div>';

    html += '<hr class="echo-divider">';
    html += '<details class="echo-detail-note-collapse">';
    html += '<summary>想多写几句？（可选）</summary>';
    html += '<label class="echo-detail-my-label" for="echoMyNote">我的笔记（自动保存）</label>';
    html += '<textarea id="echoMyNote" class="echo-detail-my-note" rows="4" placeholder="读到这里，想到谁？想到什么事？">' + escapeHtml(userNote) + '</textarea>';
    html += '</details>';

    $modalContent.innerHTML = html;
    $modal.hidden = false;

    // ── 摘录按钮事件绑定 ──
    $modalContent.querySelectorAll('.echo-detail-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var action = btn.getAttribute('data-action');
        handleExcerptAction(action, item);
      });
    });

    // ── 心情标记按钮：点一下就存为笔记 ──
    $modalContent.querySelectorAll('.echo-mood-mark-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mark = btn.getAttribute('data-mark');
        var existing = EchoArchive.getNote(id) || '';
        var noteText = mark;
        if (existing && !existing.startsWith('[')) {
          noteText = mark + ' ' + existing;
        }
        EchoArchive.setNote(id, noteText);
        btn.classList.add('marked');
        btn.textContent = '✓ ' + mark;
        setTimeout(function () {
          btn.classList.remove('marked');
          btn.textContent = mark;
        }, 1500);
      });
    });

    var ta = document.getElementById('echoMyNote');
    var saveTimer = null;
    ta.addEventListener('input', function () {
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(function () {
        EchoArchive.setNote(id, ta.value);
        var tip = document.querySelector('.echo-saved-tip');
        if (!tip) {
          tip = document.createElement('span');
          tip.className = 'echo-saved-tip';
          ta.parentNode.insertBefore(tip, ta.nextSibling);
        }
        tip.textContent = '已保存';
        setTimeout(function () { if (tip) tip.textContent = ''; }, 1500);
      }, 400);
    });
  }

  function closeModal() {
    $modal.hidden = true;
    $modalContent.innerHTML = '';
  }

  // ── 补录弹窗 ──
  function openAdd() {
    $addForm.reset();
    $addModal.hidden = false;
  }

  function closeAdd() {
    $addModal.hidden = true;
  }

  function handleAddSubmit(e) {
    e.preventDefault();
    var fd = new FormData($addForm);
    var tagsRaw = (fd.get('tags') || '').toString().trim();
    var tags = tagsRaw ? tagsRaw.split(/[,，、\s]+/).filter(Boolean) : [];
    EchoArchive.addItem({
      type: fd.get('type'),
      theme: fd.get('theme'),
      title: fd.get('title'),
      author: fd.get('author'),
      excerpt: fd.get('excerpt'),
      source: fd.get('source'),
      tags: tags,
      note: fd.get('note')
    });
    closeAdd();
    // 切到对应分类，方便用户立刻看到
    state.type = fd.get('type') || 'all';
    syncFilterButtons();
    renderList();
  }

  function syncFilterButtons() {
    var btns = $filters.querySelectorAll('.echo-filter');
    btns.forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-type') === state.type);
    });
  }

  // ── utils ──
  function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── 事件绑定 ──
  $filters.addEventListener('click', function (e) {
    var btn = e.target.closest('.echo-filter');
    if (!btn) return;
    state.type = btn.getAttribute('data-type');
    syncFilterButtons();
    renderList();
  });

  $addBtn.addEventListener('click', openAdd);
  $resetBtn.addEventListener('click', function () {
    if (confirm('确定要重置为初始 55 条归档吗？你补录的内容和笔记都会被清除。')) {
      EchoArchive.resetToSeed();
      state.type = 'all';
      syncFilterButtons();
      renderList();
    }
  });
  $addForm.addEventListener('submit', handleAddSubmit);

  // 通用：点 [data-close] 关闭弹窗
  document.addEventListener('click', function (e) {
    if (e.target.hasAttribute && e.target.hasAttribute('data-close')) {
      closeModal();
      closeAdd();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeModal(); closeAdd(); }
  });

  // ── 初始化 ──
  renderList();

  // ── 摘录动作：用 localStorage 直接写入其他模块 ──
  function handleExcerptAction(action, echo) {
    if (action === 'toJourney') {
      var journey = JSON.parse(localStorage.getItem('journey_data') || 'null');
      if (!journey || !Array.isArray(journey)) {
        journey = [];
      }
      var existingMaxId = 0;
      journey.forEach(function (j) {
        var num = parseInt(j.id.replace(/^j/, ''), 10);
        if (num > existingMaxId) existingMaxId = num;
      });
      journey.push({
        id: 'j' + (existingMaxId + 1),
        stage: 'quick',
        content: '读到"' + echo.title + '"：' + echo.excerpt + '\n\n—— ' + (echo.author || '佚名') + '《' + (echo.source || '未标注') + '》',
        mood: '',
        relatedEcho: echo.id,
        createdAt: Date.now(),
        settledAt: 0
      });
      localStorage.setItem('journey_data', JSON.stringify(journey));
      showToast('✓ 已存进历程簿，去历程簿查看');
    }
    else if (action === 'toMail') {
      var mail = JSON.parse(localStorage.getItem('echo_mail_data') || 'null');
      if (!mail || !Array.isArray(mail)) {
        mail = [];
      }
      var maxMailId = 0;
      mail.forEach(function (m) {
        var num = parseInt(m.id.replace(/^m/, ''), 10);
        if (num > maxMailId) maxMailId = num;
      });
      mail.push({
        id: 'm' + (maxMailId + 1),
        type: 'mirror',
        to: '现在的我',
        fromEcho: echo.id,
        echoExcerpt: echo.excerpt,
        content: '—— ' + (echo.author || '佚名') + '的话。读到时想到了什么？',
        reply: '',
        createdAt: Date.now(),
        threadId: 't' + (Date.now() % 10000)
      });
      localStorage.setItem('echo_mail_data', JSON.stringify(mail));
      showToast('✓ 已生成一封"平行我"来信，去回信亭回信');
    }
    else if (action === 'toWishlist') {
      var wishlist = JSON.parse(localStorage.getItem('wishlist_data') || 'null');
      if (!wishlist || !Array.isArray(wishlist)) {
        wishlist = [];
      }
      var maxWishId = 0;
      wishlist.forEach(function (w) {
        var num = parseInt(w.id.replace(/^w/, ''), 10);
        if (num > maxWishId) maxWishId = num;
      });
      wishlist.push({
        id: 'w' + (maxWishId + 1),
        target: '自己',
        title: '因为"' + echo.title + '"想做的一件事',
        category: '日常',
        why: '读到这段话："' + echo.excerpt.substring(0, 30) + '…" 觉得不该再等了。',
        plan: '想想具体要做什么，写下来。',
        done: '',
        status: 'todo',
        createdAt: Date.now(),
        checkins: []
      });
      localStorage.setItem('wishlist_data', JSON.stringify(wishlist));
      showToast('✓ 已创建一个关联心愿，去心愿簿完成');
    }
  }

  function showToast(msg) {
    var toast = document.createElement('div');
    toast.className = 'echo-excerpt-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = '0';
      setTimeout(function () { toast.remove(); }, 300);
    }, 2500);
  }
})();
