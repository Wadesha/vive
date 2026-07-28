(function (global) {
  'use strict';

  /*
   * 历程簿 — 记录自己的当下，不让自己的事也溜走
   * 三段式：待记（之前）/ 速记（之中）/ 回顾（之后）
   * 与存根簿（他人）、回声库（他者文字）、时光胶囊（未来）互补
   */

  var STORAGE_KEY = 'journey_data';

  // ── 三段式阶段 ──
  // todo    : 待记 — 事前埋的种子，"下次要记下什么"
  // quick   : 速记 — 已发生的当下记录
  // settled : 已沉淀 — 从速记标记为"已存进取根簿/已消化"
  var STAGE_TODO = 'todo';
  var STAGE_QUICK = 'quick';
  var STAGE_SETTLED = 'settled';

  // ── 初始示例（让首次访问不空，且示范用法）──
  var SEED = [
    {
      id: 'j1',
      stage: STAGE_TODO,
      content: '下周回老家，要记下妈妈做红烧肉时先放冰糖还是先放酱油，还有她念叨我时的原话。',
      mood: '',
      relatedEcho: '',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
      settledAt: 0
    },
    {
      id: 'j2',
      stage: STAGE_QUICK,
      content: '今天地铁上听到一段广播，"前方到站是终点站"，突然想起爷爷去世那天我也是在地铁上接到的电话。那一刻车厢晃了一下，我没站稳。',
      mood: '难过',
      relatedEcho: 'e7',
      createdAt: Date.now() - 1000 * 60 * 60 * 20,
      settledAt: 0
    },
    {
      id: 'j3',
      stage: STAGE_QUICK,
      content: '同事递给我一杯茶，是用她爷爷的旧搪瓷杯泡的。她说这杯子磕过三次都没碎。我想起存根簿里也该存一条"器物"。',
      mood: '平静',
      relatedEcho: '',
      createdAt: Date.now() - 1000 * 60 * 60 * 5,
      settledAt: 0
    },
    {
      id: 'j4',
      stage: STAGE_SETTLED,
      content: '去年生日那天父亲发来一条语音，说他记不清今天是几号了，但记得我小时候爱吃糖葫芦。这条语音已经存进取根簿"记忆锚点"维度。',
      mood: '温暖',
      relatedEcho: 'e1',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 80,
      settledAt: Date.now() - 1000 * 60 * 60 * 24 * 70
    }
  ];

  // ── 存储 ──
  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return null;
  }

  function save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function initIfEmpty() {
    if (!load()) save(JSON.parse(JSON.stringify(SEED)));
  }

  function genId() {
    return 'j-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
  }

  // ── 读 ──
  function listAll() {
    initIfEmpty();
    return load();
  }

  function listByStage(stage) {
    var items = listAll();
    if (stage === 'all') return items;
    return items.filter(function (i) { return i.stage === stage; });
  }

  function getItem(id) {
    var items = listAll();
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) return items[i];
    }
    return null;
  }

  // ── 写 ──
  function addQuick(data) {
    var items = listAll();
    var item = {
      id: genId(),
      stage: STAGE_QUICK,
      content: (data.content || '').trim(),
      mood: data.mood || '',
      relatedEcho: data.relatedEcho || '',
      createdAt: Date.now(),
      settledAt: 0
    };
    items.unshift(item);
    save(items);
    return item;
  }

  function addTodo(data) {
    var items = listAll();
    var item = {
      id: genId(),
      stage: STAGE_TODO,
      content: (data.content || '').trim(),
      mood: '',
      relatedEcho: '',
      createdAt: Date.now(),
      settledAt: 0
    };
    items.unshift(item);
    save(items);
    return item;
  }

  // 把待记转成速记（事发生了，开始记）
  function todoToQuick(id, content, mood, relatedEcho) {
    var items = listAll();
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        items[i].stage = STAGE_QUICK;
        if (content != null) items[i].content = content.trim();
        items[i].mood = mood || items[i].mood || '';
        items[i].relatedEcho = relatedEcho || items[i].relatedEcho || '';
        items[i].createdAt = Date.now(); // 转记时刷新时间
        save(items);
        return items[i];
      }
    }
    return null;
  }

  // 标记为已沉淀（之后）
  function settle(id) {
    var items = listAll();
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        items[i].stage = STAGE_SETTLED;
        items[i].settledAt = Date.now();
        save(items);
        return items[i];
      }
    }
    return null;
  }

  // 撤回沉淀，回到速记
  function unsettle(id) {
    var items = listAll();
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        items[i].stage = STAGE_QUICK;
        items[i].settledAt = 0;
        save(items);
        return items[i];
      }
    }
    return null;
  }

  function update(id, patch) {
    var items = listAll();
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        Object.keys(patch || {}).forEach(function (k) {
          items[i][k] = patch[k];
        });
        save(items);
        return items[i];
      }
    }
    return null;
  }

  function deleteItem(id) {
    var items = listAll().filter(function (i) { return i.id !== id; });
    save(items);
  }

  function resetToSeed() {
    save(JSON.parse(JSON.stringify(SEED)));
  }

  // ── 统计 ──
  function stats() {
    var items = listAll();
    var s = { todo: 0, quick: 0, settled: 0, total: items.length };
    items.forEach(function (i) { s[i.stage] = (s[i.stage] || 0) + 1; });
    return s;
  }

  global.Journey = {
    STAGE_TODO: STAGE_TODO,
    STAGE_QUICK: STAGE_QUICK,
    STAGE_SETTLED: STAGE_SETTLED,
    listAll: listAll,
    listByStage: listByStage,
    getItem: getItem,
    addQuick: addQuick,
    addTodo: addTodo,
    todoToQuick: todoToQuick,
    settle: settle,
    unsettle: unsettle,
    update: update,
    deleteItem: deleteItem,
    resetToSeed: resetToSeed,
    stats: stats
  };
})(window);
