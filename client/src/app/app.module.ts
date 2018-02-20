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
import { ShadowBoxComponent } from "./crosswords/shadow-box/shadow-box.component";
import { ContainerComponent } from "./crosswords/container/container.component";
import { ButtonComponent } from "./crosswords/button/button.component";
import { AppRoutingModule } from ".//app-routing.module";
import { GridService } from "./grid.service/grid.service";

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        DifficultyComponent,
        GridComponent,
        CrosswordComponent,
        CluesComponent,
        ShadowBoxComponent,
        ContainerComponent,
        ButtonComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ClickOutsideModule,
        AppRoutingModule
    ],
    providers: [
        RenderService,
        BasicService,
        WordService,
        GridService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
