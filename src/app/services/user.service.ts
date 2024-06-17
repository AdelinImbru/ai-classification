import { Injectable } from '@angular/core';
import { url } from '../environment';
import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import { IAttribute } from './attribute.service';
import { IMappingTemplate } from './mapping-template.service';


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
  user: IUser;
}

export interface IMappingSetup{
  id:number;
  user: number;
  field_of_activity: string;
  attributes: string[];
  number_of_attribute_values: number;
  mapping_template: any | null;
  use_descriptions: boolean;
  number_of_memory_values: number;
  use_check_prompts: boolean;
}

export interface IContact{
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject: BehaviorSubject<IUser | null>;
  public user: Observable<IUser | null>;
  public is_token_valid: boolean = true
  api = url.apiKey;
  token!: string;
  registeredUser!: IRegisteredUser;
  errorMessage: any;
  headers: HttpHeaders = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  constructor(private http: HttpClient, private router: Router) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }
  register(user: IRegister) {
    return this.http.post(this.api + 'register/', user);
  }
  
  login(user: ILogin): Observable<IToken>{
    return this.http.post<IToken>(this.api + 'token/', user).pipe(map(token => {
      this.userSubject.next(token.user)
      localStorage.setItem('token', token.access);
      localStorage.setItem('loggedUser', JSON.stringify(token.user))
      this.token=token.access
      this.headers = new HttpHeaders({
        Authorization: `Bearer ${token.access}`,
      });
      return token;
  }));
  }

  logout(){
    this.userSubject.next(null)
    this.user=this.userSubject.asObservable()
    localStorage.clear()
    this.is_token_valid=false
    return this.http.post(this.api + 'token/blacklist/', this.token);
  }

  refreshToken(refresh: string) {
    return this.http.post(this.api + 'token/refresh/', refresh);
  }

  verifyToken() {
    let token=localStorage.getItem('token')
    return this.http.post(this.api + 'token/verify/', {'token':token});
  }

  blackListToken() {
    let token=localStorage.getItem('token')
    return this.http.post(this.api + 'token/blacklist/', token);
  }

  getCurrentUser(): Observable<IUser>  {
    return this.http.get<IUser>(this.api + 'profile', { headers: this.headers }).pipe(map(usr => {
      localStorage.removeItem('loggedUser')
      localStorage.setItem('loggedUser', JSON.stringify(usr))
      this.userSubject.next(usr)
      return usr
    }));
  }

  getUserById(id: number) {
    return this.http.get(this.api + 'user/' + id.toString());
  }

  updateUser(user: IUser, token: string): Observable<IUser>{
    return this.http.put<IUser>(this.api + 'profile/update/', user, {
      headers: this.headers,
    });
  }

  deleteUser(id: number) {
    return this.http.delete(this.api + 'user/' + id.toString() + '/');
  }

  getUsers() {
    return this.http.get(this.api + 'users');
  }

  setMappingSetup(mappingSetup: IMappingSetup){
    return this.http.post(this.api + 'mapping-setup/', mappingSetup, {headers: this.headers})
  }

  getMappingSetup(){
    return this.http.get(this.api + 'mapping-setup', {headers: this.headers})
  }

  dbSetup(files: FormData){
    return this.http.post(this.api + 'dbsetup/', files, {headers: this.headers})
  }

  contactSupport(data: any){
    return this.http.post(this.api + 'contact/', data)
  }

  getDbSetup(){
    return this.http.get(this.api + 'dbsetup', {headers: this.headers})
  }
}
