import { Component } from "@angular/core";

import { WordService } from "../word.service/word.service";
import { SocketService } from "../socket.service/socket.service";
import { IOString, MessageType, IONumber } from "../socket.service/observableMessages";

@Component({
  selector: "app-crossword",
  templateUrl: "./crossword.component.html",
  styleUrls: ["./crossword.component.css"],
  providers: [ WordService ]
})
export class CrosswordComponent {
  private _opponentName: string;
  private _opponentScore: number = 0;
  private _userScore: number = 0;

  public constructor(
      public _wordService: WordService,
      public _socketService: SocketService
    ) {
        this._socketService.socketObservale.subscribe((data: IOString) => {
            if (data.type === MessageType.opponentName) {
                this._opponentName = data.data;
            }
        });

        this._socketService.socketObservale.subscribe((data: IONumber) => {
            if (data.type === MessageType.opponentScore) {
                this._opponentScore = data.data;
            } else if (data.type === MessageType.userScore) {
                this._userScore = data.data;
            }
        });

     }

  public get scoreOpponent(): number {
        return this._opponentScore;
  }

  public get scoreUser(): number {
      return this._userScore;
  }

  public get opponnentName(): string {
      return this._opponentName;
  }
  public unselect(): void {
      this._wordService.selectWordFromClue(null);
      this._wordService.selectWordFromGrid(null);
  }

  public get selectedMode(): string {
      return this._socketService.selectedMode;
  }

}
