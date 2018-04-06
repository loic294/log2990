import { Component, OnInit } from '@angular/core';
import { IGameInformation, TrackProgressionService } from "../trackProgressionService";

@Component({
  selector: 'app-hud',
  templateUrl: './hud.component.html',
  styleUrls: ['./hud.component.css']
})
export class HudComponent implements OnInit {

  private _currentGame: IGameInformation;
  public constructor(
      private trackProgressionService: TrackProgressionService
  ) { }

  public ngOnInit() {
  }

}
