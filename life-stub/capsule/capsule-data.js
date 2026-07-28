(function (global) {
  'use strict';

  var STORAGE_KEY = 'time_capsule_data';

  var SEED = [
    {
      id: 'cap-1',
      title: '给一年后的自己',
      type: 'self',
      letter: '此刻的你，正坐在阳台的藤椅上，窗外是初夏的风。\n\n刚泡了一杯碧螺春，茶叶在玻璃杯里翻上来，像很多年前那个人做的那样。\n\n你还记得吗？那天在菜场，你脱口而出"两块嫩豆腐"，然后自己愣住了。\n\n如果一年后的你再看到这段话，希望你已经不再觉得难过——不是忘记了，而是那些痕迹，终于变成了你身上安稳的一部分。',
      createdAt: Date.now() - 86400000 * 30,
      unlockAt: Date.now() + 86400000 * 335,
      mood: 'warm',
      opened: false
    },
    {
      id: 'cap-2',
      title: '结婚二十周年纪念',
      type: 'anniversary',
      letter: '今天是我们结婚二十周年。\n\n你说要做一桌菜，还是老规矩：先盐后糖再酱油。\n\n我站在厨房门口看你，阳光从窗户照进来，落在你微微驼的背上。\n\n这封信，我要在我们金婚那天打开。\n\n那时候我们都老了，你还会记得今天吗？',
      createdAt: Date.now() - 86400000 * 100,
      unlockAt: Date.now() + 86400000 * 365 * 30,
      mood: 'happy',
      opened: false
    },
    {
      id: 'cap-3',
      title: '爸爸的茶垢瓷杯',
      type: 'memory',
      letter: '今天整理书房，翻到了那只带茶垢的旧瓷杯。\n\n杯口的裂纹还在，你说那是"岁月的吻痕"。\n\n我把它擦干净了，放在书架最显眼的地方。\n\n以后每次看到它，就当你又来坐过了。',
      createdAt: Date.now() - 86400000 * 10,
      unlockAt: Date.now() + 86400000 * 365,
      mood: 'soft',
      opened: false
    },
    {
      id: 'cap-4',
      title: '致女儿十八岁',
      type: 'child',
      letter: '亲爱的女儿：\n\n今天你八岁，在客厅地上搭积木，搭到一半又推翻重来。\n\n我在旁边看着你，想把这一幕记下来，等你十八岁生日那天再看。\n\n那时候你可能已经嫌我啰嗦了，可能有了自己的小秘密，可能觉得我什么都不懂。\n\n但请记得——\n\n你搭积木时认真抿嘴的样子，是妈妈这辈子见过最美的风景。',
      createdAt: Date.now() - 86400000 * 5,
      unlockAt: Date.now() + 86400000 * 365 * 10,
      mood: 'warm',
      opened: false
    },
    {
      id: 'cap-5',
      title: '给三年前的我',
      type: 'self',
      letter: '三年前的你刚接到体检报告，在车里坐了两个小时没发动。\n\n我想提前告诉你：那个最怕的结果没有发生。但这三年你因为害怕，做了很多后悔的事——对妈妈发火、推掉所有饭局、半夜查资料查到天亮。\n\n如果可以，请你现在就放下手机，给妈妈打个电话。\n\n她比你更怕，但她什么都不说。',
      createdAt: Date.now() - 86400000 * 1095,
      unlockAt: Date.now() - 86400000 * 1,
      mood: 'sad',
      opened: false
    },
    {
      id: 'cap-6',
      title: '我们的第一次旅行',
      type: 'lover',
      letter: '今天是我们第一次一起旅行的第七年。\n\n你还记得吗，青岛那家小旅馆漏雨，我们把所有毛巾铺在床上接水，笑到肚子疼。\n\n你说"以后老了我们也来这住"。我当时没接话，怕给不了你"以后"。\n\n七年了，我们还在。这封信我埋在七年后开启，到那时你拿出来念给我听，看我们还算不算数。',
      createdAt: Date.now() - 86400000 * 200,
      unlockAt: Date.now() + 86400000 * 365 * 7,
      mood: 'happy',
      opened: false
    },
    {
      id: 'cap-7',
      title: '给十年后的老友',
      type: 'someone',
      letter: '老张：\n\n你总说自己记性差，怕老了把我们这些朋友都忘了。\n\n我把这封信封到十年后。如果你还能打开它，说明你赢了；如果是我替你打开，那我就念给你听——\n\n2008年大雪，你骑电瓶车来给我送药，摔在小区门口，膝盖缝了七针。\n\n你趴在沙发上还嘴硬："这药贵，不能耽误。"\n\n这就是你。十年后也请别变。',
      createdAt: Date.now() - 86400000 * 60,
      unlockAt: Date.now() + 86400000 * 365 * 10,
      mood: 'soft',
      opened: false
    },
    {
      id: 'cap-8',
      title: '父亲节快乐',
      type: 'anniversary',
      letter: '爸：\n\n你走后的第一个父亲节。我在你常坐的位置放了一杯茶，茶垢瓷杯。\n\n妈妈说你最烦别人给你过节，但我知道她还是买了你爱吃的酱牛肉。\n\n这封信我封一年。明年今日，希望我已经学会不在这天哭。\n\n如果还哭，也没关系——你本来就嫌我坚强得不像话。',
      createdAt: Date.now() - 86400000 * 15,
      unlockAt: Date.now() + 86400000 * 350,
      mood: 'calm',
      opened: false
    },
    {
      id: 'cap-9',
      title: '外公的怀表',
      type: 'memory',
      letter: '今天从外婆家带回一只旧怀表，外公走了十年，外婆一直压在枕头底下。\n\n她说："你拿去，他最疼你。"\n\n表早停了，指针停在三点十七分。我不知道那是什么时刻——是他走的点，还是他第一次抱我的点。\n\n这封信封五年。五年后我再打开，希望我已经打听到了三点十七分对他意味着什么。',
      createdAt: Date.now() - 86400000 * 3,
      unlockAt: Date.now() + 86400000 * 365 * 5,
      mood: 'soft',
      opened: false
    },
    {
      id: 'cap-10',
      title: '已经可以拆的那封',
      type: 'self',
      letter: '这是一封测试胶囊——你可以现在就拆开它，看看"拆封仪式"长什么样。\n\n写于一个普通的下午，窗外有风，茶还热着。\n\n如果你正读到这行字，说明时间到了。希望你比写下这行字的我，过得更好一点点。哪怕只是一点点。',
      createdAt: Date.now() - 86400000 * 40,
      unlockAt: Date.now() - 86400000 * 10,
      mood: 'calm',
      opened: false
    },
    {
      id: 'cap-11',
      title: '给搬家那天留的',
      type: 'memory',
      letter: '今天我们搬离住了十二年的老房子。\n\n打包时翻出很多东西：女儿画的全家福贴在冰箱上，你当年写给我的情书夹在旧相册里，阳台的绿萝已经枯了一半。\n\n我把这封信封起来，等五年后搬回来那天打开。希望那时候的院子里，你种的桂花树已经长到二楼了。',
      createdAt: Date.now() - 86400000 * 30,
      unlockAt: Date.now() + 86400000 * 365 * 5,
      mood: 'soft',
      opened: false
    },
    {
      id: 'cap-12',
      title: '结婚十周年',
      type: 'anniversary',
      letter: '老婆，今天是我们结婚十周年。\n\n你在厨房炖了汤，还是用那个掉了漆的砂锅。客厅里放着你刚从花店买回来的满天星，插在玻璃花瓶里。\n\n这十年我们吵过架、冷战过、也一起熬过最难的那段日子。\n\n下一个十年，我还想和你一起过。这封信写给那时的我们，看看我们有没有白发，还会不会为了谁洗碗吵架。',
      createdAt: Date.now() - 86400000 * 100,
      unlockAt: Date.now() + 86400000 * 365 * 10,
      mood: 'happy',
      opened: false
    },
    {
      id: 'cap-13',
      title: '给刚出生的女儿',
      type: 'child',
      letter: '我的小宝贝：\n\n今天你出生第七天，躺在婴儿床里攥着小拳头睡觉。你哭起来声音很大，护士说"这孩子有劲"。\n\n妈妈把这封信封起来，等你十八岁生日那天给你。那时候你可能在准备高考，可能已经有了喜欢的男孩，可能觉得妈妈管得太多。\n\n但无论你变成什么样，请记得——你来到这个世界的那天，是妈妈这辈子最幸福的一天。',
      createdAt: Date.now() - 86400000 * 3,
      unlockAt: Date.now() + 86400000 * 365 * 18,
      mood: 'warm',
      opened: false
    },
    {
      id: 'cap-14',
      title: '给十年后的自己',
      type: 'self',
      letter: '你好，十年后的我。\n\n写这封信的时候，我三十二岁，在一家互联网公司做产品经理，租住在五环外的一居室，每天通勤两小时。\n\n我想问你几个问题：你还坚持跑步吗？你还会在看书时做笔记吗？你有没有变成自己讨厌的那种大人？\n\n如果那时候的你很成功——恭喜；如果不那么顺利——也没关系，你从来都是打不死的。',
      createdAt: Date.now() - 86400000 * 20,
      unlockAt: Date.now() + 86400000 * 365 * 10,
      mood: 'warm',
      opened: false
    },
    {
      id: 'cap-15',
      title: '给老友阿杰',
      type: 'friend',
      letter: '阿杰：\n\n上次见面是去年冬天，你说要去新疆开卡车，一去就是半年。我笑你"中年人叛逆"。\n\n这封信我封八年。如果那时候我们还在联系，你应该已经跑遍了西北的戈壁滩，脸晒得比我还黑。\n\n如果我们失联了，就当这封信从没写过。但如果你还能打开它——记得找我喝酒，我存了一瓶好白酒，等你。',
      createdAt: Date.now() - 86400000 * 60,
      unlockAt: Date.now() + 86400000 * 365 * 8,
      mood: 'happy',
      opened: false
    },
    {
      id: 'cap-16',
      title: '父亲走的第七天',
      type: 'regret',
      letter: '爸：\n\n你走了七天。家里很安静，妈妈每天坐在阳台上发呆，不说话。\n\n我有很多话想跟你说。关于我辞掉公务员去做独立设计师的事，关于我想把房子卖了换个小的，关于我终于学会了你做的红烧肉。\n\n但这些话你都听不到了。\n\n这封信我封一年。明年的今天，希望我能把它念给你听，在梦里。',
      createdAt: Date.now() - 86400000 * 7,
      unlockAt: Date.now() + 86400000 * 365,
      mood: 'sad',
      opened: false
    },
    {
      id: 'cap-17',
      title: '给高考前的自己',
      type: 'self',
      letter: '你好，十八岁的我。\n\n现在你正坐在书桌前做模拟卷，数学又考砸了，在数学卷子上画了一只小乌龟。\n\n我是十年后的你。我想告诉你：高考不是人生的终点，它甚至算不上一个重要的节点。\n\n你会去一个普通的大学，学一个不那么喜欢的专业，然后在毕业后的几年里慢慢找到自己。\n\n别害怕。那些你以为天大的事，十年后都不值一提。',
      createdAt: Date.now() - 86400000 * 365,
      unlockAt: Date.now() + 86400000 * 365 * 2,
      mood: 'warm',
      opened: false
    },
    {
      id: 'cap-18',
      title: '金婚纪念',
      type: 'anniversary',
      letter: '老头子：\n\n今天是我们结婚五十年。孩子们张罗了一大桌子菜，你穿了那件洗得发白的中山装，扣子还是我去年给你缝的。\n\n五十年了，我们吵过无数次架，你摔过碗，我回回过娘家，但每次都和好了。\n\n这封信封十年，等我们六十周年的时候打开。到那时候，如果我先走了，你要替我念完；如果你先走了，我在等你。',
      createdAt: Date.now() - 86400000 * 50,
      unlockAt: Date.now() + 86400000 * 365 * 10,
      mood: 'warm',
      opened: false
    },
    {
      id: 'cap-19',
      title: '送儿子上大学那天',
      type: 'child',
      letter: '儿子：\n\n今天送你去火车站，你背着大书包，手里攥着录取通知书。过安检的时候你回头看了我一眼，挥挥手说"爸，我走了"。\n\n我没跟你说"好好学习"，也没说"常回家看看"。我只是拍了拍你的肩膀。\n\n这封信我封四年。等你大学毕业那天打开。希望那时候你已经变成了一个独立、自信、对世界充满好奇的年轻人。\n\n爸爸爱你。',
      createdAt: Date.now() - 86400000 * 2,
      unlockAt: Date.now() + 86400000 * 365 * 4,
      mood: 'grateful',
      opened: false
    },
    {
      id: 'cap-20',
      title: '给失意时的自己',
      type: 'self',
      letter: '嗨。\n\n如果你正在看这封信，说明你又处在人生的低谷了。可能是工作不顺，可能是感情受挫，可能是家里出了事。\n\n我只想跟你说一句话：这一切都会过去的。\n\n你以前也失意过，那时候觉得天都塌了，后来不也过来了吗？\n\n泡杯热茶，早点睡。明天的事明天再说。你已经做得很好了。',
      createdAt: Date.now() - 86400000 * 30,
      unlockAt: Date.now() + 86400000 * 365 * 2,
      mood: 'warm',
      opened: false
    },
    {
      id: 'cap-21',
      title: '给那个没追上的人',
      type: 'regret',
      letter: '林晓：\n\n你好。我们已经五年没见了。\n\n我写这封信不是为了打扰你，而是想跟那个二十岁的自己和解。那年我喜欢你，你说"我们还是做朋友吧"。\n\n我花了三年才放下。现在我有了自己的家庭，过得很幸福。\n\n这封信封一年。明年的今天，希望我已经能笑着看完它，而不是心里发紧。\n\n祝你也幸福。',
      createdAt: Date.now() - 86400000 * 120,
      unlockAt: Date.now() + 86400000 * 365,
      mood: 'regret',
      opened: false
    },
    {
      id: 'cap-22',
      title: '毕业五周年',
      type: 'friend',
      letter: '各位老铁：\n\n毕业五年了。你们还好吗？\n\n我在深圳做程序员，每天加班到九点，头发掉了三分之一。大熊在老家当公务员，已经发福了二十斤。阿芳当妈妈了，朋友圈全是娃。\n\n这封信封五年，等毕业十周年的时候打开。希望那时候我们能凑齐十个人，在学校门口的烧烤摊再喝一次酒。\n\n别忘了我们当年说的："苟富贵，勿相忘。"\n\n——你们的老五',
      createdAt: Date.now() - 86400000 * 15,
      unlockAt: Date.now() + 86400000 * 365 * 5,
      mood: 'happy',
      opened: false
    },
    {
      id: 'cap-23',
      title: '给妈妈的最后一封信',
      type: 'regret',
      letter: '妈：\n\n你走了三年了。我常常在厨房里想起你，想起你做的番茄炒蛋，想起你总把鸡腿夹给我自己啃鸡皮。\n\n我最后悔的事，是你病重那年我没能辞掉工作陪你。我总说"等忙完这阵"，结果"这阵"永远没忙完。\n\n这封信我封三年。三年后我再打开它，希望我已经学会了珍惜眼前人，不再把"等有空"挂在嘴边。\n\n妈，对不起。我爱你。',
      createdAt: Date.now() - 86400000 * 90,
      unlockAt: Date.now() + 86400000 * 365 * 3,
      mood: 'sad',
      opened: false
    },
    {
      id: 'cap-24',
      title: '给创业失败的自己',
      type: 'self',
      letter: '你好，失败者。\n\n是的，你创业失败了。烧光了积蓄，欠了一屁股债，女朋友也走了。\n\n但这不是结束。\n\n我想告诉你：你才三十岁，身体健康，头脑灵活，还有一帮愿意帮你的朋友。这些是你最大的本钱。\n\n这封信封三年。三年后打开，看看你是不是已经重新站起来了。我相信你一定可以。\n\n因为你从来就不是一个会被打倒的人。',
      createdAt: Date.now() - 86400000 * 45,
      unlockAt: Date.now() + 86400000 * 365 * 3,
      mood: 'grateful',
      opened: false
    },
    {
      id: 'cap-25',
      title: '给二十年后的全家福',
      type: 'memory',
      letter: '今天是小女儿五岁生日，我们在客厅拍了全家福：你、我、大儿子、小女儿，还有外婆。\n\n外婆已经八十岁了，坐在中间笑得眼睛眯成一条缝。她说"能看到你们这样，我死也瞑目了"。\n\n这封信封二十年。那时候小女儿二十五岁了，可能已经嫁人；大儿子三十岁，可能也有了自己的孩子。\n\n希望那时候的全家福，还是这么热闹，这么温暖。\n\n时间会走，但爱不会。',
      createdAt: Date.now() - 86400000 * 5,
      unlockAt: Date.now() + 86400000 * 365 * 20,
      mood: 'warm',
      opened: false
    }
  ];

  function uid() {
    return 'cap-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
  }

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

  function save(capsules) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(capsules));
  }

  function initIfEmpty() {
    if (!load()) {
      save(deepClone(SEED));
    }
  }

  function listCapsules() {
    initIfEmpty();
    return load();
  }

  function getCapsule(id) {
    var list = listCapsules();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function addCapsule(data) {
    var list = listCapsules();
    var cap = {
      id: uid(),
      title: data.title || '未命名胶囊',
      type: data.type || 'self',
      letter: data.letter || '',
      createdAt: Date.now(),
      unlockAt: data.unlockAt || (Date.now() + 86400000),
      mood: data.mood || 'soft',
      opened: false
    };
    list.unshift(cap);
    save(list);
    return cap;
  }

  function openCapsule(id) {
    var list = listCapsules();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        list[i].opened = true;
        save(list);
        return list[i];
      }
    }
    return null;
  }

  function deleteCapsule(id) {
    var list = listCapsules();
    list = list.filter(function (c) { return c.id !== id; });
    save(list);
  }

  function resetToSeed() {
    save(deepClone(SEED));
  }

  global.TimeCapsule = {
    listCapsules: listCapsules,
    getCapsule: getCapsule,
    addCapsule: addCapsule,
    openCapsule: openCapsule,
    deleteCapsule: deleteCapsule,
    resetToSeed: resetToSeed
  };
})(window);
