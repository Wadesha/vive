(function () {
  var tabs = document.querySelectorAll('.tab');
  var panels = document.querySelectorAll('.tab-panel');

  if (tabs.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = this.getAttribute('data-tab');
        tabs.forEach(function (t) { t.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        this.classList.add('active');
        var panel = document.getElementById(target);
        if (panel) panel.classList.add('active');
      });
    });
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  var pageEls = document.querySelectorAll('.stub-page, .entry, .about-block, .anchor-item');
  pageEls.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(el);
  });

  var style = document.createElement('style');
  style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);

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

  var heroScroll = document.querySelector('.hero-scroll');
  if (heroScroll) {
    heroScroll.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector('#dimensions');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

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
