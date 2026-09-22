/**
 * OSO FOOD - GASTROBAR VALLADOLID
 * Main Application Logic & Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNavigation();
  initActiveNavScroll();
  initMobileFloatingBar();
  initMenuFiltering();
  initLiveScheduleStatus();
  initGalleryLightbox();
  initLegalModals();
  initScrollAnimations();
});

/* --------------------------------------------------------------------------
   1. Header Scroll Shrink & Blur Effect
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   1b. Active Nav Link Tracking on Scroll
   -------------------------------------------------------------------------- */
function initActiveNavScroll() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-desktop .nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        desktopNavLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        mobileNavLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));
}

/* --------------------------------------------------------------------------
   1c. Mobile Sticky Floating Action Bar
   -------------------------------------------------------------------------- */
function initMobileFloatingBar() {
  const floatingBar = document.getElementById('mobileFloatingBar');
  if (!floatingBar) return;

  const handleScroll = () => {
    // Show after scrolling 300px down on mobile
    if (window.scrollY > 350) {
      floatingBar.classList.add('visible');
    } else {
      floatingBar.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. Mobile Drawer Navigation
   -------------------------------------------------------------------------- */
function initMobileNavigation() {
  const hamburger = document.getElementById('hamburgerBtn');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburger || !drawer || !backdrop) return;

  const toggleDrawer = (open) => {
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', open);
    drawer.classList.toggle('open', open);
    backdrop.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    toggleDrawer(!isOpen);
  });

  backdrop.addEventListener('click', () => toggleDrawer(false));

  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleDrawer(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggleDrawer(false);
    }
  });
}

/* --------------------------------------------------------------------------
   3. Menu / Carta Filtering by Categories
   -------------------------------------------------------------------------- */
function initMenuFiltering() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const menuItems = document.querySelectorAll('.menu-item-row');

  if (!tabButtons.length || !menuItems.length) return;

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;

      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      menuItems.forEach(item => {
        const itemCategory = item.dataset.category;
        if (category === 'all' || itemCategory === category) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(8px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. Live Opening Status & Hours Table Highlight
   -------------------------------------------------------------------------- */
function initLiveScheduleStatus() {
  const statusPill = document.getElementById('liveStatusPill');
  const statusText = document.getElementById('liveStatusText');
  const hoursRows = document.querySelectorAll('.hours-table tr[data-day]');

  // Schedule definition: day index (0=Sun, 1=Mon, ..., 6=Sat)
  // Shifts formatted in [startHour, endHour] in 24h
  const schedule = {
    0: [{ start: 11, end: 16 }, { start: 20, end: 23 }], // Sunday
    1: [{ start: 10, end: 16 }, { start: 20, end: 23.5 }], // Monday
    2: [], // Tuesday - Closed
    3: [{ start: 10, end: 16 }, { start: 20, end: 23.5 }], // Wednesday
    4: [{ start: 10, end: 16 }, { start: 20, end: 23.5 }], // Thursday
    5: [{ start: 10, end: 16 }, { start: 20, end: 26 }], // Friday (until 02:00 = 26)
    6: [{ start: 11, end: 16 }, { start: 20, end: 26 }]  // Saturday (until 02:00 = 26)
  };

  const now = new Date();
  const currentDay = now.getDay();
  let currentHour = now.getHours() + now.getMinutes() / 60;

  // Highlight current day in table
  hoursRows.forEach(row => {
    if (parseInt(row.dataset.day, 10) === currentDay) {
      row.classList.add('today');
      const dayCell = row.querySelector('td:first-child');
      if (dayCell && !dayCell.innerHTML.includes('(Hoy)')) {
        dayCell.innerHTML += ' <span style="font-size:0.75rem; color:var(--color-accent-gold); font-weight:700;">(Hoy)</span>';
      }
    }
  });

  if (!statusPill || !statusText) return;

  // Check if open now
  let isOpen = false;
  let nextClosingTime = '';

  const todayShifts = schedule[currentDay] || [];
  for (const shift of todayShifts) {
    if (currentHour >= shift.start && currentHour < shift.end) {
      isOpen = true;
      const closingHour = shift.end > 24 ? shift.end - 24 : shift.end;
      const closingMinutes = Math.round((closingHour % 1) * 60);
      const formattedClosing = `${Math.floor(closingHour).toString().padStart(2, '0')}:${closingMinutes.toString().padStart(2, '0')}`;
      nextClosingTime = formattedClosing;
      break;
    }
  }

  // Handle Friday/Saturday early morning spillover (00:00 - 02:00)
  if (!isOpen && (currentDay === 6 || currentDay === 0) && currentHour < 2) {
    const prevDay = currentDay === 0 ? 6 : 5;
    const prevShifts = schedule[prevDay] || [];
    const nightShift = prevShifts.find(s => s.end > 24);
    if (nightShift && (currentHour + 24) < nightShift.end) {
      isOpen = true;
      nextClosingTime = '02:00';
    }
  }

  if (isOpen) {
    statusPill.className = 'live-status-pill open';
    statusText.textContent = `Abierto ahora · Cierra a las ${nextClosingTime}`;
  } else {
    statusPill.className = 'live-status-pill closed';
    statusText.textContent = currentDay === 2
      ? 'Cerrado por descanso · Abrimos el miércoles a las 10:00'
      : 'Cerrado ahora · Consulta nuestro horario de apertura';
  }
}

/* --------------------------------------------------------------------------
   5. Editorial Gallery Lightbox Modal
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('lightboxModal');
  if (!modal) return;

  const lightboxImg = modal.querySelector('.modal-lightbox-img');
  const lightboxCaption = modal.querySelector('.modal-lightbox-caption');
  const closeBtn = modal.querySelector('.modal-close-btn');

  const openLightbox = (src, caption) => {
    lightboxImg.src = src;
    lightboxImg.alt = caption;
    lightboxCaption.textContent = caption;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.dataset.caption || img.alt;
      if (img) openLightbox(img.src, caption);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   6. Legal Modals (Aviso Legal, Privacidad, Cookies)
   -------------------------------------------------------------------------- */
function initLegalModals() {
  const triggers = document.querySelectorAll('[data-legal-modal]');
  const modals = document.querySelectorAll('.legal-modal');

  const closeModal = (modal) => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.dataset.legalModal;
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(modal));
    }
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(m => closeModal(m));
    }
  });
}

/* --------------------------------------------------------------------------
   7. Smooth Reveal on Scroll Animations
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.reveal-on-scroll');
  if (!animatedElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if observer not supported
    animatedElements.forEach(el => el.classList.add('is-revealed'));
  }
}
