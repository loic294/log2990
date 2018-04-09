import { Injectable, OnInit } from "@angular/core";
import { AudioListener, AudioLoader, AudioBuffer, PositionalAudio, Audio } from "three";
import { Car } from "../car/car";

const ENGINE_PATH: string = "assets/audio/engine.wav";
/*const COUNTDOWN_PATH: string = "assets/audio/countdown.ogg";
const CRASH_PATH: Array<string> = ["", ""];
const WALL_CRASH_PATH: string = "";
*/
const VOLUME: number = 0.5;
const INITIAL_FREQUENCE: number = 0.145;

@Injectable()
export class AudioService {

    private _listener: AudioListener;
    private _audioLoader: AudioLoader;

    public constructor() {

    }

    private async loadSound(sound: Audio, path: string, isLooping: boolean): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._audioLoader.load(
                path,
                (buffer: AudioBuffer) => {
                    sound.setBuffer(buffer);
                    sound.setLoop(true);
                    sound.setVolume(VOLUME);
                    sound.setPlaybackRate(INITIAL_FREQUENCE);
                    // sound.play();
                    resolve();
                },
                (buffer: AudioBuffer) => { },
                (buffer: AudioBuffer) => { }
            );
        });
    }

    public initializeCarSound(player: Car, bots: Array<Car>): void {
        this.addListener(player);
        this._audioLoader = new AudioLoader();
        this.addCarSound(ENGINE_PATH, player);
        for (const car of bots) {
            this.addCarSound(ENGINE_PATH, car);
        }
    }

    private addCarSound(audioPath: string, car: Car): void {
        const sound: PositionalAudio = new PositionalAudio(this._listener);
        this.loadSound(sound, ENGINE_PATH, true).then(() => {
            car.sound = sound;
            sound.play();
        });
    }

    private addListener(car: Car): void {
        this._listener = new AudioListener();
        car.mesh.add(this._listener);
    }

}
