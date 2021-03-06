import { Injectable } from "@angular/core";
import { AudioListener, AudioLoader, AudioBuffer, PositionalAudio, Audio } from "three";
import { Car } from "../car/car";

const ENGINE_PATH: string = "assets/audio/engine.wav";
const COUNTDOWN_PATH: string = "assets/audio/countdown.ogg";
const CRASH_PATH: Array<string> = [
    "assets/audio/crash1.wav",
    "assets/audio/crash2.wav",
    "assets/audio/crash3.wav",
    "assets/audio/crash4.wav"
];
const WALL_CRASH_PATH: string = "assets/audio/wallCrash.wav";

const VOLUME: number = 0.5;
const RANDOM_FACTOR: number = 10;

@Injectable()
export class AudioService {

    private _listener: AudioListener;
    private _audioLoader: AudioLoader;
    private _countdown: Audio;
    private _carCollision: Array<Audio>;
    private _wallCollision: Audio;

    public constructor() {
        this._audioLoader = new AudioLoader();
        this._carCollision = new Array<Audio>();
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
        await this.initializeCountdown();
        await this.initializeCarCollisionSound();
        await this.initializeWallCollisionSounds();

    }

    private async initializeCountdown(): Promise<void>  {
        this._countdown = new Audio(this._listener);
        await this.loadSound(this._countdown, COUNTDOWN_PATH, false);
    }

    private async initializeWallCollisionSounds(): Promise<void> {
        const sound: PositionalAudio = new PositionalAudio(this._listener);
        await this.loadSound(sound, WALL_CRASH_PATH, false);
        this._wallCollision = sound;
    }

    private async initializeCarCollisionSound(): Promise<void>  {
        for (const path of CRASH_PATH) {
            const sound: Audio = new Audio(this._listener);
            await this.loadSound(sound, path, false);
            this._carCollision.push(sound);
        }
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

    public start(): void {
        this._listener.setMasterVolume(1);
        this._countdown.play();
    }

    public playCarCollision(): void {
        const randomIndex: number = Math.floor((Math.random()) * RANDOM_FACTOR % this._carCollision.length);
        if (this._carCollision[randomIndex].isPlaying) {
            this._carCollision[randomIndex].stop();
        }
        this._carCollision[randomIndex].play();
    }

    public playWallCollision(): void {
        if (this._wallCollision.isPlaying) {
            this._wallCollision.stop();
        }
        this._wallCollision.play();
    }

    public get countdown(): Audio {
        return this.countdown;
    }

}
