/* ==========================================================================
   SONS OF HARRISON (sonsofharrison.com) — GLOBAL THEME, CREST & VIEW ENGINE
   Decoupled Site Theme (Dark/Light) + Independent 9:16 Crest Finish (Steel Default)
   ========================================================================== */

/* 0. Immediate Theme, Crest Finish & View Restoration */
(function restoreSavedPreferences() {
  const savedTheme = localStorage.getItem('harrison-theme') || 'dark';
  const savedCrest = localStorage.getItem('harrison-crest-finish') || 'steel';
  const savedView = localStorage.getItem('harrison-view-mode') || 'standard';

  document.documentElement.setAttribute('data-theme', savedTheme);
  document.documentElement.setAttribute('data-crest', savedCrest);

  if (savedView === 'mobile') {
    document.documentElement.setAttribute('data-view', 'mobile');
  }
})();

/**
 * 1. Global Dark/Light Media Asset Synchronizer (Site Theme)
 *    - Swaps 1:1 Square Logos (.theme-brand-logo) between Harrison_Sons_Dark.jpg & Harrison_Sons_Light.jpg
 *    - Swaps Subsidiary 9:16 Posters (.theme-brand-9x16) between *_Dark_9x16.jpg & *_Light_9x16.jpg
 *    - Does NOT alter the decoupled 9:16 Sons of Harrison Hero video/crest finish
 */
function syncThemeMediaAssets() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const modeLabel = isLight ? 'Light' : 'Dark';

  /* A. Sync 1:1 Square Brand Logos (.theme-brand-logo) — Strictly Dark & Light */
  const logoSrc = isLight ? 'Harrison_Sons_Light.jpg' : 'Harrison_Sons_Dark.jpg';
  document.querySelectorAll('.theme-brand-logo').forEach((img) => {
    if (img.getAttribute('src') !== logoSrc) {
      img.setAttribute('src', logoSrc);
    }
  });

  /* B. Sync Subsidiary 9:16 Static Brand Graphics (.theme-brand-9x16) */
  const brandAssetMap = {
    hardscaping: `Harrison_Hardscaping_${modeLabel}_9x16.jpg`,
    arbitrage: `Harrison_Arbitrage_${modeLabel}_9x16.jpg`,
    collectibles: `Harrison_Collectibles_${modeLabel}_9x16.jpg`,
    agents: `Harrison_Agents_${modeLabel}_9x16.jpg`,
    sons: `Harrison_Sons_Cyber_${modeLabel}_9x16.jpg`
  };

  document.querySelectorAll('.theme-brand-9x16').forEach((img) => {
    const brandKey = (img.dataset.brand || 'sons').toLowerCase();
    const targetSrc = brandAssetMap[brandKey] || brandAssetMap.sons;
    if (img.getAttribute('src') !== targetSrc) {
      img.dataset.fallbackApplied = 'false';
      img.style.display = '';
      const wrapper = img.parentElement;
      const existingFallback = wrapper ? wrapper.querySelector('.asset-fallback-box') : null;
      if (existingFallback) existingFallback.remove();
      img.setAttribute('src', targetSrc);
    }
  });

  /* C. Update Dynamic Theme Status Captions */
  document.querySelectorAll('[data-caption-dark][data-caption-light]').forEach((el) => {
    el.textContent = isLight
      ? el.getAttribute('data-caption-light')
      : el.getAttribute('data-caption-dark');
  });
}

/**
 * 2. Independent 9:16 Sons of Harrison Crest Finish Engine
 *    - Defaults to 'steel' (Harrison_Sons_Cyber_Steel_9x16_Animated.mp4)
 *    - Remains independent when Global Site Theme toggles between Dark and Light
 */
function syncCrestFinishAssets() {
  const crestFinish = (document.documentElement.getAttribute('data-crest') || 'steel').toLowerCase();
  const finishLabelMap = {
    steel: 'Steel',
    dark: 'Dark',
    light: 'Light'
  };
  const finishLabel = finishLabelMap[crestFinish] || 'Steel';

  const videoSrc = `Harrison_Sons_Cyber_${finishLabel}_9x16_Animated.mp4`;
  const posterSrc = `Harrison_Sons_Cyber_${finishLabel}_9x16.jpg`;

  /* A. Sync 9:16 Hero Animated Videos (.crest-brand-video) */
  document.querySelectorAll('.crest-brand-video').forEach((video) => {
    video.setAttribute('poster', posterSrc);
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    if (video.getAttribute('src') !== videoSrc) {
      video.setAttribute('src', videoSrc);
      video.load();
    }

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  });

  /* B. Sync 9:16 Static Crest Displays tied to Crest Switcher (.crest-brand-9x16) */
  document.querySelectorAll('.crest-brand-9x16').forEach((img) => {
    if (img.getAttribute('src') !== posterSrc) {
      img.setAttribute('src', posterSrc);
    }
  });

  /* C. Update Active State on Crest Switcher Buttons (.crest-switch-btn) */
  document.querySelectorAll('.crest-switch-btn').forEach((btn) => {
    const isMatch = (btn.dataset.crestTarget || '').toLowerCase() === crestFinish;
    btn.classList.toggle('active', isMatch);
    btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
  });
}

