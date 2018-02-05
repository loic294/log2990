import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { GridComponent } from "./grid.component";
import { WordService } from "../../word.service/word.service";

describe("GridComponent", () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ GridComponent ],
      providers: [ WordService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should be a letter", () => {
    let letter: string = "b";
    expect(component.isLetter(letter)).toBe(true);

    letter = "e";
    expect(component.isLetter(letter)).toBe(true);

    letter = "o";
    expect(component.isLetter(letter)).toBe(true);

    letter = "D";
    expect(component.isLetter(letter)).toBe(true);

    letter = "L";
    expect(component.isLetter(letter)).toBe(true);
  });

  it("shouldn't be a letter", () => {
    let letter: string = "4";
    expect(component.isLetter(letter)).toBe(false);

    letter = "^";
    expect(component.isLetter(letter)).toBe(false);

    letter = "ç";
    expect(component.isLetter(letter)).toBe(false);

    letter = "à";
    expect(component.isLetter(letter)).toBe(false);

    letter = ";";
    expect(component.isLetter(letter)).toBe(false);

    letter = "?";
    expect(component.isLetter(letter)).toBe(false);

    letter = "#";
    expect(component.isLetter(letter)).toBe(false);
  });

});
