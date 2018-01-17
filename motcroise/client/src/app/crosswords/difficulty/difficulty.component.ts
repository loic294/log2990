import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-difficulty',
  templateUrl: './difficulty.component.html',
  styleUrls: ['./difficulty.component.css']
})
export class DifficultyComponent implements OnInit {

  selectedDifficulty: String

  difficulties = ['Easy','Normal','Hard']

  onSelect(diff: String): void {
    this.selectedDifficulty = diff;
  }

  constructor() { }

  ngOnInit() {
  }

}
