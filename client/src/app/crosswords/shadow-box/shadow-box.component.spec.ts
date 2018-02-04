import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShadowBoxComponent } from './shadow-box.component';

describe('ShadowBoxComponent', () => {
  let component: ShadowBoxComponent;
  let fixture: ComponentFixture<ShadowBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShadowBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShadowBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
