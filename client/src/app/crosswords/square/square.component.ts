import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Case } from '../../../case'

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit {

  @Input() case: Case;

 @Output() charChange = new EventEmitter(); 

  getLetter(): String {
    return this.case.getChar();
  }

  setLetter(c: String): void {
    this.case.setChar(c);
    this.charChange.emit(c);
  }

  constructor() {
  }

  ngOnInit() {
  }

}
