import { makeAutoObservable } from 'mobx';

/** Persist key — AsyncStorage hydration добавим позже */
export const SESSION_USER_ID_KEY = '@mecenate/user_id';

class SessionStore {
  userId: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUserId(id: string | null) {
    this.userId = id;
  }

  get authorizationHeader(): string | null {
    return this.userId != null && this.userId !== '' ? `Bearer ${this.userId}` : null;
  }
}

export const sessionStore = new SessionStore();
