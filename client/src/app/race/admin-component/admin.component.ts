import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

interface MockGame {
    id: number;
    name: string;
}

const MOCK_TRACKS: Array<MockGame> = [
    { id: 1, name: "First game name" },
    { id: 2, name: "A second game" },
    { id: 3, name: "Another one?" },
    { id: 4, name: "A name again" },
    { id: 5, name: "A last one!" }
];

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {

    private _games: Array<MockGame>;
    public id: string;

    public constructor(
        private route: ActivatedRoute
    ) {
        this._games = MOCK_TRACKS;
    }

    public get games(): Array<MockGame> {
        return this._games;
    }

    public deleteGame(id: string): void {
        const TEN: number = 10;
        const index: number = this._games.findIndex((game: MockGame) => game.id === parseInt(id, TEN));
        this._games.splice(index, 1);
    }

    public ngOnInit(): void {
        this.route.params.subscribe((params: Array<string>) => {
            this.id = params["id"];
        });
    }

}
