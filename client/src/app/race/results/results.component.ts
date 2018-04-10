import { Component, OnInit } from "@angular/core";
import { TrackProgressionService, IGameInformation } from "../trackProgressionService";
import { ResultsService } from "../results-service/results.service";
// import { TrackInformationService } from "../../../../../server/app/services/trackInformation/trackInformationService";

interface PlayerStats {
    player: String;
    gameTime: String;
    lapTimes: Array<String>;
}

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
    private _bestTimeName: String;

    private _showGameResults: boolean;
    private _positionedRaceStats: Array<PlayerStats>;

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
    public get bestTimeName(): String {
        return this._bestTimeName;
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
    private calculateCompleteTime(times: Array<String>): String {
        let completedTime: number = 0;
        for (const time of times) {
            completedTime += parseFloat(time.toString());
        }

        return completedTime.toString();
    }

    private getPlayerStats(): Array<PlayerStats> {
        let botIndex: number = 0;
        const stats: Array<PlayerStats> = [];
        for (const bot of this._game.botTimes) {
            const botStat: PlayerStats = {
                player: "BOT " + botIndex.toString(),
                gameTime: this.calculateCompleteTime(bot),
                lapTimes: bot
            };
            botIndex++;
            stats.push(botStat);
        }

        const playerStats: PlayerStats = {
            player: "YOU",
            gameTime: this._game.gameTime,
            lapTimes: this._game.lapTimes
        };

        stats.push(playerStats);

        return stats;
    }

    private positionPlayerStats(): void {
        this._positionedRaceStats = this.getPlayerStats().sort((n1, n2) =>
        parseFloat(n1.gameTime.toString()) - parseFloat(n2.gameTime.toString()));
    }
    public get positionedRaceStats(): Array<PlayerStats> {
        return this._positionedRaceStats;
    }

    public isFirst(): boolean {
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
        this._bestTimeName = name;
    }

    public get showGameResults(): boolean {
        return this._showGameResults;
    }

    public findGameResults(): void {
        this._showGameResults = true;
        this.positionPlayerStats();
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
