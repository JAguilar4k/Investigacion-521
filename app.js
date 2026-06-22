(() => {
  "use strict";

  /*
    LIVE TUNING AREA
    These constants are intentionally grouped at the top for the live defense.
    If the professor asks for a new shortcut, a different default slide, or a
    new error state, edit this object first and the rest of the app follows.
  */
  const LIVE_TUNING = Object.freeze({
    theme: {
      storageKeys: {
        index: "tw-course-theme",
        presentation: "tw-deck-theme",
        dashboard: "tw-dashboard-theme",
      },
      modes: Object.freeze(["light", "dark"]),
      defaultMode: "system",
    },
    deck: {
      firstSlide: 0,
      wrapSlides: true,
      focusSlideAfterKeyboardNavigation: true,
      shortcuts: {
        next: Object.freeze(["ArrowRight", "PageDown", " "]),
        previous: Object.freeze(["ArrowLeft", "PageUp"]),
        first: Object.freeze(["Home"]),
        last: Object.freeze(["End"]),
        notes: "n",
        theme: "d",
        fullscreen: "f",
      },
    },
    dashboard: {
      defaultTab: "overview",
      confidenceSuffix: "%",
      searchMinimumLength: 2,
      exportDelayMs: 400,
    },
    messages: {
      missingElement: "No se encontro un elemento requerido. Revisa el selector en app.js.",
      fullscreenUnavailable: "Pantalla completa no disponible en este navegador.",
      fullscreenError: "No se pudo cambiar el modo de pantalla completa.",
      searchTooShort: "Escribe al menos 2 caracteres para buscar.",
      searchReady: "Busqueda aplicada correctamente.",
      exportStarted: "Exportando datos visibles.",
      exportFinished: "CSV preparado para la demo.",
    },
  });

  const SELECTORS = Object.freeze({
    shared: {
      themeToggle: "[data-action='toggle-theme']",
      themeLabel: "[data-theme-label]",
      status: "[data-app-status]",
    },
    deck: {
      root: "[data-deck]",
      slide: "[data-slide]",
      note: "[data-note]",
      dots: "[data-slide-dots]",
      previous: "[data-action='previous-slide']",
      next: "[data-action='next-slide']",
      counter: "[data-slide-counter]",
      notesToggle: "[data-action='toggle-notes']",
      notesDialog: "[data-speaker-notes]",
      notesClose: "[data-action='close-notes']",
      fullscreenToggle: "[data-action='toggle-fullscreen']",
    },
    dashboard: {
      filtersToggle: "[data-action='toggle-filters']",
      filtersPanel: "[data-filters-panel]",
      confidenceRange: "[data-confidence-range]",
      confidenceValue: "[data-confidence-value]",
      tabButton: "[role='tab'][data-tab]",
      tabPanel: "[role='tabpanel'][data-panel]",
      searchForm: "[data-search-form]",
      searchInput: "[data-search-input]",
      exportButton: "[data-action='export-csv']",
      status: "[data-dashboard-status]",
    },
  });

  const CLASS_NAMES = Object.freeze({
    dark: "dark",
    activeSlide: "animate-slide-in",
    activePanel: "animate-fade-in",
  });

  const root = document.documentElement;
  const pageName = root.dataset.app || "index";
  const themeStorageKey = root.dataset.themeStorage || LIVE_TUNING.theme.storageKeys[pageName] || LIVE_TUNING.theme.storageKeys.index;

  applyInitialTheme();
  document.addEventListener("DOMContentLoaded", initialisePage, { once: true });

  function initialisePage() {
    bindSharedThemeControls();

    if (pageName === "presentation") {
      initialiseDeck();
      return;
    }

    if (pageName === "dashboard") {
      initialiseDashboard();
    }
  }

  function applyInitialTheme() {
    const storedTheme = readStoredTheme(themeStorageKey);
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    const shouldUseDark = storedTheme ? storedTheme === "dark" : prefersDark;

    setTheme(shouldUseDark);
  }

  function bindSharedThemeControls() {
    const themeButtons = Array.from(document.querySelectorAll(SELECTORS.shared.themeToggle));

    themeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const nextIsDark = !root.classList.contains(CLASS_NAMES.dark);
        setTheme(nextIsDark);
        writeStoredTheme(themeStorageKey, nextIsDark ? "dark" : "light");
      });
    });

    syncThemeLabels();
  }

  function setTheme(shouldUseDark) {
    root.classList.toggle(CLASS_NAMES.dark, shouldUseDark);
    root.dataset.theme = shouldUseDark ? "dark" : "light";
    syncThemeLabels();
  }

  function syncThemeLabels() {
    const isDark = root.classList.contains(CLASS_NAMES.dark);
    const label = isDark ? "Oscuro" : "Claro";
    const nextLabel = isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro";

    document.querySelectorAll(SELECTORS.shared.themeToggle).forEach((button) => {
      button.setAttribute("aria-label", nextLabel);
      button.setAttribute("aria-pressed", String(isDark));
    });

    document.querySelectorAll(SELECTORS.shared.themeLabel).forEach((node) => {
      node.textContent = label;
    });
  }

  function initialiseDeck() {
    const deck = requireElement(SELECTORS.deck.root, document, "deck root");
    if (!deck) return;

    const slides = Array.from(deck.querySelectorAll(SELECTORS.deck.slide));
    const notes = Array.from(document.querySelectorAll(SELECTORS.deck.note));
    const dots = requireElement(SELECTORS.deck.dots, document, "slide dots");
    const previousButton = requireElement(SELECTORS.deck.previous, document, "previous slide button");
    const nextButton = requireElement(SELECTORS.deck.next, document, "next slide button");
    const counter = requireElement(SELECTORS.deck.counter, document, "slide counter");
    const notesToggle = requireElement(SELECTORS.deck.notesToggle, document, "speaker notes toggle");
    const notesDialog = requireElement(SELECTORS.deck.notesDialog, document, "speaker notes dialog");
    const notesClose = requireElement(SELECTORS.deck.notesClose, document, "speaker notes close");
    const fullscreenToggle = requireElement(SELECTORS.deck.fullscreenToggle, document, "fullscreen toggle");

    if (!slides.length || !dots || !previousButton || !nextButton || !counter || !notesToggle || !notesDialog || !notesClose || !fullscreenToggle) {
      announceStatus(LIVE_TUNING.messages.missingElement);
      return;
    }

    let currentSlide = normaliseSlideIndex(LIVE_TUNING.deck.firstSlide, slides.length);
    let focusBeforeNotes = null;

    buildSlideDots(dots, slides.length);
    const jumpButtons = Array.from(dots.querySelectorAll("[data-slide-jump]"));

    function showSlide(index, options = {}) {
      currentSlide = normaliseSlideIndex(index, slides.length);

      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === currentSlide;
        slide.hidden = !isActive;
        slide.dataset.state = isActive ? "active" : "inactive";
        slide.setAttribute("aria-hidden", String(!isActive));
        slide.classList.toggle(CLASS_NAMES.activeSlide, isActive);
      });

      notes.forEach((note, noteIndex) => {
        note.hidden = noteIndex !== currentSlide;
      });

      jumpButtons.forEach((button, buttonIndex) => {
        const isActive = buttonIndex === currentSlide;
        button.dataset.active = String(isActive);
        button.setAttribute("aria-pressed", String(isActive));
        if (isActive) {
          button.setAttribute("aria-current", "step");
        } else {
          button.removeAttribute("aria-current");
        }
      });

      counter.value = `${currentSlide + 1} / ${slides.length}`;
      counter.textContent = `${currentSlide + 1} / ${slides.length}`;

      if (options.focusSlide) {
        slides[currentSlide].focus({ preventScroll: true });
      }
    }

    previousButton.addEventListener("click", () => showSlide(currentSlide - 1, { focusSlide: false }));
    nextButton.addEventListener("click", () => showSlide(currentSlide + 1, { focusSlide: false }));

    jumpButtons.forEach((button) => {
      button.addEventListener("click", () => {
        showSlide(Number(button.dataset.slideJump), { focusSlide: true });
      });
    });

    notesToggle.addEventListener("click", () => {
      if (notesDialog.hidden) {
        openNotesDialog();
      } else {
        closeNotesDialog({ restoreFocus: true });
      }
    });

    notesClose.addEventListener("click", () => closeNotesDialog({ restoreFocus: true }));

    notesDialog.addEventListener("keydown", (event) => {
      trapFocusInsideDialog(event, notesDialog, () => closeNotesDialog({ restoreFocus: true }));
    });

    function openNotesDialog() {
      focusBeforeNotes = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      notesDialog.hidden = false;
      notesDialog.dataset.state = "open";
      notesDialog.setAttribute("aria-hidden", "false");
      notesToggle.setAttribute("aria-expanded", "true");
      notesToggle.setAttribute("aria-pressed", "true");
      notesClose.focus({ preventScroll: true });
    }

    function closeNotesDialog({ restoreFocus }) {
      notesDialog.hidden = true;
      notesDialog.dataset.state = "closed";
      notesDialog.setAttribute("aria-hidden", "true");
      notesToggle.setAttribute("aria-expanded", "false");
      notesToggle.setAttribute("aria-pressed", "false");

      if (restoreFocus && focusBeforeNotes) {
        focusBeforeNotes.focus({ preventScroll: true });
      }
    }

    configureFullscreen(fullscreenToggle);

    document.addEventListener("keydown", (event) => {
      if (isTypingTarget(event.target) || !notesDialog.hidden) return;

      const key = event.key;
      const lowerKey = key.toLowerCase();
      const shouldFocusSlide = LIVE_TUNING.deck.focusSlideAfterKeyboardNavigation;

      if (LIVE_TUNING.deck.shortcuts.next.includes(key)) {
        event.preventDefault();
        showSlide(currentSlide + 1, { focusSlide: shouldFocusSlide });
      }

      if (LIVE_TUNING.deck.shortcuts.previous.includes(key)) {
        event.preventDefault();
        showSlide(currentSlide - 1, { focusSlide: shouldFocusSlide });
      }

      if (LIVE_TUNING.deck.shortcuts.first.includes(key)) {
        event.preventDefault();
        showSlide(0, { focusSlide: shouldFocusSlide });
      }

      if (LIVE_TUNING.deck.shortcuts.last.includes(key)) {
        event.preventDefault();
        showSlide(slides.length - 1, { focusSlide: shouldFocusSlide });
      }

      if (lowerKey === LIVE_TUNING.deck.shortcuts.notes) {
        event.preventDefault();
        notesToggle.click();
      }

      if (lowerKey === LIVE_TUNING.deck.shortcuts.theme) {
        event.preventDefault();
        document.querySelector(SELECTORS.shared.themeToggle)?.click();
      }

      if (lowerKey === LIVE_TUNING.deck.shortcuts.fullscreen) {
        event.preventDefault();
        fullscreenToggle.click();
      }
    });

    showSlide(currentSlide);
  }

  function buildSlideDots(container, slideCount) {
    container.replaceChildren();

    for (let index = 0; index < slideCount; index += 1) {
      const listItem = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "slide-dot";
      button.dataset.slideJump = String(index);
      button.dataset.active = "false";
      button.setAttribute("aria-label", `Ir a diapositiva ${index + 1}`);
      button.setAttribute("aria-pressed", "false");
      listItem.append(button);
      container.append(listItem);
    }
  }

  function configureFullscreen(fullscreenToggle) {
    function syncFullscreenButton() {
      const isFullscreen = Boolean(document.fullscreenElement);
      fullscreenToggle.textContent = isFullscreen ? "Salir pantalla" : "Pantalla completa";
      fullscreenToggle.setAttribute("aria-pressed", String(isFullscreen));
      fullscreenToggle.setAttribute("aria-label", isFullscreen ? "Salir de pantalla completa" : "Entrar en pantalla completa");
    }

    if (!document.fullscreenEnabled || !root.requestFullscreen) {
      fullscreenToggle.disabled = true;
      fullscreenToggle.textContent = "No disponible";
      fullscreenToggle.setAttribute("aria-label", LIVE_TUNING.messages.fullscreenUnavailable);
      return;
    }

    fullscreenToggle.addEventListener("click", async () => {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        } else {
          await root.requestFullscreen();
        }
      } catch (error) {
        console.warn(LIVE_TUNING.messages.fullscreenError, error);
        announceStatus(LIVE_TUNING.messages.fullscreenError);
      }
    });

    document.addEventListener("fullscreenchange", syncFullscreenButton);
    syncFullscreenButton();
  }

  function initialiseDashboard() {
    const filtersToggle = requireElement(SELECTORS.dashboard.filtersToggle, document, "filters toggle");
    const filtersPanel = requireElement(SELECTORS.dashboard.filtersPanel, document, "filters panel");
    const confidenceRange = requireElement(SELECTORS.dashboard.confidenceRange, document, "confidence range");
    const confidenceValue = requireElement(SELECTORS.dashboard.confidenceValue, document, "confidence value");
    const tabButtons = Array.from(document.querySelectorAll(SELECTORS.dashboard.tabButton));
    const tabPanels = Array.from(document.querySelectorAll(SELECTORS.dashboard.tabPanel));
    const searchForm = document.querySelector(SELECTORS.dashboard.searchForm);
    const searchInput = document.querySelector(SELECTORS.dashboard.searchInput);
    const exportButton = document.querySelector(SELECTORS.dashboard.exportButton);

    if (!filtersToggle || !filtersPanel || !confidenceRange || !confidenceValue || !tabButtons.length || !tabPanels.length) {
      announceDashboardStatus(LIVE_TUNING.messages.missingElement);
      return;
    }

    setFiltersOpen(false);
    selectTab(LIVE_TUNING.dashboard.defaultTab, { moveFocus: false });
    syncConfidenceValue(confidenceRange, confidenceValue);

    filtersToggle.addEventListener("click", () => {
      const isOpen = filtersToggle.getAttribute("aria-expanded") === "true";
      setFiltersOpen(!isOpen);
    });

    confidenceRange.addEventListener("input", () => syncConfidenceValue(confidenceRange, confidenceValue));

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => selectTab(button.dataset.tab, { moveFocus: false }));
      button.addEventListener("keydown", (event) => handleTabKeyboard(event, tabButtons));
    });

    searchForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = searchInput?.value.trim() ?? "";

      if (query.length < LIVE_TUNING.dashboard.searchMinimumLength) {
        announceDashboardStatus(LIVE_TUNING.messages.searchTooShort);
        searchInput?.focus();
        return;
      }

      announceDashboardStatus(`${LIVE_TUNING.messages.searchReady}: ${query}`);
    });

    exportButton?.addEventListener("click", () => {
      announceDashboardStatus(LIVE_TUNING.messages.exportStarted);
      exportButton.disabled = true;

      window.setTimeout(() => {
        exportButton.disabled = false;
        announceDashboardStatus(LIVE_TUNING.messages.exportFinished);
      }, LIVE_TUNING.dashboard.exportDelayMs);
    });

    function setFiltersOpen(shouldOpen) {
      filtersToggle.setAttribute("aria-expanded", String(shouldOpen));
      filtersPanel.dataset.state = shouldOpen ? "open" : "closed";
      filtersPanel.setAttribute("aria-hidden", String(!shouldOpen));
      filtersPanel.inert = !shouldOpen;
    }

    function selectTab(tabName, { moveFocus }) {
      const targetButton = tabButtons.find((button) => button.dataset.tab === tabName) || tabButtons[0];
      const selectedTab = targetButton.dataset.tab;

      tabButtons.forEach((button) => {
        const isSelected = button.dataset.tab === selectedTab;
        button.setAttribute("aria-selected", String(isSelected));
        button.tabIndex = isSelected ? 0 : -1;
      });

      tabPanels.forEach((panel) => {
        const isSelected = panel.dataset.panel === selectedTab;
        panel.hidden = !isSelected;
        panel.classList.toggle(CLASS_NAMES.activePanel, isSelected);
      });

      if (moveFocus) {
        targetButton.focus();
      }
    }

    function handleTabKeyboard(event, buttons) {
      const currentIndex = buttons.indexOf(event.currentTarget);
      const lastIndex = buttons.length - 1;
      let nextIndex = currentIndex;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = lastIndex;
      } else {
        return;
      }

      event.preventDefault();
      selectTab(buttons[nextIndex].dataset.tab, { moveFocus: true });
    }
  }

  function syncConfidenceValue(range, output) {
    output.value = `${range.value}${LIVE_TUNING.dashboard.confidenceSuffix}`;
    output.textContent = `${range.value}${LIVE_TUNING.dashboard.confidenceSuffix}`;
  }

  function normaliseSlideIndex(index, slideCount) {
    if (!LIVE_TUNING.deck.wrapSlides) {
      return Math.min(Math.max(index, 0), slideCount - 1);
    }

    return (index + slideCount) % slideCount;
  }

  function trapFocusInsideDialog(event, dialog, onEscape) {
    if (event.key === "Escape") {
      event.preventDefault();
      onEscape();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = getFocusableElements(dialog);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function getFocusableElements(scope) {
    return Array.from(
      scope.querySelectorAll(
        "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
      ),
    ).filter((element) => element instanceof HTMLElement && element.offsetParent !== null);
  }

  function isTypingTarget(target) {
    return (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      (target instanceof HTMLElement && target.isContentEditable)
    );
  }

  function requireElement(selector, scope, label) {
    const element = scope.querySelector(selector);
    if (!element) {
      console.warn(`${LIVE_TUNING.messages.missingElement} (${label}: ${selector})`);
    }
    return element;
  }

  function announceStatus(message) {
    const status = document.querySelector(SELECTORS.shared.status);
    if (status) {
      status.textContent = message;
    }
  }

  function announceDashboardStatus(message) {
    const status = document.querySelector(SELECTORS.dashboard.status) || document.querySelector(SELECTORS.shared.status);
    if (status) {
      status.textContent = message;
    }
  }

  function readStoredTheme(key) {
    try {
      const value = window.localStorage.getItem(key);
      return LIVE_TUNING.theme.modes.includes(value) ? value : null;
    } catch (error) {
      console.warn("No se pudo leer localStorage.", error);
      return null;
    }
  }

  function writeStoredTheme(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.warn("No se pudo escribir localStorage.", error);
    }
  }
})();
