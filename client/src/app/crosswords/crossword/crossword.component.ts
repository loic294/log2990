import { Component } from "@angular/core";

import { WordService } from "../../word.service/word.service";
import { SocketService } from "../../socket.service/socket.service";

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
        this._socketService.opponentName.subscribe((data) => {
            this._opponentName = data;
        });

        this._socketService.opponentScore.subscribe((data) => {
            this._opponentScore = data;
        });

        this._socketService.userScore.subscribe((data) => {
            this._userScore = data;
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
