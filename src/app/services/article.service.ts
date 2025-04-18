import { HttpClient, HttpHeaders,HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { ApiResponse } from "../interfaces/interface";
import { Article } from "../interfaces/interface";


@Injectable({providedIn:'root'})
export class ArticleService{
    private url=`${environment.baseUrl}`

  constructor(private http:HttpClient){}

  getToken(): string | null {
    return localStorage.getItem('Authorization');
  }

  getArticles(): Observable<HttpResponse<Article[]>>{
    const token=this.getToken()
    // const token=this.getToken() || ""

    const headers = new HttpHeaders().set('Authorization',token!);

    return this.http.get<Article[]>(`${this.url}/articles`, {headers, observe:'response'})
  }
}
