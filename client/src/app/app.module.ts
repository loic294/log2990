import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { ClickOutsideModule } from "ng-click-outside";

import { AppComponent } from "./app.component";
import { GameComponent } from "./race/game-component/game.component";

import { RenderService } from "./race/render-service/render.service";
import { WordService } from "./word.service/word.service";

import { DifficultyComponent } from "./crosswords/difficulty/difficulty.component";
import { GridComponent } from "./crosswords/grid/grid.component";
import { CrosswordComponent } from "./crosswords/crossword/crossword.component";
import { CluesComponent } from "./crosswords/clues/clues.component";
import { AppRoutingModule } from "./app-routing.module";
import { GridService } from "./grid.service/grid.service";
import { SocketIoModule, SocketIoConfig } from "ng-socket-io";
import { ModeComponent, ModeDialogComponent, DisconnectedDialogComponent } from "./crosswords/mode/mode.component";
import { SocketService } from "./socket.service/socket.service";
import { AdminComponent } from "./race/admin-component/admin.component";
import {MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS} from "@angular/material/dialog";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TrackCreationComponent} from "./race/track-creation/track-creation.component";
import {MatProgressSpinnerModule} from "@angular/material";
import { DifficultyService } from "./difficulty.service/difficulty.service";
import { HomeComponent } from "./home/home.component";

const config: SocketIoConfig = { url: "http://localhost:3000", options: {} };

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        DifficultyComponent,
        GridComponent,
        CrosswordComponent,
        CluesComponent,
        AdminComponent,
        ModeComponent,
        ModeDialogComponent,
        HomeComponent,
        TrackCreationComponent,
        ModeDialogComponent,
        DisconnectedDialogComponent
    ],
    entryComponents: [
        ModeDialogComponent,
        DisconnectedDialogComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ClickOutsideModule,
        SocketIoModule.forRoot(config),
        MatDialogModule,
        MatProgressSpinnerModule,
        BrowserAnimationsModule,
        AppRoutingModule
    ],
    providers: [
        RenderService,
        WordService,
        GridService,
        SocketService,
        DifficultyService,
        {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}}
    ],
    exports: [
        MatProgressSpinnerModule,
        MatDialogModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
