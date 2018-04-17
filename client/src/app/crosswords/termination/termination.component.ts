import { Component, Inject } from "@angular/core";
import { SocketService } from "../socket.service/socket.service";
import {MatDialogRef, MatDialog, MAT_DIALOG_DATA} from "@angular/material";
import { Type } from "../type";
import { Mode } from "../../../../../common/grid/player";
import { GridLoadingService } from "../../grid-loading.service/grid-loading.service";

@Component({
    selector: "app-termination-component-termination",
    templateUrl: "termination.component.dialog.html",
    styleUrls: ["./termination.component.css"]
  })
  export class TerminationDialogComponent {
    private _dialogType: Number;
    public showRematchOffer: boolean = false;
    public showWaitingRematchOffer: boolean = false;
    public loadingGrid: boolean = false;
    public opponentID: string;

    public constructor (
        private socketService: SocketService,
        public dialogRef: MatDialogRef<TerminationComponent>,
        public dialog: MatDialog,
        private gridLoadingService: GridLoadingService,
        @Inject(MAT_DIALOG_DATA) public data: Type) {

            dialogRef.disableClose = true;
            this._dialogType = data;
            this.rematchOffer();
            this.receiveAcceptRematch();
        }

    public async loadNewGrid(): Promise<void> {
        this.loadingGrid = true;
        await this.gridLoadingService.loadNewGrid();
        this.loadingGrid = false;
    }

    public isLoadingGrid(): boolean {
        return this.loadingGrid;
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
        this.socketService.requestRematch().subscribe( (gameID: string) => {
            this.showRematchOffer = true;
            this.opponentID = gameID;
       });
    }

    public async acceptRematchOffer(): Promise<void> {
        await this.loadNewGrid();
        this.socketService.acceptRequestRematch(this.opponentID);
        this.closeDialog();
    }

    public openModeDialog(): void {
        this.closeDialog();
        this.socketService.sendRequestModeMenu();
    }

    private receiveAcceptRematch(): void {
        this.socketService.acceptRematch().subscribe( (accepted: boolean) => {
            if (accepted) {
                this.closeDialog();
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
        this.socketService.isOpponentDisconnected.subscribe( (opponentDisconnected: boolean) => {
            if (opponentDisconnected) {
                this.openDialog(Type.disconnected);
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
            this.socketService.gridValidated.subscribe((gridValidated: boolean) => {
                if (gridValidated) {
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
            });
    }

}
