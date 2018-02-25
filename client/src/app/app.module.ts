import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { ClickOutsideModule } from "ng-click-outside";

import { AppComponent } from "./app.component";
import { GameComponent } from "./race/game-component/game.component";

import { RenderService } from "./race/render-service/render.service";
import { BasicService } from "./basic.service";
import { WordService } from "./word.service/word.service";

import { DifficultyComponent } from "./crosswords/difficulty/difficulty.component";
import { GridComponent } from "./crosswords/grid/grid.component";
import { CrosswordComponent } from "./crosswords/crossword/crossword.component";
import { CluesComponent } from "./crosswords/clues/clues.component";
import { AppRoutingModule } from "./app-routing.module";
import { GridService } from "./grid.service/grid.service";
import { SocketIoModule, SocketIoConfig } from "ng-socket-io";
import { ModeComponent, ModeDialog } from "./crosswords/mode/mode.component";
import { SocketService } from "./socket.service/socket.service";
import {MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatProgressSpinnerModule} from '@angular/material';

const config: SocketIoConfig = { url: "http://localhost:3000", options: {} };

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        DifficultyComponent,
        GridComponent,
        CrosswordComponent,
        CluesComponent,
        ModeComponent,
        ModeDialog
    ],
    entryComponents: [
        ModeDialog
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ClickOutsideModule,
        SocketIoModule.forRoot(config),
        MatProgressSpinnerModule,
        MatDialogModule,
        BrowserAnimationsModule,
        AppRoutingModule
    ],
    providers: [
        RenderService,
        BasicService,
        WordService,
        GridService,
        SocketService,
        {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
    ],
    exports: [
        MatProgressSpinnerModule,
        MatDialogModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
