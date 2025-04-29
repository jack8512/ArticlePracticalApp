import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url=`${environment.baseUrl}`
  private tokenKey='Authorization'
  // private loggedIn$=new BehaviorSubject<boolean>(this.hasToken())
  // private hasToken(): boolean {
  //   return !!localStorage.getItem('Authorization');
  // }

  // isLoggedIn$(): Observable<boolean>{
  //   return this.loggedIn$.asObservable()
  // }
  // logout(): void{
  //   this.clearToken()
  //   this.clearUser()
  //   this.loggedIn$.next(false)
  // }
  constructor(private http: HttpClient) {}

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }


  isLoggedIn(): Observable<boolean> {
    const token = this.getToken();
    if (!token) return of(false);
    const headers = new HttpHeaders().set(this.tokenKey, token);
    return this.http.get(`${this.url}/users/auth`, { headers }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }
  saveUser(user:User | undefined){
    localStorage.setItem('userInfo',JSON.stringify(user))
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
  }
  clearUser() {
    localStorage.removeItem('userInfo');
  }
}
