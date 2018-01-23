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

  grid: Array<Array<Case>> = grid.map((row: string) => {
    const strings: Array<string> = row.split(' ')
    return strings.map((c: string) => new Case(c))
  })

  constructor() {}

  ngOnInit() {}

}
