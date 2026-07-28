(function (global) {
  'use strict';

  var STORAGE_KEY = 'life_stub_data';
  var ACTIVE_KEY = 'life_stub_active';

  // ── 默认示例数据 ──
  var SEED_DATA = [
    {
      id: 'stub-1',
      name: '他',
      details: [
        {
          id: 'd1', date: '三月十四日', weather: '晴',
          body: [
            '他喝茶的时候，习惯先把杯子转三圈，再轻轻吹一下。',
            '那个带茶垢的旧瓷杯，杯口有一道细裂纹，他说那是"岁月的吻痕"。'
          ],
          tags: ['习惯', '茶', '物品']
        },
        {
          id: 'd2', date: '四月二日', weather: '雨',
          body: [
            '他说话会带一句"你晓得伐"，说了二十多年，改不掉。',
            '吵架的时候也会说，听起来格外滑稽。'
          ],
          tags: ['语言', '口头禅']
        },
        {
          id: 'd3', date: '四月十五日', weather: '多云',
          body: [
            '他走路的时候，左脚微微有点拖，是年轻时受伤留下的。',
            '我现在在超市里听到类似的脚步声，还是会愣住。'
          ],
          tags: ['身体', '声音']
        },
        {
          id: 'd4', date: '五月一日', weather: '晴',
          body: [
            '他做菜放盐的顺序很奇怪：先盐后糖再酱油。',
            '女儿说"这不对"，但他坚持说"这样才有层次"。'
          ],
          tags: ['习惯', '食物', '厨房']
        },
        {
          id: 'd5', date: '六月八日', weather: '夜',
          body: [
            '他看书时会把书页折一个很小的角，只有我能找到他读到了哪里。',
            '他走的那天，桌上摊着一本《浮生六记》，正翻在卷二。'
          ],
          tags: ['物品', '阅读']
        }
      ],
      emotions: [
        {
          id: 'e1', date: '三月二十日',
          lines: [
            '我买了他爱喝的碧螺春，泡茶的时候手在抖。',
            '水倒进去，茶叶翻上来，像他当年做的那样。',
            '可是今天，只有我一个人喝。'
          ]
        },
        {
          id: 'e2', date: '四月四日',
          lines: [
            '去菜场，路过他常买的那家豆腐摊。',
            '"两块嫩豆腐。"我脱口而出，才意识到他已经不在了。',
            '摊主看着我，我笑了一下，眼睛湿了。',
            '原来有些话，不是用来说的，是用来留的。'
          ]
        },
        {
          id: 'e3', date: '五月十二日',
          lines: [
            '今天我没哭。',
            '不是因为不想，是因为哭累了。',
            '我坐在阳台上，看了一下午的云。',
            '风把窗帘吹起来，我好像听到他在书房翻书的声音。',
            '也可能只是风。'
          ]
        },
        {
          id: 'e4', date: '六月十九日',
          lines: [
            '朋友说"时间会冲淡一切"。',
            '我没反驳，因为反驳了也只是让她尴尬。',
            '但我心里想的是——我不想被冲淡。',
            '那些细节本来就是我的一部分，',
            '为什么要被冲掉？'
          ]
        }
      ],
      connections: [
        { id: 'c1', label: '说话方式', desc: '现在我也会说"你晓得伐"，女儿学去了，外孙女也在学' },
        { id: 'c2', label: '饮食习惯', desc: '先盐后糖再酱油，我已经改不回来了' },
        { id: 'c3', label: '阅读习惯', desc: '看书折小角，现在家里每个人都这么做' },
        { id: 'c4', label: '喝茶仪式', desc: '转三圈，吹一下，已经变成我们家的喝茶规矩' },
        { id: 'c5', label: '走路节奏', desc: '偶尔我会发现自己走路左脚有点拖，原来是跟他学的' }
      ],
      anchors: [
        { id: 'a1', icon: '🎵', title: '2019年的一段录音', desc: '他在厨房唱歌，跑调跑得离谱', meta: '时长 47秒 · 录音' },
        { id: 'a2', icon: '✉️', title: '一封没有寄出的信', desc: '2017年3月，他写的，放在抽屉最里面', meta: '文字 · 3页' },
        { id: 'a3', icon: '📷', title: '阳台晒太阳的照片', desc: '2020年冬天，他眯着眼睛，手放在膝盖上', meta: '照片 · 3张' },
        { id: 'a4', icon: '🍵', title: '那只带茶垢的旧瓷杯', desc: '杯口有裂纹，他说是"岁月的吻痕"', meta: '物品 · 已保存' },
        { id: 'a5', icon: '📖', title: '《浮生六记》卷二', desc: '他走的那天，桌上摊着的那本书', meta: '物品 · 页码有折痕' }
      ]
    }
  ];

  // ── 工具函数 ──
  function uid() {
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // ── 数据存储 ──
  function loadAll() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return null;
  }

  function saveAll(stubs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stubs));
  }

  function initIfEmpty() {
    if (!loadAll()) {
      saveAll(deepClone(SEED_DATA));
    }
  }

  // ── 存根簿 CRUD ──
  function listStubs() {
    initIfEmpty();
    return loadAll();
  }

  function getStub(stubId) {
    var stubs = listStubs();
    for (var i = 0; i < stubs.length; i++) {
      if (stubs[i].id === stubId) return stubs[i];
    }
    return null;
  }

  function getActiveStubId() {
    var id = localStorage.getItem(ACTIVE_KEY);
    if (!id) {
      var stubs = listStubs();
      id = stubs.length ? stubs[0].id : null;
    }
    return id;
  }

  function setActiveStubId(id) {
    localStorage.setItem(ACTIVE_KEY, id);
  }

  function createStub(name) {
    var stubs = listStubs();
    var stub = { id: uid(), name: name, details: [], emotions: [], connections: [], anchors: [] };
    stubs.push(stub);
    saveAll(stubs);
    return stub;
  }

  function updateStubName(stubId, name) {
    var stubs = listStubs();
    for (var i = 0; i < stubs.length; i++) {
      if (stubs[i].id === stubId) { stubs[i].name = name; break; }
    }
    saveAll(stubs);
  }

  function deleteStub(stubId) {
    var stubs = listStubs();
    stubs = stubs.filter(function (s) { return s.id !== stubId; });
    saveAll(stubs);
    if (getActiveStubId() === stubId) {
      setActiveStubId(stubs.length ? stubs[0].id : '');
    }
  }

  // ── 条目 CRUD（通用） ──
  function getEntries(stubId, section) {
    var stub = getStub(stubId);
    return stub ? (stub[section] || []) : [];
  }

  function addEntry(stubId, section, entry) {
    var stubs = listStubs();
    for (var i = 0; i < stubs.length; i++) {
      if (stubs[i].id === stubId) {
        entry.id = uid();
        stubs[i][section].push(entry);
        break;
      }
    }
    saveAll(stubs);
    return entry;
  }

  function updateEntry(stubId, section, entryId, data) {
    var stubs = listStubs();
    for (var i = 0; i < stubs.length; i++) {
      if (stubs[i].id === stubId) {
        var items = stubs[i][section];
        for (var j = 0; j < items.length; j++) {
          if (items[j].id === entryId) {
            for (var k in data) { if (data.hasOwnProperty(k)) items[j][k] = data[k]; }
            break;
          }
        }
        break;
      }
    }
    saveAll(stubs);
  }

  function deleteEntry(stubId, section, entryId) {
    var stubs = listStubs();
    for (var i = 0; i < stubs.length; i++) {
      if (stubs[i].id === stubId) {
        stubs[i][section] = stubs[i][section].filter(function (e) { return e.id !== entryId; });
        break;
      }
    }
    saveAll(stubs);
  }

  // ── 重置为示例数据 ──
  function resetToSeed() {
    saveAll(deepClone(SEED_DATA));
    localStorage.removeItem(ACTIVE_KEY);
  }

  // ── 导出 ──
  global.LifeStub = {
    listStubs: listStubs,
    getStub: getStub,
    getActiveStubId: getActiveStubId,
    setActiveStubId: setActiveStubId,
    createStub: createStub,
    updateStubName: updateStubName,
    deleteStub: deleteStub,
    getEntries: getEntries,
    addEntry: addEntry,
    updateEntry: updateEntry,
    deleteEntry: deleteEntry,
    resetToSeed: resetToSeed,
    uid: uid
  };
})(window);
