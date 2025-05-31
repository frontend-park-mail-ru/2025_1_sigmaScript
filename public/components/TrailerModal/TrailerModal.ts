import template from './TrailerModal.hbs';

export type TrailerModalConfig = {
  trailerUrl: string;
};

export class TrailerModal {
  #parent: HTMLElement;
  #config: TrailerModalConfig;
  #modalElem: HTMLElement | null = null;

  constructor(parent: HTMLElement, config: TrailerModalConfig) {
    this.#parent = parent;
    this.#config = config;
  }

  #isYouTubeUrl(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('youtube.com/embed');
  }

  #processYouTubeUrl(url: string): string {
    // Если это уже embed URL, возвращаем как есть
    if (url.includes('/embed/')) {
      return url;
    }
    
    // Обрабатываем обычные YouTube URL
    let videoId = '';
    
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      videoId = urlParams.get('v') || '';
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }

  render() {
    this.destroy();
    
    const isYoutube = this.#isYouTubeUrl(this.#config.trailerUrl);
    const processedUrl = isYoutube ? this.#processYouTubeUrl(this.#config.trailerUrl) : this.#config.trailerUrl;
    
    const modalHTML = template({ 
      trailerUrl: processedUrl,
      isYoutube: isYoutube
    });
    
    const wrapper = document.createElement('div');
    wrapper.innerHTML = modalHTML;
    this.#modalElem = wrapper.firstElementChild as HTMLElement;
    this.#parent.appendChild(this.#modalElem);
    this.#modalElem.querySelector('.trailer-modal__close')?.addEventListener('click', () => this.destroy());
    this.#modalElem.addEventListener('click', (e) => {
      if (e.target === this.#modalElem) this.destroy();
    });
  }

  destroy() {
    this.#modalElem?.remove();
    this.#modalElem = null;
  }
}

export default TrailerModal;
