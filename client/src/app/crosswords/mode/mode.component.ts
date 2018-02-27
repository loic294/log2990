import { Component, OnInit, Inject } from "@angular/core";
import { SocketService } from "../../socket.service/socket.service";
import { IGameModel } from "./../../../../../server/app/models/game";
import {MatDialogRef, MatDialog, MAT_DIALOG_DATA} from "@angular/material";

@Component({
    selector: "app-mode-component",
    templateUrl: "mode.component.html",
    styleUrls: ["./mode.component.css"]
  })
  export class ModeDialogComponent {

    public showDifficulty: boolean = true;
    public showNameInput: boolean = true;
    public showStartSoloGame: boolean = true;
    public waitingForPlayer: boolean = false;

    public constructor (
        private socketService: SocketService,
        public dialogRef: MatDialogRef<ModeComponent>,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: {}) {
            this.waitingConnection();
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
        if (this.selectedMode === "Single Player" && !this.showNameInput) {
            return true;
        }

        return false;
    }

    public isDifficultySelected(): boolean {
       return this.showNameInput = false;
    }

    public isMultiPlayer(): boolean {
        if (!this.showNameInput && this.selectedMode === "Two Players") {
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
        this.showDifficulty = false;

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
  export class ModeComponent implements OnInit {

      public constructor(
          public dialog: MatDialog
      ) {

          this.dialog.open(ModeDialogComponent, {
              width: "500px",
              height: "500px",
              data: {  }
          });

      }

      public ngOnInit(): void {}

}
