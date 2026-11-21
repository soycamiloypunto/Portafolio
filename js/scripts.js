/*!
 * Cristian Camilo Tabares Villanueva — Portfolio & HV Scripts
 * Automatic Browser Theme (prefers-color-scheme) + Filter Tabs + Export HV to PDF
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
    btns.forEach(function (btn) {
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

  function exportHVToPDF() {
    // Ensure all sections of the HV are visible before generating the PDF
    const filterButtons = document.querySelectorAll('[data-filter-btn]');
    const filterItems = document.querySelectorAll('[data-filter-section]');
    filterButtons.forEach(function (b) {
      if (b.getAttribute('data-filter-btn') === 'all') {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
    filterItems.forEach(function (sec) {
      sec.style.display = '';
    });

    const originalTitle = document.title;
    document.title = 'HV_Cristian_Camilo_Tabares_Villanueva';
    window.print();
    setTimeout(function () {
      document.title = originalTitle;
    }, 500);
  }

  // Expose globally if needed
  window.exportHVToPDF = exportHVToPDF;

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

    // Export HV to PDF buttons
    document.querySelectorAll('[data-export-hv]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        exportHVToPDF();
      });
    });

    // Auto-trigger PDF export if navigated with ?export=pdf
    if (window.location.search.indexOf('export=pdf') !== -1) {
      setTimeout(function () {
        exportHVToPDF();
      }, 350);
    }

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
