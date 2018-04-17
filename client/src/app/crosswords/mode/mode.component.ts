import { Component, Inject } from "@angular/core";
import { SocketService } from "../socket.service/socket.service";
import { IGameModel } from "./../../../../../server/app/models/game";
import {MatDialogRef, MatDialog, MAT_DIALOG_DATA} from "@angular/material";
import { Mode } from "../../../../../common/grid/player";
import { GridLoadingService } from "../../grid-loading.service/grid-loading.service";
import { DifficultyService } from "./../difficulty.service/difficulty.service";
import { Difficulty } from "./../../../../../common/grid/difficulties";

@Component({
    selector: "app-mode-component-mode",
    templateUrl: "mode.component.mode.html",
    styleUrls: ["./mode.component.css"]
  })
  export class ModeDialogComponent {

    public _level: Difficulty;
    public showDifficulty: boolean;
    public showNameInput: boolean;
    public showStartSoloGame: boolean;
    public waitingForPlayer: boolean;
    public loadingGrid: boolean;
    public scoreOpponent: number;

    public constructor (
        private socketService: SocketService,
        public dialogRef: MatDialogRef<ModeComponent>,
        public dialog: MatDialog,
        private gridLoadingService: GridLoadingService,
        private difficultyService: DifficultyService,
        @Inject(MAT_DIALOG_DATA) public data: {}) {
            this.showDifficulty = false;
            this.showNameInput = false;
            this.showStartSoloGame = false;
            this.waitingForPlayer = false;
            this.loadingGrid = false;
            this.scoreOpponent = 0;

            this.initDifficulty();
            this.waitingConnection();
            dialogRef.disableClose = true;

        }

    public initDifficulty(): void {
        this.difficultyService.difficulty.subscribe((level: Difficulty) => {
            this._level = level;
        });
    }

    public async loadNewGrid(): Promise<void> {
        this.loadingGrid = true;
        await this.gridLoadingService.loadNewGrid(this._level);
        this.loadingGrid = false;
    }

    public async newGame(): Promise<void> {
        await this.loadNewGrid();
        this.closeDialog();
    }

    public closeDialog(): void {
        this.dialogRef.close();
    }

    private waitingConnection(): void {
        this.socketService.isUserConnected.subscribe( (userConnected: boolean) => {
            if (userConnected) {
                this.closeDialog();
            }
       });
    }

    public isWaitingForPlayer(): boolean {
        return this.waitingForPlayer;
    }

    public isLoadingGrid(): boolean {
        return this.loadingGrid;
    }

    public startSoloGame(): boolean {
        return this.selectedMode === Mode.SinglePlayer && this.showNameInput;

    }

    public isDifficultySelected(): boolean {
       return this.showNameInput = true;
    }

    public isMultiPlayer(): boolean {
        return this.showNameInput && this.selectedMode === Mode.MultiPlayer;

    }

    public get modes(): string[] {
        return this.socketService.modes;
    }

    public get player(): string {
        return this.socketService.player;
    }

    public onEnter(value: string): void {
        this.socketService.onEnter(value);

    }

    public get selectedMode(): string {
        return this.socketService.selectedMode;
    }

    public onSelect(mode: string): void {
        this.showDifficulty = true;

        return this.socketService.onSelect(mode);

    }

    public get games(): IGameModel[] {
        return this.socketService.games;
    }

    public addGames(): void {
        this.socketService.addGames();
    }

    public toggleShowGames(): void {
        this.socketService.toggleShowGames();
    }

    public get showGames(): boolean {
        return this.socketService.showGames;
    }

    public createGame(mode: string): void {
        this.socketService.createGame(mode);
        this.waitingForPlayer = true;
    }

    public async joinGame(gameId: string): Promise<void> {
        await this.loadNewGrid();
        this.socketService.joinGame(gameId);
        this.closeDialog();
    }
}

@Component({
    selector: "app-mode",
    templateUrl: "./mode.component.html",
    styleUrls: ["./mode.component.css"]
  })
  export class ModeComponent {

    public constructor(
          public dialog: MatDialog,
          private _socketService: SocketService
      ) {
          this.openDialog();
          this.receiveRequestForModeMenu();

      }

    private receiveRequestForModeMenu(): void {
        this._socketService.requestModeMenu.subscribe( (requestModeMenu: boolean) => {
            if (requestModeMenu) {
        this.openDialog();
            }
       });
    }

    private openDialog(): void {
        this.dialog.open(ModeDialogComponent, {
            width: "500px",
            height: "75%",
            data: {  }
        });
    }

}
