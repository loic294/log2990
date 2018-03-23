// tslint:disable:no-magic-numbers
// tslint:disable:no-floating-promises
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CluesComponent } from "./clues.component";
import { WordService } from "../../word.service/word.service";

describe("CluesComponent", () => {
  let component: CluesComponent;
  let fixture: ComponentFixture<CluesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CluesComponent ],
      providers: [ WordService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CluesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

//   it("should create", () => {
//     expect(component).toBeTruthy();
//   });

//   it("should select clue", () => {
//     component.onSelect(component.clues[0]);
//     expect(component.selectedClue.name).toBe("Clue");
//   });

//   it("should select Worry", () => {
//     component.onSelect(component.clues[6]);
//     expect(component.selectedClue.name).toBe("Worry");
//   });

//   it("should select Crack", () => {
//     component.onSelect(component.clues[10]);
//     expect(component.selectedClue.name).toBe("Crack");
//   });
});
