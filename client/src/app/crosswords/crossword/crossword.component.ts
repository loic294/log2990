import { Component, OnInit } from "@angular/core";
import Word from "../../../../../common/lexical/word";

@Component({
  selector: "app-crossword",
  templateUrl: "./crossword.component.html",
  styleUrls: ["./crossword.component.css"]
})
export class CrosswordComponent implements OnInit {

  public _word: Word;

  public constructor() { }

  public ngOnInit(): void {
  }

}