/**
 * 3. Initialize Header & Hero Controls
 */
function initHeaderControls() {
  const rootEl = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const viewBtn = document.getElementById('view-mode-toggle');
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  const syncControlLabels = () => {
    const isLight = rootEl.getAttribute('data-theme') === 'light';
    const isMobileView = rootEl.getAttribute('data-view') === 'mobile';

    if (themeBtn) {
      themeBtn.innerHTML = isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
      themeBtn.setAttribute('aria-label', isLight ? 'Switch Site to Dark Mode' : 'Switch Site to Light Mode');
    }

    if (viewBtn) {
      viewBtn.innerHTML = isMobileView ? '🖥️ Full View' : '📱 Mobile View';
      viewBtn.classList.toggle('active', isMobileView);
      viewBtn.setAttribute('aria-pressed', isMobileView ? 'true' : 'false');
    }

    syncThemeMediaAssets();
    syncCrestFinishAssets();
  };

  syncControlLabels();

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isLight = rootEl.getAttribute('data-theme') === 'light';
      const nextTheme = isLight ? 'dark' : 'light';
      rootEl.setAttribute('data-theme', nextTheme);
      localStorage.setItem('harrison-theme', nextTheme);
      syncControlLabels();
    });
  }

  if (viewBtn) {
    viewBtn.addEventListener('click', () => {
      const isMobileView = rootEl.getAttribute('data-view') === 'mobile';
      if (isMobileView) {
        rootEl.removeAttribute('data-view');
        localStorage.setItem('harrison-view-mode', 'standard');
      } else {
        rootEl.setAttribute('data-view', 'mobile');
        localStorage.setItem('harrison-view-mode', 'mobile');
      }
      syncControlLabels();
    });
  }

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('nav-open');
      menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menuBtn.textContent = isOpen ? '✕ CLOSE' : '☰ MENU';
    });
  }

  /* Bind Independent 9:16 Crest Finish Switcher Pills */
  document.querySelectorAll('.crest-switch-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetCrest = (btn.dataset.crestTarget || 'steel').toLowerCase();
      rootEl.setAttribute('data-crest', targetCrest);
      localStorage.setItem('harrison-crest-finish', targetCrest);
      syncCrestFinishAssets();
    });
  });
}

/**
 * 4. Highlight Current Active Page in Navigation
 */
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/**
 * 5. Collapsible Details for Mobile Center-Scrolling View
 */
function initMobileCollapsibleCards() {
  document.querySelectorAll('[data-collapsible-card]').forEach((card) => {
    const content = card.querySelector('.collapsible-content');
    const toggleBtn = card.querySelector('.collapse-toggle-btn');
    if (!content || !toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      const isCollapsed = content.classList.toggle('is-collapsed');
      toggleBtn.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
      toggleBtn.innerHTML = isCollapsed
        ? '<span>Show Full Details</span> <span>[+]</span>'
        : '<span>Collapse Details</span> <span>[−]</span>';
    });
  });
}

/**
 * 6. Automatic Zero-Edit Fallback for Any Missing Future Brand Image
 */
function initMissingAssetFallbacks() {
  document.querySelectorAll('img[data-fallback-title]').forEach((img) => {
    const handleFallback = () => {
      if (img.dataset.fallbackApplied === 'true') return;
      img.dataset.fallbackApplied = 'true';

      const srcAttr = img.getAttribute('src') || 'Asset_File.jpg';
      const title = img.getAttribute('data-fallback-title') || 'Sons of Harrison Asset';
      const status = img.getAttribute('data-asset-status') || 'SUBSIDIARY';

      if (img.classList.contains('theme-brand-logo')) {
        const parent = img.parentElement;
        img.style.display = 'none';
        if (parent && !parent.querySelector('.logo-monogram-fallback')) {
          const badge = document.createElement('span');
          badge.className = 'logo-monogram-fallback';
          badge.textContent = 'SH';
          parent.appendChild(badge);
        }
        return;
      }

      const wrapper = img.parentElement;
      img.style.display = 'none';

      if (wrapper && !wrapper.querySelector('.asset-fallback-box')) {
        const fallbackEl = document.createElement('div');
        fallbackEl.className = 'asset-fallback-box';
        fallbackEl.innerHTML = `
          <span class="fallback-monogram">SONS OF HARRISON // ${status}</span>
          <div class="fallback-title">${title}</div>
          <span class="fallback-filename">${srcAttr}</span>
        `;
        wrapper.appendChild(fallbackEl);
      }
    };

    img.addEventListener('error', handleFallback);
    if (img.complete && img.naturalWidth === 0) {
      handleFallback();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeaderControls();
  highlightActiveNav();
  initMobileCollapsibleCards();
  initMissingAssetFallbacks();
  syncThemeMediaAssets();
  syncCrestFinishAssets();
});
