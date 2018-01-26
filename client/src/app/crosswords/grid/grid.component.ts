import { Component, OnInit } from '@angular/core';
import { Case } from '../../../../../common/crossword/case'

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

  grid: Array<Array<Case>> = grid.map((row: string) => {
    const strings: Array<string> = row.split(' ')
    return strings.map((c: string) => new Case(c))
  })

  private _selectedCase: Case;
  private _input : string = null;
  private _x : number;
  private _y : number;



  enterInput(input: string) : void {
    this._input = input;
  }



  selectCase(c : Case) : void {
    this._selectedCase = c;
    this._x = c.getX();
    this._y = c.getY();
  }



  enterWord() : void {

    while (true) {

      while (this._input == null);

      this._selectedCase.setChar(this._input);
      this._input = null;

      this._selectedCase.unselect();
      
      if (this._x + 1 == this.grid.length) 
        break;

      this.selectCase(this.grid[this._x+1][this._y]);
    }

  }


  
  constructor() {}

  ngOnInit() {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        this.grid[i][j].setX(i);
        this.grid[i][j].setY(j);
      }
    }

  }

}
