import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { GridComponent } from "./grid.component";
import { WordService } from "../../word.service/word.service";

import Word, { Orientation } from "../../../../../common/lexical/word";

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

  it("Word shoud be validated", () => {
      const word: string = "clue";
      component.word = new Word("clue", "", [0, 0], Orientation.vertical, 0);
      expect(component.word.validated).toBe(false);
      const elem: HTMLElement = document.getElementById("16");
      component.validateWord(word, elem);
      expect(component.word.validated).toBe(true);
  });

  it("Word shoud not be validated", () => {
        let word: string = "oops";
        component.word = new Word("clue", "", [0, 0], Orientation.vertical, 0);
        expect(component.word.validated).toBe(false);
        const elem: HTMLElement = document.getElementById("16");

        component.validateWord(word, elem);
        expect(component.word.validated).toBe(false);

        word = "cluue";
        component.validateWord(word, elem);
        expect(component.word.validated).toBe(false);
    });

});
