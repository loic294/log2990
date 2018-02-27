import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CrosswordComponent } from "./crosswords/crossword/crossword.component";
import { GameComponent } from "./race/game-component/game.component";
import { AdminComponent } from "./race/admin-component/admin.component";
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
    { path: "crossword", component: CrosswordComponent },
    { path: "race", component: GameComponent },
    { path: "admin/:id", component: AdminComponent },
<<<<<<< HEAD
    { path: "admin", component: AdminComponent }
=======
    { path: "admin", component: AdminComponent },
    { path: "", component: HomeComponent },
>>>>>>> eab16e39df2c73483b1ed02249a8a0855dfe324d
];

@NgModule({
    exports: [RouterModule],
    imports: [ RouterModule.forRoot(routes) ],

})
export class AppRoutingModule { }
