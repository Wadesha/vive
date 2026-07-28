(function (global) {
  'use strict';

  /*
   * 回信亭 — 另一个我，在回应自己
   *
   * 核心理念（基于心理学"未来自我他者化"研究）：
   *   人天然把"过去的自己""未来的自己"当成陌生人。
   *   所有名人/网友的话，本质是"平行宇宙里经历过同样事的我"写来的信。
   *   记录不是孤独的重复，是不同时间维度的"我"在对话。
   *
   * 三种信：
   *   past   — 寄往过去：给"过去的自己/故人"写一封"如果能回去"的信
   *   mirror — 来自平行我：从回声库抽取一条，作为"另一个我"的来信，可回信
   *   future — 未来的回响：给"未来某时刻的自己"写信（区别于时光胶囊的"封存"，强调"对话"）
   *
   * 一个信件可被"再回应"，形成自我对话链。
   */

  var STORAGE_KEY = 'echo_mail_data';

  // ── 信件类型 ──
  var T_PAST = 'past';       // 寄往过去
  var T_MIRROR = 'mirror';   // 来自平行我（基于回声库）
  var T_FUTURE = 'future';   // 未来的回响

  var TYPE_LABEL = {
    past: '寄往过去',
    mirror: '来自平行我',
    future: '未来的回响'
  };

  // ── 模拟数据：让用户一看就懂"对话"是怎么发生的 ──
  var SEED = [
    {
      id: 'm1',
      type: T_PAST,
      to: '十八岁的自己',
      fromEcho: '',
      echoExcerpt: '',
      content: '你现在正坐在高考考场外的台阶上，觉得天要塌了。我想告诉你：不会的。十年后你做着完全没想到的工作，活得比想象中安稳。但你要记住，妈妈那天给你送的那瓶水，她站在校门外看了你很久才走。这件事你当时没看见，现在我要替你记下。',
      reply: '',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
      threadId: 't1'
    },
    {
      id: 'm2',
      type: T_MIRROR,
      to: '现在的我',
      fromEcho: 'e34',
      echoExcerpt: '我真想告诫所有长大了的男孩子，千万不要跟母亲来这套倔强，羞涩就更不必，我已经懂了可我已经来不及了。',
      content: '—— 史铁生写给我的信。我也是，倔强了三十年，懂了的时候已经来不及了。',
      reply: '收到。所以从今天起，每次见妈妈前先在心里说一句"别倔"。这是我能做的全部"来得及"。',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
      threadId: 't2'
    },
    {
      id: 'm3',
      type: T_FUTURE,
      to: '五年后的自己',
      fromEcho: '',
      echoExcerpt: '',
      content: '如果你正读这封信，说明妈妈还在的可能性很大（希望如此）。请你回想一下，过去五年你有没有认真陪她过一个完整的春节？如果答案是没有，请立刻订一张回家的票。我现在最大的恐惧，就是变成"已经懂了可已经来不及了"的那个人。',
      reply: '',
      createdAt: Date.now() - 1000 * 60 * 60 * 6,
      threadId: 't3'
    },
    {
      id: 'm4',
      type: T_MIRROR,
      to: '正在悲伤的我',
      fromEcho: 'e55',
      echoExcerpt: '走不出来，在亲人离世多年之后"还是会哭"，是一件正常的事——哀伤不需要被战胜，它需要被接住。',
      content: '—— 这封信救了我。我以为自己病了，三年了还会在超市哭。原来这是正常的。',
      reply: '那就让它正常地发生。哭的时候，就是TA还在你身上的证明。',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
      threadId: 't4'
    },
    {
      id: 'm5',
      type: T_PAST,
      to: '爷爷',
      fromEcho: '',
      echoExcerpt: '',
      content: '你走的那天我在外地，没赶上最后一面。你最后清醒时问的那句"孙子回来了吗"，是十年后我才知道的。如果能回去，我什么都不说，就坐在你床边，让你看见我回来了。',
      reply: '',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
      threadId: 't5'
    },
    {
      id: 'm6',
      type: T_FUTURE,
      to: '明年的自己',
      fromEcho: 'e47',
      echoExcerpt: '谢谢你，没有放弃努力；谢谢你，走到了今天。',
      content: '今年很难，但你撑过来了。请对明年的我说：谢谢你，没有放弃努力；谢谢你，走到了今天。无论明年发生什么，你都是值得被爱的。',
      reply: '',
      createdAt: Date.now() - 1000 * 60 * 60 * 12,
      threadId: 't6'
    },
    {
      id: 'm7',
      type: T_PAST,
      to: '二十岁那个圣诞节',
      fromEcho: '',
      echoExcerpt: '',
      content: '你那天因为加班没回家，妈妈在电话里说"没事，工作要紧"，你信了。十年后你才知道，那天她一个人热了三次你爱吃的菜，最后都倒了。如果能回去，我什么都不解释，买张票就上车。',
      reply: '所以今年平安夜，我推掉了所有局。菜还是那几道，她还是说"没事"。但这次我没信。',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
      threadId: 't7'
    },
    {
      id: 'm8',
      type: T_MIRROR,
      to: '正在和父母冷战的我',
      fromEcho: 'e2',
      echoExcerpt: '母亲就悄悄地躲出去，在我看不见的地方偷偷地听着我的动静。当一切恢复沉寂，她又悄悄地进来，眼边红红的，看着我。',
      content: '—— 史铁生的母亲也是这样"悄悄地"。我现在和她冷战，她是不是也在房门外站了很久？写信给平行我：原来我们都把最亲的人，逼成了"悄悄地"。',
      reply: '今晚我先开口叫她。哪怕只是"妈，吃饭了"。这是我能给她的，最早的"来得及"。',
      createdAt: Date.now() - 1000 * 60 * 60 * 30,
      threadId: 't8'
    },
    {
      id: 'm9',
      type: T_FUTURE,
      to: '送走妈妈那天的我',
      fromEcho: '',
      echoExcerpt: '',
      content: '我不知道你是哪一天读到这封信，但那天你一定很累。请你做三件事：一，喝一口温水；二，把你这两天所有没说出口的话写下来，不必给谁看；三，记得她最后一句清醒时说的话。这三件事，是给未来你的"接住"。',
      reply: '',
      createdAt: Date.now() - 1000 * 60 * 60 * 2,
      threadId: 't9'
    },
    {
      id: 'm10',
      type: T_MIRROR,
      to: '觉得自己不配被记起的我',
      fromEcho: 'e55',
      echoExcerpt: '走不出来，在亲人离世多年之后"还是会哭"，是一件正常的事——哀伤不需要被战胜，它需要被接住。',
      content: '—— 平行我写来：三年了，我还是会在超市冰柜前突然停下，因为他爱喝的那个牌子还在卖。我以为自己病了，原来这是"接住"。',
      reply: '那我就继续接住。下次在冰柜前停下，不再骂自己，就买一罐，回家慢慢喝完。',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
      threadId: 't10'
    },
    {
      id: 'm11',
      type: T_PAST,
      to: '十五岁出远门的那趟绿皮火车',
      fromEcho: '',
      echoExcerpt: '',
      content: '你正趴在硬座小桌上假装睡觉，其实是在哭。你以为自己是为了离开家难过，其实你是怕再也回不到那个家。别怕，你会回去很多次。只是每一次回去，家里都会少一点什么。所以请你现在就睁眼，把窗外那片稻田记住——那是你最后一次见到完整的它。',
      reply: '',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15,
      threadId: 't11'
    },
    {
      id: 'm12',
      type: T_FUTURE,
      to: '退休第一天的自己',
      fromEcho: 'e44',
      echoExcerpt: '当人们设想40年后的用餐情景时，却倾向于使用第三人称。',
      content: '恭喜你，终于到了我一直在用第三人称想象的"那一天"。心理学说我们把未来的自己当陌生人，所以这些年我没真正为你准备过什么。今天起，请你反过来——用第一人称写一封回信给现在的我，告诉我哪里该早做准备。我在这里等。',
      reply: '',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
      threadId: 't12'
    },
    {
      id: 'm13',
      type: T_FUTURE,
      to: '一年后的自己',
      fromEcho: '',
      echoExcerpt: '',
      content: '如果你还在为那件事难过，请记得：你已经比去年的你更好了。时间不是用来忘记的，而是用来沉淀的。',
      reply: '',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
      threadId: 't13'
    },
    {
      id: 'm14',
      type: T_FUTURE,
      to: '五年后的自己',
      fromEcho: '',
      echoExcerpt: '',
      content: '那时候爸爸应该快八十了吧？请你每周至少回去看他一次。不是因为你应该，而是因为你想。他做的红烧肉，你在外面永远吃不到。',
      reply: '',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
      threadId: 't14'
    },
    {
      id: 'm15',
      type: T_FUTURE,
      to: '十年后的自己',
      fromEcho: '',
      echoExcerpt: '',
      content: '看看你的白发，数一数有几根是因为当年那件事白的。然后告诉自己：值了。因为你没有被击垮，你变得更像你自己了。',
      reply: '',
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
      threadId: 't15'
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
    return 'm-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
  }

  function genThreadId() {
    return 't-' + Date.now().toString(36);
  }

  // ── 读 ──
  function listAll() {
    initIfEmpty();
    return load();
  }

  function listByType(type) {
    var items = listAll();
    if (type === 'all') return items;
    return items.filter(function (i) { return i.type === type; });
  }

  function getItem(id) {
    var items = listAll();
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) return items[i];
    }
    return null;
  }

  // ── 写 ──
  function add(data) {
    var items = listAll();
    var item = {
      id: genId(),
      type: data.type,
      to: (data.to || '').trim(),
      fromEcho: data.fromEcho || '',
      echoExcerpt: data.echoExcerpt || '',
      content: (data.content || '').trim(),
      reply: '',
      createdAt: Date.now(),
      threadId: data.threadId || genThreadId()
    };
    items.unshift(item);
    save(items);
    return item;
  }

  function setReply(id, reply) {
    var items = listAll();
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        items[i].reply = (reply || '').trim();
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
        Object.keys(patch || {}).forEach(function (k) { items[i][k] = patch[k]; });
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

  // ── 从回声库随机抽一条作为"平行我的来信" ──
  function drawMirrorFromEcho() {
    if (typeof EchoArchive === 'undefined') return null;
    var all = EchoArchive.listAll();
    if (!all.length) return null;
    var idx = Math.floor(Math.random() * all.length);
    var echo = all[idx];
    return {
      fromEcho: echo.id,
      echoExcerpt: echo.excerpt,
      echoTitle: echo.title,
      echoAuthor: echo.author,
      echoSource: echo.source
    };
  }

  // ── 统计 ──
  function stats() {
    var items = listAll();
    var s = { past: 0, mirror: 0, future: 0, total: items.length, replied: 0 };
    items.forEach(function (i) {
      s[i.type] = (s[i.type] || 0) + 1;
      if (i.reply) s.replied++;
    });
    return s;
  }

  global.EchoMail = {
    T_PAST: T_PAST,
    T_MIRROR: T_MIRROR,
    T_FUTURE: T_FUTURE,
    TYPE_LABEL: TYPE_LABEL,
    listAll: listAll,
    listByType: listByType,
    getItem: getItem,
    add: add,
    setReply: setReply,
    update: update,
    deleteItem: deleteItem,
    resetToSeed: resetToSeed,
    drawMirrorFromEcho: drawMirrorFromEcho,
    stats: stats
  };
})(window);
