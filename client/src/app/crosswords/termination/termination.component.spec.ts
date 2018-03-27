// tslint:disable
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClickOutsideModule } from "ng-click-outside";
import { SocketIoModule, SocketIoConfig, Socket } from "ng-socket-io";
import {MatDialogModule} from "@angular/material/dialog";
import {MatProgressSpinnerModule} from "@angular/material";

import { TerminationComponent, TerminationDialogComponent } from "./termination.component";
import { DifficultyComponent } from "../difficulty/difficulty.component";
import { SocketService } from "../../socket.service/socket.service";
import { DifficultyService } from "../../difficulty.service/difficulty.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { Difficulty } from "../../../../../common/grid/difficulties";
import { Type } from "../type"
import { GridLoadingService } from "../../grid-loading.service/grid-loaing.service";

const config: SocketIoConfig = { url: "http://localhost:3000", options: {} };

@NgModule({
    imports: [CommonModule, MatDialogModule, MatProgressSpinnerModule],
    declarations: [TerminationDialogComponent, DifficultyComponent],
    entryComponents: [TerminationDialogComponent],
    providers: [GridLoadingService]
  })
  export class FakeTestTerminationModule {}

describe("TerminationComponent", () => {
  let component: TerminationComponent;
  let fixture: ComponentFixture<TerminationComponent>;
  let fixtureDifficulty: ComponentFixture<DifficultyComponent>;
  let dialog: TerminationDialogComponent;

  let difficulty: DifficultyComponent;
  let socketService: SocketService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
            ClickOutsideModule,
            SocketIoModule.forRoot(config),
            BrowserAnimationsModule,
            FakeTestTerminationModule,
        ],
        declarations: [
            TerminationComponent,
        ],
        providers: [
            SocketService,
            DifficultyService
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminationComponent);
    fixtureDifficulty = TestBed.createComponent(DifficultyComponent);
    component = fixture.componentInstance;

    difficulty = fixtureDifficulty.componentInstance;
    socketService = new SocketService(new Socket(config), new DifficultyService(), new GridLoadingService());
    fixture.detectChanges();
    dialog = component.dialog.open(TerminationDialogComponent, {
        width: "500px",
        height: "450px",
        data: 0
    }).componentInstance;
    spyOn(socketService, 'sendRequestRematch' );
    
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have an open dialog", () => {
    expect(TerminationDialogComponent).toBeTruthy();
  });

  it("should open disonnected dialog if oppenent disconnected", () => {
    const type: Type = Type.disconnected;
    expect(dialog.dialogType()).toEqual(type);
  });

  it("should open soloGridValidated dialog if grid validated in single player mode", () => {
    const type: Type = Type.soloGridValidated;
    dialog = component.dialog.open(TerminationDialogComponent, {
        width: "500px",
        height: "450px",
        data: type
    }).componentInstance;
    expect(dialog.dialogType()).toEqual(type);
  });

  it("should not show rematch offer if grid validated in single player mode", () => {

    expect(dialog.showRematchOffer).toBeFalsy();
    expect(dialog.showWaitingRematchOffer).toBeFalsy();
    
  });

  it("should keep user setting if play again option is selected", () => {
    
    difficulty.onSelect(0);
    dialog.createSoloGame();
    expect(difficulty.selectedDifficulty).toEqual(Difficulty.Easy);

  });

  it("should open a win dialog in multiplayer mode ", () => {
    const type: Type = Type.multiPlayerWin;
    dialog = component.dialog.open(TerminationDialogComponent, {
        width: "500px",
        height: "450px",
        data: type
    }).componentInstance;
    expect(dialog.dialogType()).toEqual(type);
    
  });

  it("should offer to rematch again same player in multiplayer mode ", () => {
    dialog.requestRematch();
    expect(dialog.showWaitingRematchOffer).toBeTruthy();
  });

  it("should send rematch offer to other player", () => {
    dialog.requestRematch();
    socketService.sendRequestRematch(); 
  
    expect(socketService.sendRequestRematch).toHaveBeenCalled();
  });
});
