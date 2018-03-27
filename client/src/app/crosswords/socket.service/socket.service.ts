import { Injectable } from "@angular/core";
import { Socket } from "ng-socket-io";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { IGameModel } from "./../../../../../server/app/models/game";
import { difficultyName } from "../../../../../common/grid/difficulties";
import { SocketMessage } from "../../../../../common/communication/message";
import Word from "../../../../../common/lexical/word";
import { DifficultyService } from "./../difficulty.service/difficulty.service";
import { Mode } from "../../../../../common/grid/player";
import { GridLoadingService } from "../grid-loading.service/grid-loaing.service";

@Injectable()
export class SocketService {

    public _player: string = "";
    private _difficulty: String;
    private _modes: string[];
    private _selectedMode: string;
    private _games: IGameModel[];
    private _showGames: boolean;
    private _wordCount: number;
    private _grid: Array<String>;
    private _clues: Array<Word>;

    private _updateUserConnected: Observable<boolean>;
    private _userConnected: Subject<boolean> = new Subject<boolean>();
    private _updateHighligthCell: Observable<string>;
    private _highlightCell: Subject<string> = new Subject<string>();
    private _updateWordValidated: Observable<string>;
    private _wordToValidate: Subject<string> = new Subject<string>();
    private _updateOpponentDisconnected: Observable<boolean>;
    private _opponentDisconnected: Subject<boolean> = new Subject<boolean>();
    private _updateOpponentName: Observable<string>;
    private _opponentName: Subject<string> = new Subject<string>();
    private _updateUserScore: Observable<number>;
    private _userScore: Subject<number> = new Subject<number>();
    private _userScoreCount: number;
    private _updateOpponentScore: Observable<number>;
    private _opponentScore: Subject<number> = new Subject<number>();
    private _opponentScoreCount: number;
    private _updateGridValidated: Observable<boolean>;
    private _gridValidated: Subject<boolean> = new Subject<boolean>();
    private _updateRequestRematch: Observable<string>;
    private _requestRematch: Subject<string> = new Subject<string>();
    private _updateRequestModeMenu: Observable<boolean>;
    private _requestModeMenu: Subject<boolean> = new Subject<boolean>();
    private _updateAcceptRematch: Observable<boolean>;
    private _acceptRematch: Subject<boolean> = new Subject<boolean>();
    private _updateGridValidation: Observable<number>;
    private _gridValidation: Subject<number> = new Subject<number>();

    public constructor(
        private _socket: Socket,
        private difficultyService: DifficultyService,
        private gridLoadingService: GridLoadingService
    ) {
        this.difficultyService.difficulty.subscribe((diff) => {
            this._difficulty = difficultyName(diff);
        });
        this._opponentScoreCount = 1;
        this._userScoreCount = 1;
        this._games = [];
        this._modes = [Mode.SinglePlayer, Mode.MultiPlayer];
        this._selectedMode = "";
        this._showGames = false;
        this._updateUserConnected = this._userConnected.asObservable();
        this._updateHighlightCell = this._highlightCell.asObservable();
        this._updateUserScore = this._userScore.asObservable();
        this._updateOpponentScore = this._opponentScore.asObservable();
        this._updateWordValidated = this._wordToValidate.asObservable();
        this._updateOpponentDisconnected = this._opponentDisconnected.asObservable();
        this._updateOpponentName = this._opponentName.asObservable();
        this._updateGridValidated = this._gridValidated.asObservable();
        this._updateRequestRematch = this._requestRematch.asObservable();
        this._updateRequestModeMenu = this._requestModeMenu.asObservable();
        this._updateAcceptRematch = this._acceptRematch.asObservable();
        this._updateGridValidation = this._gridValidation.asObservable();
        this.initializeSocket();
        this.initializeGridSocket();
        this.initializeObservables();

    }

    public get socket(): Socket {
        return this._socket;
    }

    public initializeObservables(): void {
        this.gridLoadingService.newGrid.subscribe((grid: Array<String>) => {
            this._grid = grid;
        });

        this.gridLoadingService.newClues.subscribe((clues: Array<Word>) => {
            this._clues = clues;
        });
    }

