import { Component, OnInit, Inject } from "@angular/core";
import { SocketService } from "../../socket.service/socket.service";
import {MatDialogRef, MatDialog, MAT_DIALOG_DATA} from "@angular/material";

enum Type {
    disconnected = 0,
    soloGridValidated = 1,
    multiPlayerWin = 2,
    multiPlayerLoss = 3
}

@Component({
    selector: "app-termination-component-termination",
    templateUrl: "termination.component.dialog.html",
    styleUrls: ["./termination.component.css"]
  })
  export class TerminationDialogComponent {
    private _dialogType: Number;
    public waitingForPlayer: boolean = false;
    public constructor (
        private socketService: SocketService,
        public dialogRef: MatDialogRef<TerminationComponent>,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: Type) {

            dialogRef.disableClose = true;
            this._dialogType = data;
        }

    public closeDialog(): void {
        this.dialog.closeAll();
    }

    public dialogType(): Number {
        return this._dialogType;
    }

    public isWaitingForPlayer(): boolean {
        return this.waitingForPlayer;
    }

    public createGame(): void {
        this.socketService.createGame("Multi Players");
        this.waitingForPlayer = true;
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
export class TerminationComponent implements OnInit {

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
            height: "250px",
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

    private waitingGridValidation(): void {
            this.socketService.gridValidated.subscribe((gridValidated: boolean) => {
                if (gridValidated) {
                    switch (this.socketService.selectedMode) {
                        case "Single Player":
                            this.openDialog(Type.soloGridValidated);
                            break;
                        case "Two Players":
                            if (this.socketService.opponentScoreCount() > this.socketService.userScoreCount()) {
                                this.openDialog(Type.multiPlayerLoss);
                            } else {
                                this.openDialog(Type.multiPlayerWin);
                            }
                            break;
                        default:
                            break;

                    }
                }
            });
    }

    public ngOnInit(): void {}

}
