import { Scene, Clock } from "three";
import { TrackBuilder } from "./trackBuilder";
import { TrackProgressionService } from "./trackProgressionService";

export class RaceStarter {
    private _countdownClock: Clock;

    public constructor(private _scene: Scene, private _trackBuilder: TrackBuilder,
                       private _trackProgressionService: TrackProgressionService) {
        this._countdownClock = new Clock();
        this._countdownClock.start();
    }

    public getCountdown(): number {
        return this._countdownClock.getElapsedTime();
    }

    public get trackBuilder(): TrackBuilder {
        return this._trackBuilder;
    }

    public get trackProgressionService(): TrackProgressionService {
        return this._trackProgressionService;
    }

}
