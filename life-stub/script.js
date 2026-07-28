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
