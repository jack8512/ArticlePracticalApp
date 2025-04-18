import { HttpResponse } from '@angular/common/http';
import { ArticleService } from './../services/article.service';
import { ApiResponse, Article } from './../interfaces/interface';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, tap } from 'rxjs';
import {marked} from 'marked'
import DOMPurify from 'dompurify'
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtml } from '@angular/platform-browser';

type SanitizedArticle = Omit<Article, 'content'> & {
  content: SafeHtml;
  previewContent: SafeHtml;
  isCollapsed: Boolean
};

@Component({
  selector: 'app-feed-board',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './feed-board.component.html',
  styleUrl: './feed-board.component.css'
})
export class FeedBoardComponent {

  constructor(private articleService: ArticleService, private sanitizer: DomSanitizer){}

  articles: SanitizedArticle[] = [];

  ngOnInit() {
    this.articleService.getArticles().pipe(
      map((res: HttpResponse<Article[]>) => {
        const articles = res.body ?? [];
        return articles.map(article => {
        return {
           ...article,
          content: this.toSafeHtml(article.content),
          previewContent: this.toSafeHtml(article.content, 50),
          isCollapsed: true}
        });
      })
    ).subscribe({
      next: (articles) => {
        this.articles = articles;
      },
      error: (err) => {
        console.error('API 錯誤：', err);
      }
    });
  }

  toSafeHtml(markdown: string, limit?: number): SafeHtml {
    const content = limit ? markdown.slice(0, limit) + '...' : markdown;
    const rawHtml = marked.parse(content) as string;
    const sanitized = DOMPurify.sanitize(rawHtml);
    return this.sanitizer.bypassSecurityTrustHtml(sanitized);
  }

  toggleContent(index: number) {
    this.articles[index].isCollapsed = !this.articles[index].isCollapsed;
  }
}
