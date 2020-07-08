import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import { EnvironmentService } from "../environment-service/environment.service";
import {
    WebGLRenderer, Scene, Vector3, Mesh
} from "three";
import { Car } from "../car/car";
import { CameraService } from "../camera-service/camera.service";
import { AiService } from "../ai-service/ai.service";
import { TrackProgression } from "../trackProgression";
import { TrackProgressionService } from "../trackProgressionService";
import { RaceStarter } from "../raceStarter";
import { TrackBuilder } from "../trackBuilder";
import { AudioService } from "../audio-service/audio.service";
import Collision from "../car/collision";

const AMOUNT_OF_NPCS: number = 3;
const MAX_COUNTDOWN: number = 3;

@Injectable()
export class RenderService {

    private _container: HTMLDivElement;
    private _car: Car;
    private _renderer: WebGLRenderer;
    private _scene: THREE.Scene;
    private _stats: Stats;
    private _lastDate: number;
    private _bots: Array<Car>;
    private _aiService: AiService;
    private _raceStarter: RaceStarter;
    private _trackProgression: TrackProgression;
    private _track: Array<Mesh>;
    private _isRestarting: boolean;

    public constructor(private _cameraService: CameraService, private _audioService: AudioService,
                       private _environmentService: EnvironmentService) {
        this._car = new Car();
        this._bots = [];

        for (let i: number = 0; i < AMOUNT_OF_NPCS; i++) {
            this._bots[i] = new Car();
        }
        this._isRestarting = false;
    }

    public async initialize(container: HTMLDivElement): Promise<void> {
        if (container) {
            this._container = container;
        }

        await this.createScene();
        this.initStats();
        this.startRenderingLoop();
    }

    private initStats(): void {
        this._stats = new Stats();
        this._stats.dom.style.position = "absolute";
        this._container.appendChild(this._stats.dom);
    }

    private update(): void {
        const timeSinceLastFrame: number = Date.now() - this._lastDate;
        this._car.update(timeSinceLastFrame);
        if (this._aiService !== undefined) {
            this._aiService.update(timeSinceLastFrame);
            this.collisions();
        }
        this._cameraService.followCar();
        this._lastDate = Date.now();
    }

    private collisions(): void {
        for (let i: number = 0; i < this._bots.length; i++) {
            for (let j: number = i + 1; j < this._bots.length; j++) {
                if (Collision.detectCollision(this._bots[i], this._bots[j])) {
                    this._audioService.playCarCollision();
                    const resultSpeeds: Array<Vector3> = Collision.collide(this._bots[i], this._bots[j]);
                    this._bots[j].speed = resultSpeeds[1];
                    this._bots[i].speed = resultSpeeds[0];
                }
            }
            if (Collision.detectCollision(this._car, this._bots[i])) {
                this._audioService.playCarCollision();
                const resultSpeeds: Array<Vector3> = Collision.collide(this._car, this._bots[i]);
                this._bots[i].speed = resultSpeeds[1];
                this._car.speed = resultSpeeds[0];
            }
        }

        if (Collision.detectOutOfBounds(this._car, this._track) !== null) {
            this._car.speed = Collision.detectOutOfBounds(this._car, this._track);
        }
        for (const bot of this._bots) {
            if (Collision.detectOutOfBounds(bot, this._track) !== null) {
                bot.speed = Collision.detectOutOfBounds(bot, this._track);
            }
        }
    }

    private async createScene(): Promise<void> {
        this._scene = new Scene();

        await this._car.init();

        this.scene.add(this._car);

        for (let i: number = 0; i < AMOUNT_OF_NPCS; i++) {
            await this._bots[i].init();
            this.scene.add(this._bots[i]);
        }
        await this._audioService.initializeSounds(this.car, this._bots);
        this._environmentService.initialize(this._scene);
        this._cameraService.initialize(this._car, this.getAspectRatio());
        this._cameraService.changeCamera();
    }

    public start(trackBuilder: TrackBuilder, service: TrackProgressionService): void {
        this._cameraService.initialize(this._car, this.getAspectRatio());
        this._raceStarter = new RaceStarter(trackBuilder, service, this._audioService);
    }

    public getAspectRatio(): number {
        return this._container.clientWidth / this._container.clientHeight;
    }

    private startRenderingLoop(): void {
        this._renderer = new WebGLRenderer();
        this._renderer.setPixelRatio(devicePixelRatio);
        this._renderer.setSize(this._container.clientWidth, this._container.clientHeight);

        this._lastDate = Date.now();
        this._container.appendChild(this._renderer.domElement);
        this.render();
    }

    private render(): void {
        requestAnimationFrame(() => this.render());
        this.update();
        this.renderer.render(this.scene, this._cameraService.camera);
        this._stats.update();

        if (this._raceStarter !== undefined && this._raceStarter.getCountdown() >= MAX_COUNTDOWN) {
            this._aiService = new AiService(this._raceStarter.trackBuilder, this._bots);

            this._trackProgression = new TrackProgression(this._raceStarter.trackBuilder.startingLines[0].position,
                                                          this._car, this._bots,
                                                          this._raceStarter.trackProgressionService,
                                                          this._raceStarter.trackBuilder.vertices);
            this._track = this._raceStarter.trackBuilder.trackSegments;
            this._raceStarter = undefined;
        }
        if (this._trackProgression !== undefined) {
            this._trackProgression.checkRaceProgress();
        }
    }

    public onResize(): void {
        this._cameraService.onResize(this.getAspectRatio());
        this.renderer.setSize(this._container.clientWidth, this._container.clientHeight);
    }

    public changeTimeOfDay(): void {
        this._environmentService.changeMode();
        if (!this._environmentService.isNight && this._car.headlightsManager.isActive) {
            this.toogleLights();
        } else if (this._environmentService.isNight && !this._car.headlightsManager.isActive) {
            this.toogleLights();
        }
    }

    public toogleLights(): void {
        this._car.toogleLight();
        for (const bot of this.bots) {
            bot.toogleLight();
        }
    }

    public get renderer(): WebGLRenderer {
        return this._renderer;
    }

    public get camera(): THREE.Camera {
        return this._cameraService.camera;
    }

    public get scene(): THREE.Scene {
        return this._scene;
    }

    public get car(): Car {
        return this._car;
    }

    public set car(car: Car) {
        this._car = car;
    }

    public get cameraService(): CameraService {
        return this._cameraService;
    }

    public get environmentService(): EnvironmentService {
        return this._environmentService;
    }

    public get bots(): Array<Car> {
        return this._bots;
    }

    public set bots(bots: Array<Car>) {
        this._bots = bots;
    }

    public set aiService(aiService: AiService) {
        this._aiService = aiService;
    }

    public get raceStarter(): RaceStarter {
        return this._raceStarter;
    }

    public set trackProgression(trackProgression: TrackProgression) {
        this._trackProgression = trackProgression;
    }

    public get audioService(): AudioService {
        return this._audioService;
    }

    public set isRestarting(restart: boolean) {
        this._isRestarting = restart;
    }

}
