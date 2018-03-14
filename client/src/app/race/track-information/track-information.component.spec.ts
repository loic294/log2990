import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TrackInformationComponent } from "./track-information.component";

describe("TrackInformationComponent", () => {
  let component: TrackInformationComponent;
  let fixture: ComponentFixture<TrackInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
