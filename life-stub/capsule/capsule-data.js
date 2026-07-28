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
