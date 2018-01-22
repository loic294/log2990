import { Component, OnInit, Input } from '@angular/core';
import { Case } from '../../../case'

@Component({
  selector: 'app-enter-word',
  templateUrl: './enter-word.component.html',
  styleUrls: ['./enter-word.component.css']
})




export class EnterWordComponent implements OnInit {

  correctWord: boolean = false;
  word: String = "abc";
  index: number = 0;
  letters: Array<Case> = [new Case(""), new Case("b"), new Case("")];
  @Input() letter: String;

  isLetter(letter: string): boolean{
    return (/[A-Za-z]/.test(letter) && letter.length == 1);
  }

  getLetter(idx: number): String{
    return this.letters[idx].getChar();
  }
  
  setLetter(letter: string): void{

    if (!this.isLetter(letter))
      return;

    this.letters[this.index].setChar(letter);
    this.index++;

    while (this.letters[this.index].getChar() != '' || 
    this.index < this.letters.length) 
      this.index++;

    if (this.index == this.letters.length)
      this.verifyWord();
  }

  undoLast(): void {
    this.index--;
    this.letters[this.index].setChar('');
  }

  verifyWord(): void {
    let temp = '';

    for (let i = 0; i < this.letters.length; i++)
      temp += this.letters[i].getChar();
      
    this.correctWord = (temp === this.word)
  }

  constructor() { }

  ngOnInit() {
  }

}
