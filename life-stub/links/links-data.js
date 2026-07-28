(function (global) {
  'use strict';

  /*
   * 引用网 — 跨子产品引用的总览与反向索引
   *
   * v0.8 串联层：六大子产品第一次被"网络化"。
   * 当前已有的跨模块引用字段：
   *   - 历程簿 journey_data[].relatedEcho   → 回声库 echo id
   *   - 回信亭  echo_mail_data[].fromEcho    → 回声库 echo id
   *
   * 直接读 localStorage 聚合，避免依赖各子产品全局对象被加载。
   * 所有读取都做了 null/异常兜底，任一子产品未初始化也不影响总览。
   */

  // ── 各子产品 localStorage key ──
  var KEYS = {
    echo: 'echo_archive_data',
    journey: 'journey_data',
    mail: 'echo_mail_data',
    wishlist: 'wishlist_data',
    capsule: 'time_capsule_data',
    stub: 'life_stub_data'
  };

  // ── 子产品展示信息 ──
  var SOURCES = {
    echo:    { label: '回声库',   color: '#8B7355', href: '../echo/echo.html' },
    journey: { label: '历程簿',   color: '#6B5D4D', href: '../journey/journey.html' },
    mail:    { label: '回信亭',   color: '#A0522D', href: '../mail/mail.html' },
    wishlist:{ label: '心愿册',   color: '#9B7B47', href: '../wishlist/wishlist.html' },
    capsule: { label: '时光胶囊', color: '#7A6A55', href: '../capsule/capsule.html' },
    stub:    { label: '存根簿',   color: '#5C4A3A', href: '../demo.html' }
  };

  function safeParse(raw, fallback) {
    if (!raw) return fallback;
    try { return JSON.parse(raw); } catch (e) { return fallback; }
  }

  function readLS(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  // ── 读取各子产品条目（归一为统一结构）──
  function getEchoItems() {
    return safeParse(readLS(KEYS.echo), []);
  }

  function getJourneyItems() {
    var items = safeParse(readLS(KEYS.journey), []);
    return items.map(function (i) {
      return {
        source: 'journey',
        id: i.id,
        title: i.content ? (i.content.slice(0, 28) + (i.content.length > 28 ? '…' : '')) : '(空)',
        preview: i.content || '',
        mood: i.mood || '',
        stage: i.stage || '',
        refEcho: i.relatedEcho || '',
        createdAt: i.createdAt || 0
      };
    });
  }

  function getMailItems() {
    var items = safeParse(readLS(KEYS.mail), []);
    return items.map(function (i) {
      var label = i.to ? ('致 · ' + i.to) : '(无收件人)';
      return {
        source: 'mail',
        id: i.id,
        title: label,
        preview: i.content || '',
        type: i.type || '',
        refEcho: i.fromEcho || '',
        createdAt: i.createdAt || 0
      };
    });
  }

  function getWishlistItems() {
    var items = safeParse(readLS(KEYS.wishlist), []);
    return items.map(function (i) {
      return {
        source: 'wishlist',
        id: i.id,
        title: i.title || '(未命名心愿)',
        preview: (i.why || i.plan || i.done || ''),
        target: i.target || '',
        status: i.status || '',
        refEcho: '',
        createdAt: i.createdAt || 0
      };
    });
  }

  function getCapsuleItems() {
    var items = safeParse(readLS(KEYS.capsule), []);
    return items.map(function (i) {
      return {
        source: 'capsule',
        id: i.id,
        title: i.title || '(未命名胶囊)',
        preview: i.letter ? (i.letter.slice(0, 40) + '…') : '',
        type: i.type || '',
        refEcho: '',
        createdAt: i.createdAt || 0
      };
    });
  }

  function getStubItems() {
    var stubs = safeParse(readLS(KEYS.stub), []);
    var out = [];
    stubs.forEach(function (s) {
      out.push({
        source: 'stub',
        id: s.id,
        title: s.name || '(未命名存根簿)',
        preview: '为 ' + (s.name || '某人') + ' 建立的存根簿',
        refEcho: '',
        createdAt: 0
      });
    });
    return out;
  }

  // ── 全部条目（不含 echo，echo 作为被引用方单独索引）──
  function getAllEntries() {
    return [].concat(
      getJourneyItems(),
      getMailItems(),
      getWishlistItems(),
      getCapsuleItems(),
      getStubItems()
    );
  }

  // ── 引用关系：from(任意子产品) → to(echo) ──
  function getReferences() {
    var entries = getAllEntries();
    var echoMap = {};
    getEchoItems().forEach(function (e) { echoMap[e.id] = e; });

    var refs = [];
    entries.forEach(function (en) {
      if (en.refEcho && echoMap[en.refEcho]) {
        var ec = echoMap[en.refEcho];
        refs.push({
          from: { source: en.source, id: en.id, title: en.title, preview: en.preview },
          to:   { id: ec.id, title: ec.title, author: ec.author, theme: ec.theme, excerpt: ec.excerpt }
        });
      }
    });
    return refs;
  }

  // ── 反向引用：echo → 谁在引用我 ──
  function getReverseReferences(echoId) {
    var entries = getAllEntries();
    return entries.filter(function (en) { return en.refEcho === echoId; });
  }

  // ── 统计 ──
  function stats() {
    var echo = getEchoItems();
    var journey = getJourneyItems();
    var mail = getMailItems();
    var wishlist = getWishlistItems();
    var capsule = getCapsuleItems();
    var stub = getStubItems();

    var counts = {
      echo: echo.length,
      journey: journey.length,
      mail: mail.length,
      wishlist: wishlist.length,
      capsule: capsule.length,
      stub: stub.length
    };

    var refs = getReferences();
    var referencedEchoIds = {};
    refs.forEach(function (r) { referencedEchoIds[r.to.id] = true; });

    return {
      counts: counts,
      totalEntries: counts.journey + counts.mail + counts.wishlist + counts.capsule + counts.stub,
      totalReferences: refs.length,
      referencedEchoCount: Object.keys(referencedEchoIds).length,
      echoTotal: counts.echo
    };
  }

  global.LinkNet = {
    SOURCES: SOURCES,
    getEchoItems: getEchoItems,
    getAllEntries: getAllEntries,
    getReferences: getReferences,
    getReverseReferences: getReverseReferences,
    stats: stats
  };
})(window);
