/* ============================================================
   ST. CLEMENTE — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ─── Nav: scroll state ─────────────────────────────────── */

  const nav = document.getElementById('site-nav');

  function updateNav() {
    if (window.scrollY > 60) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ─── Mobile menu ───────────────────────────────────────── */

  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  toggle.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });

  /* ─── Full story overlay ────────────────────────────────── */

  const storyOpenBtn = document.getElementById('story-open');
  const storyOverlay = document.getElementById('story-overlay');
  const storyCloseBtn = document.getElementById('story-close');

  function openStory() {
    storyOverlay.classList.add('is-open');
    storyOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    storyCloseBtn.focus();
  }

  function closeStory() {
    storyOverlay.classList.remove('is-open');
    storyOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    storyOpenBtn.focus();
  }

  storyOpenBtn.addEventListener('click', openStory);
  storyCloseBtn.addEventListener('click', closeStory);

  storyOverlay.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeStory();
  });

  /* ─── Smooth anchor scrolling (enhanced) ───────────────── */

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = nav.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  /* ─── Scroll-reveal ─────────────────────────────────────── */

  const revealEls = document.querySelectorAll([
    '.story-visual',
    '.story-text',
    '.artwork-card',
    '.commissions-text',
    '.commissions-image',
    '.correspondence-inner',
    '.section-label',
  ].join(', '));

  revealEls.forEach(function (el) {
    el.classList.add('reveal');
  });

  /* Stagger artwork cards */
  document.querySelectorAll('.artwork-card').forEach(function (card, i) {
    card.classList.add('reveal-delay-' + Math.min(i + 1, 3));
  });

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ─── Hero scroll hint: hide on scroll ─────────────────── */

  const heroScroll = document.querySelector('.hero-scroll');
  if (heroScroll) {
    window.addEventListener('scroll', function () {
      heroScroll.style.opacity = window.scrollY > 80 ? '0' : '';
    }, { passive: true });
  }

  /* ────────────────────────────────────────────────────────────
     E-COMMERCE HOOK
     ════════════════════════════════════════════════════════════
     Wire your commerce platform here. Replace the stub functions
     below with calls to your chosen API / SDK.

     Recommended:
       · Shopify: shopify.checkout.addLineItem(variantId, qty)
       · Stripe:  redirect to Stripe Payment Link
       · Custom:  POST to your own /api/cart endpoint

     State:
       · cartItems  — array of { productId, title, price, qty }
       · updateCartUI() — call after any cart mutation
  ═════════════════════════════════════════════════════════════= */

  var cartItems = [];

  function getProductData(card) {
    return {
      id:     card.dataset.productId,
      title:  card.dataset.title,
      price:  card.dataset.price,
      medium: card.dataset.medium,
      qty:    1,
    };
  }

  function updateCartUI() {
    var count = cartItems.reduce(function (sum, item) { return sum + item.qty; }, 0);
    var badge = document.getElementById('cart-count');
    if (badge) {
      badge.textContent = count;
      badge.hidden = count === 0;
    }
  }

  function addToCart(product) {
    /* REPLACE THIS STUB with your commerce API call */
    var existing = cartItems.find(function (i) { return i.id === product.id; });
    if (existing) {
      existing.qty += 1;
    } else {
      cartItems.push(product);
    }
    updateCartUI();
    /* TODO: open cart drawer / toast notification */
  }

  /* Wire "Enquire to Purchase" buttons */
  document.querySelectorAll('.artwork-card').forEach(function (card) {
    var btn = card.querySelector('.btn-enquire');
    if (!btn || !card.dataset.productId) return;
    /*
      To switch from "enquire" to "add to cart" mode:
        1. Change btn text: btn.textContent = 'Add to Cart';
        2. Prevent default link navigation: btn.setAttribute('href', '#');
        3. Uncomment the event listener below.
    */
    // btn.addEventListener('click', function (e) {
    //   e.preventDefault();
    //   addToCart(getProductData(card));
    // });
  });

  /* ════════════════════════════════════════════════════════════
     END E-COMMERCE HOOK
  ════════════════════════════════════════════════════════════ */

})();
