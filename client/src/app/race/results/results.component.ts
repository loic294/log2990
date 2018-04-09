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
    private _times: Array<String>;
    private _bestTimes: Array<String>;
    //private _bestTimeName: String;

    public constructor( private resultsService: ResultsService) {
        this._isHidden = true;
        this._game =  {gameTime: "0.00", lapTimes: new Array(), gameIsFinished: false, currentLap: 1, botTimes: new Array()};
    }

    public show(): void {
        this._isHidden = false;
    }

    public get isHidden(): boolean {
        return this._isHidden;
    }
    public bestTimes(): Array<String> {
        if (this._game.gameIsFinished) {
            const start: number = 0;
            const end: number = 5;
            let sortedTimes: Array<number> = [];
            this._bestTimes = [];
            for (const time of this._times) {
                const convertedTime: number = parseFloat(time.toString());
                sortedTimes.push(convertedTime);
            }
            sortedTimes = sortedTimes.sort((n1, n2) => n1 - n2).slice(start, end);
            for (const time of sortedTimes) {
                this._bestTimes.push(time.toString());
            }

            return this._bestTimes;
        } else {
            return [];
        }
    }

    public isBestTime(): boolean {
        for (const time of this.bestTimes()) {
            if (time === this._game.gameTime) {
                return true;
            }
        }

        return false;
    }

    public isFirst(): boolean {
        console.log("bot Times: ", this._game.botTimes);
        for (const bot of this._game.botTimes) {
            let completeTimeBot: number = 0;
            for (const time of bot) {
                completeTimeBot += parseFloat(time.toString());
            }
            if (parseFloat(this._game.gameTime.toString()) > completeTimeBot) {
                return false;
            }
        }

        return true;
    }

    public enterName(name: String): void {
        // this._bestTimeName = name;
    }
    // tslint:disable-next-line:typedef
    public ngOnInit() {
        this.resultsService.game.subscribe( (game) => {
            this._game = game;
        });
        this.resultsService.trackTimes.subscribe((times) => {
            this._times = times;
        });
    }

}
