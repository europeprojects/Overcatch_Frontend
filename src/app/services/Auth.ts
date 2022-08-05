import {createApi} from "../components/ApiClient"; 
import jwtDecode from 'jwt-decode';
import { LoginResponse,CurrentUser } from "app/types/AuthModel";
import Config from "./Config";
import {logoutUser} from "../auth/store/userSlice";

const RM_STORAGE_KEY = '-ov-remember-me';
const AUTH_USER_STORAGE_KEY = '-ov-usr';
const AUTH_TOKEN_STORAGE_KEY = '-ov-token';

class RememberMeStorage {

  static get(): boolean {
    let value = sessionStorage.getItem(RM_STORAGE_KEY);
    return value ? JSON.parse(value) : false
  }

  static set(value: boolean) {
      sessionStorage.setItem(RM_STORAGE_KEY, JSON.stringify(value))
  }
}

class AuthStorage {

  private storage: Storage

  constructor(storage: Storage) {
    this.storage = storage
  }

  clear() {
    this.storage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    this.storage.removeItem(AUTH_USER_STORAGE_KEY)
  }

  isAuthenticated(): boolean {
    return this.storage.getItem(AUTH_TOKEN_STORAGE_KEY) !== null
  }

  setAccessToken(token: string) {
    this.storage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  }


	isAuthTokenValid(access_token: string){
		if (!access_token) {
			return false;
		}
		const decoded = jwtDecode(access_token);
		const currentTime = Date.now() / 1000;
		if (decoded.exp < currentTime) {
			console.warn('access token expired');
			return false;
		}

		return true;
  };
  
  getAccessToken(): string | null {
    return this.storage.getItem(AUTH_TOKEN_STORAGE_KEY);
  }

  setUser(user: CurrentUser) {
    this.storage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user))
  }

  getUser(): CurrentUser | null {
    let data = this.storage.getItem(AUTH_USER_STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data)
      } catch (e) {
      }
    }
    return null
  }
}

export class AuthService {

  static authStorage: AuthStorage = createStorage(RememberMeStorage.get());

  static api = createApi(Config.AUTH_API_URL)

  static login(username: string, password: string, rememberMe: boolean) {
    this.authStorage = createStorage(rememberMe)
    let form = {username, password};
    return this.api.post('/api/login', form)
      .then<LoginResponse>(res => res.data)
      .then(data => {
        if (data.success) {
          AuthService.authStorage.setAccessToken(data.accessToken)
          AuthService.authStorage.setUser(data.user)
          return {
            authenticated: data.success,
            user: data.user
          }
        } else {
          return {authenticated: false};
        }
      })
  }

  static logout() {
    return new Promise(resolve => {
      AuthService.authStorage.clear()



        resolve()
    })
  }

  static isAuthenticated(): boolean {
    return this.authStorage.isAuthenticated()
  }

  static getUser(): CurrentUser | null {
    return this.authStorage.getUser()
  }

  static isRememberMe(): boolean {
    return RememberMeStorage.get()
  }

  static setRememberMe(value: boolean) {
    RememberMeStorage.set(value)
  }

	isAuthTokenValid = access_token => {
		if (!access_token) {
			return false;
		}
		const decoded = jwtDecode(access_token);
		const currentTime = Date.now() / 1000;
		if (decoded.exp < currentTime) {
			console.warn('access token expired');
			return false;
		}

		return true;
  }
  
  static getAccessToken() {
    return this.authStorage.getAccessToken()
  }
}

function createStorage(rememberMe: boolean): AuthStorage {
  // clear old auth session
  if (!rememberMe) {
      sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
  }

  RememberMeStorage.set(rememberMe)

  return new AuthStorage( sessionStorage)
}
