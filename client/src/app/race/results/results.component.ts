import { Component, OnInit } from "@angular/core";
import { IGameInformation } from "../trackProgressionService";
import { ResultsService } from "../results-service/results.service";
import { PlayerStats } from "../../../../../common/race/playerStats";
import { TrackInformation } from "../trackInformation";
const ENTER_KEYCODE: number = 13;
const MAX_TIMES: number = 5;

@Component({
    selector: "app-results",
    templateUrl: "./results.component.html",
    styleUrls: ["./results.component.css"],
    providers: [
    ]
})
export class ResultsComponent implements OnInit {
    private _game: IGameInformation;
    private _trackTimes: Array<PlayerStats>;
    private _bestTimes: Array<PlayerStats>;
    private _bestTimeName: String;
    private _updatedName: boolean;
    private _trackInfo: TrackInformation;
    private _showGameResults: boolean;
    private _positionedRaceStats: Array<PlayerStats>;
    private _showModal: boolean;

    public constructor( private resultsService: ResultsService) {
        this._showModal = true;
        this._game =  {
            gameTime: "0.00",
            lapTime: "0.00" ,
            lapTimes: new Array(),
            gameIsFinished: false,
            currentLap: 1,
            botTimes: new Array()};
        this._updatedName = false;
    }

    public get showModal(): boolean {
        return this._showModal;
    }

    public get updatedName(): boolean {
        return this._updatedName;
    }

    public get bestTimeName(): String {
        return this._bestTimeName;
    }

    public get showGameResults(): boolean {
        return this._showGameResults;
    }

    public get positionedRaceStats(): Array<PlayerStats> {
        return this._positionedRaceStats;
    }

    public bestTimes(): Array<PlayerStats> {
        const start: number = 0;
        const end: number = 5;
        this._bestTimes = [];
        this._bestTimes = this._trackTimes.sort((n1, n2) =>
        parseFloat(n1.gameTime.toString()) - parseFloat(n2.gameTime.toString())).slice(start, end);

        return this._bestTimes;
    }

    public isBestTime(): boolean {
        for (const time of this.bestTimes()) {
            if (time.gameTime === this._game.gameTime) {
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

    private clipNumberOfBestTimes(): void {
        const fiveBestTimes: Array<PlayerStats> = new Array();
        for (let i: number = 0; i < MAX_TIMES; i++) {
            fiveBestTimes.push(this._trackInfo.track.completedTimes[i]);
        }
        this._trackInfo.track.completedTimes = fiveBestTimes;
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

    public findGameResults(): void {
        this._showGameResults = true;
        this.positionPlayerStats();
    }

    public hideGameResults(): void {
        this._showGameResults = false;
    }

    public enterName(name: String): void {
        this._bestTimeName = name;
    }

    public async updateName(event: KeyboardEvent): Promise<void> {

        if (event.keyCode === ENTER_KEYCODE) {
            this._updatedName = true;
            for ( const stat of this._trackInfo.track.completedTimes) {
                if ( stat.player === "" && stat.gameTime === this._game.gameTime) {
                    stat.player = this.bestTimeName;
                }
            }
            if (this._trackInfo.track.completedTimes.length > MAX_TIMES) {
                this.clipNumberOfBestTimes();
            }
            await this._trackInfo.patchTrack();
        }
    }

    public isPlayerTime(time: PlayerStats): boolean {
        return this._game.gameTime === time.gameTime && time.player === "";
    }

    public playAgain(): void {
        this._showModal = false;
    }

    public ngOnInit(): void {
        this.resultsService.game.subscribe( (game) => {
            this._game = game;
        });
        this.resultsService.trackTimes.subscribe((times) => {
            this._trackTimes = times;
        });
        this.resultsService.trackInformation.subscribe((info) => {
            this._trackInfo = info;
        });
    }

}
