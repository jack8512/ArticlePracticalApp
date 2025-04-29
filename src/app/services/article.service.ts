import { Article } from '../interfaces/interface';
import { HttpClient, HttpHeaders,HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";


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
  postArticle(article:Article):Observable<HttpResponse<Article>>{
    const token=this.getToken()
    const headers = new HttpHeaders().set('Authorization',token!);
    return this.http.post<Article>(`${this.url}/articles/create`,article,{headers,observe:'response'})
  }

  updateArticle(article: Article):Observable<HttpResponse<Article[]>>{
    const token: any = this.getToken();
    const headers = new HttpHeaders().set('Authorization', token);
   return this.http.put<Article[]>(`${this.url}/articles/update/${article._id}`, article ,{ observe: 'response',headers })
  }
}
