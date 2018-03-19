import { Component, OnInit, Inject } from "@angular/core";
import { SocketService } from "../../socket.service/socket.service";
import { IGameModel } from "./../../../../../server/app/models/game";
import {MatDialogRef, MatDialog, MAT_DIALOG_DATA} from "@angular/material";

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

    private _wordCount: number;

    public constructor (
        private socketService: SocketService,
        public dialogRef: MatDialogRef<ModeComponent>,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: {}) {
            this.waitingConnection();
            this.isUserDisconnected();
            this.waitingGridValidation();
            dialogRef.disableClose = true;

        }

    public closeDialog(): void {
        this.dialog.closeAll();
    }

    public disconnectDialog(): void {
        this.dialog.open(DisconnectedDialogComponent, {
            width: "500px",
            height: "250px",
            data: {  }
        });
    }

    private waitingGridValidation(): void {
        this.socketService.gridValidated.subscribe((gridValidated: boolean) => {
            if (gridValidated) {
                console.log("WOOOOOOOOO");
                this.disconnectDialog();
            }
        });
    }
    private isUserDisconnected(): void {
        this.socketService.isOpponentDisconnected.subscribe( (opponentDisconnected: boolean) => {
            if (opponentDisconnected) {
                this.disconnectDialog();
            }
        });
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
        if (this.selectedMode === "Single Player" && this.showNameInput) {
            return true;
        }

        return false;
    }

    public isDifficultySelected(): boolean {
       return this.showNameInput = true;
    }

    public isMultiPlayer(): boolean {
        if (this.showNameInput && this.selectedMode === "Two Players") {
            return true;
        }

        return false;
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
    selector: "mode.component.disconnected",
    templateUrl: "./mode.component.disconnected.html",
    styleUrls: ["./mode.component.css"]
  })
  export class DisconnectedDialogComponent {

      public constructor(
        public dialog: MatDialog,
        private dialogRef: MatDialogRef<ModeComponent>
      ) {
        this.dialogRef.disableClose = true;
      }

      public openModeDialog(): void {
        this.dialog.open(ModeDialogComponent, {
            width: "500px",
            height: "75%",
            data: {  }
        });
      }

      public ngOnInit(): void {}

}
// tslint:disable max-classes-per-file
@Component({
    selector: "app-mode",
    templateUrl: "./mode.component.html",
    styleUrls: ["./mode.component.css"]
  })
  export class ModeComponent implements OnInit {

      public constructor(
          public dialog: MatDialog
      ) {

          this.dialog.open(ModeDialogComponent, {
              width: "500px",
              height: "75%",
              data: {  }
          });

      }

      public ngOnInit(): void {}

}
