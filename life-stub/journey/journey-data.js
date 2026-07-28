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
    },
    {
      id: 'j5',
      stage: STAGE_TODO,
      content: '下次和外婆视频，要让她念一段她年轻时挑水走山路的旧事，录下来。她最近开始把同一个故事讲两遍，我怕来不及。',
      mood: '',
      relatedEcho: '',
      createdAt: Date.now() - 1000 * 60 * 60 * 9,
      settledAt: 0
    },
    {
      id: 'j6',
      stage: STAGE_TODO,
      content: '清明节前，把爷爷那张在老屋门槛上抽烟的照片找出来，扫描一份存进存根簿。原照已经发黄，边角有水渍。',
      mood: '',
      relatedEcho: '',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
      settledAt: 0
    },
    {
      id: 'j7',
      stage: STAGE_QUICK,
      content: '今天下雨，下班路过那家面馆，老板娘还认得我，说"还是老样子，多辣少葱？"。我说对。坐下来才反应过来，这是十年前我和他常来的店。他走了六年，口味却被一个陌生人替我记住了。',
      mood: '柔软',
      relatedEcho: 'e2',
      createdAt: Date.now() - 1000 * 60 * 60 * 3,
      settledAt: 0
    },
    {
      id: 'j8',
      stage: STAGE_QUICK,
      content: '辅导女儿写作业，她把"爷"字写错了三遍，我正要发火，突然想起我爸当年也是这样拍着桌子教我写"奶"字。我把举起来的手放下了。原来脾气也是会遗传的，但我可以决定从这里断开。',
      mood: '愧疚',
      relatedEcho: 'e1',
      createdAt: Date.now() - 1000 * 60 * 60 * 26,
      settledAt: 0
    },
    {
      id: 'j9',
      stage: STAGE_QUICK,
      content: '整理衣柜翻出一件旧毛衣，袖口磨毛了，是妈妈十几年前织的。我试了试，居然还合身。那一刻有种很奇怪的感觉——她当年织毛衣时想象的那个"未来的我"，就是现在穿着它的我。我们在同一件衣服里相遇了。',
      mood: '温暖',
      relatedEcho: 'e44',
      createdAt: Date.now() - 1000 * 60 * 60 * 48,
      settledAt: 0
    },
    {
      id: 'j10',
      stage: STAGE_QUICK,
      content: '同事问我周末干嘛，我说回家。他说"你每周都回，不烦吗"。我没回答。烦什么呢，我妈每周给我打电话时声音都在变老，我只是怕哪天她忽然不打了。',
      mood: '平静',
      relatedEcho: 'e33',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
      settledAt: 0
    },
    {
      id: 'j11',
      stage: STAGE_SETTLED,
      content: '三个月前记下"外婆开始把故事讲两遍"。上周回去，她真的一段也没重复，反而讲了几件我从没听过的抗战逃难旧事。我录了四十分钟。这条已沉淀，录音存进了存根簿"记忆锚点"。',
      mood: '温暖',
      relatedEcho: 'e13',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 90,
      settledAt: Date.now() - 1000 * 60 * 60 * 24 * 2
    },
    {
      id: 'j12',
      stage: STAGE_SETTLED,
      content: '读史铁生《我与地坛》那段"有过我的车辙的地方也都有过母亲的脚印"，坐在阳台上哭了很久。原来我以为是自己在走，其实一直有人在背后找我。这条已沉淀，挂到回声库 e33 作参照。',
      mood: '难过',
      relatedEcho: 'e33',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 120,
      settledAt: Date.now() - 1000 * 60 * 60 * 24 * 100
    },
    {
      id: 'j13',
      stage: STAGE_QUICK,
      content: '今天整理旧物翻出了高中的校服，口袋里还有一张写满数学公式的草稿纸。突然想起那年冬天，同桌把唯一的暖手宝塞给我，说他不冷。现在他在哪？',
      mood: '柔软',
      relatedEcho: '',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
      settledAt: 0
    },
    {
      id: 'j14',
      stage: STAGE_QUICK,
      content: '早上出门时，爸爸在楼下花园剪枝。他说这棵桂花树是我出生那年栽的，今年开得特别密。我看了一眼就走了，没多说什么。',
      mood: '愧疚',
      relatedEcho: 'e5',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
      settledAt: 0
    },
    {
      id: 'j15',
      stage: STAGE_QUICK,
      content: '刚刚把儿子的小书包收拾出来捐了。他现在上三年级了，用不上了。收拾的时候翻出一张他三岁时画的"全家福"，把我画成了一个三角形，说妈妈是"尖尖的"。',
      mood: '温暖',
      relatedEcho: '',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
      settledAt: 0
    },
    {
      id: 'j16',
      stage: STAGE_QUICK,
      content: '听了一首歌，歌词是"总以为来日方长，却忘了世事无常"。突然想给妈打个电话，不是因为有事，就是想听听她的声音。她在电话那头说"吃了吗"，我说"吃了"，然后沉默了三秒。',
      mood: '平静',
      relatedEcho: '',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
      settledAt: 0
    },
    {
      id: 'j17',
      stage: STAGE_QUICK,
      content: '在超市看到一位老人推着购物车，车里坐着他的老伴儿，老伴儿戴着氧气面罩。老人在跟她念叨"今天的排骨新鲜"。我看了很久，差点在超市哭出来。',
      mood: '难过',
      relatedEcho: '',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
      settledAt: 0
    },
    {
      id: 'j18',
      stage: STAGE_SETTLED,
      content: '上周带妈妈去了那个她说了好久的包子铺。她吃了三个，说"还是当年的味道"。回家的路上她睡着了，头靠在车窗上。我没叫醒她，绕路多开了两圈。这件事我已存进存根簿。',
      mood: '温暖',
      relatedEcho: 'e2',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
      settledAt: Date.now() - 1000 * 60 * 60 * 24 * 3
    },
    {
      id: 'j19',
      stage: STAGE_SETTLED,
      content: '终于跟弟弟说了那句"对不起"。为了十年前的事。他说"我早忘了"。但我知道他没有，因为他说话的语气变轻了。',
      mood: '愧疚',
      relatedEcho: 'e15',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
      settledAt: Date.now() - 1000 * 60 * 60 * 24 * 10
    },
    {
      id: 'j20',
      stage: STAGE_SETTLED,
      content: '把外婆的菜谱整理成了文档。有一道菜，我做了三次都做不出那个味。后来才发现，关键不在调料，在于切肉的刀法——要横切，不能顺纹。',
      mood: '平静',
      relatedEcho: 'e8',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
      settledAt: Date.now() - 1000 * 60 * 60 * 24 * 5
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
