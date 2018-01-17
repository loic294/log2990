import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core'
import { DifficultyComponent } from './difficulty.component';
//import { By } from '@angular/platform-browser';

describe('DifficultyComponent', () => {
  let component: DifficultyComponent;
  let fixture: ComponentFixture<DifficultyComponent>;
  let debugElement: DebugElement;
  //let htmlElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DifficultyComponent]
    }).compileComponents();
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DifficultyComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;//.query(By.css('h2'));
    //htmlElement = debugElement.nativeElement;

    fixture.detectChanges();
  })

  it ('Should create DifficultyComponent', () => {
    expect(component).toBeTruthy();
  })


  it('Should display Easy', () => {
    
    component.onSelect(component.difficulties[0]);
    fixture.detectChanges();
    expect(component.selectedDifficulty).toBe('Easy');
  })

  it('Should display Normal', () => {
    
    component.onSelect(component.difficulties[1]);
    expect(component.selectedDifficulty).toBe('Normal');
  })

  it('Should display Hard', () => {
    
    component.onSelect(component.difficulties[2]);
    expect(component.selectedDifficulty).toBe('Hard');
  })

});
