import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  grid: Array<Array<String>> = [
    ["a", "b"],
    ["c", "d"],
  ]

  constructor() { }

  ngOnInit() {
  }

}
