(function () {
  // ── 滚动渐入动画（首页 & 关于页使用） ──
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  var pageEls = document.querySelectorAll('.stub-page, .about-block');
  pageEls.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(el);
  });

  var style = document.createElement('style');
  style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);

  // ── 导航平滑滚动 ──
  var navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ── Hero 向下滚动 ──
  var heroScroll = document.querySelector('.hero-scroll');
  if (heroScroll) {
    heroScroll.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector('#dimensions');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ── 翻开存根簿按钮 ──
  var enterBtn = document.querySelector('.enter-btn');
  if (enterBtn) {
    enterBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var href = this.getAttribute('href');
      if (href) {
        var parts = href.split('#');
        window.location.href = parts[0];
        if (parts[1]) {
          setTimeout(function () {
            var target = document.querySelector('#' + parts[1]);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    });
  }

  // ── 首页速记：直接写，直接存到历程簿 ──
  var $todayQuick = document.getElementById('todayQuickText');
  if ($todayQuick && typeof Journey !== 'undefined') {
    var $todayMood = document.getElementById('todayQuickMood');
    var $todaySave = document.getElementById('todayQuickSave');
    var $todayHint = document.getElementById('todayQuickHint');

    function saveTodayQuick() {
      var text = $todayQuick.value.trim();
      if (!text) { $todayQuick.focus(); return; }
      Journey.addQuick({
        content: text,
        mood: $todayMood ? $todayMood.value : '',
        relatedEcho: ''
      });
      $todayQuick.value = '';
      if ($todayMood) $todayMood.value = '';
      if ($todayHint) {
        $todayHint.hidden = false;
        setTimeout(function () { $todayHint.hidden = true; }, 2000);
      }
    }

    if ($todaySave) $todaySave.addEventListener('click', saveTodayQuick);
    $todayQuick.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        saveTodayQuick();
      }
    });
  }

  // ── 首页一键打卡：心情标签 ──
  var $punchTags = document.getElementById('todayPunchTags');
  if ($punchTags && typeof Journey !== 'undefined') {
    $punchTags.addEventListener('click', function (e) {
      var btn = e.target.closest('.punch-tag');
      if (!btn) return;
      Journey.addQuick({
        content: btn.getAttribute('data-text'),
        mood: btn.getAttribute('data-mood'),
        relatedEcho: ''
      });
      var orig = btn.textContent;
      btn.classList.add('punched');
      btn.textContent = '✓ 已记录';
      setTimeout(function () {
        btn.classList.remove('punched');
        btn.textContent = orig;
      }, 1200);
    });
  }

  // ── 我的痕迹：读取 localStorage 统计 ──
  function loadMyStats() {
    var stats = {
      echo: 0, journey: 0, wish: 0, capsule: 0, mail: 0, stub: 0
    };
    try {
      var ed = JSON.parse(localStorage.getItem('echo_archive_data') || 'null');
      if (Array.isArray(ed)) stats.echo = ed.length;
    } catch (e) {}
    try {
      var jd = JSON.parse(localStorage.getItem('journey_data') || 'null');
      if (Array.isArray(jd)) stats.journey = jd.length;
    } catch (e) {}
    try {
      var wd = JSON.parse(localStorage.getItem('wishlist_data') || 'null');
      if (Array.isArray(wd)) stats.wish = wd.length;
    } catch (e) {}
    try {
      var cd = JSON.parse(localStorage.getItem('time_capsule_data') || 'null');
      if (Array.isArray(cd)) stats.capsule = cd.length;
    } catch (e) {}
    try {
      var md = JSON.parse(localStorage.getItem('echo_mail_data') || 'null');
      if (Array.isArray(md)) stats.mail = md.length;
    } catch (e) {}
    try {
      var sd = JSON.parse(localStorage.getItem('life_stub_data') || 'null');
      if (Array.isArray(sd)) stats.stub = sd.length;
    } catch (e) {}

    // 如果 localStorage 是空的（首次访问），显示 seed 数据的统计
          if (stats.echo === 0) stats.echo = 80;
          if (stats.journey === 0) stats.journey = 20;
          if (stats.wish === 0) stats.wish = 64;
          if (stats.capsule === 0) stats.capsule = 25;
          if (stats.mail === 0) stats.mail = 15;
          if (stats.stub === 0) stats.stub = 20;

    var el = function (id) { return document.getElementById(id); };
    var animateNum = function ($el, target) {
      if (!$el) return;
      var cur = 0;
      var step = Math.max(1, Math.floor(target / 20));
      var timer = setInterval(function () {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(timer); }
        $el.textContent = cur;
      }, 30);
    };

    animateNum(el('statEcho'), stats.echo);
    animateNum(el('statJourney'), stats.journey);
    animateNum(el('statWish'), stats.wish);
    animateNum(el('statCapsule'), stats.capsule);
    animateNum(el('statMail'), stats.mail);
    animateNum(el('statStub'), stats.stub);
  }
  loadMyStats();

  // ── 纸纹理视差 ──
  var paperTexture = document.querySelector('.paper-texture');
  if (paperTexture) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var scrollY = window.pageYOffset;
          paperTexture.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
          ticking = false;
        });
        ticking = true;
      }
    });
  }
})();
