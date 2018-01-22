import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { GameComponent } from "./race/game-component/game.component";

import { RenderService } from "./race/render-service/render.service";
import { BasicService } from "./basic.service";
import { DifficultyComponent } from './crosswords/difficulty/difficulty.component';
import { GridComponent } from './crosswords/grid/grid.component';
import { SquareComponent } from './crosswords/square/square.component';
import { CrosswordComponent } from './crosswords/crossword/crossword.component';

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        DifficultyComponent,
        GridComponent,
        SquareComponent,
        CrosswordComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule
    ],
    providers: [
        RenderService,
        BasicService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
