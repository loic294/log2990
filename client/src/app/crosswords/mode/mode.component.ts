import { Component, OnInit, Inject } from "@angular/core";
import { SocketService } from "../../socket.service/socket.service";
import { IGameModel } from "./../../../../../server/app/models/game";
import {MatDialogRef, MatDialog, MAT_DIALOG_DATA} from '@angular/material';


@Component({
  selector: "app-mode",
  templateUrl: "./mode.component.html",
  styleUrls: ["./mode.component.css"]
})
export class ModeComponent implements OnInit {

    // private input: String;

    public constructor(
        public dialog: MatDialog
    ) { let dialogRef = this.dialog.open(ModeDialog, {
        width: '500px',
        height: '500px',
        data: {  }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });}


    public ngOnInit(): void {
    }

}

@Component({
    selector: 'mode-component-popup',
    templateUrl: 'mode.component.popup.html',
  })
  export class ModeDialog {
  
    constructor(
        private socketService: SocketService,
        public dialogRef: MatDialogRef<ModeComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) { }
  
    onNoClick(): void {
      this.dialogRef.close();
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
    }

    public joinGame(gameId: string): void {
        this.socketService.joinGame(gameId);
    }

  
  }
