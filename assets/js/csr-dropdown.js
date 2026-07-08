/**
 * csr-dropdown.js — Custom dropdown component for CRZRT site
 * Handles: open/close, option selection, outside-click close, keyboard nav
 */
(function () {
  'use strict';

  function initDropdowns() {
    var dropdowns = document.querySelectorAll('.csr-dropdown');
    if (!dropdowns.length) return;
    dropdowns.forEach(function (dropdown) {
      var trigger = dropdown.querySelector('.csr-dropdown__trigger');
      var panel = dropdown.querySelector('.csr-dropdown__panel');
      var label = dropdown.querySelector('.csr-dropdown__label');
      var options = dropdown.querySelectorAll('.csr-dropdown__option');

      // Store placeholder text
      var placeholder = label ? label.textContent.trim() : '';

      // Toggle open/close
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = dropdown.classList.contains('is-open');
        closeAllDropdowns();
        if (!isOpen) openDropdown(dropdown);
      });

      // Keyboard support on trigger
      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!dropdown.classList.contains('is-open')) {
            closeAllDropdowns();
            openDropdown(dropdown);
            // Focus first option
            var first = panel.querySelector('.csr-dropdown__option');
            if (first) first.focus();
          }
        }
        if (e.key === 'Escape') closeDropdown(dropdown);
      });

      // Option selection
      options.forEach(function (option) {
        option.addEventListener('click', function () {
          selectOption(dropdown, option, label, placeholder);
          closeDropdown(dropdown);
          trigger.focus();
        });

        // Keyboard within panel
        option.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectOption(dropdown, option, label, placeholder);
            closeDropdown(dropdown);
            trigger.focus();
          }
          if (e.key === 'Escape') {
            closeDropdown(dropdown);
            trigger.focus();
          }
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            var next = option.nextElementSibling;
            if (next) next.focus();
          }
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            var prev = option.previousElementSibling;
            if (prev) prev.focus();else trigger.focus();
          }
        });
      });
    });

    // Close on outside click
    document.addEventListener('click', function () {
      closeAllDropdowns();
    });

    // Close on Escape anywhere
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAllDropdowns();
    });
  }
  function openDropdown(dropdown) {
    dropdown.classList.add('is-open');
    var trigger = dropdown.querySelector('.csr-dropdown__trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  }
  function closeDropdown(dropdown) {
    dropdown.classList.remove('is-open');
    var trigger = dropdown.querySelector('.csr-dropdown__trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }
  function closeAllDropdowns() {
    document.querySelectorAll('.csr-dropdown.is-open').forEach(closeDropdown);
  }
  function selectOption(dropdown, option, label, placeholder) {
    var value = option.dataset.value || '';
    var text = option.textContent.trim();

    // Update label
    if (label) label.textContent = text;

    // Update data-value
    dropdown.dataset.value = value;

    // Toggle has-value class for colour
    dropdown.classList.toggle('has-value', !!value);

    // Mark selected option
    dropdown.querySelectorAll('.csr-dropdown__option').forEach(function (o) {
      o.classList.toggle('is-selected', o === option);
    });
  }

  // Expose to window for dynamic rendering
  window.initDropdowns = initDropdowns;

  // Init after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDropdowns);
  } else {
    initDropdowns();
  }
})();