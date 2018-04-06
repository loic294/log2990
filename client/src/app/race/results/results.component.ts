import { Component, OnInit } from "@angular/core";
import { TrackProgressionService, IGameInformation } from "../trackProgressionService";
import { ResultsService } from "../results-service/results.service";
// import { TrackInformationService } from "../../../../../server/app/services/trackInformation/trackInformationService";

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
    private _bestTimes: Array<number>;
    private _bestTimeName: String;

    public constructor( private resultsService: ResultsService) {
        this._isHidden = true;
        this._game =  {gameTime: 0, lapTimes: new Array(), gameIsFinished: false, currentLap: 1};
    }

    public show(): void {
        this._isHidden = false;
    }

    public get isHidden(): boolean {
        return this._isHidden;
    }
    public bestTimes(): Array<number> {
        return this._bestTimes;
    }

    public isBestTime(): boolean {
        for (const time of this.bestTimes()) {
            if (time === this._game.gameTime) {
                return true;
            }
        }

        return false;
    }

    public enterName(name: String): void {
        this._bestTimeName = name;
    }
    // tslint:disable-next-line:typedef

    public ngOnInit() {
        this.resultsService.game.subscribe( (game) => {
            this._game = game;
        });
        this.resultsService.trackTimes.subscribe((times) => {
            const start: number = 0;
            const end: number = 5;
            const sortedTimes: Array<number> = times.sort((n1, n2) => n1 - n2).slice(start, end);
            this._bestTimes = sortedTimes;
        });
    }

}
