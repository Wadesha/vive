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
    },

    // ── 陪伴类 ──
    {
      id: 'w31',
      target: '妈妈',
      title: '拍一张正经的合照',
      category: '陪伴',
      why: '翻遍手机几千张照片，竟然没一张和妈的合照。全是拍菜、拍风景、拍猫，她的脸永远是糊的或者只有半边。突然意识到，她每次都躲镜头，而我也从没认真拉住她。',
      plan: '下次回家，找个光线好的下午，架三脚架拍。别用手机自拍，找路人帮忙也行。告诉她：这张我要洗出来放钱包里。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 17,
      doneAt: 0
    },
    {
      id: 'w32',
      target: '爸爸',
      title: '翻翻他的购物记录',
      category: '陪伴',
      why: '有人的父亲手机购物记录里：三次老花镜、治牙疼风湿的药、三罐儿子爱吃的红烧肉罐头。没有一件是给自己享受的。我想看看我爸的购物车里都装着谁。',
      plan: '回家帮他清手机内存的时候，顺便看看他的淘宝订单和微信支付记录。不是偷看，是了解。看看他最近缺什么、想要什么、舍不得买什么。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 45,
      doneAt: 0
    },
    {
      id: 'w33',
      target: '爸妈',
      title: '每周打一次不敷衍的电话',
      category: '陪伴',
      why: '有统计说80后62.1%后悔忽略了家人，45.8%每年陪父母不足10天。我每周打电话不超过5分钟，永远是"吃了没""嗯""好的""挂了"。这不是打电话，这是打卡。',
      plan: '每周固定一天晚上8点打。定闹钟。聊够20分钟再挂。问点具体的：今天和谁下棋了？菜场什么便宜了？隔壁张阿姨家闺女结婚了没？',
      done: '',
      status: ST_DOING,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
      doneAt: 0
    },
    {
      id: 'w34',
      target: '老友阿杰',
      title: '发一条认真的消息',
      category: '陪伴',
      why: '撒贝宁第一条微信发给了已故母亲，永远不会收到回复。我想起阿杰帮我搬家那次，我连句谢都没好好说。不是不在乎，是总觉得来得及。万一来不及呢？',
      plan: '不群发，不转发。认真写一段话，告诉他在我心里有多重要。发完不管他怎么回，我都不尴尬。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 22,
      doneAt: 0
    },
    {
      id: 'w35',
      target: '爸爸',
      title: '不拒绝他的小小心愿',
      category: '陪伴',
      why: '朱迅拒绝父亲"回家"的心愿，成了她一辈子的痛。我爸说"过年来一趟吧"，我说"忙"。他说"那五一呢"，我说"再说"。他每次都说"再说"，我从没当回事。',
      plan: '下次他说想让我做什么，先答应。做不到的再说做不到，但先别一口回绝。把"再说"换成"好，我看看时间"。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 31,
      doneAt: 0
    },
    {
      id: 'w36',
      target: '爸妈',
      title: '今年多回一次家',
      category: '陪伴',
      why: '算了一笔账：一年见四次面一次两天，余生陪父母不足两个月。这两个月还包括睡觉、刷手机、跟朋友出去吃饭。真正看着他们说话的时间，可能还不到一星期。',
      plan: '今年中秋或国庆，额外请两天假回去。不赶时间，在家住满。跟他们一起买菜做饭，不去外面吃。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 9,
      doneAt: 0
    },
    {
      id: 'w37',
      target: '妈妈',
      title: '在她最需要时不缺席',
      category: '陪伴',
      why: '康辉在书里写，出差时母亲离世，连最后一面都没见上。他一辈子无法释怀。我出差也多，每次妈说哪里不舒服，我都是"去医院看看""多喝热水"。万一哪次不是小毛病呢？',
      plan: '妈说身体不舒服的时候，别远程指挥了，请假回去陪她看医生。年假就是干这个用的。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 67,
      doneAt: 0
    },
    {
      id: 'w38',
      target: '妈妈',
      title: '听完她说的每句话',
      category: '陪伴',
      why: '妈打电话来，用那种小心翼翼的语气问："你忙不忙？明年能不能少接点活？"我没听完就说"没办法"。后来才听出来，她不是让我辞职，她是想我了。',
      plan: '以后她说话的时候，忍住不插嘴。等她说完，停三秒再答。那些听起来唠叨的话里，藏着她的需求。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
      doneAt: 0
    },
    {
      id: 'w39',
      target: '外婆',
      title: '学会做一碗她爱喝的粥',
      category: '陪伴',
      why: '外婆生病后说想喝一碗粥，不是什么山珍海味，就是小米粥加红枣。可我连小米粥都不会熬，不是夹生就是糊底。她喝了一辈子我外公熬的粥，外公走了就没人给她熬了。',
      plan: '回家让外婆在旁边指挥，我动手。小米冷水下锅，大火开了转小火，搅三次防粘底。红枣后放，最后撒一点点盐提味。学会，以后每次回去都给她熬。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 28,
      doneAt: 0
    },
    {
      id: 'w40',
      target: '爸爸',
      title: '趁还叫得出口多叫几声爸',
      category: '陪伴',
      why: '倪萍写到她父亲去世，她这辈子都没喊过一声爸。有些人叫不出口，是因为别扭；有些人来不及叫，是因为来不及。我现在叫"爸"的时候越来越少了，都是"喂""嗯"。趁还叫得动，多叫几声。',
      plan: '每次打电话开头叫一声"爸"，结尾说一句"爸我挂了"。不省略。回家进门先叫人。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 52,
      doneAt: 0
    },

    // ── 和解类 ──
    {
      id: 'w41',
      target: '爸爸',
      title: '和他解开那个冷战',
      category: '和解',
      why: '和父母赌气冷战，总以为来日方长，等想开口的时候人已经不在了，愧疚半辈子。我和爸为考学的事吵翻两年没说话，他先低头给我发了条微信，我回了个"嗯"。现在想起来，那个"嗯"真该打。',
      plan: '主动打个电话，不提当年谁对谁错。就问："爸，周末我回去，你想吃啥我带。"他肯定一愣，然后假装没事地说"随便"。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 11,
      doneAt: 0
    },
    {
      id: 'w42',
      target: '妈妈',
      title: '下次发火前先停下来',
      category: '和解',
      why: '把最坏的脾气留给最亲的人。我对外人客客气气，妈多问一句我就能炸。说完就后悔，下次还这样。她说"你对外面的人比对我好"，我无力反驳。',
      plan: '下次忍不住想发火时，先深呼吸，去阳台站一分钟再说话。把对客户的耐心分十分之一给她就够了。',
      done: '',
      status: ST_DOING,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
      doneAt: 0
    },
    {
      id: 'w43',
      target: '自己',
      title: '和过去的遗憾和解',
      category: '和解',
      why: '输入法还记得你的名字，但我不能提了。分手三年，我的手机输入法打"我"后面还跟着她的名字。删了又怎样，心里删不掉。但我不能一直背着这件事走了。',
      plan: '不逼自己忘记。每年清明给自己写一封信，写完烧掉。允许自己偶尔想起，但不允许它挡住以后的路。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 78,
      doneAt: 0
    },
    {
      id: 'w44',
      target: '老公',
      title: '冷战不超过一天',
      category: '和解',
      why: '看到有人写：父亲走时，翻遍手机找不到和母亲的一张合照，因为他们冷战了大半辈子。我和老公也冷战，最长一次二十天没说话。吵不散的，冷战会。',
      plan: '约定：再怎么生气，睡前必须说一句话，哪怕是"明天记得带伞"。冷战不超过24小时。谁先开口谁不是认输，是更在乎。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 19,
      doneAt: 0
    },
    {
      id: 'w45',
      target: '弟弟',
      title: '先低头不丢人',
      category: '和解',
      why: '因为固执、怨恨、骄傲，拒绝和解，形同陌路。我和弟弟因为家产的事翻脸五年。五年。过年饭桌上多出来的那副空碗筷，妈每次都假装没看见。',
      plan: '不谈家产的事了。约他吃顿火锅，就像小时候那样。他来不来是他的事，我约不约是我的事。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 33,
      doneAt: 0
    },
    {
      id: 'w46',
      target: '父亲',
      title: '放下对他的怨，趁还来得及',
      category: '和解',
      why: '看到有人写：创业失败和父亲争吵，多年不相往来，父亲病重才和解。我和我爸也是，嫌他管太多、嫌他没本事、嫌他说话难听。但我想起他白头发的速度比我想起他缺点快多了。',
      plan: '下个月回家。不翻旧账。帮他修修家里那个漏水的水龙头。他不说谢谢，我也不需要他说。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 88,
      doneAt: 0
    },

    // ── 传承类 ──
    {
      id: 'w47',
      target: '爸妈',
      title: '录下他们的口述回忆',
      category: '传承',
      why: '凯文·凯利说：趁父母在世，记录他们口述的经历，这会是家庭最珍贵的礼物。我妈讲过她小时候吃不饱饭偷红薯的事，讲得跟段子一样。但我从没录下来，全靠记忆，已经在模糊了。',
      plan: '春节回家，吃完饭泡壶茶，把手机架起来录。别搞成采访，就聊天。问他们小时候的事、谈恋爱的经过、觉得最苦和最甜的日子。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 42,
      doneAt: 0
    },
    {
      id: 'w48',
      target: '外婆',
      title: '学会她的独门酱菜',
      category: '传承',
      why: '外婆会做的那种酱菜，她走后全家没人做得出那个味道。问过我妈，说"知道放什么但比例不对"。那味道就真的没了。',
      plan: '趁外婆还在，回去蹲厨房。她腌一罐我记一罐，盐几勺、醋多少、腌几天翻一次。写成菜谱，教给表姐表妹。一个人记住不算数，要三个人记住才传得下去。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 55,
      doneAt: 0
    },
    {
      id: 'w49',
      target: '爷爷',
      title: '记下他说的那些老话',
      category: '传承',
      why: '爷爷说话有一堆土话，"日头偏西""灶膛火"这些词，我听着新鲜但说不出来。他走了以后，村里没人说这些话了。语言死了，世界就小了一圈。',
      plan: '下次回去录音。让他讲讲他爷爷那时候的事，那些老话让他用原话讲。回家整理成文字，配上解释。发到家族群里，让大家都存一份。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 36,
      doneAt: 0
    },
    {
      id: 'w50',
      target: '爷爷奶奶',
      title: '问清楚祖辈从哪迁来的',
      category: '传承',
      why: '我连我爷爷的爷爷叫什么都不知道。家族从哪迁来的、为什么迁的、原来姓什么，全是空白。我如果不知道，我儿子更不会知道。',
      plan: '回老家找族里最年长的长辈聊。带个本子画家族树。去村委会查旧档案。把来历写下来，留给下一代。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 73,
      doneAt: 0
    },
    {
      id: 'w51',
      target: '妈妈',
      title: '耐心教会她用微信',
      category: '传承',
      why: '妈用微信只会发语音和点红包。视频通话要我爸帮她拨。她不敢乱点怕扣钱。我教过她两次，不耐烦，说"你自己琢磨吧"。她就没再问过。',
      plan: '手把手教：打车、挂号、买菜、发朋友圈。每一步截个图，做成她看得懂的手写说明书，贴在冰箱上。她问的时候不叹气。',
      done: '',
      status: ST_DOING,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
      doneAt: 0
    },
    {
      id: 'w52',
      target: '外婆',
      title: '把老照片里的人认全',
      category: '传承',
      why: '外婆那盒老照片里有一大半人我不认识。我问她"这是谁"，她说一个名字，我转头就忘。照片里的人正在被遗忘，再没人认得他们了。',
      plan: '带外婆一张一张过，每张拍照+录她说的人名和关系。回去整理成电子相册，人名写在照片下方。打出来一本给她，让她翻着看。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 61,
      doneAt: 0
    },

    // ── 告别类 ──
    {
      id: 'w53',
      target: '前任',
      title: '好好说一次再见',
      category: '告别',
      why: '分开的时候太体面了，体面到连再见都没好好说。以为不联系就是放下，其实那个句号一直没画上。',
      plan: '不一定见面。写一封信，不寄也行。把当年没说完的话说完，然后真正地放手。告别不是给对方看的，是给自己的。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15,
      doneAt: 0
    },
    {
      id: 'w54',
      target: '爸爸',
      title: '问问他还有什么想说的',
      category: '告别',
      why: '有人的父亲走的时候一只眼合一只眼不合，老人说那是因为还有没说出的话。我不想等到那时候才后悔没问。',
      plan: '找个安静的时候，泡杯茶，认真问他："爸，你有没有什么话一直想说但没说的？"不管他说什么，都别打断。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 96,
      doneAt: 0
    },
    {
      id: 'w55',
      target: '外公',
      title: '不把见面当理所当然',
      category: '告别',
      why: '有人在一个普通的下午出门，就再也没回来。每一次告别都可能是最后一次，但我们总以为还有下次。上次见外公走的时候我说"下月再来看你"，说完就忘了。',
      plan: '以后每次告别都认真一点。看着对方的眼睛说再见，不要边看手机边敷衍。每次走之前多待五分钟。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
      doneAt: 0
    },
    {
      id: 'w56',
      target: '妈妈',
      title: '认真说一次我爱你',
      category: '告别',
      why: '来不及说爱，是很多人一辈子的遗憾。中国家庭不说"爱"字，觉得矫情。但万一呢？万一哪天想说说不出来了呢？',
      plan: '不挑节日，就随便哪天打电话的时候，在挂电话之前说一句："妈，我爱你。"她可能会愣住，可能会笑我傻，但她会记一辈子。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 48,
      doneAt: 0
    },

    // ── 日常类 ──
    {
      id: 'w57',
      target: '外婆',
      title: '每次见她都穿整齐',
      category: '日常',
      why: '外婆生病的时候跟我说："在家里也不能邋里邋遢的。"她一辈子出门都要换干净衣裳、梳好头。她不是嫌我邋遢，她是觉得认真对待自己就是认真对待日子。',
      plan: '每次去看她，换件干净的衬衫。不是为了面子，是她会高兴。她高兴了，这个下午就值得。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
      doneAt: 0
    },
    {
      id: 'w58',
      target: '妈妈',
      title: '给她买一件用心的礼物',
      category: '日常',
      why: '有人给父母买了件羊绒大衣，妈穿上拍了照发朋友圈，写了句"闺女买的"。其实那件打折才两百。不是贵不贵的问题，是她终于有了一件不是自己舍不得买的衣服。',
      plan: '观察她缺什么：鞋子旧了？羽绒服不暖了？围巾起球了？买完直接寄到家，不问她要不要——问了她永远说不需要。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 23,
      doneAt: 0
    },
    {
      id: 'w59',
      target: '儿子',
      title: '放下手机陪他玩十分钟',
      category: '日常',
      why: '他说"爸爸看我看我"，我头都没抬。他说了三遍，我不耐烦地"嗯嗯"。他就不说了。我放下手机的时候他已经走开了。',
      plan: '每天晚饭后，手机调成静音扣在桌上，陪他玩十分钟。玩乐高也行，在地上打滚也行。十分钟不多，但他会记得。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
      doneAt: 0
    },
    {
      id: 'w60',
      target: '妈妈',
      title: '耐心听完她的唠叨',
      category: '日常',
      why: '她讲菜场张阿姨家闺女、楼下老李头的狗、隔壁谁家装修吵——我觉得没营养，总是"嗯嗯嗯"催她快点说。但她说这些，是因为她的世界就这么大。我在外面看世界，她在家里等我回来讲给她听。',
      plan: '下次她唠叨的时候，不催，不打断，不转移话题。偶尔追问一句细节："然后呢？"她会越讲越开心。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 16,
      doneAt: 0
    },

    // ── 仪式类 ──
    {
      id: 'w61',
      target: '全家',
      title: '拍一张像样的全家福',
      category: '仪式',
      why: '没有一张像样的全家福。手机里倒是不少，全是吃饭时随手拍的，有人闭眼有人看手机有人嘴含着菜。正经的全家福，一张都没有。',
      plan: '今年春节，请个相熟的邻居帮忙拍。不用影楼，就在院子里。穿干净衣服，站好看镜头。冲洗6寸的，给每家寄一张。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
      doneAt: 0
    },
    {
      id: 'w62',
      target: '儿子',
      title: '给他办一场成人礼',
      category: '仪式',
      why: '他18岁了，没什么仪式感，我自己18岁那年也没有。人这辈子需要几个被正式对待的瞬间，告诉他自己长大了，也告诉别人他值得被认真对待。',
      plan: '不是大摆酒席那种。请他最好的三个朋友和家里最亲的人吃顿饭。给他写一封信，当着所有人念。送他一样带一辈子的小东西，比如一块表。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 39,
      doneAt: 0
    },
    {
      id: 'w63',
      target: '爷爷',
      title: '在他忌日做一件纪念的事',
      category: '仪式',
      why: '爷爷的忌日我总是过了才想起来。不是不想他，是没人提醒我。日子一天天过，他走的那天变成了日历上最普通的一天。不应该的。',
      plan: '在日历上标好日期，设每年提醒。那天去他喜欢的茶馆坐一坐，点壶他爱喝的铁观音。不在朋友圈发什么，自己在心里跟他说几句话。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 105,
      doneAt: 0
    },
    {
      id: 'w64',
      target: '家族',
      title: '把家谱整理出来',
      category: '仪式',
      why: '族谱上到我爷爷那辈就断了。再往上，没人说得清。我们这个姓在这个村子待了多少代、从哪里来，都在那个被虫蛀的老本子上，再不整理就彻底看不清了。',
      plan: '过年回老家，把老族谱拍照存档。找村里老人帮忙补齐缺失的部分。用电脑重新排版打印，每家发一本。趁还认得字的老人们都在。',
      done: '',
      status: ST_TODO,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 84,
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
