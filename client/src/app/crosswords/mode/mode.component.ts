import { Component, Inject } from "@angular/core";
import { SocketService } from "../socket.service/socket.service";
import { IGameModel } from "./../../../../../server/app/models/game";
import {MatDialogRef, MatDialog, MAT_DIALOG_DATA} from "@angular/material";
import { Mode } from "../../../../../common/grid/player";

@Component({
    selector: "app-mode-component-mode",
    templateUrl: "mode.component.mode.html",
    styleUrls: ["./mode.component.css"]
  })
  export class ModeDialogComponent {

    public showDifficulty: boolean = false;
    public showNameInput: boolean = false;
    public showStartSoloGame: boolean = false;
    public waitingForPlayer: boolean = false;
    public scoreOpponent: number = 0;

    public constructor (
        private socketService: SocketService,
        public dialogRef: MatDialogRef<ModeComponent>,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: {}) {
            this.waitingConnection();
            dialogRef.disableClose = true;

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

    public joinGame(gameId: string): void {
        this.socketService.joinGame(gameId);
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
