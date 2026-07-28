(function () {
  'use strict';

  var state = { type: 'all' };
  var pendingMirror = null; // 抽到的平行我来信

  // ── DOM ──
  var $list = document.getElementById('mailList');
  var $empty = document.getElementById('mailEmpty');
  var $stats = document.getElementById('mailStats');
  var $filters = document.getElementById('mailFilters');
  var $resetBtn = document.getElementById('mailResetBtn');

  var $modal = document.getElementById('mailModal');
  var $modalTitle = document.getElementById('mailModalTitle');
  var $form = document.getElementById('mailForm');
  var $formTo = document.getElementById('mailFormTo');
  var $formType = document.getElementById('mailFormType');
  var $formFromEcho = document.getElementById('mailFormFromEcho');
  var $formEchoExcerpt = document.getElementById('mailFormEchoExcerpt');
  var $mirrorDisplay = document.getElementById('mailMirrorDisplay');
  var $mirrorExcerpt = document.getElementById('mailMirrorExcerpt');
  var $mirrorSource = document.getElementById('mailMirrorSource');

  var $detailModal = document.getElementById('mailDetailModal');
  var $detailContent = document.getElementById('mailDetailContent');

  // ── 渲染列表 ──
  function renderList() {
    var items = EchoMail.listByType(state.type);
    items.sort(function (a, b) { return b.createdAt - a.createdAt; });
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
    card.className = 'mail-card mail-card--' + item.type;

    // 信封头部
    var head = document.createElement('header');
    head.className = 'mail-card-head';

    var typeBadge = document.createElement('span');
    typeBadge.className = 'mail-type-badge mail-type-' + item.type;
    typeBadge.textContent = EchoMail.TYPE_LABEL[item.type];

    var to = document.createElement('span');
    to.className = 'mail-card-to';
    to.textContent = '致 · ' + item.to;

    var date = document.createElement('span');
    date.className = 'mail-card-date';
    date.textContent = formatDate(item.createdAt);

    head.appendChild(typeBadge);
    head.appendChild(to);
    head.appendChild(date);

    card.appendChild(head);

    // 平行我来信引用
    if (item.type === 'mirror' && item.echoExcerpt) {
      var quote = document.createElement('blockquote');
      quote.className = 'mail-card-quote';
      quote.textContent = item.echoExcerpt;
      card.appendChild(quote);
    }

    // 信的正文
    var content = document.createElement('p');
    content.className = 'mail-card-content';
    content.textContent = item.content;
    card.appendChild(content);

    // 回信预览
    if (item.reply) {
      var reply = document.createElement('div');
      reply.className = 'mail-card-reply';
      var replyLabel = document.createElement('div');
      replyLabel.className = 'mail-reply-label';
      replyLabel.textContent = '↳ 我的回信';
      var replyBody = document.createElement('p');
      replyBody.className = 'mail-reply-body';
      replyBody.textContent = item.reply;
      reply.appendChild(replyLabel);
      reply.appendChild(replyBody);
      card.appendChild(reply);
    }

    // 操作
    var foot = document.createElement('footer');
    foot.className = 'mail-card-foot';

    var openBtn = document.createElement('button');
    openBtn.className = 'mail-btn ghost small';
    openBtn.textContent = item.reply ? '查看 / 修改回信' : '写回信';
    openBtn.addEventListener('click', function () { openDetail(item.id); });
    foot.appendChild(openBtn);

    var delBtn = document.createElement('button');
    delBtn.className = 'mail-btn ghost small danger';
    delBtn.textContent = '销毁';
    delBtn.addEventListener('click', function () {
      if (confirm('把这封信销毁？')) { EchoMail.deleteItem(item.id); renderList(); }
    });
    foot.appendChild(delBtn);

    card.appendChild(foot);
    return card;
  }

  function renderStats() {
    var s = EchoMail.stats();
    $stats.innerHTML = '共 <b>' + s.total + '</b> 封信 · ' +
      '寄往过去 ' + s.past + ' · 平行我 ' + s.mirror + ' · 未来 ' + s.future +
      ' · 已回信 ' + s.replied;
  }

  // ── 写信弹窗 ──
  function openWrite(type) {
    pendingMirror = null;
    $form.reset();
    $formType.value = type;
    $formFromEcho.value = '';
    $formEchoExcerpt.value = '';
    $mirrorDisplay.hidden = true;

    if (type === 'past') {
      $modalTitle.textContent = '寄往过去';
      $formTo.placeholder = '如：十八岁的自己 / 爷爷 / 那年的我';
      $formTo.value = '';
    } else if (type === 'future') {
      $modalTitle.textContent = '未来的回响';
      $formTo.placeholder = '如：五年后的我 / 明年的自己 / 四十岁的我';
      $formTo.value = '';
    }
    $modal.hidden = false;
  }

  // 抽取平行我来信
  function drawMirror() {
    var m = EchoMail.drawMirrorFromEcho();
    if (!m) {
      alert('回声库还没有内容，无法抽取来信。');
      return;
    }
    pendingMirror = m;
    $form.reset();
    $formType.value = 'mirror';
    $formFromEcho.value = m.fromEcho;
    $formEchoExcerpt.value = m.echoExcerpt;
    $modalTitle.textContent = '来自平行我的信';
    $formTo.value = '现在的我';
    $mirrorExcerpt.textContent = m.echoExcerpt;
    $mirrorSource.textContent = '—— ' + (m.echoAuthor || '佚名') + '《' + (m.echoTitle || '') + '》';
    $mirrorDisplay.hidden = false;
    $modal.hidden = false;
  }

  function closeModal() {
    $modal.hidden = true;
    pendingMirror = null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    var data = {
      type: $formType.value,
      to: $formTo.value.trim(),
      content: $form.content.value.trim(),
      fromEcho: $formFromEcho.value,
      echoExcerpt: $formEchoExcerpt.value
    };
    if (!data.to || !data.content) return;
    EchoMail.add(data);
    closeModal();
    // 切到对应分类
    state.type = data.type;
    syncFilterButtons();
    renderList();
  }

  // ── 详情/回信弹窗 ──
  function openDetail(id) {
    var item = EchoMail.getItem(id);
    if (!item) return;

    var html = '';
    html += '<div class="mail-detail-type mail-type-' + item.type + '">' + EchoMail.TYPE_LABEL[item.type] + '</div>';
    html += '<div class="mail-detail-to">致 · ' + escapeHtml(item.to) + '</div>';
    html += '<div class="mail-detail-date">' + formatDate(item.createdAt) + '</div>';

    if (item.type === 'mirror' && item.echoExcerpt) {
      html += '<blockquote class="mail-detail-quote">' + escapeHtml(item.echoExcerpt) + '</blockquote>';
      if (item.fromEcho && typeof EchoArchive !== 'undefined') {
        var echo = EchoArchive.getItem(item.fromEcho);
        if (echo) {
          html += '<div class="mail-detail-echo-source">来自回声库：' + escapeHtml(echo.author + '《' + echo.title + '》') + '</div>';
        }
      }
    }

    html += '<div class="mail-detail-label">信的正文</div>';
    html += '<p class="mail-detail-content">' + escapeHtml(item.content) + '</p>';

    html += '<hr class="mail-divider">';
    html += '<label class="mail-detail-reply-label" for="mailReplyText">我的回信（自动保存）</label>';
    html += '<textarea id="mailReplyText" class="mail-detail-reply" rows="5" placeholder="现在，回应这封信——可以是对过去的释怀，对平行我的共鸣，或给未来的自己留一句话。">' + escapeHtml(item.reply) + '</textarea>';

    $detailContent.innerHTML = html;
    $detailModal.hidden = false;

    var ta = document.getElementById('mailReplyText');
    var timer = null;
    ta.addEventListener('input', function () {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        EchoMail.setReply(id, ta.value);
        var tip = document.querySelector('.mail-saved-tip');
        if (!tip) {
          tip = document.createElement('span');
          tip.className = 'mail-saved-tip';
          ta.parentNode.insertBefore(tip, ta.nextSibling);
        }
        tip.textContent = '已保存';
        setTimeout(function () { if (tip) tip.textContent = ''; }, 1500);
      }, 400);
    });
  }

  function closeDetail() {
    $detailModal.hidden = true;
    $detailContent.innerHTML = '';
    renderList(); // 刷新回信预览
  }

  // ── 筛选 ──
  function syncFilterButtons() {
    $filters.querySelectorAll('.mail-filter').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-type') === state.type);
    });
  }

  // ── utils ──
  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function formatDate(ts) {
    var d = new Date(ts);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  // ── 绑定 ──
  // 三种信入口卡片
  document.querySelectorAll('.mail-action-card[data-type]').forEach(function (el) {
    el.addEventListener('click', function () {
      openWrite(el.getAttribute('data-type'));
    });
  });

  document.getElementById('mailDrawMirror').addEventListener('click', drawMirror);

  // 筛选（事件委托）
  $filters.addEventListener('click', function (e) {
    var b = e.target.closest('.mail-filter');
    if (!b) return;
    state.type = b.getAttribute('data-type');
    syncFilterButtons();
    renderList();
  });

  $resetBtn.addEventListener('click', function () {
    if (confirm('确定重置为示例数据？你的所有信件都会被清除。')) {
      EchoMail.resetToSeed();
      state.type = 'all';
      syncFilterButtons();
      renderList();
    }
  });

  $form.addEventListener('submit', handleSubmit);

  document.addEventListener('click', function (e) {
    if (e.target.hasAttribute && e.target.hasAttribute('data-close')) {
      closeModal();
      if (!$detailModal.hidden) closeDetail();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal();
      if (!$detailModal.hidden) closeDetail();
    }
  });

  // ── 初始化 ──
  renderList();
})();
