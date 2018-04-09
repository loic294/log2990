import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import { EnvironmentService } from "../environment-service/environment.service";
import {
    WebGLRenderer, Scene, Vector3
} from "three";
import { Car } from "../car/car";
import { CameraService } from "../camera-service/camera.service";
import { AiService } from "../ai-service/ai.service";
import { TrackProgression } from "../trackProgression";
import { TrackProgressionService } from "../trackProgressionService";
import Collision from "../car/collision";

const AMOUNT_OF_NPCS: number = 3;

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
    private _trackLoaded: boolean;
    private _trackProgression: TrackProgression;

    public constructor(private _cameraService: CameraService, private _environmentService: EnvironmentService) {
        this._car = new Car();
        this._bots = [];
        this._trackLoaded = false;

        for (let i: number = 0; i < AMOUNT_OF_NPCS; i++) {
            this._bots[i] = new Car();
        }

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
        this._bots.forEach((bot) => {
            if (Collision.detectCollision(this._car, bot)) {
                const resultSpeeds: Array<Vector3> = Collision.collide(this._car, bot);
                bot.speed = resultSpeeds[1];
                this._car.speed = resultSpeeds[0];
            }
        });
        for (let i: number = 0; i < this._bots.length; i++) {
            for (let j: number = i + 1; j < this._bots.length; j++) {
                if (Collision.detectCollision(this._bots[i], this._bots[j])) {
                    const resultSpeeds: Array<Vector3> = Collision.collide(this._bots[i], this._bots[j]);
                    this._bots[j].speed = resultSpeeds[1];
                    this._bots[i].speed = resultSpeeds[0];
                }
            }
        }
        if (this._trackLoaded) {
            this._aiService.update(timeSinceLastFrame);
        }
        this._cameraService.followCar();
        this._lastDate = Date.now();
    }

    private async createScene(): Promise<void> {
        this._scene = new Scene();

        await this._car.init();
        this.scene.add(this._car);
        for (let i: number = 0; i < AMOUNT_OF_NPCS; i++) {
            await this._bots[i].init();
            this.scene.add(this._bots[i]);
        }
        this._environmentService.initialize(this._scene);

        this._cameraService.initialize(this._car, this.getAspectRatio());
        this._cameraService.changeCamera();
    }

    public start(startingLine: Vector3, service: TrackProgressionService): void {
        this._cameraService.initialize(this._car, this.getAspectRatio());
        this._trackProgression = new TrackProgression(startingLine, this._car, service);
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

    public get cameraService(): CameraService {
        return this._cameraService;
    }

    public get environmentService(): EnvironmentService {
        return this._environmentService;
    }

    public get bots(): Array<Car> {
        return this._bots;
    }

    public set aiService(aiService: AiService) {
        this._aiService = aiService;
    }

    public set trackLoaded(trackLoaded: boolean) {
        this._trackLoaded = trackLoaded;
    }

}
