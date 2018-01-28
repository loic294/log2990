import { Component, OnInit/*, Input,*/ } from '@angular/core';

import { Case } from '../case'
import  Word  from "../../../../../common/lexical/word";

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

  selectCase(c : Case) : void {
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

  enterWord(): void {
    this._wordService.getWord()
    .subscribe(_word => this._word = _word);
    this.selectCase(this._grid[this._word.col][this._word.row]);
  }


  constructor(private _wordService: WordService) {}

  ngOnInit() {
    for (let i = 0; i < this._grid.length; i++) {
      for (let j = 0; j < this._grid[i].length; j++) {
        this._grid[i][j].setX(i);
        this._grid[i][j].setY(j);
      }
    }

    this.enterWord();
  }



}
