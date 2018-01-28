import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms'

import { AppComponent } from "./app.component";
import { GameComponent } from "./race/game-component/game.component";

import { RenderService } from "./race/render-service/render.service";
import { BasicService } from "./basic.service";
import { WordService } from "./word.service";

import { DifficultyComponent } from './crosswords/difficulty/difficulty.component';
import { GridComponent } from './crosswords/grid/grid.component';
import { CrosswordComponent } from './crosswords/crossword/crossword.component';
import { CluesComponent } from './crosswords/clues/clues.component';


@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        DifficultyComponent,
        GridComponent,
        CrosswordComponent,
        CluesComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule
    ],
    providers: [
        RenderService,
        BasicService,
        WordService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
