import { Component, OnInit } from '@angular/core';
import { Case } from '../../../case'

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

  private _selectedCase: Case;
  private _x : number;
  private _y : number;



  isLetter(letter: string) : boolean {
    return (/[A-Za-z]/.test(letter) && letter.length == 1);
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


  constructor() {}

  ngOnInit() {
    for (let i = 0; i < this._grid.length; i++) {
      for (let j = 0; j < this._grid[i].length; j++) {
        this._grid[i][j].setX(i);
        this._grid[i][j].setY(j);
      }
    }

  }

}
