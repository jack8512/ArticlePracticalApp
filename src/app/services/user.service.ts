import { HttpHeaders,HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse, User } from '../interfaces/interface';
import { HttpResponse } from '@angular/common/http';
import { UserStore } from './user-store.service';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url=`${environment.baseUrl}`
  constructor(private http: HttpClient, private userStore: UserStore){}

  private tokenKey='Authorization'
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  login(payload: any): Observable<HttpResponse<ApiResponse>>{
    return this.http.post<ApiResponse>(`${this.url}/users/login`,payload,{
      observe:'response'
    })
  }

  getUser(): Observable<HttpResponse<User>> {
    const token=this.getToken()
    const headers = new HttpHeaders().set('Authorization', token!);
    return this.http.get<User>(`${this.url}/users/profile`,{headers,observe: 'response'})
  }

}
