(function (global) {
  'use strict';

  /*
   * 回声库 — 归档关于关系、记忆、遗憾的文字碎片
   * 数据来源：中国现当代文学经典、个人真实分享、口述史
   * 每条记录均标注来源，尊重原作者版权
   */

  var STORAGE_KEY = 'echo_archive_data';
  var NOTE_KEY = 'echo_archive_notes';

  // ── 第一批归档内容 ──
  var SEED = [
    // ===== 文学经典 =====
    {
      id: 'e1',
      type: 'literature',
      theme: '亲情',
      title: '背影',
      author: '朱自清',
      excerpt: '我与父亲不相见已二年余了，我最不能忘记的是他的背影。他用两手攀着上面，两脚再向上缩；他肥胖的身子向左微倾，显出努力的样子。这时我看见他的背影，我的泪很快地流下来了。',
      source: '《背影》1925年',
      tags: ['父亲', '背影', '细节', '离别'],
      note: '最经典的"生活细节锚点"——一个翻月台的动作，胜过千言万语。这正是存根簿想帮人留住的东西。'
    },
    {
      id: 'e2',
      type: 'literature',
      theme: '亲情',
      title: '秋天的怀念',
      author: '史铁生',
      excerpt: '双腿瘫痪后，我的脾气变得暴怒无常。母亲就悄悄地躲出去，在我看不见的地方偷偷地听着我的动静。当一切恢复沉寂，她又悄悄地进来，眼边红红的，看着我。"听说北海的花儿都开了，我推着你去走走。"她总是这么说。',
      source: '《秋天的怀念》',
      tags: ['母亲', '隐忍', '陪伴', '遗憾'],
      note: '母亲在世时，我们往往不知道她的苦。等到明白，已经来不及了。这就是"当时不知道怎么回事"的典型。'
    },
    {
      id: 'e3',
      type: 'literature',
      theme: '爱情',
      title: '给亡妇',
      author: '朱自清',
      excerpt: '谦，日子真快，一眨眼你已经死了三个年头了。三年里，我不知道多少次想起你，每次想起，总像有一根针扎在心上。你生前最操心的就是孩子，现在他们都好，你放心罢。',
      source: '《给亡妇》1932年',
      tags: ['亡妻', '思念', '日常', '悼念'],
      note: '写给亡妻的信，没有华丽辞藻，只有日常琐碎的交代。最平淡的话，反而最沉重。'
    },
    {
      id: 'e4',
      type: 'literature',
      theme: '友情',
      title: '为了忘却的记念',
      author: '鲁迅',
      excerpt: '我早已想写一点文字，来记念几个青年的作家。这并非为了别的，只因为两年以来，悲愤总时时袭击我的心，至今没有停止，我很想借此算是竦身一摇，将悲哀摆脱，给自己轻松一下。',
      source: '《为了忘却的记念》1933年',
      tags: ['友人', '悼念', '悲愤', '书写'],
      note: '鲁迅提出了一个核心命题：书写本身就是一种"摆脱悲哀"的方式——不是遗忘，而是安放。'
    },
    {
      id: 'e5',
      type: 'literature',
      theme: '亲情',
      title: '我的母亲',
      author: '老舍',
      excerpt: '母亲并不识字，可是她给我的生命的教育，比什么先生都高明。她一世未曾享过一天福，临死还吃的是粗粮。唉！还说什么呢？心痛！心痛！',
      source: '《我的母亲》1943年',
      tags: ['母亲', '教育', '愧疚', '粗糙'],
      note: '"心痛！心痛！"——四个字胜过万言。老舍写出了无数人的共同遗憾：来不及报答。'
    },
    {
      id: 'e6',
      type: 'literature',
      theme: '亲情',
      title: '我与地坛',
      author: '史铁生',
      excerpt: '多年来我头一次意识到，这园中不单是处处都有过我的车辙，有过我的车辙的地方也都有过母亲的脚印。她不是那种光会疼爱儿子而不懂得理解儿子的母亲。她知道我心里的苦处，怕我万一想不开去寻死，可她又不敢说破。',
      source: '《我与地坛》',
      tags: ['母亲', '沉默', '理解', '后知后觉'],
      note: '"有过我车辙的地方也都有过母亲的脚印"——这正是关系中的"后知后觉"。当时不知道，回头才看见。'
    },

    // ===== 个人真实分享 =====
    {
      id: 'e7',
      type: 'personal',
      theme: '亲情',
      title: '亲人的离去不是一场暴雨，而是一生的潮湿',
      author: '网络匿名',
      excerpt: '亲人的离去不是一场暴雨，而是一生的潮湿。你以为你走出来了，但某天在超市听到类似的脚步声，还是会愣住。你以为你忘了，但泡茶的时候手在抖，因为他是那样泡的。',
      source: '微博热门转发',
      tags: ['思念', '潮湿', '细节', '后知后觉'],
      note: '这句话在中文互联网被无数次转发，因为它说出了"悲伤不会结束，只会变形"的真相。'
    },
    {
      id: 'e8',
      type: 'personal',
      theme: '亲情',
      title: '我还有好多好多话，没来得及和她讲',
      author: '悼词委托人（崔馨月记录）',
      excerpt: '一位网友未能见到母亲最后一面，她满是遗憾。悼词中写道："我还有好多好多话，没来得及和她讲。我对她的思念、对她的爱，再也无人可说了。"',
      source: '广东共青团报道，2025年',
      tags: ['遗憾', '来不及', '悼词', '母亲'],
      note: '00后女孩崔馨月帮人写了48份悼词，发现最多的主题就是"来不及"和"没好好告别"。'
    },
    {
      id: 'e9',
      type: 'personal',
      theme: '亲情',
      title: '嗨，小罗罗，早上好',
      author: '潘婕',
      excerpt: '在陪伴母亲抗癌的700多个日夜里，我用文字记录生活点滴。"当时根本没想过要出书，就是本能地想把每一天都留住。"母亲离世后，北京的每个角落都有关于妈妈的记忆，路过稻香村就想给她带牛舌饼。',
      source: '《嗨，小罗罗，早上好》，中国青年作家报2025年',
      tags: ['记录', '陪伴', '抗癌', '日常'],
      note: '潘婕用49万字记录了母亲最后的两年。她证明了一件事：最好的记录，是"本能地想把每一天都留住"。'
    },
    {
      id: 'e10',
      type: 'personal',
      theme: '亲情',
      title: '爷爷让我第一次明白，原来人是会死的',
      author: '豆瓣用户 momo',
      excerpt: '爷爷离世时我还未成年，没有经济能力去反哺爷爷对我的爱。爷爷让我第一次明白，"哦，原来人是会死的！""原来我的亲人会永远离开我的。"为了不让自己再次产生遗憾，我决定在奶奶在世之前多多去关怀她。',
      source: '豆瓣小组，2026年3月',
      tags: ['爷爷', '死亡', '觉醒', '弥补'],
      note: '一个关于"痛过之后才开始行动"的真实故事。遗憾本身也是一种驱动力。'
    },
    {
      id: 'e11',
      type: 'personal',
      theme: '亲情',
      title: '父亲这一辈子没有留下一张照片',
      author: '徐连生',
      excerpt: '想念母亲时我还能翻看曾经的相片，以解思念之苦。想念父亲时我唯有努力地回忆再回忆，抑或在梦境中父子相遇，醒来时已泪湿衣襟。遗憾的是父亲这一辈子没有留下一张照片。',
      source: '潮新闻"写点生活"栏目，2026年4月',
      tags: ['父亲', '照片', '回忆', '缺失'],
      note: '没有留下任何影像和文字记录，是最深的遗憾。这正是存根簿要解决的问题。'
    },
    {
      id: 'e12',
      type: 'personal',
      theme: '亲情',
      title: '奶奶的三餐要有奶茶，顿顿要有咸菜',
      author: '网友 @NW10RW',
      excerpt: '奶奶拥有充实饱满的一生，跌宕起伏有之，平淡无奇有之。她三餐要有奶茶，顿顿要有咸菜。她有一件上个世纪的玫粉色棉裤，像人生信条一样坚固地焊在腿上。她真的不完美，我们还是怀念。',
      source: '社交平台留言，2025年',
      tags: ['奶奶', '习惯', '不完美', '怀念'],
      note: '最鲜活的记忆，往往是那些"不完美"的日常细节——玫粉色棉裤、顿顿咸菜。'
    },

    // ===== 口述史 / 民间记忆 =====
    {
      id: 'e13',
      type: 'oral',
      theme: '乡土',
      title: '老人的口述是最鲜活的乡土史料',
      author: '胡双祥（武科大学生）',
      excerpt: '队员们走村入户，听高龄村民严时登细说木雕纹样背后的家族往事。大家将收集到的民间传说、节庆风俗，与族谱、老照片进行交叉佐证。在空间上复原古民居三维模型，在时间上梳理人文脉络。',
      source: '武汉科技大学新闻网，2026年7月',
      tags: ['口述史', '村落', '家族', '交叉佐证'],
      note: '口述史方法论：老人的讲述 + 族谱 + 老照片交叉验证。这个方法也可以用在家庭记忆的采集中。'
    },
    {
      id: 'e14',
      type: 'oral',
      theme: '家族',
      title: '不是一个冷冰冰的家庭网盘，而是一个会读懂家庭的AI',
      author: '梁昊（拾光回忆录创始人）',
      excerpt: '多模态大模型自动识别老照片中的人物、地点和年代并打标签归档；口述史录音经AI转写、情感标注与主题聚类后，沉淀为可检索的家族数据库。我们想做的不是一个冷冰冰的家庭网盘，而是一个会"读懂"家庭的AI。',
      source: '中国日报网，2026年5月',
      tags: ['AI', '口述史', '归档', '家族数据库'],
      note: 'AI辅助记忆采集的方向：自动转写、情感标注、主题聚类。这是回声库未来的技术路径。'
    },
    {
      id: 'e15',
      type: 'oral',
      theme: '家族',
      title: '陪伴式访谈——让家人来提问',
      author: '拾光回忆录团队',
      excerpt: '邀请老人的家人作为采访者。公司会将打磨好的采访提纲交给老人的家人，让他们去提问，倾听老人讲述生平。这样的过程让子辈更深切地感受到父辈母辈一路走来的艰辛，也让老人能够更自然、坦然地分享过去。',
      source: '中国日报网，2026年5月',
      tags: ['访谈', '提问', '陪伴', '家人'],
      note: '"让家人来提问"是一个关键设计——不是外人采访，而是亲人之间的对话。存根簿的连接地图可以借鉴。'
    }
  ];

  // ── 工具 ──
  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

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

  function loadNotes() {
    try {
      var raw = localStorage.getItem(NOTE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return {};
  }

  function saveNotes(notes) {
    localStorage.setItem(NOTE_KEY, JSON.stringify(notes));
  }

  function initIfEmpty() {
    if (!load()) {
      save(deepClone(SEED));
    }
  }

  function listAll() {
    initIfEmpty();
    return load();
  }

  function getItem(id) {
    var items = listAll();
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) return items[i];
    }
    return null;
  }

  function addItem(data) {
    var items = listAll();
    var item = {
      id: 'echo-' + Date.now().toString(36),
      type: data.type || 'personal',
      theme: data.theme || '其他',
      title: data.title || '未命名',
      author: data.author || '佚名',
      excerpt: data.excerpt || '',
      source: data.source || '',
      tags: data.tags || [],
      note: data.note || ''
    };
    items.unshift(item);
    save(items);
    return item;
  }

  function deleteItem(id) {
    var items = listAll();
    items = items.filter(function (i) { return i.id !== id; });
    save(items);
  }

  function getNote(id) {
    var notes = loadNotes();
    return notes[id] || '';
  }

  function setNote(id, text) {
    var notes = loadNotes();
    notes[id] = text;
    saveNotes(notes);
  }

  function resetToSeed() {
    save(deepClone(SEED));
    localStorage.removeItem(NOTE_KEY);
  }

  function listByType(type) {
    var items = listAll();
    if (type === 'all') return items;
    return items.filter(function (i) { return i.type === type; });
  }

  function listByTheme(theme) {
    var items = listAll();
    if (theme === 'all') return items;
    return items.filter(function (i) { return i.theme === theme; });
  }

  function allTags() {
    var items = listAll();
    var tagSet = {};
    items.forEach(function (i) {
      (i.tags || []).forEach(function (t) { tagSet[t] = (tagSet[t] || 0) + 1; });
    });
    return Object.keys(tagSet).sort(function (a, b) { return tagSet[b] - tagSet[a]; });
  }

  global.EchoArchive = {
    listAll: listAll,
    getItem: getItem,
    addItem: addItem,
    deleteItem: deleteItem,
    getNote: getNote,
    setNote: setNote,
    resetToSeed: resetToSeed,
    listByType: listByType,
    listByTheme: listByTheme,
    allTags: allTags
  };
})(window);
