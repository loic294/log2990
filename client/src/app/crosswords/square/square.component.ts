import { Component, OnInit, Input } from '@angular/core';

import { Case } from '../../../../../common/crossword/case'

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit {

  @Input() case: Case;

  constructor() { }

  ngOnInit() {
  }

}
