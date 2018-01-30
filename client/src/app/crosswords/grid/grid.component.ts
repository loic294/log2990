import { Component, OnInit/*, Input,*/ } from '@angular/core';

import { Case } from '../case'
import  Word, { Orientation }  from "../../../../../common/lexical/word";

import { WordService } from '../../word.service'

/** TEMPORARY MOCKED CONTENT 
   * Example table
   * **/

const grid: Array<String> = [
  '- - - - - - - - P -',
  '- - - - A - C L U E',
  'W O U N D - R - S -',
  'O - - - V - O - H -',
  'R - - - E - S - - -',
  'R - F I N I S H - C',
  'Y - - - T - W - - R',
  '- M E N U - O - - A',
  '- - - - R - E - - C',
  'G R A V E - D O C K',
]

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  private _grid: Array<Array<Case>> = grid.map((row: string) => {
    const strings: Array<string> = row.split(' ')
    return strings.map((c: string) => new Case(c))
  })

  //@Input() public word: Word;
  private _selectedCase: Case;
  private _word: Word;
  private _x : number;
  private _y : number;



  isLetter(letter: string) : boolean {
    return (/[a-z]/i.test(letter) && letter.length == 1);
  }


  findWordStart(): Word {
        let tempIndex: Array<number> = [this._x,this._y];
        let tempOrientation: Orientation;

        /* If letter */
        if (this.isLetter(this._grid[tempIndex[0]][tempIndex[1]].getChar())) {
            /* Go back by col indexes if possible */
            if (tempIndex[1]-1 >= 0 && 
                this.isLetter(this._grid[tempIndex[0]][tempIndex[1]-1].getChar())) {
                    tempOrientation = Orientation.horizontal;
                     while (tempIndex[1]-1 >= 0 &&
                        this.isLetter(this._grid[tempIndex[0]][tempIndex[1]-1].getChar())) {
                        tempIndex[1]--;
                    }
            }
            /* else go back by row indexes if possible */
            else if (tempIndex[0]-1 >= 0 &&
                this.isLetter(this._grid[tempIndex[0]-1][tempIndex[1]].getChar())) {
                    tempOrientation = Orientation.vertical;
                    while (tempIndex[0]-1 >= 0 &&
                    this.isLetter(this._grid[tempIndex[0]-1][tempIndex[1]].getChar())) {
                        tempIndex[0]--;
                    }
            }
            /* else already (or is now) at word start. return as is */
        }

        return new Word("","",tempIndex,tempOrientation);       
  }

  selectCase(c : Case) : void {
    this._x = c.getX();
    this._y = c.getY();

    let tempWord: Word = this.findWordStart();    
    this._wordService.selectPosition(tempWord);

    if (this._selectedCase != null)
      this._selectedCase.unselect();
    this._grid[tempWord.col][tempWord.row].select();
    this._selectedCase = this._grid[tempWord.col][tempWord.row];
    this._x = this._grid[tempWord.col][tempWord.row].getX();
    this._y = this._grid[tempWord.col][tempWord.row].getY();
  }

  selectCaseService(c: Case): void {
    if (this._selectedCase != null)
      this._selectedCase.unselect();
    c.select();
    this._selectedCase = c;
    this._x = c.getX();
    this._y = c.getY();
  }


  nextCase() : void {
    if (this.isLetter(this._selectedCase.getChar())) {
      if (this._x + 1 < this._grid.length) {
       this._x++;
       this.selectCase(this._grid[this._x][this._y]);
      }
      else
       this._selectedCase.unselect();
    }
  }

  constructor(private _wordService: WordService)  {}

  ngOnInit() {
    for (let i = 0; i < this._grid.length; i++) {
      for (let j = 0; j < this._grid[i].length; j++) {
        this._grid[i][j].setX(i);
        this._grid[i][j].setY(j);
      }
    }

    this._wordService.getWord()
    .subscribe(
    (_word) => {this._word = _word,
    this.selectCaseService(this._grid[_word.col][_word.row])}
    );
  }



}
