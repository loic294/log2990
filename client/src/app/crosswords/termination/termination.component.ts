import { Component, Inject } from "@angular/core";
import { SocketService } from "../socket.service/socket.service";
import {MatDialogRef, MatDialog, MAT_DIALOG_DATA} from "@angular/material";
import { Type } from "../type";
import { Mode } from "../../../../../common/grid/player";
import { GridLoadingService } from "../../crosswords/grid-loading.service/grid-loading.service";
import { DifficultyService } from "./../difficulty.service/difficulty.service";
import { Difficulty } from "./../../../../../common/grid/difficulties";
import { MessageType, IOBoolean, IOString } from "../socket.service/observableMessages";

@Component({
    selector: "app-termination-component-termination",
    templateUrl: "termination.component.dialog.html",
    styleUrls: ["./termination.component.css"]
  })
  export class TerminationDialogComponent {
    public _level: Difficulty;
    private _dialogType: Number;
    private _loadingGrid: boolean;
    public showRematchOffer: boolean;
    public showWaitingRematchOffer: boolean;
    public opponentID: string;

    public constructor (
        private socketService: SocketService,
        public dialogRef: MatDialogRef<TerminationComponent>,
        public dialog: MatDialog,
        private gridLoadingService: GridLoadingService,
        private difficultyService: DifficultyService,
        @Inject(MAT_DIALOG_DATA) public data: Type) {

            this.showRematchOffer = false;
            this.showWaitingRematchOffer = false;
            this._loadingGrid = false;
            dialogRef.disableClose = true;
            this._dialogType = data;
            this.rematchOffer();
            this.receiveAcceptRematch();
        }

    public initDifficulty(): void {
        this.difficultyService.difficulty.subscribe((level: Difficulty) => {
            this._level = level;
        });
    }

    public async loadNewGrid(): Promise<void> {
        this._loadingGrid = true;
        this.socketService.resetScore();
        await this.gridLoadingService.loadNewGrid(this._level);
        this._loadingGrid = false;
    }

    public isLoadingGrid(): boolean {
        return this._loadingGrid;
    }

    public closeDialog(): void {
        this.dialog.closeAll();
    }

    public dialogType(): Number {
        return this._dialogType;
    }

    public async createSoloGame(): Promise<void> {

        await this.loadNewGrid();
        this.closeDialog();

    }

    public requestRematch(): void {
        this.showWaitingRematchOffer = true;
        this.socketService.sendRequestRematch();
    }

    public rematchOffer(): void {
        this.socketService.socketObservable.subscribe((data: IOString) => {
            if (data.type === MessageType.requestRematch) {
                this.showRematchOffer = true;
                this.opponentID = data.data;
            }
        });
    }

    public async acceptRematchOffer(): Promise<void> {
        await this.loadNewGrid();
        this.socketService.acceptRequestRematch(this.opponentID);
        this.closeDialog();
    }

    public openModeDialog(): void {
        this.socketService.resetScore();
        this.closeDialog();
        this.socketService.sendRequestModeMenu();
    }

    private receiveAcceptRematch(): void {
        this.socketService.socketObservable.subscribe((data: IOString) => {
            if (data.type === MessageType.acceptRematch) {
                if (data.data) {
                    this.showRematchOffer = true;
                    this.opponentID = data.data;
                }
            }
        });
    }

    public joinGame(gameId: string): void {
        this.socketService.joinGame(gameId);
    }
  }

@Component({
  selector: "app-termination",
  templateUrl: "./termination.component.html",
  styleUrls: ["./termination.component.css"]
})
export class TerminationComponent {

    public constructor(
        public dialog: MatDialog,
        private socketService: SocketService,

    ) {
       this.waitingGridValidation();
       this.isUserDisconnected();

    }

    public openDialog(type: Type): void {
        this.dialog.open(TerminationDialogComponent, {
            width: "500px",
            height: "450px",
            data: type
        });
    }

    private isUserDisconnected(): void {
        this.socketService.socketObservable.subscribe((data: IOBoolean) => {
            if (data.type === MessageType.opponentDisconnected) {
                if (data.data) {
                    this.openDialog(Type.disconnected);
                }
            }
        });
    }

    private twoPlayersValidation(): void {
        if (this.socketService.opponentScoreCount() > this.socketService.userScoreCount()) {
            this.openDialog(Type.multiPlayerLoss);
        } else {
            this.openDialog(Type.multiPlayerWin);
        }
    }

    private waitingGridValidation(): void {
        this.socketService.socketObservable.subscribe((data: IOBoolean) => {
            if (data.type === MessageType.gridValidated) {
                if (data.data) {
                    switch (this.socketService.selectedMode) {
                        case Mode.SinglePlayer:
                            this.openDialog(Type.soloGridValidated);
                            break;
                        case Mode.MultiPlayer:
                            this.twoPlayersValidation();
                            break;
                        default:
                            break;
                    }
                }
            }
        });
    }

}
