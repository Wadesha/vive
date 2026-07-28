(function () {
  'use strict';

  var STATUS_LABEL = { todo: '待做', doing: '在做', done: '完成' };

  var state = { target: 'all', status: 'all' };
  var editingId = null;

  // ── utils ──
  function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── DOM ──
  var $quickGrid = document.getElementById('wishlistQuickGrid');
  var $progress = document.getElementById('wishlistProgress');
  var $targets = document.getElementById('wishlistTargets');
  var $list = document.getElementById('wishlistList');
  var $empty = document.getElementById('wishlistEmpty');
  var $addBtn = document.getElementById('wishlistAddBtn');
  var $resetBtn = document.getElementById('wishlistResetBtn');

  var $modal = document.getElementById('wishlistModal');
  var $modalTitle = document.getElementById('wishlistModalTitle');
  var $form = document.getElementById('wishlistForm');
  var $formCategory = document.getElementById('wishlistFormCategory');
  var $doneField = document.getElementById('wishlistDoneField');
  var $templates = document.getElementById('wishlistTemplates');
  var $templateList = document.getElementById('wishlistTemplateList');

  // ── 快速心愿（6 个，点一下就加，不用填表）──
  var QUICK_WISHES = [
    { target: '妈妈', title: '带妈妈看一次海', category: '陪伴',
      why: '她说这辈子没看过海。每次电视里播海，她都多看两眼。',
      plan: '国庆假期，订去海边的票。选她能走得动的路线。' },
    { target: '爸爸', title: '问清他年轻时最骄傲的事', category: '传承',
      why: '我只知道他做什么工作，不知道他这辈子得意过什么。',
      plan: '下次回去，泡壶茶，慢慢问。准备好录音。' },
    { target: '奶奶', title: '录下她拿手菜的菜谱', category: '传承',
      why: '她做的味道，是我对"家"的味觉记忆。趁还能问赶紧记。',
      plan: '回乡下住几天，每天学一道。录视频 + 写文字，精确到克。' },
    { target: '自己', title: '一个人去一次海边', category: '日常',
      why: '总说等有空了就去。等了十年，还是没去。',
      plan: '下周末就去。不做攻略。带本书，看一下午浪。' },
    { target: '老朋友', title: '主动联系那个失联的朋友', category: '和解',
      why: '当年因为一件小事闹掰。现在想想，不值得。',
      plan: '找到联系方式。不提当年的事。就问："最近怎么样？"' },
    { target: '全家', title: '拍一张正经的全家福', category: '仪式',
      why: '上一张全家福是十年前了。再不拍，人又该变了。',
      plan: '今年春节全家到齐那天，用三脚架自拍。一个都不能少。' }
  ];

  function renderQuickWishes() {
    $quickGrid.innerHTML = QUICK_WISHES.map(function (w, i) {
      return '<button class="wishlist-quick-card" data-idx="' + i + '">' +
        '<span class="wishlist-quick-cat">' + escapeHtml(w.category) + '</span>' +
        '<span class="wishlist-quick-title">' + escapeHtml(w.title) + '</span>' +
        '<span class="wishlist-quick-target">@ ' + escapeHtml(w.target) + '</span>' +
        '<span class="wishlist-quick-add">＋ 一键加入</span>' +
        '</button>';
    }).join('');
  }

  $quickGrid.addEventListener('click', function (e) {
    var btn = e.target.closest('.wishlist-quick-card');
    if (!btn) return;
    var idx = parseInt(btn.getAttribute('data-idx'), 10);
    var w = QUICK_WISHES[idx];
    if (!w) return;
    var newItem = Wishlist.add({
      target: w.target,
      category: w.category,
      title: w.title,
      why: w.why,
      plan: w.plan
    });
    // 小动效
    btn.classList.add('added');
    btn.querySelector('.wishlist-quick-add').textContent = '✓ 已加入';
    setTimeout(function () {
      btn.classList.remove('added');
      btn.querySelector('.wishlist-quick-add').textContent = '＋ 一键加入';
    }, 1500);
    state.status = 'todo';
    // 同步状态筛选按钮高亮
    document.querySelectorAll('[data-status]').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-status') === 'todo');
    });
    renderAll();
    // 滚到列表
    $list.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // ── 初始化分类下拉 + 模板快选 ──
  function initCategoryOptions() {
    $formCategory.innerHTML = Wishlist.CATEGORIES.map(function (c) {
      return '<option value="' + c + '">' + c + '</option>';
    }).join('');
  }

  function initTemplates() {
    $templateList.innerHTML = Wishlist.TEMPLATES.map(function (t, idx) {
      return '<button type="button" class="wishlist-template-chip" data-idx="' + idx + '" title="' + escapeHtml(t.fill) + '">' + escapeHtml(t.tpl) + '</button>';
    }).join('');
  }

  // ── 渲染关系筛选标签 ──
  function renderTargetFilters() {
    var targets = Wishlist.allTargets();
    $targets.innerHTML = targets.map(function (t) {
      var cls = 'wishlist-filter' + (state.target === t ? ' active' : '');
      return '<button class="' + cls + '" data-target="' + escapeHtml(t) + '">' + escapeHtml(t) + '</button>';
    }).join('');
  }

  // ── 渲染进度总览 ──
  function renderProgress() {
    var s = Wishlist.stats();
    var pct = s.total ? Math.round(s.done / s.total * 100) : 0;

    var html = '<div class="wishlist-progress-summary">';
    html += '<span class="wishlist-progress-total">共 <b>' + s.total + '</b> 个心愿</span>';
    html += '<span class="wishlist-progress-pct">已完成 <b>' + pct + '%</b></span>';
    html += '<span class="wishlist-progress-detail">待做 ' + s.todo + ' · 在做 ' + s.doing + ' · 完成 ' + s.done + '</span>';
    html += '</div>';

    // 总进度条
    html += '<div class="wishlist-progress-bar"><div class="wishlist-progress-fill" style="width:' + pct + '%"></div></div>';

    // 按关系分组
    var byTarget = Wishlist.statsByTarget();
    byTarget.sort(function (a, b) { return b.total - a.total; });
    if (byTarget.length > 1) {
      html += '<div class="wishlist-progress-by-target">';
      byTarget.forEach(function (g) {
        var gp = g.total ? Math.round(g.done / g.total * 100) : 0;
        html += '<div class="wishlist-target-progress">';
        html += '<span class="wishlist-target-name">' + escapeHtml(g.target) + '</span>';
        html += '<span class="wishlist-target-count">' + g.done + '/' + g.total + '</span>';
        html += '<div class="wishlist-target-bar"><div class="wishlist-target-fill" style="width:' + gp + '%"></div></div>';
        html += '</div>';
      });
      html += '</div>';
    }

    $progress.innerHTML = html;
  }

  // ── 渲染卡片列表 ──
  function renderList() {
    var items = Wishlist.listAll();
    // 双重筛选
    items = items.filter(function (i) {
      var okT = state.target === 'all' || i.target === state.target;
      var okS = state.status === 'all' || i.status === state.status;
      return okT && okS;
    });
    // 排序：doing 优先，其次 todo，最后 done；同状态按时间倒序
    var order = { doing: 0, todo: 1, done: 2 };
    items.sort(function (a, b) {
      if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
      return b.createdAt - a.createdAt;
    });

    $list.innerHTML = '';
    if (!items.length) {
      $empty.hidden = false;
      return;
    }
    $empty.hidden = true;
    items.forEach(function (item) {
      $list.appendChild(buildCard(item));
    });
  }

  function buildCard(item) {
    var card = document.createElement('article');
    card.className = 'wishlist-card wishlist-card--' + item.status;

    // 头部：关系 + 分类 + 状态
    var head = document.createElement('header');
    head.className = 'wishlist-card-head';

    var target = document.createElement('span');
    target.className = 'wishlist-target-tag';
    target.textContent = '@ ' + item.target;

    var cat = document.createElement('span');
    cat.className = 'wishlist-cat-tag wishlist-cat-' + item.category;
    cat.textContent = item.category;

    var statusBadge = document.createElement('span');
    statusBadge.className = 'wishlist-status-badge wishlist-status-' + item.status;
    statusBadge.textContent = STATUS_LABEL[item.status];

    head.appendChild(target);
    head.appendChild(cat);
    head.appendChild(statusBadge);

    // 标题
    var title = document.createElement('h3');
    title.className = 'wishlist-card-title';
    if (item.status === 'done') {
      var check = document.createElement('span');
      check.className = 'wishlist-check';
      check.textContent = '✓ ';
      title.appendChild(check);
    }
    title.appendChild(document.createTextNode(item.title));

    card.appendChild(head);
    card.appendChild(title);

    // 三段笔记（折叠展示，有内容才显示）
    if (item.why) card.appendChild(buildNote('事前 · 为什么', item.why, 'why'));
    if (item.plan) card.appendChild(buildNote('事中 · 怎么准备', item.plan, 'plan'));
    if (item.done) card.appendChild(buildNote('事后 · 感受', item.done, 'done'));

    // 操作区
    var foot = document.createElement('footer');
    foot.className = 'wishlist-card-foot';

    // 打卡按钮
    var advanceBtn = document.createElement('button');
    advanceBtn.className = 'wishlist-btn solid small';
    if (item.status === 'todo') {
      advanceBtn.textContent = '开始做 →';
      advanceBtn.addEventListener('click', function () { Wishlist.advance(item.id); renderAll(); });
    } else if (item.status === 'doing') {
      advanceBtn.textContent = '完成了！✓';
      advanceBtn.addEventListener('click', function () {
        // 推进到 done
        Wishlist.advance(item.id);
        renderAll();
      });
    } else {
      advanceBtn.textContent = '已完成';
      advanceBtn.disabled = true;
      advanceBtn.className = 'wishlist-btn ghost small';
    }
    foot.appendChild(advanceBtn);

    // 回退按钮（doing/done 时显示）
    if (item.status !== 'todo') {
      var backBtn = document.createElement('button');
      backBtn.className = 'wishlist-btn ghost small';
      backBtn.textContent = '退回';
      backBtn.addEventListener('click', function () { Wishlist.retreat(item.id); renderAll(); });
      foot.appendChild(backBtn);
    }

    var editBtn = document.createElement('button');
    editBtn.className = 'wishlist-btn ghost small';
    editBtn.textContent = '编辑';
    editBtn.addEventListener('click', function () { openEdit(item.id, false); });
    foot.appendChild(editBtn);

    var delBtn = document.createElement('button');
    delBtn.className = 'wishlist-btn ghost small danger';
    delBtn.textContent = '删除';
    delBtn.addEventListener('click', function () {
      if (confirm('删掉这个心愿？')) { Wishlist.deleteItem(item.id); renderAll(); }
    });
    foot.appendChild(delBtn);

    card.appendChild(foot);

    // done 状态下展示"写感受"展开框（没填 done 时提示）
    if (item.status === 'done' && !item.done) {
      var doneBox = document.createElement('div');
      doneBox.className = 'wishlist-done-inline';
      var doneLabel = document.createElement('div');
      doneLabel.className = 'wishlist-done-inline-label';
      doneLabel.textContent = '做完了，写点感受？（存下来，以后不后悔）';
      var doneText = document.createElement('textarea');
      doneText.className = 'wishlist-done-inline-text';
      doneText.rows = 3;
      doneText.placeholder = '比如：做完才发现，原来她等这一天等了很久……';
      var doneActions = document.createElement('div');
      doneActions.className = 'wishlist-done-inline-actions';
      var doneSkip = document.createElement('button');
      doneSkip.className = 'wishlist-btn ghost small';
      doneSkip.textContent = '以后再写';
      var doneSave = document.createElement('button');
      doneSave.className = 'wishlist-btn solid small';
      doneSave.textContent = '存档 ✓';
      doneActions.appendChild(doneSkip);
      doneActions.appendChild(doneSave);
      doneBox.appendChild(doneLabel);
      doneBox.appendChild(doneText);
      doneBox.appendChild(doneActions);
      card.appendChild(doneBox);

      doneSave.addEventListener('click', function () {
        var val = doneText.value.trim();
        if (!val) return;
        Wishlist.update(item.id, { done: val });
        renderAll();
      });
      doneSkip.addEventListener('click', function () {
        doneBox.style.display = 'none';
      });
    }

    return card;
  }

  function buildNote(label, text, cls) {
    var wrap = document.createElement('div');
    wrap.className = 'wishlist-note wishlist-note--' + cls;
    var lab = document.createElement('div');
    lab.className = 'wishlist-note-label';
    lab.textContent = label;
    var body = document.createElement('p');
    body.className = 'wishlist-note-body';
    body.textContent = text;
    wrap.appendChild(lab);
    wrap.appendChild(body);
    return wrap;
  }

  function renderAll() {
    renderTargetFilters();
    renderProgress();
    renderList();
  }

  // ── 模板快选 ──
  $templateList.addEventListener('click', function (e) {
    var chip = e.target.closest('.wishlist-template-chip');
    if (!chip) return;
    var idx = parseInt(chip.getAttribute('data-idx'), 10);
    var tpl = Wishlist.TEMPLATES[idx];
    $form.title.value = tpl.fill;
    $form.target.focus();
  });

  // ── 添加弹窗 ──
  function openAdd() {
    editingId = null;
    $modalTitle.textContent = '添加一个心愿';
    $form.reset();
    $doneField.hidden = true;
    $templates.hidden = false;
    $form.target.value = state.target !== 'all' ? state.target : '';
    $modal.hidden = false;
  }

  function openEdit(id, focusDone) {
    var item = Wishlist.getItem(id);
    if (!item) return;
    editingId = id;
    $modalTitle.textContent = '编辑心愿';
    $form.reset();
    $templates.hidden = true;
    $form.target.value = item.target;
    $form.category.value = item.category;
    $form.title.value = item.title;
    $form.why.value = item.why;
    $form.plan.value = item.plan;
    $form.done.value = item.done;
    $doneField.hidden = false;
    if (focusDone) $form.done.focus();
    $modal.hidden = false;
  }

  function closeModal() {
    $modal.hidden = true;
    editingId = null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    var data = {
      target: $form.target.value.trim(),
      category: $form.category.value,
      title: $form.title.value.trim(),
      why: $form.why.value.trim(),
      plan: $form.plan.value.trim(),
      done: $form.done.value.trim()
    };
    if (!data.target || !data.title) return;

    if (editingId) {
      Wishlist.update(editingId, data);
    } else {
      Wishlist.add(data);
    }
    closeModal();
    renderAll();
  }

  // ── 筛选 ──
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-target]');
    var s = e.target.closest('[data-status]');
    if (t) {
      state.target = t.getAttribute('data-target');
      renderAll();
      return;
    }
    if (s) {
      state.status = s.getAttribute('data-status');
      // 更新状态筛选按钮高亮
      document.querySelectorAll('[data-status]').forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-status') === state.status);
      });
      renderList();
      return;
    }
    if (e.target.hasAttribute && e.target.hasAttribute('data-close')) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  $addBtn.addEventListener('click', openAdd);
  $resetBtn.addEventListener('click', function () {
    if (confirm('确定重置为示例数据？你的所有心愿都会被清除。')) {
      Wishlist.resetToSeed();
      state.target = 'all';
      state.status = 'all';
      renderAll();
    }
  });
  $form.addEventListener('submit', handleSubmit);

  // ── 初始化 ──
  renderQuickWishes();
  initCategoryOptions();
  initTemplates();
  renderAll();
})();
