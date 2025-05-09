import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url=`${environment.baseUrl}`
  private tokenKey='Authorization'
  isLoggedIn$ = new BehaviorSubject<boolean>(false);
  user = new BehaviorSubject<User|null>(null);

  constructor(private http: HttpClient,private userService:UserService) {}

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  checkLoginStatus(): void {
    this.isLoggedIn().subscribe((status)=>this.isLoggedIn$.next(status))
  }
  logout(){
    this.clearToken()
    this.clearUser()
    this.isLoggedIn$.next(false)
  }

  isLoggedIn(): Observable<boolean> {
    const token = this.getToken();
    if (!token) return of(false);
    const headers = new HttpHeaders().set(this.tokenKey, token);
    return this.http.get(`${this.url}/users/auth`, { headers }).pipe(
      map(() =>{
        this.isLoggedIn$.next(true);
        return true
      }),
      catchError(() => {
        this.isLoggedIn$.next(false)
        return  of(false)})
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

  // auth(payload) {
  //   this.userService.login(payload)
  //       .pipe(concatMap((user) => this.user.next(user))).subscribe()
  // }
}
