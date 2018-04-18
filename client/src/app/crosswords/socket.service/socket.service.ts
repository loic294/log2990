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
import { GridLoadingService } from "../../grid-loading.service/grid-loading.service";
import { Cell } from "../../../../../common/grid/cell";
import { IOMessage, MessageType } from "./observableMessages";

@Injectable()
export class SocketService {

    public _player: string = "";
    private _difficulty: String;
    private _modes: string[];
    private _selectedMode: string;
    private _games: IGameModel[];
    private _showGames: boolean;
    private _wordCount: number;
    private _grid: Array<Array<Cell>>;
    private _clues: Array<Word>;

    private _socketObservale: Observable<IOMessage>;
    private _observableMessage: Subject<IOMessage> = new Subject<IOMessage>();

    private _userScoreCount: number;
    private _opponentScoreCount: number;

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
        this._socketObservale = this._observableMessage.asObservable();

        this.initializeSocket();
        this.initializeGridSocket();
        this.initializeObservables();
    }

    public get socket(): Socket {
        return this._socket;
    }

    public initializeObservables(): void {
        this.gridLoadingService.newGrid.subscribe((grid: Array<Array<Cell>>) => {
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
            this._observableMessage.next({ type: MessageType.highligthCell, data });
        });

        this._socket.on(SocketMessage.pushValidation, (data: string): void => {
           this.pushValidation(data);
        });

        this._socket.on(SocketMessage.secondPlayerJoined, (data: IGameModel) => {
           this.secondPlayerJoined(data);
        });

        this._socket.on(SocketMessage.opponentDisconnected, (data: boolean) => {
            this._observableMessage.next({ type: MessageType.opponentDisconnected, data: true });
        });

        this._socket.on(SocketMessage.rematchInvitation, (data: string) => {
            this._observableMessage.next({ type: MessageType.requestRematch, data });
        });

        this._socket.on(SocketMessage.rematchAccepted, (data: boolean) => {
            this._observableMessage.next({ type: MessageType.acceptRematch, data: true });
        });
    }

    public initializeGridSocket(): void {
        this._socket.on(SocketMessage.syncGridSend, (data: string) => {
            const { grid, clues } = JSON.parse(data);
            this.gridLoadingService.setNewGrid(grid, clues);
        });
        this._socket.on(SocketMessage.readyToSync, (data: IGameModel) => {
            const content: string = JSON.stringify({ grid: this._grid, clues: this._clues });
            this.socket.emit(SocketMessage.syncGrid, content);
        });
    }

    private pushValidation(data: string): void {
        this._observableMessage.next({ type: MessageType.opponentScore, data: this._opponentScoreCount++ });
        this._observableMessage.next({ type: MessageType.wordToValidate, data });
    }

    public get socketObservale(): Observable<IOMessage> {
        return this._socketObservale;
    }

    private secondPlayerJoined(data: IGameModel): void {
        this._observableMessage.next({ type: MessageType.userConnected, data: true });
        if (this.player === data.players[0]) {
            this._observableMessage.next({ type: MessageType.opponentName, data: data.players[1].toString() });
        } else {
            this._observableMessage.next({ type: MessageType.opponentName, data: data.players[0].toString() });
        }
    }

    public userScoreCount(): number {
        return this._userScoreCount;
    }

    public opponentScoreCount(): number {
        return this._opponentScoreCount;
    }

    public resetScore(): void {
        this._observableMessage.next({ type: MessageType.opponentScore, data: this._opponentScoreCount = 0 });
        this._observableMessage.next({ type: MessageType.userScore, data: this._userScoreCount = 0 });
        this._userScoreCount = 1;
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
        this._observableMessage.next({ type: MessageType.userScore, data: this._userScoreCount++ });
    }

    public setWordCount(wordCount: number): void {
        this._wordCount = wordCount;
        if (this._wordCount === 0) {
            this._observableMessage.next({ type: MessageType.gridValidated, data: true });
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
        this._observableMessage.next({ type: MessageType.gridValidated, data: true });
    }

    public sendRequestModeMenu(): void {
        this._observableMessage.next({ type: MessageType.requestModeMenu, data: true });
    }
}
