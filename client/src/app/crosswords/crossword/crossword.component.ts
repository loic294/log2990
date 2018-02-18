import { Injectable, Component, OnInit } from "@angular/core";

import { WordService } from "../../word.service/word.service";
import { Socket } from "ng-socket-io";
// import { setTimeout } from "timers";

@Injectable()
@Component({
  selector: "app-crossword",
  templateUrl: "./crossword.component.html",
  styleUrls: ["./crossword.component.css"]
})
export class CrosswordComponent implements OnInit {

  public constructor(public _wordService: WordService, private _socket: Socket) {
      this._socket.connect();
      setTimeout(() => {
        this._socket.emit("test", "Hello");
        this._socket.emit("connet_to_room", "test-room");
        this._socket.on("connected_to_room", (status: string): void => {
            console.log("Connected to room", status);
        });
      }, 2000);
  }

  public unselect(): void {
      this._wordService.selectWordFromClue(null);
      this._wordService.selectWordFromGrid(null);
  }

  public ngOnInit(): void {
  }

}