    public initializeSocket(): void {
        this._socket.connect();

        this._socket.on(SocketMessage.addGame, (games: IGameModel[]) => {
            this._games = games;
        });

        this._socket.on(SocketMessage.receiveWord, (data: string): void => {
            this._highlightCell.next(data);
        });

        this._socket.on(SocketMessage.pushValidation, (data: string): void => {
           this.pushValidation(data);
        });

        this._socket.on(SocketMessage.secondPlayerJoined, (data: IGameModel) => {
           this.secondPlayerJoined(data);
        });

        this._socket.on(SocketMessage.opponentDisconnected, (data: boolean) => {
            this._opponentDisconnected.next(true);
        });

        this._socket.on(SocketMessage.rematchInvitation, (data: string) => {
            this._requestRematch.next(data);
        });

        this._socket.on(SocketMessage.rematchAccepted, (data: boolean) => {
            this._acceptRematch.next(true);
        });
    }

    public initializeGridSocket(): void {
        this._socket.on("sync_grid", (data: string) => {
            console.log('RECEIVED SYNC GRID')
        });
    }

    private pushValidation(data: string): void {
        this._opponentScore.next(this._opponentScoreCount++);
        this._wordToValidate.next(data);
    }

    private secondPlayerJoined(data: IGameModel): void {
        this._userConnected.next(true);
        if ( this.player === data.players[0]) {
            this._opponentName.next(data.players[1].toString());
        } else {
            this._opponentName.next(data.players[0].toString());
        }
    }

    public acceptRematch(): Observable<boolean> {
        return this._updateAcceptRematch;
    }

    public get requestModeMenu(): Observable<boolean> {
        return this._updateRequestModeMenu;
    }

    public requestRematch(): Observable<string> {
        return this._updateRequestRematch;
    }

    public userScoreCount(): number {
        return this._userScoreCount;
    }

    public opponentScoreCount(): number {
        return this._opponentScoreCount;
    }
    public get gridValidated(): Observable<boolean> {
        return this._updateGridValidated;
    }

    public get opponentScore(): Observable<number> {
        return this._updateOpponentScore;
    }

    public get userScore(): Observable<number> {
        return this._updateUserScore;
    }

    public get gridValidation(): Observable<number> {
        return this._updateGridValidation;
    }

    public get opponentName(): Observable<string> {
        return this._updateOpponentName;
    }

    public get isOpponentDisconnected(): Observable<boolean> {
        return this._updateOpponentDisconnected;
    }

    public get isUserConnected(): Observable<boolean> {
        return this._updateUserConnected;
    }

    public get cellToHighligh(): Observable<string> {
        return this._updateHighlightCell;
    }

    public get wordIsValidated(): Observable<string> {
        return this._updateWordValidated;
    }

    public onEnter(value: string): void {
        this._player = value;
    }

    public get modes(): string[] {
        return this._modes;
    }
    public get selectedMode(): string {
        return this._selectedMode;
    }

    public onSelect(mode: string): void {
        this._selectedMode = mode;
    }

    public get games(): IGameModel[] {
        return this._games;
    }

    public addGames(): void {
        this._socket.emit(SocketMessage.getGames, this.difficulty);
    }

    public toggleShowGames(): void {
        this._showGames = !this._showGames;
    }

    public get showGames(): boolean {
        return this._showGames;
    }

    public createGame(mode: string): void {
        if (mode === Mode.MultiPlayer) {
            const gameId: string = this.player;
            const difficulty: String = this.difficulty;
            this._socket.emit(SocketMessage.createGame, JSON.stringify({ gameId, difficulty}));
            this.joinGame(gameId);
        }
    }

    public joinGame(gameId: string): void {
        this._socket.emit(SocketMessage.connectToGame, JSON.stringify({ gameId, value: this.player }));
    }

    public get player(): string {
        return this._player;
    }
    public get difficulty(): String {
        return this._difficulty;
    }

    public syncWord(word: Word): void {
        this._socket.emit(SocketMessage.syncWord, JSON.stringify({word}));
    }

    public sendValidation(word: Word): void {
        this._socket.emit(SocketMessage.sendValidation, JSON.stringify({word}));
        this._userScore.next(this._userScoreCount++);
    }

    public setWordCount(wordCount: number): void {
        this._wordCount = wordCount;
        if (this._wordCount === 0) {
            this._gridValidated.next(true);
        }
    }

    public getWordCount(): number {
        return this._wordCount;
    }

    public sendRequestRematch(): void {
        this.createGame(this.selectedMode);
        this._socket.emit(SocketMessage.requestRematch, this.player);
    }

    public acceptRequestRematch(gameID: string): void {
        this.joinGame(gameID);
        this._socket.emit(SocketMessage.acceptRematch, gameID);
        this._gridValidated.next(true);
    }

    public sendRequestModeMenu(): void {
        this._requestModeMenu.next(true);
    }
}
