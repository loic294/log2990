import { ComponentFixture, TestBed, async } from "@angular/core/testing";

import { ResultsComponent } from "./results.component";
import { ResultsService } from "../results-service/results.service";

describe("ResultsComponent", () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsComponent ],
      providers: [
          ResultsService
      ]
    })
    .compileComponents().catch((error) => {
        throw error;
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
