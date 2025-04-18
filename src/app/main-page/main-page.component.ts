import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

}
