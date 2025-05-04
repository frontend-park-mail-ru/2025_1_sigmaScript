import { dispatcher } from 'flux/Dispatcher';
import { Action } from 'types/Dispatcher.types';
import { RenderActionTypes, TabsActionTypes, UserPageTypes } from 'flux/ActionTypes';
import { UserPageState, Listener, UserData, UpdateUserData } from 'types/UserPage.types';
import { initialStore } from './InitialStore';
import { UserPage } from 'pages/UserPage/UserPage';
import { AUTH_URL } from 'public/consts';
import request from 'utils/fetch';
import { serialize, deserialize } from 'utils/Serialize';
import { getUser, noSession, PopupActions, updateUserPage } from 'flux/Actions';
import { router } from 'modules/router';
import { BASE_URL } from 'public/consts';
import { MovieDataJSON } from 'types/main_page.types';
import { PersonCardInfo } from 'types/Person.types';
import { Review } from 'types/movie_page.types';

class UserPageStore {
  private state: UserPageState;
  private listeners: Array<Listener>;

  constructor() {
    this.state = {
      parent: null,
      userData: null,
      movieCollection: new Map<number, MovieDataJSON>(),
      actorCollection: new Map<number, PersonCardInfo>(),
      reviews: new Map<number, Review>(),
      needTabID: null
    };
    this.listeners = [];

    dispatcher.register(this.handleActions.bind(this));
  }

