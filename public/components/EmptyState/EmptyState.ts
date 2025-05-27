export interface EmptyStateConfig {
  description: string;
  className?: string;
}

export class EmptyState {
  private parent: HTMLElement;
  private config: EmptyStateConfig;

  constructor(parent: HTMLElement, config: EmptyStateConfig) {
    this.parent = parent;
    this.config = config;
  }

  render(): void {
    const emptyStateDiv = document.createElement('div');
    emptyStateDiv.className = `empty-state ${this.config.className || ''}`;

    emptyStateDiv.innerHTML = `
          <p class="empty-state__description">${this.config.description}</p>
        `;

    this.parent.appendChild(emptyStateDiv);
  }
}
