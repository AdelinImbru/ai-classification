import { Injectable } from '@angular/core';
import { url } from '../environment';
import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';


export interface IRegister {
  username: string;
  password: string;
  password2: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface IRegisteredUser {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface ILogin {
  username: string;
  password: string;
}

export interface IUser {
  id: number;
  last_login: string;
  is_superuser: boolean;
  username: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: Date;
  first_name: string;
  last_name: string;
  groups: string[];
  user_permissions: string[];
}

export interface IToken {
  access: string;
  refresh: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  api = url.apiKey;
  user!: IUser;
  token = localStorage.getItem('token');
  registeredUser!: IRegisteredUser;
  errorMessage: any;
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${this.token}`,
  });

  constructor(private http: HttpClient) {}
  register(user: IRegister) {
    return this.http.post(this.api + 'register/', user);
  }

  login(user: ILogin) {
    return this.http.post(this.api + 'token/', user);
  }

  refreshToken(refresh: string) {
    return this.http.post(this.api + 'token/refresh/', refresh);
  }

  verifyToken() {
    return this.http.post(this.api + 'token/verify/', this.token);
  }

  blackListToken() {
    return this.http.post(this.api + 'token/blacklist/', this.token);
  }

  getCurrentUser() {
    return this.http.get(this.api + 'profile', { headers: this.headers });
  }

  getUserById(id: number) {
    return this.http.get(this.api + 'user/' + id.toString());
  }

  updateUser(user: IUser, token: string) {
    return this.http.put(this.api + 'profile/update/', user, {
      headers: this.headers,
    });
  }

  deleteUser(id: number) {
    return this.http.delete(this.api + 'user/' + id.toString() + '/');
  }

  getUsers() {
    return this.http.get(this.api + 'users');
  }
}
