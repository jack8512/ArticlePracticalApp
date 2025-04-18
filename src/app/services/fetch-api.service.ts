import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/interface';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FetchAPIService {
  private url=`${environment.baseUrl}`
  constructor(private http: HttpClient){}

  login(payload: any): Observable<HttpResponse<ApiResponse>>{
    return this.http.post<ApiResponse>(`${this.url}/users/login`,payload,{
      observe:'response'
    })
  }
  getUser(): Observable<HttpResponse<ApiResponse>> {
    return this.http.get<ApiResponse>(`${this.url}`,{
      observe:'response'
    })
  }
}
