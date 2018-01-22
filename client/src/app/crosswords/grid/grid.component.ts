import { Component, OnInit } from '@angular/core';
import { Case } from '../../../case'

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  grid: Array<Array<Case>> = [
    [new Case("a"), new Case("b"), new Case("c")],
    [new Case("c"), new Case("c"), new Case("c")],
    [new Case("c"), new Case("c"), new Case("c")],
  ]

  constructor() { }

  ngOnInit() {
  }

}
