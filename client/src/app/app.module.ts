import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms'

import { AppComponent } from "./app.component";
import { GameComponent } from "./race/game-component/game.component";

import { RenderService } from "./race/render-service/render.service";
import { BasicService } from "./basic.service";
import { DifficultyComponent } from './crosswords/difficulty/difficulty.component';
import { GridComponent } from './crosswords/grid/grid.component';
import { SquareComponent } from './crosswords/square/square.component';
import { CrosswordComponent } from './crosswords/crossword/crossword.component';
<<<<<<< HEAD
import { CluesComponent } from './crosswords/clues/clues.component';
=======
import { EnterWordComponent } from './crosswords/enter-word/enter-word.component';
>>>>>>> dcbef734cc15c14e1c66b626e4f208559045faf5

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        DifficultyComponent,
        GridComponent,
        SquareComponent,
        CrosswordComponent,
<<<<<<< HEAD
        CluesComponent,
=======
        EnterWordComponent,
>>>>>>> dcbef734cc15c14e1c66b626e4f208559045faf5
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
<<<<<<< HEAD
        FormsModule,
=======
        FormsModule
>>>>>>> dcbef734cc15c14e1c66b626e4f208559045faf5
    ],
    providers: [
        RenderService,
        BasicService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
