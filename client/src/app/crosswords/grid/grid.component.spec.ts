// tslint:disable:no-floating-promises
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { SocketIoModule, SocketIoConfig } from "ng-socket-io";

import { GridComponent } from "./grid.component";
import { WordService } from "../word.service/word.service";
import { SocketService } from "../socket.service/socket.service";
import { GridService } from "../grid.service/grid.service";
import { DifficultyService } from "../difficulty.service/difficulty.service";

const config: SocketIoConfig = { url: "http://localhost:3000", options: {} };

describe("GridComponent", () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, SocketIoModule.forRoot(config) ],
      declarations: [ GridComponent ],
      providers: [ WordService, SocketService, GridService, DifficultyService ]
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
});
