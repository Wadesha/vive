(function () {
  'use strict';

  if (!window.LifeStub) return;

  var currentTab = 'details';

  // ── HTML 转义 ──
  function esc(str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  // ── 获取当前存根簿 ──
  function currentStub() {
    var id = LifeStub.getActiveStubId();
    return id ? LifeStub.getStub(id) : null;
  }

  // ── 渲染存根簿切换器 ──
  function renderSwitcher() {
    var container = document.getElementById('stubSwitcher');
    if (!container) return;
    var stubs = LifeStub.listStubs();
    var activeId = LifeStub.getActiveStubId();

    var html = '<div class="switcher-list">';
    stubs.forEach(function (s) {
      var cls = s.id === activeId ? 'switcher-item active' : 'switcher-item';
      html += '<button class="' + cls + '" data-stub="' + s.id + '">' + esc(s.name) + '</button>';
    });
    html += '<button class="switcher-item switcher-add" id="addStubBtn">+ 新簿</button>';
    html += '<button class="switcher-item switcher-manage" id="manageStubBtn">管理</button>';
    html += '</div>';
    container.innerHTML = html;

    // 绑定切换
    container.querySelectorAll('[data-stub]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        LifeStub.setActiveStubId(this.getAttribute('data-stub'));
        renderAll();
      });
    });

    var addBtn = document.getElementById('addStubBtn');
    if (addBtn) addBtn.addEventListener('click', showNewStubPrompt);

    var manageBtn = document.getElementById('manageStubBtn');
    if (manageBtn) manageBtn.addEventListener('click', showStubManager);
  }

  // ── 新建存根簿提示 ──
  function showNewStubPrompt() {
    var name = prompt('为新的存根簿命名（例如：奶奶、老友）：');
    if (name && name.trim()) {
      var stub = LifeStub.createStub(name.trim());
      LifeStub.setActiveStubId(stub.id);
      renderAll();
    }
  }

  // ── 存根簿管理弹窗 ──
  function showStubManager() {
    var overlay = document.getElementById('stubModalOverlay');
    var body = document.getElementById('stubModalBody');
    if (!overlay || !body) return;

    var stubs = LifeStub.listStubs();
    var html = '<div class="stub-manager">';
    stubs.forEach(function (s) {
      html += '<div class="stub-mgr-row">';
      html += '<span class="stub-mgr-name">' + esc(s.name) + '</span>';
      html += '<button class="stub-mgr-rename" data-id="' + s.id + '">改名</button>';
      html += '<button class="stub-mgr-del" data-id="' + s.id + '">删除</button>';
      html += '</div>';
    });
    html += '<div class="stub-mgr-row">';
    html += '<button class="stub-mgr-reset" id="resetAllBtn">重置为示例数据</button>';
    html += '</div>';
    html += '</div>';
    body.innerHTML = html;
    overlay.classList.add('open');

    body.querySelectorAll('.stub-mgr-rename').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = this.getAttribute('data-id');
        var stub = LifeStub.getStub(id);
        var newName = prompt('新名称：', stub ? stub.name : '');
        if (newName && newName.trim()) {
          LifeStub.updateStubName(id, newName.trim());
          renderAll();
          showStubManager();
        }
      });
    });

    body.querySelectorAll('.stub-mgr-del').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = this.getAttribute('data-id');
        if (confirm('确认删除此存根簿？所有条目将丢失。')) {
          LifeStub.deleteStub(id);
          renderAll();
          overlay.classList.remove('open');
        }
      });
    });

    var resetBtn = document.getElementById('resetAllBtn');
    if (resetBtn) resetBtn.addEventListener('click', function () {
      if (confirm('确认重置？所有数据将恢复为示例数据。')) {
        LifeStub.resetToSeed();
        renderAll();
        overlay.classList.remove('open');
      }
    });
  }

  // ── 渲染生活细节 ──
  function renderDetails(stub) {
    var panel = document.getElementById('details');
    if (!panel) return;
    var items = stub.details || [];
    if (!items.length) {
      panel.innerHTML = '<div class="empty-hint">还没有生活细节，点击右下角 + 添加</div>';
      return;
    }
    var html = '';
    items.forEach(function (d) {
      html += '<div class="entry" data-id="' + d.id + '">';
      html += '<div class="entry-date">' + esc(d.date) + (d.weather ? ' · ' + esc(d.weather) : '') + '</div>';
      html += '<div class="entry-body">';
      d.body.forEach(function (p) { html += '<p>' + esc(p) + '</p>'; });
      html += '</div>';
      if (d.tags && d.tags.length) {
        html += '<div class="entry-tags">';
        d.tags.forEach(function (t) { html += '<span class="tag">' + esc(t) + '</span>'; });
        html += '</div>';
      }
      html += '<button class="entry-del" data-section="details" data-id="' + d.id + '" title="删除">×</button>';
      html += '</div>';
    });
    panel.innerHTML = html;
  }

  // ── 渲染情绪痕迹 ──
  function renderEmotions(stub) {
    var panel = document.getElementById('emotions');
    if (!panel) return;
    var items = stub.emotions || [];
    if (!items.length) {
      panel.innerHTML = '<div class="empty-hint">还没有情绪痕迹，点击右下角 + 添加</div>';
      return;
    }
    var html = '';
    items.forEach(function (e) {
      html += '<div class="entry entry-emotion" data-id="' + e.id + '">';
      html += '<div class="entry-date">' + esc(e.date) + '</div>';
      html += '<div class="entry-body">';
      e.lines.forEach(function (l) { html += '<p class="emotion-text">' + esc(l) + '</p>'; });
      html += '</div>';
      html += '<button class="entry-del" data-section="emotions" data-id="' + e.id + '" title="删除">×</button>';
      html += '</div>';
    });
    panel.innerHTML = html;
  }

  // ── 渲染连接地图 ──
  function renderConnections(stub) {
    var panel = document.getElementById('connections');
    if (!panel) return;
    var items = stub.connections || [];
    if (!items.length) {
      panel.innerHTML = '<div class="empty-hint">还没有连接，点击右下角 + 添加</div>';
      return;
    }
    var html = '<div class="connection-map">';
    html += '<div class="map-center"><div class="map-node center">' + esc(stub.name) + '</div></div>';
    html += '<div class="map-links">';
    items.forEach(function (c) {
      html += '<div class="link-item" data-id="' + c.id + '">';
      html += '<span class="link-label">' + esc(c.label) + '</span>';
      html += '<span class="link-desc">' + esc(c.desc) + '</span>';
      html += '<button class="entry-del" data-section="connections" data-id="' + c.id + '" title="删除">×</button>';
      html += '</div>';
    });
    html += '</div>';
    html += '<div class="map-footnote">' + esc(stub.name) + '留给你的，已经变成了你身上的一部分</div>';
    html += '</div>';
    panel.innerHTML = html;
  }

  // ── 渲染记忆锚点 ──
  function renderAnchors(stub) {
    var panel = document.getElementById('anchors');
    if (!panel) return;
    var items = stub.anchors || [];
    if (!items.length) {
      panel.innerHTML = '<div class="empty-hint">还没有记忆锚点，点击右下角 + 添加</div>';
      return;
    }
    var html = '<div class="anchor-list">';
    items.forEach(function (a) {
      html += '<div class="anchor-item" data-id="' + a.id + '">';
      html += '<div class="anchor-icon">' + a.icon + '</div>';
      html += '<div class="anchor-info">';
      html += '<div class="anchor-title">' + esc(a.title) + '</div>';
      html += '<div class="anchor-desc">' + esc(a.desc) + '</div>';
      html += '<div class="anchor-meta">' + esc(a.meta) + '</div>';
      html += '</div>';
      html += '<button class="entry-del" data-section="anchors" data-id="' + a.id + '" title="删除">×</button>';
      html += '</div>';
    });
    html += '</div>';
    html += '<div class="anchor-empty">';
    html += '<p>当某一天，你走过熟悉的街角，</p>';
    html += '<p>或者吃到某道菜突然愣神的时候——</p>';
    html += '<p class="anchor-empty-highlight">翻开这里。</p>';
    html += '</div>';
    panel.innerHTML = html;
  }

  // ── 渲染全部面板 ──
  function renderPanels() {
    var stub = currentStub();
    if (!stub) {
      ['details', 'emotions', 'connections', 'anchors'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.innerHTML = '<div class="empty-hint">请先创建一个存根簿</div>';
      });
      return;
    }
    renderDetails(stub);
    renderEmotions(stub);
    renderConnections(stub);
    renderAnchors(stub);
    bindDeleteButtons();
    observeNewEntries();
  }

  // ── 渲染所有 ──
  function renderAll() {
    renderSwitcher();
    renderPanels();
  }

  // ── 绑定删除按钮 ──
  function bindDeleteButtons() {
    document.querySelectorAll('.entry-del').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var section = this.getAttribute('data-section');
        var entryId = this.getAttribute('data-id');
        var stubId = LifeStub.getActiveStubId();
        if (confirm('确认删除此条目？')) {
          LifeStub.deleteEntry(stubId, section, entryId);
          renderPanels();
        }
      });
    });
  }

  // ── 添加条目弹窗 ──
  function showAddModal() {
    var overlay = document.getElementById('modalOverlay');
    var title = document.getElementById('modalTitle');
    var body = document.getElementById('modalBody');
    if (!overlay || !body) return;

    var stub = currentStub();
    if (!stub) { alert('请先创建存根簿'); return; }

    var forms = {
      details: function () {
        return '<label>日期<input name="date" placeholder="三月廿日"></label>'
          + '<label>天气<input name="weather" placeholder="晴"></label>'
          + '<label>内容<textarea name="body" rows="4" placeholder="每行一段"></textarea></label>'
          + '<label>标签<input name="tags" placeholder="用逗号分隔"></label>';
      },
      emotions: function () {
        return '<label>日期<input name="date" placeholder="三月廿日"></label>'
          + '<label>内容<textarea name="lines" rows="5" placeholder="每行一段"></textarea></label>';
      },
      connections: function () {
        return '<label>连接标签<input name="label" placeholder="说话方式"></label>'
          + '<label>描述<textarea name="desc" rows="3" placeholder="描述这个连接..."></textarea></label>';
      },
      anchors: function () {
        return '<label>图标<input name="icon" placeholder="🎵" maxlength="2"></label>'
          + '<label>标题<input name="title" placeholder="一段录音"></label>'
          + '<label>描述<textarea name="desc" rows="2" placeholder="描述..."></textarea></label>'
          + '<label>元信息<input name="meta" placeholder="时长 47秒 · 录音"></label>';
      }
    };

    var tabLabels = { details: '生活细节', emotions: '情绪痕迹', connections: '连接地图', anchors: '记忆锚点' };
    title.textContent = '添加 · ' + tabLabels[currentTab];
    body.innerHTML = '<form id="addForm" class="add-form">' + forms[currentTab]() + '<button type="submit" class="add-submit">保存</button></form>';
    overlay.classList.add('open');

    document.getElementById('addForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(this);
      var stubId = LifeStub.getActiveStubId();
      var entry = {};

      if (currentTab === 'details') {
        entry.date = fd.get('date') || '';
        entry.weather = fd.get('weather') || '';
        entry.body = (fd.get('body') || '').split('\n').filter(function (l) { return l.trim(); });
        entry.tags = (fd.get('tags') || '').split(/[,，]/).map(function (t) { return t.trim(); }).filter(Boolean);
      } else if (currentTab === 'emotions') {
        entry.date = fd.get('date') || '';
        entry.lines = (fd.get('lines') || '').split('\n').filter(function (l) { return l.trim(); });
      } else if (currentTab === 'connections') {
        entry.label = fd.get('label') || '';
        entry.desc = fd.get('desc') || '';
      } else if (currentTab === 'anchors') {
        entry.icon = fd.get('icon') || '📌';
        entry.title = fd.get('title') || '';
        entry.desc = fd.get('desc') || '';
        entry.meta = fd.get('meta') || '';
      }

      LifeStub.addEntry(stubId, currentTab, entry);
      overlay.classList.remove('open');
      renderPanels();
    });
  }

  // ── IntersectionObserver 重新观察新条目 ──
  var observer = null;
  function observeNewEntries() {
    if (!observer) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      }, { threshold: 0.15 });
    }
    document.querySelectorAll('.entry, .anchor-item').forEach(function (el) {
      if (!el.classList.contains('visible')) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        observer.observe(el);
      }
    });
  }

  // ── 关闭弹窗 ──
  function closeModal(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('open');
  }

  // ── 初始化 ──
  function init() {
    renderAll();

    // 标签页切换
    var tabs = document.querySelectorAll('.tab');
    var panels = document.querySelectorAll('.tab-panel');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        currentTab = this.getAttribute('data-tab');
        tabs.forEach(function (t) { t.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        this.classList.add('active');
        var panel = document.getElementById(currentTab);
        if (panel) panel.classList.add('active');
      });
    });

    // FAB 添加
    var fab = document.getElementById('fabAdd');
    if (fab) fab.addEventListener('click', showAddModal);

    // 弹窗关闭
    document.getElementById('modalClose').addEventListener('click', function () { closeModal('modalOverlay'); });
    document.getElementById('modalOverlay').addEventListener('click', function (e) { if (e.target === this) closeModal('modalOverlay'); });
    document.getElementById('stubModalClose').addEventListener('click', function () { closeModal('stubModalOverlay'); });
    document.getElementById('stubModalOverlay').addEventListener('click', function (e) { if (e.target === this) closeModal('stubModalOverlay'); });
  }

  // 页面加载后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
