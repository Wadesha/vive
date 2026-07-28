(function () {
  'use strict';

  // ── DOM refs ──
  var $quickText = document.getElementById('quickText');
  var $quickMood = document.getElementById('quickMood');
  var $quickEcho = document.getElementById('quickEcho');
  var $quickSaveBtn = document.getElementById('quickSaveBtn');
  var $todoForm = document.getElementById('todoForm');
  var $todoText = document.getElementById('todoText');
  var $todoList = document.getElementById('todoList');
  var $quickList = document.getElementById('quickList');
  var $settledList = document.getElementById('settledList');
  var $stats = document.getElementById('journeyStats');
  var $resetBtn = document.getElementById('journeyResetBtn');

  var $modal = document.getElementById('journeyModal');
  var $modalTitle = document.getElementById('journeyModalTitle');
  var $modalText = document.getElementById('journeyModalText');
  var $modalMood = document.getElementById('journeyModalMood');
  var $modalEcho = document.getElementById('journeyModalEcho');
  var $modalSave = document.getElementById('journeyModalSave');
  var editingId = null;

  // ── 回声库下拉填充 ──
  function fillEchoOptions() {
    if (typeof EchoArchive === 'undefined') return;
    var items = EchoArchive.listAll();
    var opts = '<option value="">关联回声库（可选）</option>';
    items.forEach(function (it) {
      opts += '<option value="' + it.id + '">' + escapeHtml(truncate(it.title, 20)) + '</option>';
    });
    $quickEcho.innerHTML = opts;

    var modalOpts = '<option value="">（无）</option>';
    items.forEach(function (it) {
      modalOpts += '<option value="' + it.id + '">' + escapeHtml(truncate(it.title, 20)) + '</option>';
    });
    $modalEcho.innerHTML = modalOpts;
  }

  // ── 渲染三栏 ──
  function renderAll() {
    renderCol($todoList, Journey.STAGE_TODO);
    renderCol($quickList, Journey.STAGE_QUICK);
    renderCol($settledList, Journey.STAGE_SETTLED);
    renderStats();
  }

  function renderCol($container, stage) {
    var items = Journey.listByStage(stage);
    // 速记/回顾按时间倒序，待记按创建正序（先埋的先做）
    if (stage !== Journey.STAGE_TODO) {
      items.sort(function (a, b) { return b.createdAt - a.createdAt; });
    } else {
      items.sort(function (a, b) { return a.createdAt - b.createdAt; });
    }
    $container.innerHTML = '';
    if (!items.length) {
      var empty = document.createElement('p');
      empty.className = 'journey-empty-hint';
      empty.textContent = stage === Journey.STAGE_TODO
        ? '还没有埋下的种子。'
        : (stage === Journey.STAGE_QUICK ? '还没有速记。想到什么，写在最上方。' : '还没有沉淀的条目。');
      $container.appendChild(empty);
      return;
    }
    items.forEach(function (item) {
      $container.appendChild(buildCard(item, stage));
    });
  }

  function buildCard(item, stage) {
    var card = document.createElement('div');
    card.className = 'journey-card journey-card--' + stage;

    var time = document.createElement('div');
    time.className = 'journey-card-time';
    time.textContent = formatTime(item.createdAt, stage === Journey.STAGE_SETTLED ? item.settledAt : 0);

    var content = document.createElement('p');
    content.className = 'journey-card-content';
    content.textContent = item.content;

    card.appendChild(time);
    card.appendChild(content);

    // 心情标签
    if (item.mood) {
      var mood = document.createElement('span');
      mood.className = 'journey-mood-chip';
      mood.textContent = item.mood;
      card.appendChild(mood);
    }

    // 关联回声库
    if (item.relatedEcho && typeof EchoArchive !== 'undefined') {
      var echo = EchoArchive.getItem(item.relatedEcho);
      if (echo) {
        var ref = document.createElement('div');
        ref.className = 'journey-echo-ref';
        ref.innerHTML = '↳ 呼应回声：<span>' + escapeHtml(truncate(echo.title, 24)) + '</span>';
        card.appendChild(ref);
      }
    }

    // 操作按钮
    var foot = document.createElement('div');
    foot.className = 'journey-card-foot';

    if (stage === Journey.STAGE_TODO) {
      var startBtn = mkBtn('发芽 →', 'solid small', function () {
        // 待记 → 速记：一键转换，不弹框
        Journey.todoToQuick(item.id);
        renderAll();
      });
      var delBtn = mkBtn('删除', 'ghost small danger', function () {
        if (confirm('删掉这颗种子？')) { Journey.deleteItem(item.id); renderAll(); }
      });
      foot.appendChild(startBtn);
      foot.appendChild(delBtn);
    } else if (stage === Journey.STAGE_QUICK) {
      var editBtn = mkBtn('编辑', 'ghost small', function () { openModal(item, '编辑速记'); });
      var settleBtn = mkBtn('已沉淀', 'ghost small', function () {
        Journey.settle(item.id);
        renderAll();
      });
      var delBtn2 = mkBtn('删除', 'ghost small danger', function () {
        if (confirm('删掉这条速记？')) { Journey.deleteItem(item.id); renderAll(); }
      });
      foot.appendChild(editBtn);
      foot.appendChild(settleBtn);
      foot.appendChild(delBtn2);
    } else {
      var unsetBtn = mkBtn('撤回', 'ghost small', function () {
        Journey.unsettle(item.id);
        renderAll();
      });
      var delBtn3 = mkBtn('删除', 'ghost small danger', function () {
        if (confirm('彻底删除这条沉淀？')) { Journey.deleteItem(item.id); renderAll(); }
      });
      foot.appendChild(unsetBtn);
      foot.appendChild(delBtn3);
    }

    card.appendChild(foot);
    return card;
  }

  function mkBtn(text, cls, onClick) {
    var b = document.createElement('button');
    b.className = 'journey-btn ' + cls;
    b.textContent = text;
    b.addEventListener('click', onClick);
    return b;
  }

  // ── 统计 ──
  function renderStats() {
    var s = Journey.stats();
    $stats.innerHTML =
      '共 <b>' + s.total + '</b> 条 · ' +
      '待记 ' + s.todo + ' · 速记 ' + s.quick + ' · 沉淀 ' + s.settled;
  }

  // ── 速记保存 ──
  function handleQuickSave() {
    var text = $quickText.value.trim();
    if (!text) {
      $quickText.focus();
      return;
    }
    Journey.addQuick({
      content: text,
      mood: $quickMood.value,
      relatedEcho: $quickEcho.value
    });
    $quickText.value = '';
    $quickMood.value = '';
    $quickEcho.value = '';
    renderAll();
  }

  // ── 待记提交 ──
  function handleTodoSubmit(e) {
    e.preventDefault();
    var text = $todoText.value.trim();
    if (!text) return;
    Journey.addTodo({ content: text });
    $todoText.value = '';
    renderAll();
  }

  // ── 编辑弹窗 ──
  function openModal(item, title) {
    editingId = item.id;
    $modalTitle.textContent = title || '编辑';
    $modalText.value = item.content;
    $modalMood.value = item.mood || '';
    $modalEcho.value = item.relatedEcho || '';
    $modal.hidden = false;
  }

  function closeModal() {
    $modal.hidden = true;
    editingId = null;
  }

  function handleModalSave() {
    if (!editingId) return;
    var item = Journey.getItem(editingId);
    if (!item) { closeModal(); return; }
    var text = $modalText.value.trim();
    if (!text) { $modalText.focus(); return; }

    if (item.stage === Journey.STAGE_TODO) {
      // 待记 -> 速记
      Journey.todoToQuick(editingId, text, $modalMood.value, $modalEcho.value);
    } else {
      // 速记编辑
      Journey.update(editingId, {
        content: text,
        mood: $modalMood.value,
        relatedEcho: $modalEcho.value
      });
    }
    closeModal();
    renderAll();
  }

  // ── utils ──
  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function truncate(s, n) {
    s = s || '';
    return s.length > n ? s.slice(0, n) + '…' : s;
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function formatTime(ts, settledTs) {
    var d = new Date(ts);
    var base = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    if (settledTs) {
      var s = new Date(settledTs);
      return '沉淀于 ' + s.getFullYear() + '-' + pad(s.getMonth() + 1) + '-' + pad(s.getDate()) + ' · 原记 ' + base;
    }
    return base;
  }

  // ── 绑定 ──
  $quickSaveBtn.addEventListener('click', handleQuickSave);
  $todoForm.addEventListener('submit', handleTodoSubmit);
  $modalSave.addEventListener('click', handleModalSave);

  // ── 一键打卡：心情标签 ──
  document.getElementById('journeyMoodTags').addEventListener('click', function (e) {
    var btn = e.target.closest('.mood-tag');
    if (!btn) return;
    Journey.addQuick({
      content: btn.getAttribute('data-text'),
      mood: btn.getAttribute('data-mood'),
      relatedEcho: ''
    });
    flashPunch(btn);
    renderAll();
  });

  // ── 一键打卡：场景卡片 ──
  document.getElementById('journeySceneCards').addEventListener('click', function (e) {
    var btn = e.target.closest('.scene-card');
    if (!btn) return;
    Journey.addQuick({
      content: btn.getAttribute('data-text'),
      mood: btn.getAttribute('data-mood'),
      relatedEcho: ''
    });
    flashPunch(btn);
    renderAll();
  });

  function flashPunch(btn) {
    btn.classList.add('punched');
    var orig = btn.textContent;
    btn.textContent = '✓ 已记录';
    setTimeout(function () {
      btn.classList.remove('punched');
      btn.textContent = orig;
    }, 1200);
  }

  $resetBtn.addEventListener('click', function () {
    if (confirm('确定重置为示例数据？你的所有历程记录都会被清除。')) {
      Journey.resetToSeed();
      fillEchoOptions();
      renderAll();
    }
  });

  // Ctrl/Cmd+Enter 快速保存速记
  $quickText.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleQuickSave();
    }
  });

  // 点 mask / [data-close] 关闭
  document.addEventListener('click', function (e) {
    if (e.target.hasAttribute && e.target.hasAttribute('data-close')) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  // ── 初始化 ──
  fillEchoOptions();
  renderAll();
})();
