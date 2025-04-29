import { Article } from '../interfaces/interface';
import { Component, signal, model, inject, HostListener, ViewChild, ElementRef } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { output } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import Fuse from 'fuse.js'
import { ArticleService } from '../services/article.service';


@Component({
  selector: 'app-search-bar',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

constructor(private articleService: ArticleService) {}
keyword=model.required<string>({alias:'keywordSearch'})
processFilter=output<string>({alias:'filterChange'})
keyword$=toObservable(this.keyword)
articles: Article[] = [];
fuseSearchResults:string[]=[]
searchResultsCollapse=false

ngOnInit(): void {
  this.articleService.getArticles().pipe(
    map((res) => res.body ?? [])
  ).subscribe((data) => this.articles = data);
  this.keyword$.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    map(keyword => {
      const fuse = new Fuse(this.articles, {
        keys: ['title','content','author','date'],
        threshold: 0.1,
        shouldSort: true,
        location: 0,
        sortFn:(a,b)=>{return b.score-a.score}
      });
      return fuse.search(keyword).map(result => result.item.title);
    }),
    filter((results)=>results.length>0)
  )
  .subscribe((results) => {this.fuseSearchResults = results}
  );
}

onSearch(){
this.processFilter.emit(this.keyword())
}

@ViewChild('searchBox') searchBox!: ElementRef;
@HostListener('document:click', ['$event'])
onClickOutside(event: MouseEvent) {
  const clickedInside = this.searchBox?.nativeElement.contains(event.target);
  if (!clickedInside) {
    this.searchResultsCollapse = true;
  }
}
isCollapsed() {
  this.searchResultsCollapse = this.keyword().trim() === '';
}

}
