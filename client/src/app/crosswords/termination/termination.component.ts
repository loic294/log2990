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
    private _dialogType: string;
    public constructor (
        private socketService: SocketService,
        public dialogRef: MatDialogRef<TerminationComponent>,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: Type) {

            dialogRef.disableClose = true;
            this._dialogType = data;
            console.log(this._dialogType);

        }

    public closeDialog(): void {
        this.dialog.closeAll();
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
            data: { type }
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
                    this.openDialog("validated");
                }
            });
    }

    public ngOnInit(): void {}

}
