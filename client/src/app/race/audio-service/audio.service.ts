import { Injectable } from "@angular/core";
import { AudioListener,  AudioLoader, AudioBuffer, PositionalAudio } from "three";
import { Car } from "../car/car";

const ENGINE_PATH: string = "assets/audio/engine.wav";
/*const COUNTDOWN_PATH: string = "";
const CRASH_PATH: Array<string> = ["", ""];
const WALL_CRASH_PATH: string = "";
*/
const VOLUME: number = 0.5;
const INITIAL_FREQUENCE: number = 0.145;

@Injectable()
export class AudioService {

    private listener: AudioListener;
    public audioLoader: AudioLoader;

    private loadSound(sound: PositionalAudio, path: string): void {
        // load a sound and set it as the Audio object's buffer
        this.audioLoader.load(
            path,
            (buffer: AudioBuffer) => {
                sound.setBuffer(buffer);
                sound.setLoop(true);
                sound.setVolume(VOLUME);
                sound.setPlaybackRate(INITIAL_FREQUENCE);
                sound.play();
            },
            (buffer: AudioBuffer) => { },
            (buffer: AudioBuffer) => { }
        );
    }

    public initialize(player: Car, bots: Array<Car>): void {
        this.addListener(player);
        this.audioLoader = new AudioLoader();
        this.addCarSound(ENGINE_PATH, player);
        for (const car of bots) {
            this.addCarSound(ENGINE_PATH, car);
        }

    }

    private addCarSound(audioPath: string, car: Car): void {
        const sound: PositionalAudio = new PositionalAudio(this.listener);
        this.loadSound(sound,  ENGINE_PATH);
        car.sound = sound;
    }

    private addListener(car: Car): void {
        // create an AudioListener and add it to the camera
        this.listener = new AudioListener();
        car.mesh.add(this.listener);
    }

}
