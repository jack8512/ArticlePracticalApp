import { UserStore } from './../services/user-store.service';
import { ArticleService } from '../services/article.service';
import { ApiResponse, Article, User } from '../interfaces/interface';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, map, tap, forkJoin } from 'rxjs';
import {marked, Renderer} from 'marked'
import DOMPurify from 'dompurify'
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

  constructor(private articleService: ArticleService,  private userStore:UserStore){}

  articles: SanitizedArticle[] = [];
  allArticles: SanitizedArticle[] = [];
  user:User | null=null


  @ViewChild('articleDialog') articleDialog!: ElementRef<HTMLDialogElement>
  newArticleData = {
    title: '',
    author: '',
    content: '',
    date: new Date(),
    userId: ''
  };

  openDialog(){
    this.newArticleData={
    title:'',
    author:`${this.user?.first_name} ${this.user?.last_name}`,
    content:'',
    date:new Date,
    userId:String(this.user?.id)
    }
    this.articleDialog.nativeElement.showModal()
    // console.log(this.newArticleData);
  }

  closeDialog(){
    this.articleDialog.nativeElement.close()
  }
  submitNewArticle() {
    // console.log(this.newArticleData);
    this.articleService.postArticle(this.newArticleData).pipe(
      tap((res)=>{if(res.status==201){
        alert('新增成功')
        this.ngOnInit()
      }else{
        alert('新增失敗')
      }})
    ).subscribe()
    this.closeDialog();
  }

  ngOnInit() {
    forkJoin({
      userRes: this.userStore.getUser(),
      articleRes: this.articleService.getArticles()
    }).pipe(
      map(({ userRes, articleRes }) => {
        const user = userRes;
        const userId = user?.id;
        const articles = articleRes.body ?? [];

        const transformed = articles.map(article => {
          const content = article.content;
          return {
            ...article,
            content: this.toSafeHtml(content),
            date: String(article.date).split('T')[0],
            previewContent: this.toSafeHtml(content, 100),
            rawContent: content,
            editable: article.userId === userId,
            isCollapsed: true,
            isEditing: false
          };
        });

        return { user, transformed };
      })
    ).subscribe({
      next: ({ user, transformed }) => {
        this.user = user;
        this.articles = transformed;
        this.allArticles = structuredClone(transformed);
      },
      error: (err) => {
        console.error('初始化失敗：', err);
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
    return Math.max(20, lineCount);
  }

  enterEdit(index: number) {
    this.articles[index].isEditing = true;
    this.articles[index].editingContent = this.articles[index].rawContent || '';
  }

  cancelEdit(article: SanitizedArticle) {
    article.editingContent = article.rawContent;
    article.isEditing = false;
    article.isCollapsed = false;
  }

  saveSubmit(index: number){
    if(confirm('確定送出嗎？')){
      const updateArticle={
        ...this.articles[index],
        "content": this.articles[index].editingContent|| '',
        "date": new Date().toISOString().split('T')[0]
      }
      // console.log('更新文章',updateArticle);
      this.articleService.updateArticle(updateArticle).pipe(
        tap((res)=>{
          if(res.status===201){alert('更新成功');
            this.ngOnInit()
          }
          else{alert('更新失敗')}
        })
      ).subscribe()
    }
  }

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


