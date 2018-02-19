import { Injectable, Component, OnInit } from "@angular/core";
import { WordService } from "../../word.service/word.service";

@Injectable()
@Component({
  selector: "app-crossword",
  templateUrl: "./crossword.component.html",
  styleUrls: ["./crossword.component.css"]
})
export class CrosswordComponent implements OnInit {

  public constructor(public _wordService: WordService) {

  }

  public unselect(): void {
        this._wordService.selectWordFromClue(null);
        this._wordService.selectWordFromGrid(null);
  }

  public ngOnInit(): void {
  }

}
