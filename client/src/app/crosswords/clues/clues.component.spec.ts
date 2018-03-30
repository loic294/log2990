// tslint:disable:no-magic-numbers
// tslint:disable:no-floating-promises
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SocketIoConfig, SocketIoModule } from "ng-socket-io";
import { CluesComponent } from "./clues.component";
import { WordService } from "../word.service/word.service";
import { SocketService } from "../socket.service/socket.service";
import { DifficultyService } from "../difficulty.service/difficulty.service";

const config: SocketIoConfig = { url: "http://localhost:3000", options: {} };

import CLUES from "../mock-words";

describe("CluesComponent", () => {
  let component: CluesComponent;
  let fixture: ComponentFixture<CluesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SocketIoModule.forRoot(config) ],
      declarations: [ CluesComponent ],
      providers: [ WordService, SocketService, DifficultyService ]
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
