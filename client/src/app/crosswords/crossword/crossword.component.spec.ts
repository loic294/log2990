import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'

import { CrosswordComponent } from './crossword.component';
import { CluesComponent } from '../clues/clues.component';
import { DifficultyComponent } from '../difficulty/difficulty.component';
import { GridComponent } from '../grid/grid.component';

import { WordService } from '../../word.service'

describe('CrosswordComponent', () => {
  let component: CrosswordComponent;
  let fixture: ComponentFixture<CrosswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ 
        CrosswordComponent,
        CluesComponent,
        DifficultyComponent,
        GridComponent,
       ],
       providers: [ WordService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrosswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
