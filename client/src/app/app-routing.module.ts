import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CrosswordComponent } from "./crosswords/crossword/crossword.component";
import { GameComponent } from "./race/game-component/game.component";
import { TrackCreationComponent } from "./race/track-creation/track-creation.component";

const routes: Routes = [
    { path: "crossword", component: CrosswordComponent },
    { path: "race", component: GameComponent }
    { path: "race/admin", component: TrackCreationComponent  }
];

@NgModule({
    exports: [RouterModule],
    imports: [ RouterModule.forRoot(routes) ],

})
export class AppRoutingModule { }
