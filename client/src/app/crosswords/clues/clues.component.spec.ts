// tslint:disable:no-magic-numbers
// tslint:disable:no-floating-promises
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SocketIoConfig, SocketIoModule } from "ng-socket-io";
import { CluesComponent } from "./clues.component";
import { WordService } from "../word.service/word.service";
import { SocketService } from "../socket.service/socket.service";
import { DifficultyService } from "../difficulty.service/difficulty.service";
import Word, { Orientation } from "../../../../../common/lexical/word";
import { GridLoadingService } from "../../crosswords/grid-loading.service/grid-loading.service";

const config: SocketIoConfig = { url: "http://localhost:3000", options: {} };

const CLUES: Array<Word> = [
    new Word("Clue", "Definition of word clue", [1, 6], Orientation.horizontal, 0),
    new Word("Wound", "Definition of word wound", [2, 0], Orientation.horizontal, 1),
    new Word("Finish", "Definition of word finish", [5, 2], Orientation.horizontal, 2),
    new Word("Menu", "Definition of word menu", [7, 1], Orientation.horizontal, 3),
    new Word("Grave", "Definition of word grave", [9, 0], Orientation.horizontal, 4),
    new Word("Dock", "Definition of word dock", [9, 6], Orientation.horizontal, 5),
    new Word("Worry", "Definition of word worry", [2, 0], Orientation.vertical, 6),
    new Word("Adventure", "Definition of word adventure", [1, 4], Orientation.vertical, 7),
    new Word("Crossword", "Definition of word crossword", [1, 6], Orientation.vertical, 8),
    new Word("Push", "Definition of word push", [0, 8], Orientation.vertical, 9),
    new Word("Crack", "Definition of word crack", [5, 9], Orientation.vertical, 10),
];

describe("CluesComponent", () => {
  let component: CluesComponent;
  let fixture: ComponentFixture<CluesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SocketIoModule.forRoot(config) ],
      declarations: [ CluesComponent ],
      providers: [ WordService, SocketService, DifficultyService, GridLoadingService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CluesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.clues = CLUES;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should select clue", () => {
    component.onSelect(component.clues[0]);
    expect(component.selectedClue.name).toBe("Clue");
  });

  it("should select Worry", () => {
    component.onSelect(component.clues[6]);
    expect(component.selectedClue.name).toBe("Worry");
  });

  it("should select Crack", () => {
    component.onSelect(component.clues[10]);
    expect(component.selectedClue.name).toBe("Crack");
  });
});
