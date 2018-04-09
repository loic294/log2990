import { Injectable } from "@angular/core";
import { AudioListener, AudioLoader, AudioBuffer, PositionalAudio, Audio } from "three";
import { Car } from "../car/car";

const ENGINE_PATH: string = "assets/audio/engine.wav";
const COUNTDOWN_PATH: string = "assets/audio/countdown.ogg";
/*const CRASH_PATH: Array<string> = ["", ""];
const WALL_CRASH_PATH: string = "";
*/
const VOLUME: number = 0.5;

@Injectable()
export class AudioService {

    private _listener: AudioListener;
    private _audioLoader: AudioLoader;

    public constructor() {
        this._audioLoader = new AudioLoader();
    }

    private async loadSound(sound: Audio, path: string, isLooping: boolean): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._audioLoader.load(
                path,
                (buffer: AudioBuffer) => {
                    sound.setBuffer(buffer);
                    sound.setLoop(isLooping);
                    sound.setVolume(VOLUME);
                    resolve();
                },
                (buffer: AudioBuffer) => { },
                (buffer: AudioBuffer) => { }
            );
        });
    }

    public async initializeSounds(player: Car, bots: Array<Car>): Promise<void> {
        this.addListener(player);
        this._listener.setMasterVolume(0);
        await this.addCarSound(ENGINE_PATH, player);
        for (const car of bots) {
            await this.addCarSound(ENGINE_PATH, car);
        }

    }

    private playCountdouwn(): void {
        const sound: Audio = new Audio(this._listener);
        this.loadSound(sound, COUNTDOWN_PATH, false).then( () => {
            sound.play();
        });
    }

    private async addCarSound(audioPath: string, car: Car): Promise<void> {
        const sound: PositionalAudio = new PositionalAudio(this._listener);
        await this.loadSound(sound, ENGINE_PATH, true);
        car.sound = sound;
        sound.play();
    }

    private addListener(car: Car): void {
        this._listener = new AudioListener();
        car.mesh.add(this._listener);
    }

    public play(): void {
        this._listener.setMasterVolume(1);
        this.playCountdouwn();
    }

}
