import { Component, OnInit } from "@angular/core";
import { TrackProgressionService, IGameInformation } from "../trackProgressionService";
import { ResultsService } from "../results-service/results.service";

@Component({
    selector: "app-results",
    templateUrl: "./results.component.html",
    styleUrls: ["./results.component.css"],
    providers: [
        TrackProgressionService
    ]
})
export class ResultsComponent implements OnInit {
    private _game: IGameInformation;
    private _isHidden: boolean;

    public constructor( private resultsService: ResultsService ) {
        this._isHidden = true;
        this._game =  {gameTime: 0, lapTimes: new Array(), gameIsFinished: false, currentLap: 1};
    }

    public show(): void {
        this._isHidden = false;
        this.times();
    }

    public get isHidden(): boolean {
        return this._isHidden;
    }
    public times(): void {
        console.log("game info", this._game.gameTime);
    }
    // tslint:disable-next-line:typedef
    public ngOnInit() {
        this.resultsService.game.subscribe( (game) => {
            this._game = game;
        });
    }

}
