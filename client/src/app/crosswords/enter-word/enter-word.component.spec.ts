import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterWordComponent } from './enter-word.component';
import { SquareComponent } from '../square/square.component';

describe('EnterWordComponent', () => {
  let component: EnterWordComponent;
  let fixture: ComponentFixture<EnterWordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterWordComponent,
      SquareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('Should enter a letter', () => {
    component.setLetter('A');
    expect(component.getLetter(0)).toBe('A');
  });

  it ('Should jump to next if case not empty', () => {
    component.setLetter('a');
    expect(component.index).toBe(2);
  });

  it ('Should end if last case (with wrong)', () => {
    component.setLetter('A');
    component.setLetter('A');
    expect(component.correctWord).toBe(false);
  });

  /*it ('Word should not have any black case', () => {
    expect(component.Letters).;
  });*/

  it ('Should undo last', () => {
    component.setLetter('A');
    component.undoLast();
    expect(component.index).toBe(1);
  });

  /*it ('Should return false (wrong word)', () => {
    expect(component.correctWord).toBe(false);
  });*/

  it ('Should return true (right word)', () => {
    component.setLetter('a');
    component.setLetter('c');
    expect(component.correctWord).toBe(true);
  });

  it ('Should not do anything (nothing to undo)', () => {
    component.undoLast();
    expect(component.index).toBe(0);
  });

  it ('Should be letter', () => {
    expect(component.isLetter('a')).toBe(true);
  });

  it ('Should not be letter', () => {
    expect(component.isLetter('1')).toBe(false);
  });

  it ('Should not be letter', () => {
    expect(component.isLetter("dd")).toBe(false);
  });

});
