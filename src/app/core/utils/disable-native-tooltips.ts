export class DisableNativeTooltips {
  private static initialized = false;
  private static observer?: MutationObserver;

  static init(): void {
    if (this.initialized) return;

    this.addGlobalStyles();
    this.removeAllTitleAttributes();
    this.setupMutationObserver();
    this.setupEventListeners();

    this.initialized = true;
  }

  private static addGlobalStyles(): void {
    const styleId = 'disable-native-tooltips';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Completely disable all native browser tooltips */
      * {
        /* Disable tooltip on all elements */
        -webkit-user-select: inherit;
      }
      
      /* Hide native tooltips using CSS */
      [title]:hover::after,
      [title]:focus::after,
      [title]:hover::before,
      [title]:focus::before {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        content: none !important;
      }
      
      /* Prevent tooltip creation on common elements */
      button,
      .btn,
      input,
      select,
      textarea,
      a,
      span,
      div {
        /* Remove any potential tooltip styling */
        position: relative;
      }
      
      /* Override any Bootstrap or other library tooltip styles */
      .tooltip,
      .bs-tooltip-top,
      .bs-tooltip-bottom,
      .bs-tooltip-left,
      .bs-tooltip-right {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }
    `;

    document.head.appendChild(style);
  }

  private static removeAllTitleAttributes(): void {
    const allElementsWithTitle = document.querySelectorAll('[title]');
    allElementsWithTitle.forEach((element) => {
      element.removeAttribute('title');
    });
  }

  private static setupMutationObserver(): void {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              this.processNewElement(element);
            }
          });
        }

        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'title'
        ) {
          const target = mutation.target as HTMLElement;
          if (target.hasAttribute('title')) {
            target.removeAttribute('title');
          }
        }
      });
    });

    this.observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['title'],
    });
  }

  private static processNewElement(element: HTMLElement): void {
    if (element.hasAttribute('title')) {
      element.removeAttribute('title');
    }

    const childrenWithTitle = element.querySelectorAll('[title]');
    childrenWithTitle.forEach((child) => {
      child.removeAttribute('title');
    });
  }

  private static setupEventListeners(): void {
    const events = ['mouseover', 'mouseenter', 'focus', 'focusin'];

    events.forEach((eventType) => {
      document.addEventListener(
        eventType,
        (event) => {
          const target = event.target as HTMLElement;
          if (target && target.hasAttribute && target.hasAttribute('title')) {
            target.removeAttribute('title');
          }
        },
        true,
      );
    });
  }

  static destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }

    const style = document.getElementById('disable-native-tooltips');
    if (style) {
      style.remove();
    }

    this.initialized = false;
  }
}
