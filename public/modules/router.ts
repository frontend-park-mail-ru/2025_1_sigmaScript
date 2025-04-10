import { RenderActions } from 'flux/Actions';

export const Urls = {
  root: '/',
  auth: '/auth',
  movie: '/movie',
  person: '/person',
  profile: '/profile'
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
      if (args.id && args.data) {
        RenderActions.renderMoviePage(args.id);
      } else if (args.id) {
        if (args.id) {
          RenderActions.renderMoviePage(args.id);
        }
      }
      break;
    case Urls.profile:
      RenderActions.renderProfilePage();
      break;
    default:
      router.go('/');
  }
};

class Router {
  startRouting() {
    const url = new URL(window.location.href);

    handler({ url: url, id: decodeURIComponent(this.getURLMethodAndID(url.pathname).id) });

    window.onpopstate = (e) => {
      if (e.state) {
        handler({ url: new URL(window.location.href), id: e.state.id });
      } else {
        handler({ url: new URL(window.location.href) });
      }
    };
  }

  getCurrentPath(): string {
    return window.location.pathname;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  go(urlPath: string, id?: number | string, data?: any) {
    /* eslint-enable @typescript-eslint/no-explicit-any */
    let url = id ? new URL(`${urlPath}/${id}`, window.location.href) : new URL(urlPath, window.location.href);
    if (data && id) {
      handler({ url: url, id: id, data: data });
      window.history.pushState({ id }, urlPath, `${urlPath}/${id}`);
    } else if (id) {
      handler({ url: url, id: id });
      window.history.pushState({ id }, urlPath, `${urlPath}/${id}`);
    } else if (data) {
      handler({ url: url, data: data });
      window.history.pushState({}, urlPath, urlPath);
    } else {
      handler({ url: url });
      window.history.pushState({}, urlPath, urlPath);
    }
  }

  getURLMethodAndID(url: string): { method: string; id: string } {
    try {
      const urlParts = url.split('/').filter((part) => part !== '');

      if (urlParts.length >= 2) {
        const id = urlParts[urlParts.length - 1]; // Last part is the ID
        const methodParts = urlParts.slice(0, urlParts.length - 1);
        const method = methodParts.length > 0 ? methodParts.join('/') : '';
        return { method: method, id: id };
      } else if (urlParts.length === 1) {
        return { method: urlParts[0], id: '' };
      } else {
        return { method: '', id: '' }; // Empty or root path
      }
    } catch (error) {
      console.error('Invalid URL:', error);
      return { method: '', id: '' };
    }
  }
}

export const router = new Router();
