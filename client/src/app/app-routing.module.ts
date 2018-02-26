import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CrosswordComponent } from "./crosswords/crossword/crossword.component";
import { GameComponent } from "./race/game-component/game.component";
import { AdminComponent } from "./race/admin-component/admin.component";

const routes: Routes = [
    { path: "crossword", component: CrosswordComponent },
    { path: "race", component: GameComponent },
    { path: "admin/:id", component: AdminComponent },
    { path: "admin", component: AdminComponent },
];

@NgModule({
    exports: [RouterModule],
    imports: [ RouterModule.forRoot(routes) ],

})
export class AppRoutingModule { }
