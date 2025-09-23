// Core Ripple Component System
export interface RippleComponent {
  element: HTMLElement;
  render(): void;
  mount(parent: HTMLElement): void;
  unmount(): void;
  update(props?: any): void;
}

export interface RippleComponentOptions {
  tag?: string;
  className?: string;
  props?: Record<string, any>;
  children?: RippleComponent[];
}

export abstract class BaseRippleComponent implements RippleComponent {
  element: HTMLElement;
  protected props: Record<string, any>;
  protected children: RippleComponent[] = [];

  constructor(options: RippleComponentOptions = {}) {
    this.element = document.createElement(options.tag || 'div');
    this.props = options.props || {};
    
    if (options.className) {
      this.element.className = options.className;
    }
    
    if (options.children) {
      this.children = options.children;
    }
  }

  abstract render(): void;

  mount(parent: HTMLElement): void {
    this.render();
    parent.appendChild(this.element);
    this.children.forEach(child => child.mount(this.element));
  }

  unmount(): void {
    this.children.forEach(child => child.unmount());
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  update(props?: any): void {
    if (props) {
      this.props = { ...this.props, ...props };
    }
    this.render();
  }

  protected createElement(tag: string, className?: string, content?: string): HTMLElement {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.textContent = content;
    return element;
  }

  protected createIcon(name: string, className?: string): HTMLElement {
    const icon = this.createElement('span', `icon ${className || ''}`);
    icon.setAttribute('data-icon', name);
    // Simple icon system - in production, you'd use SVG sprites or icon fonts
    icon.innerHTML = this.getIconSvg(name);
    return icon;
  }

  private getIconSvg(name: string): string {
    const icons: Record<string, string> = {
      'menu': '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
      'search': '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7 11c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zM11 11l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
      'filter': '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
      'more': '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="3" cy="8" r="1"/><circle cx="8" cy="8" r="1"/><circle cx="13" cy="8" r="1"/></svg>',
      'check': '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3 3 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      'chevron-down': '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      'x': '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
    };
    return icons[name] || icons['menu'];
  }
}