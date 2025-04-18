import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedBoardComponent } from './feed-board.component';

describe('FeedBoardComponent', () => {
  let component: FeedBoardComponent;
  let fixture: ComponentFixture<FeedBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
