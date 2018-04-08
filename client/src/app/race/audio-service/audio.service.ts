import { Injectable } from "@angular/core";
import { AudioListener, Audio, AudioLoader, AudioBuffer } from "three";
import { Car } from "../car/car";

const ENGINE_PATH: string = "assets/audio/engine.wav";
/*const COUNTDOWN_PATH: string = "";
const CRASH_PATH: Array<string> = ["", ""];
const WALL_CRASH_PATH: string = "";
*/
const VOLUMETEMP: number = 0.2;

@Injectable()
export class AudioService {

    private listener: AudioListener;
    // private _collisionSound: Array<Audio>;
    // private _crashWall: Audio;
    public audioLoader: AudioLoader;

    private loadSound(sound: Audio, path: string): void {
        // load a sound and set it as the Audio object's buffer
        this.audioLoader.load(
            path,
            (buffer: AudioBuffer) => {
                sound.setBuffer(buffer);
                sound.setLoop(true);
                sound.setVolume(VOLUMETEMP);
                sound.play();
            },
            (buffer: AudioBuffer) => { },
            (buffer: AudioBuffer) => { }
        );
    }

    public initialize(playerCar: Car, bots: Array<Car>): void {
        this.addListener(playerCar);
        this.audioLoader = new AudioLoader();
        this.addSound(ENGINE_PATH, playerCar.sound);
        for (const car of bots) {
            this.addSound(ENGINE_PATH, car.sound);
        }

    }

    private addSound(audioPath: string, objectSound: Audio): void {
        objectSound = new Audio(this.listener);
        this.loadSound(objectSound,  ENGINE_PATH);
    }

    private addListener(car: Car): void {
        // create an AudioListener and add it to the camera
        this.listener = new AudioListener();
        car.add(this.listener);
    }

}
