(function () {
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
    injectBackToTopButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
