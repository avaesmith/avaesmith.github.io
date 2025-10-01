/**
* Template Name: SnapFolio
* Template URL: https://bootstrapmade.com/snapfolio-bootstrap-portfolio-template/
* Updated: Jul 21 2025 with Bootstrap v5.3.7
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  headerToggleBtn.addEventListener('click', headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Brands carousel auto-scroll & controls
   */
  const brandsCarousel = document.querySelector('.brands-carousel');
  if (brandsCarousel) {
    const viewport = brandsCarousel.querySelector('.brands-viewport');
    const track = brandsCarousel.querySelector('.brands-track');
    const prevBtn = brandsCarousel.querySelector('.brands-nav-prev');
    const nextBtn = brandsCarousel.querySelector('.brands-nav-next');

    if (viewport && track && prevBtn && nextBtn) {
      let offset = 0;
      let lastTime = null;
      let isPaused = false;
      let resumeTimer;
      let segmentWidth = 0;
      let speed = 40;
      let skipActive = false;
      let skipStart = null;
      let skipFrom = 0;
      let skipTo = 0;
      const SKIP_DURATION = 500;

      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      let autoEnabled = !reducedMotionQuery.matches;

      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

      function computeMetrics() {
        segmentWidth = track.scrollWidth / 2;
        const duration = window.matchMedia('(max-width: 767px)').matches ? 20 : 22;
        if (segmentWidth > 0 && autoEnabled) {
          speed = segmentWidth / duration;
        }
      }

      function normalizeOffset() {
        if (segmentWidth <= 0) return;
        while (offset <= -segmentWidth) {
          offset += segmentWidth;
        }
        while (offset > 0) {
          offset -= segmentWidth;
        }
      }

      function normalizeTarget(value, current) {
        if (segmentWidth <= 0) return value;
        while (value <= -segmentWidth) {
          value += segmentWidth;
        }
        while (value > 0) {
          value -= segmentWidth;
        }
        const delta = value - current;
        if (delta > segmentWidth / 2) {
          value -= segmentWidth;
        } else if (delta < -segmentWidth / 2) {
          value += segmentWidth;
        }
        return value;
      }

      function applyTransform() {
        track.style.transform = `translateX(${offset}px)`;
      }

      function autoStep(timestamp) {
        if (!lastTime) {
          lastTime = timestamp;
        }

        const delta = timestamp - lastTime;
        if (skipActive) {
          if (!skipStart) {
            skipStart = timestamp;
          }
          const elapsed = timestamp - skipStart;
          const progress = Math.min(elapsed / SKIP_DURATION, 1);
          const eased = easeOutCubic(progress);
          offset = skipFrom + (skipTo - skipFrom) * eased;
          normalizeOffset();
          applyTransform();
          if (progress >= 1) {
            skipActive = false;
            offset = skipTo;
            normalizeOffset();
            applyTransform();
          }
        } else if (autoEnabled && !isPaused && segmentWidth > 0) {
          offset -= (speed * delta) / 1000;
          normalizeOffset();
          applyTransform();
        }

        lastTime = timestamp;
        requestAnimationFrame(autoStep);
      }

      function pauseAndResume() {
        isPaused = true;
        lastTime = performance.now();
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => {
          isPaused = false;
          lastTime = performance.now();
        }, 800);
      }

      function skip(distance) {
        computeMetrics();
        if (segmentWidth <= 0) return;

        if (skipActive) {
          offset = skipTo;
          normalizeOffset();
          skipActive = false;
        }

        skipFrom = offset;
        skipTo = normalizeTarget(offset + distance, offset);
        skipStart = null;
        skipActive = true;
        applyTransform();

        if (autoEnabled) {
          pauseAndResume();
        } else {
          lastTime = performance.now();
        }
      }

      prevBtn.addEventListener('click', () => {
        const distance = viewport.clientWidth * 0.6;
        skip(distance);
      });

      nextBtn.addEventListener('click', () => {
        const distance = viewport.clientWidth * 0.6;
        skip(-distance);
      });

      window.addEventListener('resize', () => {
        const previousSegment = segmentWidth;
        computeMetrics();
        if (segmentWidth > 0 && previousSegment > 0) {
          const proportion = offset / previousSegment;
          offset = proportion * segmentWidth;
          normalizeOffset();
          applyTransform();
        }
      });

      function initCarousel() {
        computeMetrics();
        normalizeOffset();
        applyTransform();
        if (!autoEnabled) {
          isPaused = true;
        }
      }

      if (document.readyState === 'complete') {
        initCarousel();
      } else {
        window.addEventListener('load', initCarousel);
      }

      const reducedMotionListener = (event) => {
        autoEnabled = !event.matches;
        if (!autoEnabled) {
          isPaused = true;
        } else {
          computeMetrics();
          lastTime = performance.now();
          isPaused = false;
        }
      };

      if (reducedMotionQuery.addEventListener) {
        reducedMotionQuery.addEventListener('change', reducedMotionListener);
      } else if (reducedMotionQuery.addListener) {
        reducedMotionQuery.addListener(reducedMotionListener);
      }

      requestAnimationFrame(autoStep);
    }
  }

})();
