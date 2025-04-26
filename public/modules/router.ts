import { RenderActions } from 'flux/Actions';
import { ScrollPositionState } from 'public/consts';

export const Urls = {
  root: '/',
  auth: '/auth',
  movie: '/movie',
  person: '/name',
  profile: '/profile',
  csat: '/csat'
};

type lastScrollState = {
  scrollPosition: ScrollPositionState | null;
  lastURLhref: string | null;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
interface handlerInput {
  url: URL;
  id?: string | number;
  data?: any;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export const handler = (args: handlerInput) => {
  switch (args.url.pathname) {
    case Urls.root:
      RenderActions.renderMainPage();
      break;
    case Urls.auth:
      RenderActions.renderAuthPage();
      break;
    case `${Urls.person}/${args.id}`:
      if (args.id) {
        RenderActions.renderPersonPage(args.id);
      }
      break;
    case `${Urls.movie}/${args.id}`:
      if (args.id) {
        RenderActions.renderMoviePage(args.id);
      } else {
        router.go(Urls.root);
      }
      break;
    case Urls.profile:
      RenderActions.renderProfilePage(args.data);
      break;
    case Urls.csat:
      RenderActions.renderCsatPage();
      break;
    default:
      window.location.pathname = '/';
      router.go('/');
  }
};

class Router {
  private pageLastScrollState: lastScrollState;

  constructor() {
    this.pageLastScrollState = {
      scrollPosition: null,
      lastURLhref: null
    };
  }

  startRouting() {
    const url = new URL(window.location.href);

    this.pageLastScrollState = {
      scrollPosition: this.saveScrollPosition(),
      lastURLhref: window.location.href
    };

    handler({ url: url, id: this.getURLMethodAndID(url.pathname).id });

    window.onpopstate = (e) => {
      if (e.state && e.state.id) {
        handler({ url: new URL(window.location.href), id: e.state.id });
      } else {
        handler({ url: new URL(window.location.href) });
      }
      if (e.state && e.state.scrollPosition) {
        const { scrollX, scrollY } = e.state.scrollPosition;

        setTimeout(() => {
          window.scrollTo(scrollX, scrollY);
        }, 0);
      }
    };
  }

  saveScrollPosition(): ScrollPositionState {
    return {
      scrollX: window.scrollX,
      scrollY: window.scrollY
    };
  }

  getCurrentPath(): string {
    return window.location.pathname;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  go(urlPath: string, data?: any) {
    /* eslint-enable @typescript-eslint/no-explicit-any */
    const { method, id } = this.getURLMethodAndID(urlPath);

    let url = id ? new URL(`${method}/${id}`, window.location.href) : new URL(method, window.location.href);

    if (data && id) {
      handler({ url: url, id: id, data: data });
      window.history.pushState({ id }, urlPath, urlPath);
    } else if (id) {
      handler({ url: url, id: id });
      window.history.pushState({ id }, urlPath, urlPath);
    } else if (data) {
      handler({ url: url, data: data });
      window.history.pushState({}, urlPath, urlPath);
    } else {
      handler({ url: url });
      window.history.pushState({}, urlPath, urlPath);
    }

    if (window.location.href === this.pageLastScrollState.lastURLhref && this.pageLastScrollState.scrollPosition) {
      window.scrollTo(this.pageLastScrollState.scrollPosition.scrollX, this.pageLastScrollState.scrollPosition.scrollY);
    } else {
      this.pageLastScrollState = {
        scrollPosition: this.saveScrollPosition(),
        lastURLhref: window.location.href
      };
      window.scrollTo(0, 0);
    }
  }

  getURLMethodAndID(url: string): { method: string; id: string | undefined } {
    try {
      const urlParts = url.split('/').filter((part) => part !== '');

      if (urlParts.length >= 2) {
        const id = urlParts[urlParts.length - 1]; // Last part is the ID
        const methodParts = urlParts.slice(0, urlParts.length - 1);
        const method = methodParts.length > 0 ? '/' + methodParts.join('/') : '/';
        return { method: method, id: id };
      } else if (urlParts.length === 1) {
        return { method: '/' + urlParts[0], id: undefined };
      } else {
        return { method: '/', id: undefined }; // Empty or root path
      }
    } catch (error) {
      return { method: '/', id: undefined };
    }
  }
}

export const router = new Router();
