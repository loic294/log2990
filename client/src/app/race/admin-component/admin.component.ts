import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

interface MockGame {
    id: number;
    name: string;
    description: string;
}

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {

    private _game: MockGame;
    public id: string;

    public constructor(
        private route: ActivatedRoute
    ) {
        this._game = {id: 1, name: "Enter name", description: "Enter description"};
    }

    public get game(): MockGame {
        return this._game;
    }

    public ngOnInit(): void {
        this.route.params.subscribe(({ id }: { id: string }) => {
            this.id = id;
        });
    }

}
