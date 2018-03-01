import { Component, OnInit } from "@angular/core";

import { WordService } from "../../word.service/word.service";
import { SocketService } from "../../socket.service/socket.service";

@Component({
  selector: "app-crossword",
  templateUrl: "./crossword.component.html",
  styleUrls: ["./crossword.component.css"],
  providers: [ WordService ]
})
export class CrosswordComponent implements OnInit {

  public constructor(
      public _wordService: WordService,
      public _socketService: SocketService
    ) { }

  public opponnentName(){ 
      return this._socketService.player;
  }
  public unselect(): void {
      this._wordService.selectWordFromClue(null);
      this._wordService.selectWordFromGrid(null);
  }

  public get selectedMode(): string {
      return this._socketService.selectedMode;
  }

  public ngOnInit(): void {
  }

}
