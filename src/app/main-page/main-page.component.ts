import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { FeedBoardComponent } from '../feed-board/feed-board.component';


@Component({
  selector: 'app-main-page',
  standalone:true,
  imports: [CommonModule, SearchBarComponent, FeedBoardComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  @ViewChild('feedBoard') feedBoard!:FeedBoardComponent

  onSearch(keyword: string){
      this.feedBoard.searchKeyword(keyword)
  }

  keywordSearch: string=''

}
