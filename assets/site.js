(function () {
  function getLinkTargets() {
    var body = document.body;
    var homePath = body.getAttribute('data-home-path');
    var labsPath = body.getAttribute('data-labs-path');

    if (!homePath) {
      homePath = window.location.pathname.indexOf('/catherines-labs/') !== -1 ? '../index.html' : 'index.html';
    }

    if (!labsPath) {
      labsPath = window.location.pathname.indexOf('/catherines-labs/') !== -1 ? 'index.html' : 'catherines-labs/index.html';
    }

    return { homePath: homePath, labsPath: labsPath };
  }

  function injectUtilityNav() {
    if (document.querySelector('[data-site-utility-nav]')) {
      return;
    }

    var targets = getLinkTargets();
    var nav = document.createElement('nav');
    nav.className = 'site-utility-nav';
    nav.setAttribute('data-site-utility-nav', 'true');
    nav.setAttribute('aria-label', 'Site navigation');

    var homeLink = document.createElement('a');
    homeLink.className = 'site-utility-link';
    homeLink.href = targets.homePath;
    homeLink.textContent = 'Home';

    var labsLink = document.createElement('a');
    labsLink.className = 'site-utility-link';
    labsLink.href = targets.labsPath;
    labsLink.textContent = "Catherine's Labs";

    nav.appendChild(homeLink);
    nav.appendChild(labsLink);
    document.body.insertBefore(nav, document.body.firstChild);
  }

  function injectBackToTopButton() {
    if (document.querySelector('[data-site-back-to-top]')) {
      return;
    }

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'site-back-to-top';
    button.setAttribute('data-site-back-to-top', 'true');
    button.setAttribute('aria-label', 'Back to top');
    button.textContent = '↑ Top';

    function toggleVisibility() {
      if (window.scrollY > 300) {
        button.classList.add('is-visible');
      } else {
        button.classList.remove('is-visible');
      }
    }

    button.addEventListener('click', function () {
      var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
    document.body.appendChild(button);
  }

  function init() {
    injectUtilityNav();
    injectBackToTopButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
