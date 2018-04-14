import { Clock } from "three";
import { TrackBuilder } from "./trackBuilder";
import { TrackProgressionService } from "./trackProgressionService";
import { AudioService } from "./audio-service/audio.service";

const MAX_COUNTDOWN: number = 3;

export class RaceStarter {
    private _countdownClock: Clock;
    private _visual: String;

    public constructor(private _trackBuilder: TrackBuilder, private _trackProgressionService: TrackProgressionService,
                       private _audioService: AudioService) {
        this._countdownClock = new Clock();
        this._countdownClock.start();
    }

    public getCountdown(): number {
        this.showCountdown();

        return this._countdownClock.getElapsedTime();
    }

    private showCountdown(): void {
        this._audioService.start();

        if (this._countdownClock.getElapsedTime() < 1) {
            this._visual = "3";
        } else if (this._countdownClock.getElapsedTime() < 2) {
            this._visual = "2";
        } else if (this._countdownClock.getElapsedTime() < MAX_COUNTDOWN) {
            this._visual = "1";
        }
    }

    public get trackBuilder(): TrackBuilder {
        return this._trackBuilder;
    }

    public get trackProgressionService(): TrackProgressionService {
        return this._trackProgressionService;
    }

    public get visual(): String {
        return this._visual;
    }

    public get audioService(): AudioService {
        return this._audioService;
    }

}
