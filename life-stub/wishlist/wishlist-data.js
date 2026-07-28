(function (global) {
  'use strict';

  /*
   * 心愿册 — 把未来会遗憾的事，提前变成要做的事
   *
   * 核心方法论：把事后感慨，变成事前准备、事中从容、事后不憾
   * 与存根簿（过去）、历程簿（现在）、回声库（他者）、时光胶囊（寄未来）互补
   *
   * 每个心愿三段笔记，对应"之前/之中/之后"：
   *   why  — 事前：当初为什么想做这件事（防遗忘初衷）
   *   plan — 事前/事中：怎么准备、怎么安排（从容）
   *   done — 事后：做完的感受（存档，即使关系结束也无悔）
   *
   * 三态打卡：todo（待做）→ doing（在做）→ done（完成）
   * 比写日记友好：预设模板 + 打卡进度 + 按关系分组
   */

  var STORAGE_KEY = 'wishlist_data';

  // ── 状态 ──
  var ST_TODO = 'todo';
  var ST_DOING = 'doing';
  var ST_DONE = 'done';

  // ── 六个分类（直接覆盖各类遗憾）──
  // 陪伴 — 趁还在，多陪
  // 传承 — 把他的手艺/故事记下来传下去
  // 告别 — 好好说再见（呼应回声库e27"没说完的话"）
  // 和解 — 趁来得及解开的结
  // 日常 — 日常小确幸清单
  // 仪式 — 给关系一个仪式感
  var CATEGORIES = ['陪伴', '传承', '告别', '和解', '日常', '仪式'];

  // ── 预设模板（比写日记友好，不面对空白页）──
  var TEMPLATES = [
    { tpl: '带___去看___', cat: '陪伴', fill: '带[谁]去看[什么]' },
    { tpl: '学会___的___', cat: '传承', fill: '学会[谁]的[手艺/菜谱/手艺]' },
    { tpl: '给___写一封信', cat: '仪式', fill: '给[谁]写一封信' },
    { tpl: '问清楚___的___', cat: '传承', fill: '问清楚[谁]的[往事/病史/来历]' },
    { tpl: '录下___的___', cat: '传承', fill: '录下[谁]的[声音/方言/故事]' },
    { tpl: '和___解开___', cat: '和解', fill: '和[谁]解开[那个结]' },
    { tpl: '陪___做一次___', cat: '陪伴', fill: '陪[谁]做一次[什么事]' },
    { tpl: '拍一张___', cat: '仪式', fill: '拍一张[什么合影/场景]' },
    { tpl: '好好和___说一次___', cat: '告别', fill: '好好和[谁]说一次[什么话]' },
    { tpl: '为___做一件___', cat: '日常', fill: '为[谁]做一件[小事]' }
  ];

  // ── 模拟数据（覆盖各类关系与分类，让用户一看就懂）──
  var SEED = [
    {
      id: 'w1',
      target: '妈妈',
      title: '带妈妈看一次海',
      category: '陪伴',
      why: '她说这辈子没看过海。每次电视里播海，她都多看两眼。我怕来不及。',
      plan: '国庆假期，订去青岛的票。她腿不好，选能推轮椅的沙滩。带上她爱吃的点心。',
      done: '',
      status: ST_DOING,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
      doneAt: 0
    },
    {
      id: 'w2',
      target: '妈妈',
      title: '学会她做红烧肉的顺序',
      category: '传承',
      why: '她做红烧肉先放冰糖炒色，再放酱油，和别人反着来。我嫌麻烦从没学。万一哪天想吃，没人能做出来。',
      plan: '下次回家，站在厨房看她做一遍，全程录像。把每一步的"少许""适量"换算成克数记下来。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
      doneAt: 0
    },
    {
      id: 'w3',
      target: '妈妈',
      title: '录下她念叨我的原话',
      category: '传承',
      why: '她总念叨"你怎么又不吃饭""穿那么少"。我嫌烦。但回声库e31说，唠叨其实是提前为没有她的日子做预案。我想留住这些原话。',
      plan: '在家那几天，手机开着录音放兜里，自然录。别让她知道，否则她会装。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15,
      doneAt: 0
    },
    {
      id: 'w4',
      target: '妈妈',
      title: '拍一张正经的合影',
      category: '仪式',
      why: '翻遍手机，我和妈妈的合影都是偷拍的、糊的、她躲镜头的。没有一张正经的。',
      plan: '今年她生日，请个摄影师到家附近拍。她肯定说浪费钱，提前跟她说好。',
      done: '今年生日拍了，她嘴上说浪费钱，但化了妆。照片洗出来挂在她床头。',
      status: ST_DONE,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 90,
      doneAt: Date.now() - 1000 * 60 * 60 * 24 * 60
    },

    {
      id: 'w5',
      target: '爸爸',
      title: '陪他下一次棋',
      category: '陪伴',
      why: '他棋瘾大，我从小嫌他下棋慢。现在他眼睛不好，下不动了。我想让他再赢我一次。',
      plan: '春节回家带副好棋子。不用他看盘，我念着他下。故意输，但别太明显。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 25,
      doneAt: 0
    },
    {
      id: 'w6',
      target: '爸爸',
      title: '问清楚家族病史',
      category: '传承',
      why: '爷爷那辈得过什么病、怎么走的，我完全不知道。爸爸是唯一清楚的人。等他也不清楚了就来不及。',
      plan: '回家长聊一次，录音。画个家族树，标清每个人的主要病史和走的原因。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18,
      doneAt: 0
    },

    {
      id: 'w7',
      target: '奶奶',
      title: '录一段她的方言',
      category: '传承',
      why: '回声库e24说"老人走了，地名跟着走"。方言也一样。奶奶说的那种土话，村里只有她那辈人会了。',
      plan: '让她讲讲小时候的事，全程录音。重点录那些只有方言才说得出的词。',
      done: '录了40分钟。她讲了好多我听不懂的词，但声音留下来了。存进了存根簿记忆锚点。',
      status: ST_DONE,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 120,
      doneAt: Date.now() - 1000 * 60 * 60 * 24 * 100
    },

    {
      id: 'w8',
      target: '爷爷',
      title: '问清他年轻时最骄傲的一件事',
      category: '传承',
      why: '我只知道他当过木匠。他手艺多好、做过什么大件、带过几个徒弟，我从没问过。',
      plan: '下次回去，泡壶茶，问他这辈子最得意的是哪件活。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
      doneAt: 0
    },

    {
      id: 'w9',
      target: '高中班主任',
      title: '给她写一封信',
      category: '仪式',
      why: '回声库e22说，老师保留了我所有作文，我十年没去看她。欠她一句谢谢，再不说可能没机会了。',
      plan: '不打电话，写信。手写。寄到学校，她应该还在那。',
      done: '',
      status: ST_DOING,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
      doneAt: 0
    },

    {
      id: 'w10',
      target: '老朋友阿明',
      title: '赴那个未完成的旅行约定',
      category: '和解',
      why: '回声库e20说，有人没等到退休就走了。我和阿明十年前约好去川藏线，后来闹掰了。现在他在化疗。',
      plan: '不提当年的事。问他还能不能走，不能走就推轮椅也推一段。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
      doneAt: 0
    },

    {
      id: 'w11',
      target: '自己',
      title: '整理一次老照片',
      category: '日常',
      why: '回声库e11说，父亲没留下一张照片是最深的遗憾。家里的老照片堆在抽屉，不整理迟早发霉丢失。',
      plan: '春节假期，花两天扫描建档。每张标清时间地点人物。存三份：本地、云盘、移动硬盘。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
      doneAt: 0
    },

    {
      id: 'w12',
      target: '自己',
      title: '学会拒绝，不再讨好',
      category: '和解',
      why: '我花了三十年讨好所有人，唯独亏待自己。和自己的关系，是所有关系的底座（回声库e28）。',
      plan: '从小事练起：别人提不合理要求，先说"我想想"再答。给自己一周一次"什么都不做"的晚上。',
      done: '',
      status: ST_DOING,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
      doneAt: 0
    },

    {
      id: 'w13',
      target: '外婆',
      title: '好好说一次再见',
      category: '告别',
      why: '回声库e27说，"没说完的话比死亡更重"。每次离开外婆家我都匆匆忙忙，从没好好道别过。',
      plan: '下次走的那天，坐下来，看着她，认真说"外婆我走了，下次再来看你"，抱一下。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
      doneAt: 0
    },

    {
      id: 'w14',
      target: '妈妈',
      title: '为她做一顿饭',
      category: '日常',
      why: '吃了她三十年的饭，没给她做过一顿像样的。',
      plan: '学会她最拿手的红烧肉（见w2），趁她还在做给她吃。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
      doneAt: 0
    },

    {
      id: 'w15',
      target: '全家',
      title: '拍一张全家福',
      category: '仪式',
      why: '上一张全家福是十年前，少了两个人，多了两个人。再不拍，又该变了。',
      plan: '今年春节，全家到齐那天，挂个红布当背景，用三脚架自拍。一个都不能少。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
      doneAt: 0
    },

    {
      id: 'w16',
      target: '外公',
      title: '听他讲一次抗美援朝',
      category: '传承',
      why: '他胸前有枚三等功勋章，我从小看到大，从没问过是怎么来的。他也从没主动说。',
      plan: '下次回去，把勋章从柜子里拿出来，递给他，问："外公，这枚章，讲讲呗。"准备好录音。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
      doneAt: 0
    },
    {
      id: 'w17',
      target: '发小小伟',
      title: '和解：那通没接的电话',
      category: '和解',
      why: '十年前我们因为一件小事闹掰。三个月前他打了个电话给我，我没接。不知道他还会不会再打。',
      plan: '我主动打过去。不提当年的事。就问："最近怎么样？"如果他接了，就约顿饭。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
      doneAt: 0
    },
    {
      id: 'w18',
      target: '女儿',
      title: '每年拍一张她和树的合影',
      category: '仪式',
      why: '她出生那天我在院子里种了棵小桃树。想每年同一天拍一张，看她和树一起长。',
      plan: '定个闹钟，每年生日那天。别嫌麻烦，十年后会感谢今天的自己。',
      done: '今年三岁，树比她高了。她踮脚够树桠，笑出两颗虎牙。',
      status: ST_DONE,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 500,
      doneAt: Date.now() - 1000 * 60 * 60 * 24 * 15
    },
    {
      id: 'w19',
      target: '老公',
      title: '一起回他的母校',
      category: '陪伴',
      why: '他总说大学食堂的红烧肉最好吃。说了七年，一次都没回去过。',
      plan: '周末瞒着他买好票。到了校门口再告诉他。在他当年的食堂吃一顿。',
      done: '',
      status: ST_DOING,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
      doneAt: 0
    },
    {
      id: 'w20',
      target: '奶奶',
      title: '记下她所有拿手菜的菜谱',
      category: '传承',
      why: '她做的梅菜扣肉，是我对"家"的味觉记忆。她已经记不清放多少盐了，趁还能问赶紧记。',
      plan: '回乡下住一周，每天学一道。每道录视频 + 写文字，精确到克。装订成小册子。',
      done: '',
      status: ST_DOING,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
      doneAt: 0
    },
    {
      id: 'w21',
      target: '姑姑',
      title: '谢谢她当年偷偷塞给我的学费',
      category: '告别',
      why: '大学第一年学费凑不齐，姑姑半夜来我家，把一个信封塞给我妈。我假装睡着了，其实都听见了。我从没谢过她。',
      plan: '过年给她买件像样的羽绒服。吃饭的时候，敬她一杯酒，说："姑，当年那笔钱，我一直记得。"',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 9,
      doneAt: 0
    },
    {
      id: 'w22',
      target: '自己',
      title: '戒掉熬夜',
      category: '日常',
      why: '妈总说"早点睡"，我嫌烦。现在她不在了，我开始自己跟自己说这句话。想替她照顾好我。',
      plan: '从 12 点提前到 11 点半，每周提前 15 分钟。睡前不刷手机，看几页纸质书。',
      done: '',
      status: ST_DOING,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
      doneAt: 0
    },
    {
      id: 'w23',
      target: '初恋',
      title: '那件没说出口的道歉',
      category: '和解',
      why: '十八岁那年分手，我说了很难听的话。十五年了，我时常想起她当时的眼神。想跟她说一句对不起。',
      plan: '不打扰她现在的生活。通过共同朋友确认她过得好就行。如果机缘合适，说一句"当年对不起"。如果不合适，就在心里说。',
      done: '通过朋友知道她结婚了，有个女儿，过得很好。足够了。那句对不起，我在心里说了。',
      status: ST_DONE,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 200,
      doneAt: Date.now() - 1000 * 60 * 60 * 24 * 180
    },
    {
      id: 'w24',
      target: '老周（同事）',
      title: '跟他说"当年那件事是我错了"',
      category: '和解',
      why: '五年前项目失败，我在会上把锅甩给了他。他没辩解。后来他离职了。我欠他一句道歉。',
      plan: '找到他的微信。直接说，不解释不找理由，就"当年那件事，是我不对，对不起"。他原不原谅是他的事，我得说。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
      doneAt: 0
    },
    {
      id: 'w25',
      target: '爸爸',
      title: '陪他去一次北京',
      category: '陪伴',
      why: '他年轻时候差点去当兵，因为奶奶不让没去成。他这辈子没出过省。总说天安门是这辈子最想去的地方。',
      plan: '秋天去，北京最美的季节。提前订好卧铺，他没坐过火车卧铺。天安门、故宫、长城，一天只去一个地方，慢慢走。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
      doneAt: 0
    },
    {
      id: 'w26',
      target: '外婆',
      title: '把她的旧照片扫描成册',
      category: '传承',
      why: '她有个铁盒子，装着几百张黑白照片。都发黄了，边角卷起来。她一张一张给我讲过是谁，我忘了一大半。',
      plan: '春节带回家，花两天扫描。每张背面写的字也拍下来。做成一本相册，给她也留一本。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
      doneAt: 0
    },
    {
      id: 'w27',
      target: '自己',
      title: '一个人去一次海边',
      category: '日常',
      why: '总说等有空了就去。等了十年，还是没去。不是没时间，是总觉得"一个人去有什么意思"。但我知道，去了就有意思了。',
      plan: '下周末就去。不做攻略。带本书，坐在海边看一下午浪。',
      done: '去了。坐了四个小时，什么都没想。回来路上，觉得心里空的地方，被海水填满了一点点。',
      status: ST_DONE,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 60,
      doneAt: Date.now() - 1000 * 60 * 60 * 24 * 50
    },
    {
      id: 'w28',
      target: '爷爷',
      title: '用他的木匠工具做一件小东西',
      category: '传承',
      why: '他走了三年，那套工具还在老房子的阁楼上落灰。我一件都不会用。想学会做一件最简单的东西，作为他留给我的"传家宝"。',
      plan: '找村里还在做木工的师傅，跟着学。做个小板凳就行。做好了放在床头。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 25,
      doneAt: 0
    },
    {
      id: 'w29',
      target: '妈妈',
      title: '跟她学织围巾',
      category: '传承',
      why: '她织了一辈子毛衣，我一件都没学会。她说"你手笨学不会"，我就真的没学。现在想，是她怕教会了我以后就没借口找她了吧。',
      plan: '周末回家，说"妈我想学织围巾"。她肯定嘴上嫌烦，心里高兴。起针、平针、收针，就这三步。织一条最丑的围巾，围一整个冬天。',
      done: '',
      status: ST_DOING,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
      doneAt: 0
    },
    {
      id: 'w30',
      target: '女儿',
      title: '每年给她写一封信，十八岁一起给她',
      category: '仪式',
      why: '时光胶囊给未来的自己写，那给未来的女儿呢？她十八岁那天，把十八封信一起交给她——让她知道，从她出生第一年起，妈妈就在认真地看着她长大。',
      plan: '每年生日写一封。不长，一千字就行。写她这一年最有趣的事、最让我头疼的事、我最想对她说的话。',
      done: '写到第三封了。今年写的是她第一次自己系鞋带，系成了死结，得意了一整天。',
      status: ST_DOING,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 365 * 3,
      doneAt: 0
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
    return 'w-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
  }

  // ── 读 ──
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

  function listByStatus(status) {
    var items = listAll();
    if (status === 'all') return items;
    return items.filter(function (i) { return i.status === status; });
  }

  function listByTarget(target) {
    var items = listAll();
    if (target === 'all') return items;
    return items.filter(function (i) { return i.target === target; });
  }

  // 所有关系对象（去重）
  function allTargets() {
    var items = listAll();
    var set = {};
    items.forEach(function (i) { set[i.target] = (set[i.target] || 0) + 1; });
    return Object.keys(set).sort(function (a, b) { return set[b] - set[a]; });
  }

  // ── 写 ──
  function add(data) {
    var items = listAll();
    var item = {
      id: genId(),
      target: (data.target || '自己').trim(),
      title: (data.title || '').trim(),
      category: data.category || '日常',
      why: (data.why || '').trim(),
      plan: (data.plan || '').trim(),
      done: '',
      status: ST_TODO,
      createdAt: Date.now(),
      doneAt: 0
    };
    items.unshift(item);
    save(items);
    return item;
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

  // 推进状态：todo → doing → done
  function advance(id) {
    var item = getItem(id);
    if (!item) return null;
    var next = item.status;
    if (item.status === ST_TODO) next = ST_DOING;
    else if (item.status === ST_DOING) next = ST_DONE;
    else return item;
    var patch = { status: next };
    if (next === ST_DONE) patch.doneAt = Date.now();
    return update(id, patch);
  }

  // 回退状态：done → doing → todo
  function retreat(id) {
    var item = getItem(id);
    if (!item) return null;
    var next = item.status;
    if (item.status === ST_DONE) next = ST_DOING;
    else if (item.status === ST_DOING) next = ST_TODO;
    else return item;
    var patch = { status: next };
    if (next !== ST_DONE) patch.doneAt = 0;
    return update(id, patch);
  }

  function deleteItem(id) {
    var items = listAll().filter(function (i) { return i.id !== id; });
    save(items);
  }

  function resetToSeed() {
    save(JSON.parse(JSON.stringify(SEED)));
  }

  // ── 统计 ──
  // 按关系分组，返回 [{target, total, todo, doing, done}]
  function statsByTarget() {
    var items = listAll();
    var map = {};
    items.forEach(function (i) {
      if (!map[i.target]) map[i.target] = { target: i.target, total: 0, todo: 0, doing: 0, done: 0 };
      map[i.target].total++;
      map[i.target][i.status]++;
    });
    return Object.keys(map).map(function (k) { return map[k]; });
  }

  function stats() {
    var items = listAll();
    var s = { todo: 0, doing: 0, done: 0, total: items.length };
    items.forEach(function (i) { s[i.status] = (s[i.status] || 0) + 1; });
    return s;
  }

  global.Wishlist = {
    ST_TODO: ST_TODO,
    ST_DOING: ST_DOING,
    ST_DONE: ST_DONE,
    CATEGORIES: CATEGORIES,
    TEMPLATES: TEMPLATES,
    listAll: listAll,
    getItem: getItem,
    listByStatus: listByStatus,
    listByTarget: listByTarget,
    allTargets: allTargets,
    add: add,
    update: update,
    advance: advance,
    retreat: retreat,
    deleteItem: deleteItem,
    resetToSeed: resetToSeed,
    stats: stats,
    statsByTarget: statsByTarget
  };
})(window);
