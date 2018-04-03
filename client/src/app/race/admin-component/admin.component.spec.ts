// tslint:disable:no-floating-promises max-func-body-length
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { APP_BASE_HREF } from "@angular/common";
import { SocketIoModule, SocketIoConfig } from "ng-socket-io";

import { AdminComponent } from "./admin.component";
import { CrosswordComponent } from "../../crosswords/crossword/crossword.component";
import {TrackCreationComponent} from "../track-creation/track-creation.component";
import { AppRoutingModule } from "../../app-routing.module";
import { GameComponent } from "../../race/game-component/game.component";
import { HomeComponent } from "../../home/home.component";
import { CluesComponent } from "../../crosswords/clues/clues.component";
import { DifficultyComponent } from "../../crosswords/difficulty/difficulty.component";
import { GridComponent } from "../../crosswords/grid/grid.component";
import { ModeComponent, ModeDialogComponent } from "../../crosswords/mode/mode.component";
import {MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS} from "@angular/material/dialog";
import {MatProgressSpinnerModule} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { TerminationComponent, TerminationDialogComponent } from "../../crosswords/termination/termination.component";

const config: SocketIoConfig = { url: "http://localhost:3000", options: {} };

describe("AdminComponent", () => {
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
            FormsModule,
            RouterModule,
            AppRoutingModule,
            MatDialogModule,
            MatProgressSpinnerModule,
            SocketIoModule.forRoot(config),
            BrowserAnimationsModule
        ],
      declarations: [
        CrosswordComponent,
        CluesComponent,
        DifficultyComponent,
        GridComponent,
        ModeComponent,
        ModeDialogComponent,
        AdminComponent,
        TrackCreationComponent,
        GameComponent,
        HomeComponent,
        TerminationComponent,
        TerminationDialogComponent
        ],
      providers: [
            {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},
            {provide: APP_BASE_HREF, useValue : "/" }
        ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    fixture.detectChanges();
  });

  /*it("should create", () => {
    expect(component).toBeTruthy();
  });*/
});
