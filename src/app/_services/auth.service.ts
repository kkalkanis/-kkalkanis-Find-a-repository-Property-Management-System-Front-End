import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../classes/user';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }
  _username !: string;
  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions);
  }

  register(username: string, password: string, email: string,role:any): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username,
      password,
      email,
      role
    }, httpOptions);
  }

  setUsername(username: string): string {
    this._username = username;
    return this._username;
  }

  getUser(): string {
    return this._username;
  }
}
