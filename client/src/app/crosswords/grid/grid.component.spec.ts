// tslint:disable:no-floating-promises
// tslint:disable:no-magic-numbers
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { SocketIoModule, SocketIoConfig, Socket } from "ng-socket-io";

import { GridComponent } from "./grid.component";
import { WordService } from "../word.service/word.service";
import { SocketService } from "../socket.service/socket.service";
import { GridService } from "../grid.service/grid.service";
import { DifficultyService } from "../difficulty.service/difficulty.service";
import Word, { Orientation } from "../../../../../common/lexical/word";

const config: SocketIoConfig = { url: "http://localhost:3000", options: {} };

describe("GridComponent", () => {
  let fixture: ComponentFixture<GridComponent>;
  let gridService: GridService;
  let component: GridComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, SocketIoModule.forRoot(config) ],
      declarations: [ GridComponent ],
      providers: [ WordService, SocketService, GridService, DifficultyService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    gridService = new GridService(new WordService(), new SocketService(new Socket(config), new DifficultyService()));
    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component = new GridComponent(gridService);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should return correct data for selectedWord", () => {
    const isOther: boolean = false;
    const word: Word = new Word("Clue", "Definition of word clue", [2, 6], Orientation.vertical, 1);
    gridService.word = word;

    expect(gridService.word).toEqual(word);
    expect(gridService.wordLength(isOther)).toEqual(4);
  });

  it("should highlight word vertically if it's a vertical word", () => {
    const isOther: boolean = false;
    const word: Word = new Word("Clue", "Definition of word clue", [2, 6], Orientation.vertical, 1);
    gridService.word = word;
    const expectedReturn: {} = {"height": "200px",
                                "width": "50px",
                                "border-color": "red"};

    expect(component.highlightStyle(isOther)).toEqual(expectedReturn);
  });

  it("should highlight current selection in red", () => {
    const isOther: boolean = false;
    const word: Word = new Word("Clue", "Definition of word clue", [1, 6], Orientation.horizontal, 0);
    gridService.word = word;
    const expectedReturn: {} = {"height": "50px",
                                "width": "200px",
                                "border-color": "red"};

    expect(gridService.word).toEqual(word);
    expect(gridService.wordLength(isOther)).toEqual(4);
    expect(component.highlightStyle(isOther)).toEqual(expectedReturn);

  });

  it("should highlight other player's current selection in blue", () => {
    const isOther: boolean = true;
    const word: Word = new Word("Clue", "Definition of word clue", [2, 6], Orientation.horizontal, 1);
    gridService.selectOtherPlayerWord(word);

    const expectedReturn: {} = {"height": "50px",
                                "width": "200px",
                                "border-color": "blue"};

    expect(component.highlightStyle(isOther)).toEqual(expectedReturn);

  });

  it("should highlight other player's selection vertically if it's a vertical word ", () => {
    const isOther: boolean = true;
    const word: Word = new Word("Clues", "Definition of word clue", [2, 6], Orientation.vertical, 1);
    gridService.selectOtherPlayerWord(word);

    const expectedReturn: {} = {"height": "250px",
                                "width": "50px",
                                "border-color": "blue"};

    expect(component.highlightStyle(isOther)).toEqual(expectedReturn);

  });

});
