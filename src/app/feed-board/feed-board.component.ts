import { HttpResponse } from '@angular/common/http';
import { ArticleService } from './../services/article.service';
import { ApiResponse, Article } from './../interfaces/interface';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, map, tap } from 'rxjs';
import {marked, Renderer} from 'marked'
import DOMPurify from 'dompurify'
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import Fuse from 'fuse.js';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

// 正確 TypeScript 的 marked renderer 設定
const renderer = new Renderer();
renderer.code = ({ text, lang }: { text: string; lang?: string; escaped?: boolean }) => {
  const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
  const highlighted = hljs.highlight(text, { language }).value;
  return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
};
marked.setOptions({ renderer });


type SanitizedArticle = Omit<Article, 'content'> & {
  content: SafeHtml;
  previewContent: SafeHtml;
  rawContent:string;
  isCollapsed: Boolean;
  editable: boolean;
  isEditing: boolean;
  editingContent?: string;
};

@Component({
  selector: 'app-feed-board',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feed-board.component.html',
  styleUrl: './feed-board.component.css'
})
export class FeedBoardComponent {

  constructor(private articleService: ArticleService, private sanitizer: DomSanitizer){}

  articles: SanitizedArticle[] = [];
  allArticles: SanitizedArticle[] = [];

  ngOnInit() {
    this.articleService.getArticles().pipe(
      map((res: HttpResponse<Article[]>) => {
        const articles = res.body ?? [];
        return articles.map(article => {
        return {
           ...article,
          content: this.toSafeHtml(article.content),
          previewContent: this.toSafeHtml(article.content, 100),
          rawContent:article.content,
          editable: true,
          isCollapsed: true,
          isEditing: false
        }
        });
      })
    ).subscribe({
      next: (articles) => {
        this.articles = articles;
        this.allArticles=[...articles]
      },
      error: (err) => {
        console.error('API 錯誤：', err);
      }
    });
  }

  highlightCode() {
    setTimeout(() => {
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }, 0);
  }

  toSafeHtml(markdown: string, limit?: number): SafeHtml {
    const content = limit ? markdown.slice(0, limit) + '...' : markdown;
    const rawHtml = marked.parse(content) as string;
    const sanitized = DOMPurify.sanitize(rawHtml);
    return sanitized //this.sanitizer.bypassSecurityTrustHtml(sanitized);
  }

  toggleContent(index: number) {
    this.articles[index].isCollapsed = !this.articles[index].isCollapsed;
  }

  getRowCount(content: any): number {
    const lineCount = content.length/50;
    return Math.max(10, lineCount);
  }

  enterEdit(index: number) {
    this.articles[index].isEditing = true;
    this.articles[index].editingContent = this.articles[index].rawContent || '';
  }

  cancelEdit(article: SanitizedArticle) {
    article.editingContent = article.rawContent;
    article.isEditing = false;
    article.isCollapsed = true;
  }

  saveSubmit(index: number){
    console.log(this.articles[index].editingContent);

  }
  //搜尋欄查詢
  searchKeyword(keyword: string): void{
    if(!keyword || keyword.trim()===''){
      this.articles=[...this.allArticles]
      return
    }
    const fuse=new Fuse(this.allArticles,{keys:['title','content','author','date'],
      threshold: 0.1,
      shouldSort: true,
      location: 0,
      sortFn:(a,b)=>{return b.score-a.score}
    })
    const results=fuse.search(keyword)
    this.articles=results.map(result=>result.item)
  }
}


