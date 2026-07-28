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
