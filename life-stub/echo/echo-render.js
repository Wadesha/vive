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
    html += '<label class="echo-detail-my-label" for="echoMyNote">我的笔记（自动保存）</label>';
    html += '<textarea id="echoMyNote" class="echo-detail-my-note" rows="4" placeholder="读到这里，想到谁？想到什么事？">' + escapeHtml(userNote) + '</textarea>';

    $modalContent.innerHTML = html;
    $modal.hidden = false;

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
    if (confirm('确定要重置为初始 15 条归档吗？你补录的内容和笔记都会被清除。')) {
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
})();
