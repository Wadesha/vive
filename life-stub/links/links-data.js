(function (global) {
  'use strict';

  /*
   * 引用网 — 跨子产品引用的总览与反向索引
   *
   * v0.8 串联层：六大子产品第一次被"网络化"。
   * 当前已有的跨模块引用字段：
   *   - 历程簿 journey_data[].relatedEcho   → 回声库 echo id
   *   - 回信亭  echo_mail_data[].fromEcho    → 回声库 echo id
   *
   * 直接读 localStorage 聚合，避免依赖各子产品全局对象被加载。
   * 所有读取都做了 null/异常兜底，任一子产品未初始化也不影响总览。
   */

  // ── 各子产品 localStorage key ──
  var KEYS = {
    echo: 'echo_archive_data',
    journey: 'journey_data',
    mail: 'echo_mail_data',
    wishlist: 'wishlist_data',
    capsule: 'time_capsule_data',
    stub: 'life_stub_data'
  };

  // ── 子产品展示信息 ──
  var SOURCES = {
    echo:    { label: '回声库',   color: '#8B7355', href: '../echo/echo.html' },
    journey: { label: '历程簿',   color: '#6B5D4D', href: '../journey/journey.html' },
    mail:    { label: '回信亭',   color: '#A0522D', href: '../mail/mail.html' },
    wishlist:{ label: '心愿册',   color: '#9B7B47', href: '../wishlist/wishlist.html' },
    capsule: { label: '时光胶囊', color: '#7A6A55', href: '../capsule/capsule.html' },
    stub:    { label: '存根簿',   color: '#5C4A3A', href: '../demo.html' }
  };

  function safeParse(raw, fallback) {
    if (!raw) return fallback;
    try { return JSON.parse(raw); } catch (e) { return fallback; }
  }

  function readLS(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  // ── 读取各子产品条目（归一为统一结构）──
  function getEchoItems() {
    return safeParse(readLS(KEYS.echo), []);
  }

  function getJourneyItems() {
    var items = safeParse(readLS(KEYS.journey), []);
    return items.map(function (i) {
      return {
        source: 'journey',
        id: i.id,
        title: i.content ? (i.content.slice(0, 28) + (i.content.length > 28 ? '…' : '')) : '(空)',
        preview: i.content || '',
        mood: i.mood || '',
        stage: i.stage || '',
        refEcho: i.relatedEcho || '',
        createdAt: i.createdAt || 0
      };
    });
  }

  function getMailItems() {
    var items = safeParse(readLS(KEYS.mail), []);
    return items.map(function (i) {
      var label = i.to ? ('致 · ' + i.to) : '(无收件人)';
      return {
        source: 'mail',
        id: i.id,
        title: label,
        preview: i.content || '',
        type: i.type || '',
        refEcho: i.fromEcho || '',
        createdAt: i.createdAt || 0
      };
    });
  }

  function getWishlistItems() {
    var items = safeParse(readLS(KEYS.wishlist), []);
    return items.map(function (i) {
      return {
        source: 'wishlist',
        id: i.id,
        title: i.title || '(未命名心愿)',
        preview: (i.why || i.plan || i.done || ''),
        target: i.target || '',
        status: i.status || '',
        refEcho: '',
        createdAt: i.createdAt || 0
      };
    });
  }

  function getCapsuleItems() {
    var items = safeParse(readLS(KEYS.capsule), []);
    return items.map(function (i) {
      return {
        source: 'capsule',
        id: i.id,
        title: i.title || '(未命名胶囊)',
        preview: i.letter ? (i.letter.slice(0, 40) + '…') : '',
        type: i.type || '',
        refEcho: '',
        createdAt: i.createdAt || 0
      };
    });
  }

  function getStubItems() {
    var stubs = safeParse(readLS(KEYS.stub), []);
    var out = [];
    stubs.forEach(function (s) {
      out.push({
        source: 'stub',
        id: s.id,
        title: s.name || '(未命名存根簿)',
        preview: '为 ' + (s.name || '某人') + ' 建立的存根簿',
        refEcho: '',
        createdAt: 0
      });
    });
    return out;
  }

  // ── 全部条目（不含 echo，echo 作为被引用方单独索引）──
  function getAllEntries() {
    return [].concat(
      getJourneyItems(),
      getMailItems(),
      getWishlistItems(),
      getCapsuleItems(),
      getStubItems()
    );
  }

  // ── 硬编码引用：手工构建的跨模块引用网络 ──
  var HARDCODED_REFS = [
    // ===== 历程簿 → 回声库（8条）=====
    {
      from: { source: 'journey', id: 'j14', title: '爸爸在花园剪枝', preview: '爸爸在花园剪枝，停下来讲他小时候的事。' },
      to:   { source: 'echo', id: 'e32', title: '最好的悼词，是具体的细节', theme: ['记录'], excerpt: '具体的细节，能让一个消失的人瞬间立起来。' }
    },
    {
      from: { source: 'journey', id: 'j16', title: '听到歌词突然想打电话', preview: '听到一首老歌，突然想打电话给好久没联系的人。' },
      to:   { source: 'echo', id: 'e8', title: '我还有好多好多话，没来得及和她讲', theme: ['亲情'], excerpt: '我还有好多好多话，没来得及和她讲。' }
    },
    {
      from: { source: 'journey', id: 'j17', title: '超市里的老人', preview: '超市里看到一位老人推着购物车，老伴戴着氧气面罩。' },
      to:   { source: 'echo', id: 'e41', title: '我希望让他们感受到，亲人离世后我也能继续好好生活', theme: ['记录'], excerpt: '用美食作为载体，分享和母亲曾经吃过的菜肴。' }
    },
    {
      from: { source: 'journey', id: 'j5', title: '想起外婆的桂花糕', preview: '想起外婆做的桂花糕，那味道再也尝不到了。' },
      to:   { source: 'echo', id: 'e1', title: '背影', theme: ['亲情'], excerpt: '我与父亲不相见已二年余了。' }
    },
    {
      from: { source: 'journey', id: 'j9', title: '地铁站的广播', preview: '地铁站的广播，让我想起了离别的感觉。' },
      to:   { source: 'echo', id: 'e7', title: '亲人的离去不是一场暴雨，而是一生的潮湿', theme: ['亲情'], excerpt: '亲人的离去不是一场暴雨，而是一生的潮湿。' }
    },
    {
      from: { source: 'journey', id: 'j3', title: '同事的搪瓷杯', preview: '同事递茶用的旧搪瓷杯，是她爷爷的遗物。' },
      to:   { source: 'echo', id: 'e18', title: '她走后，我把她用过的茶杯留了三年没洗', theme: ['爱情'], excerpt: '器物是最后的锚点。' }
    },
    {
      from: { source: 'journey', id: 'j13', title: '翻出高中校服', preview: '翻出高中校服，口袋里还有当年的数学草稿纸。' },
      to:   { source: 'echo', id: 'e55', title: '走不出来，多年后还是会哭，是正常的', theme: ['告别仪式'], excerpt: '哀伤不需要被战胜，它需要被接住。' }
    },
    {
      from: { source: 'journey', id: 'j15', title: '儿子的小书包', preview: '收拾儿子的小书包，翻出他三岁画的全家福。' },
      to:   { source: 'echo', id: 'e60', title: '呼兰河传', theme: ['乡土'], excerpt: '以前住着我的祖父，现在埋着我的祖父。' }
    },

    // ===== 心愿册 → 回声库（6条）=====
    {
      from: { source: 'wishlist', id: 'w31', title: '拍一张正经的合照', preview: '翻遍手机，没一张和妈的正经合照。' },
      to:   { source: 'echo', id: 'e46', title: '与未来自己对话的人，更愿意长期储蓄', theme: ['自我对话'], excerpt: '能清晰描绘未来自我的人，更倾向于长期储蓄。' }
    },
    {
      from: { source: 'wishlist', id: 'w33', title: '每周打一次不敷衍的电话', preview: '每周打电话不超过5分钟，永远是"吃了没"。' },
      to:   { source: 'echo', id: 'e28', title: '我与地坛（关于自己）', theme: ['自我'], excerpt: '剩下的就是怎样活的问题了。' }
    },
    {
      from: { source: 'wishlist', id: 'w38', title: '听完她说的每句话', preview: '妈打电话来，我没听完就说"没办法"。' },
      to:   { source: 'echo', id: 'e18', title: '她走后，我把她用过的茶杯留了三年没洗', theme: ['爱情'], excerpt: '器物是最后的锚点。' }
    },
    {
      from: { source: 'wishlist', id: 'w42', title: '下次发火前先停下来', preview: '把最坏的脾气留给最亲的人。' },
      to:   { source: 'echo', id: 'e12', title: '奶奶的三餐要有奶茶，顿顿要有咸菜', theme: ['亲情'], excerpt: '最鲜活的记忆，是那些"不完美"的日常细节。' }
    },
    {
      from: { source: 'wishlist', id: 'w45', title: '先低头不丢人', preview: '和弟弟因为家产翻脸五年，过年饭桌上多了副空碗筷。' },
      to:   { source: 'echo', id: 'e53', title: '活着不是为了写作，而写作是为了活着', theme: ['自我'], excerpt: '记录是为了活着，不是活着为了记录。' }
    },
    {
      from: { source: 'wishlist', id: 'w58', title: '给她买一件用心的礼物', preview: '有人给父母买羊绒大衣，妈穿上拍了照写"闺女买的"。' },
      to:   { source: 'echo', id: 'e31', title: '我妈当年那句唠叨，我十年后才听懂', theme: ['后知后觉'], excerpt: '母亲的唠叨，是提前为没有她的日子做预案。' }
    },

    // ===== 回信亭 → 回声库（4条）=====
    {
      from: { source: 'mail', id: 'm10', title: '给高三的自己', preview: '平行我写来：三年了，我还是会在超市冰柜前停下。' },
      to:   { source: 'echo', id: 'e15', title: '陪伴式访谈——让家人来提问', theme: ['家族'], excerpt: '让家人来提问，亲人之间的对话最自然。' }
    },
    {
      from: { source: 'mail', id: 'm12', title: '来自平行我', preview: '恭喜你到了我一直在用第三人称想象的那一天。' },
      to:   { source: 'echo', id: 'e56', title: '它走了以后，我每次开门还是会下意识喊它的名字', theme: ['失去宠物'], excerpt: '习惯的下意识动作，是记忆最顽固的载体。' }
    },
    {
      from: { source: 'mail', id: 'm2', title: '关于倔强', preview: '—— 史铁生写给我的信。倔强了三十年，懂了时已来不及。' },
      to:   { source: 'echo', id: 'e3', title: '给亡妇', theme: ['爱情'], excerpt: '谦，日子真快，一眨眼你已经死了三个年头了。' }
    },
    {
      from: { source: 'mail', id: 'm9', title: '关于错过', preview: '不知道你是哪一天读到这封信，但那天你一定很累。' },
      to:   { source: 'echo', id: 'e4', title: '为了忘却的记念', theme: ['友情'], excerpt: '我早已想写一点文字，来记念几个青年的作家。' }
    },

    // ===== 时光胶囊 → 回声库（3条）=====
    {
      from: { source: 'capsule', id: 'cap-14', title: '给十年后的自己', preview: '你好，十年后的我。我想问你几个问题。' },
      to:   { source: 'echo', id: 'e52', title: '味道是最说不清楚的', theme: ['记忆'], excerpt: '味道是最说不清楚的，味道不能写只能闻。' }
    },
    {
      from: { source: 'capsule', id: 'cap-13', title: '给刚出生的女儿', preview: '我的小宝贝，今天你出生第七天。' },
      to:   { source: 'echo', id: 'e26', title: '我在葬礼上没哭，三个月后在超市哭了', theme: ['生死告别'], excerpt: '悲伤不在该来的时候来。' }
    },
    {
      from: { source: 'capsule', id: 'cap-16', title: '父亲走的第七天', preview: '爸，你走了七天。家里很安静。' },
      to:   { source: 'echo', id: 'e29', title: '我把三十岁的日记翻出来看', theme: ['自我'], excerpt: '如果不写下来，连自己都会否认它发生过。' }
    },

    // ===== 存根簿 → 回声库（2条）=====
    {
      from: { source: 'stub', id: 'stub-3', title: '外公的象棋', preview: '修车大爷补胎前总爱把内胎打满气，放在水盆里转圈。' },
      to:   { source: 'echo', id: 'e19', title: '知己一人谁是', theme: ['友情'], excerpt: '别语悔分明。' }
    },
    {
      from: { source: 'stub', id: 'stub-1', title: '他的茶', preview: '他喝茶时习惯先把杯子转三圈，再轻轻吹一下。' },
      to:   { source: 'echo', id: 'e33', title: '有过我的车辙的地方，也都有过母亲的脚印', theme: ['亲情'], excerpt: '最深的母爱是"寻找"。' }
    }
  ];

  // ── 引用关系：from(任意子产品) → to(echo) ──
  function getReferences() {
    var entries = getAllEntries();
    var echoMap = {};
    getEchoItems().forEach(function (e) { echoMap[e.id] = e; });

    var refs = [];
    entries.forEach(function (en) {
      if (en.refEcho && echoMap[en.refEcho]) {
        var ec = echoMap[en.refEcho];
        refs.push({
          from: { source: en.source, id: en.id, title: en.title, preview: en.preview },
          to:   { id: ec.id, title: ec.title, author: ec.author, theme: ec.theme, excerpt: ec.excerpt }
        });
      }
    });
    return refs.concat(HARDCODED_REFS);
  }

  // ── 反向引用：echo → 谁在引用我 ──
  function getReverseReferences(echoId) {
    var entries = getAllEntries();
    var dynamic = entries.filter(function (en) { return en.refEcho === echoId; });
    var hardcoded = HARDCODED_REFS
      .filter(function (r) { return r.to.id === echoId; })
      .map(function (r) { return r.from; });
    return dynamic.concat(hardcoded);
  }

  // ── 统计 ──
  function stats() {
    var echo = getEchoItems();
    var journey = getJourneyItems();
    var mail = getMailItems();
    var wishlist = getWishlistItems();
    var capsule = getCapsuleItems();
    var stub = getStubItems();

    var counts = {
      echo: echo.length,
      journey: journey.length,
      mail: mail.length,
      wishlist: wishlist.length,
      capsule: capsule.length,
      stub: stub.length
    };

    var refs = getReferences();
    var referencedEchoIds = {};
    refs.forEach(function (r) { referencedEchoIds[r.to.id] = true; });

    return {
      counts: counts,
      totalEntries: counts.journey + counts.mail + counts.wishlist + counts.capsule + counts.stub,
      totalReferences: refs.length,
      referencedEchoCount: Object.keys(referencedEchoIds).length,
      echoTotal: counts.echo
    };
  }

  global.LinkNet = {
    SOURCES: SOURCES,
    getEchoItems: getEchoItems,
    getAllEntries: getAllEntries,
    getReferences: getReferences,
    getReverseReferences: getReverseReferences,
    stats: stats
  };
})(window);
