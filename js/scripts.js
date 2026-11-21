/*!
 * Cristian Camilo Tabares Villanueva — Portfolio & HV Scripts
 * Automatic Browser Theme (prefers-color-scheme) + Filter Tabs + Mobile Nav
 */
(function () {
  'use strict';

  const root = document.documentElement;
  const STORAGE_KEY = 'cctv_theme_pref'; // 'auto' | 'dark' | 'light'

  function getSavedTheme() {
    return localStorage.getItem(STORAGE_KEY) || 'auto';
  }

  function applyTheme(mode) {
    if (mode === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else if (mode === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    updateThemeButtons(mode);
  }

  function updateThemeButtons(mode) {
    const btns = document.querySelectorAll('[data-theme-toggle]');
    const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    btns.forEach((btn) => {
      let icon = 'bi-circle-half';
      let label = 'Auto';
      if (mode === 'dark') {
        icon = 'bi-moon-stars-fill';
        label = 'Oscuro';
      } else if (mode === 'light') {
        icon = 'bi-sun-fill';
        label = 'Claro';
      } else {
        icon = 'bi-circle-half';
        label = 'Auto (' + (isSystemDark ? 'Oscuro' : 'Claro') + ')';
      }
      btn.innerHTML = '<i class="bi ' + icon + '"></i> <span>' + label + '</span>';
      btn.setAttribute('title', 'Tema actual: ' + label + ' (clic para cambiar)');
    });
  }

  // Initialize theme immediately
  applyTheme(getSavedTheme());

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getSavedTheme());

    // Listen to OS/Browser theme changes in real time when in Auto mode
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
        if (getSavedTheme() === 'auto') {
          updateThemeButtons('auto');
        }
      });
    }

    // Theme toggle click handler (cycles Auto -> Dark -> Light -> Auto)
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const current = getSavedTheme();
        const next = current === 'auto' ? 'dark' : current === 'dark' ? 'light' : 'auto';
        localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
      });
    });

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('[data-mobile-toggle]');
    const navList = document.querySelector('[data-nav-list]');
    if (menuBtn && navList) {
      menuBtn.addEventListener('click', function () {
        navList.classList.toggle('show');
      });
    }

    // Filter Tabs (used in HV / resume.html and Projects / projects.html)
    const filterButtons = document.querySelectorAll('[data-filter-btn]');
    const filterItems = document.querySelectorAll('[data-filter-section]');

    if (filterButtons.length > 0 && filterItems.length > 0) {
      filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          const target = btn.getAttribute('data-filter-btn');

          filterButtons.forEach(function (b) {
            b.classList.remove('active');
          });
          btn.classList.add('active');

          filterItems.forEach(function (sec) {
            const cat = sec.getAttribute('data-filter-section');
            if (target === 'all' || cat === target) {
              sec.style.display = '';
            } else {
              sec.style.display = 'none';
            }
          });
        });
      });
    }
  });
})();
