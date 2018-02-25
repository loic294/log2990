import { Component, OnInit } from "@angular/core";

import { WordService } from "../../word.service/word.service";

@Component({
  selector: "app-crossword",
  templateUrl: "./crossword.component.html",
  styleUrls: ["./crossword.component.css"],
  providers: [ WordService ]
})
export class CrosswordComponent implements OnInit {

  public constructor(public _wordService: WordService) { }

  public unselect(): void {
      this._wordService.selectWordFromClue(null);
      this._wordService.selectWordFromGrid(null);
  }

  public ngOnInit(): void {
  }

}