  #formatDate(date: string) {
    const dateObj = new Date(date);
    const dateOnly = dateObj.toISOString().split('T')[0];
    return dateOnly;
  }

  private async handleActions(action: Action): Promise<void> {
    switch (action.type) {
      case RenderActionTypes.RENDER_PROFILE_PAGE:
        if (action.payload) {
          this.state.userData = action.payload as UserData;
        }
        this.renderUserPage(this.state.userData as UserData);
        break;
      case UserPageTypes.UPDATE_USER_PAGE:
        this.state.userData = action.payload as UserData;
        this.emitChange();
        break;
      case UserPageTypes.NO_SESSION:
        if (router.getCurrentPath() === '/profile') {
          router.go('/auth');
        }
        break;
      case UserPageTypes.GET_USER:
        try {
          const url = AUTH_URL + 'session';
          const res = await request({ url: url, method: 'GET', credentials: true });

          let userData = deserialize(res.body) as UserData;
          userData.createdAt = this.#formatDate(userData.createdAt);
          this.state.userData = userData;

          updateUserPage(userData);
        } catch {
          // TODO: пофиксить ошибку
          // console.log(error.errorDetails.error || 'Unknown error');
          noSession();
        }
        break;
      case UserPageTypes.UPDATE_USER:
        try {
          const payload = action.payload as UpdateUserData;

          const url = BASE_URL + 'users';
          const body = serialize({
            ...this.state.userData,
            ...payload
          }) as Record<string, unknown>;
          await request({ url: url, method: 'POST', body, credentials: true });

          getUser();
        } catch {
          // TODO: пофиксить ошибку
          // console.log(error.errorDetails.error);
        }
        break;
      case UserPageTypes.LOGOUT_USER:
        this.state.userData = null;
        try {
          const url = AUTH_URL + 'logout';
          await request({ url: url, method: 'POST', credentials: true });
        } catch {
          // TODO: пофиксить ошибку
          // console.log(error.errorDetails.error);
        }
        break;
      case UserPageTypes.UPDATE_USER_AVATAR:
        try {
          const selectedFile = action.payload as Blob;
          const formData = new FormData();
          formData.append('image', selectedFile);

          const url = BASE_URL + 'users/avatar';

          await fetch(url, {
            method: 'POST',
            body: formData,
            credentials: 'include'
          });

          getUser();
        } catch {
          PopupActions.showPopup({
            message: 'Не удалось загрузить аватар!',
            duration: 2500,
            isError: true
          });
        }
        break;
      case UserPageTypes.ADD_MOVIE_TO_FAVORITE: {
        const movieData = action.payload as MovieDataJSON;
        this.state.movieCollection.set(movieData.id, movieData);
        PopupActions.showPopup({
          message: 'Фильм добавлен в избранное!',
          duration: 2500,
          isError: false
        });

        // заготовка под бд
        // try {
        //   const url = BASE_URL + 'movie/' + `${movieData.id}/` + 'favorite';
        //   await request({ url: url, method: 'POST', credentials: true });
        //   this.state.movieCollection.set(movieData.id, movieData);
        //   PopupActions.showPopup({
        //     message: 'Фильм добавлен в избранное!',
        //     duration: 2500,
        //     isError: false
        //   });
        // } catch {
        //   PopupActions.showPopup({
        //     message: 'Не удалось добавить фильм в избранное!',
        //     duration: 2500,
        //     isError: true
        //   });
        // }

        break;
      }
      case UserPageTypes.ADD_ACTOR_TO_FAVORITE: {
        const actor = action.payload as PersonCardInfo;
        this.state.actorCollection.set(actor.personID as number, actor);

        PopupActions.showPopup({
          message: 'Актёр добавлен в избранное!',
          duration: 2500,
          isError: false
        });

        // заготовка под бд
        // try {
        //   const url = BASE_URL + 'name/' + `${actor.personID}/` + 'favorite';
        //   await request({ url: url, method: 'POST', credentials: true });
        //   this.state.actorCollection.set(actor.personID as number, actor);
        //   PopupActions.showPopup({
        //     message: 'Актёр добавлен в избранное!',
        //     duration: 2500,
        //     isError: false
        //   });
        // } catch {
        //   PopupActions.showPopup({
        //     message: 'Не удалось добавить актёра в избранное!',
        //     duration: 2500,
        //     isError: true
        //   });
        // }

        break;
      }
      case UserPageTypes.ADD_REVIEW: {
        const review = action.payload as Review;
        this.state.reviews.set(review.movieID as number, review);
        break;
      }
      case TabsActionTypes.FAVORITE_TOGGLE: {
        this.state.needTabID = action.payload as string;
        this.emitChange();
        this.state.needTabID = null;
        break;
      }
      case UserPageTypes.REMOVE_MOVIE_FROM_FAVORITE: {
        const movieID = action.payload as number;
        this.state.movieCollection.delete(movieID);

        PopupActions.showPopup({
          message: 'Фильм успешно удалён из избранного!',
          duration: 2500,
          isError: false
        });

        // заготовка под бд
        // try {
        //   const url = BASE_URL + 'movie/' + `${movieID}/` + 'favorite';
        //   await request({ url: url, method: 'DELETE', credentials: true });
        //   this.state.movieCollection.delete(movieID);
        //   PopupActions.showPopup({
        //     message: 'Фильм успешно удалён из избранного!',
        //     duration: 2500,
        //     isError: false
        //   });
        // } catch {
        //   PopupActions.showPopup({
        //     message: 'Не удалось удалить фильм из избранного!',
        //     duration: 2500,
        //     isError: true
        //   });
        // }

        break;
      }
      case UserPageTypes.REMOVE_ACTOR_FROM_FAVORITE: {
        const actorID = action.payload as number;
        this.state.actorCollection.delete(actorID);

        PopupActions.showPopup({
          message: 'Актёр успешно удалён из избранного!',
          duration: 2500,
          isError: false
        });

        // заготовка под бд
        // try {
        //   const url = BASE_URL + 'name/' + `${actorID}/` + 'favorite';
        //   await request({ url: url, method: 'DELETE', credentials: true });
        //   this.state.actorCollection.delete(actorID);
        //   PopupActions.showPopup({
        //     message: 'Актёр успешно удалён из избранного!',
        //     duration: 2500,
        //     isError: false
        //   });
        // } catch {
        //   PopupActions.showPopup({
        //     message: 'Не удалось удалить актёра из избранного!',
        //     duration: 2500,
        //     isError: true
        //   });
        // }

        break;
      }
      default:
        break;
    }
  }

  private renderUserPage(userData: UserData) {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      return;
    }

    initialStore.destroyStored();
    const userPage = new UserPage(rootElement, userData);
    initialStore.store(userPage);

    userPage.render();
  }

  subscribe(listener: Listener): void {
    this.listeners.push(listener);
  }

  unsubscribe(listener: Listener): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private emitChange(): void {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  getState(): UserPageState {
    return this.state;
  }

  getMoviesCount(): number {
    return this.state.movieCollection.size || 0;
  }

  getActorCount(): number {
    return this.state.actorCollection.size || 0;
  }

  getAverageRating(): number {
    if (this.state.reviews.size === 0) {
      return 0;
    }

    let totalRating = 0;
    for (const review of this.state.reviews.values()) {
      totalRating += review.score || 0;
    }

    const average = totalRating / this.state.reviews.size;
    return Math.round(average * 10) / 10;
  }
}

export default new UserPageStore();
