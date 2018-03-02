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
import { WordService } from "../../word.service/word.service";
import { ModeComponent, ModeDialogComponent } from "../../crosswords/mode/mode.component";
import {MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS} from "@angular/material/dialog";
import {MatProgressSpinnerModule} from "@angular/material";
import { SocketService } from "../../socket.service/socket.service";
import { GridService } from "../../grid.service/grid.service";
import { DifficultyService } from "../../difficulty.service/difficulty.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

const config: SocketIoConfig = { url: "http://localhost:3000", options: {} };

describe("AdminComponent", () => {
  let component: AdminComponent;
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
        HomeComponent
        ],
      providers: [
            WordService,
            SocketService,
            GridService,
            DifficultyService,
            {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},
            {provide: APP_BASE_HREF, useValue : "/" }
        ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
