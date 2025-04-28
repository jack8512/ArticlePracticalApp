import { HttpHeaders,HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse, User } from '../interfaces/interface';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url=`${environment.baseUrl}`
  constructor(private http: HttpClient){}

  login(payload: any): Observable<HttpResponse<ApiResponse>>{
    return this.http.post<ApiResponse>(`${this.url}/users/login`,payload,{
      observe:'response'
    })
  }

  getUser(token: any): Observable<HttpResponse<User>> {
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.get<User>(`${this.url}/users/profile`,{headers,observe: 'response'})
  }
}
