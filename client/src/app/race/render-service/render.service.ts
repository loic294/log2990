import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import { WebGLRenderer, Scene, AmbientLight,
MeshBasicMaterial, TextureLoader, MultiMaterial, Mesh, DoubleSide, BoxGeometry } from "three";
import { Car } from "../car/car";
import TopDownCamera from "../camera-state/top-down-camera";
import ThirdPersonCamera from "../camera-state/third-person-camera";
import AbsCamera from "../camera-state/ICamera";

const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 1;

const SIZE_SKYBOX: number = 10000;

enum CAMERA_VIEW {
    TOP_DOWN = 0,
    THIRD_PERSON = 1
}

@Injectable()
export class RenderService {
    private _cameraView: number;
    private _stateCamera: AbsCamera;
    private container: HTMLDivElement;
    private _car: Car;
    private renderer: WebGLRenderer;
    private scene: THREE.Scene;
    private stats: Stats;
    private lastDate: number;

    public get car(): Car {
        return this._car;
    }

    public constructor() {
        this._car = new Car();
    }

    public async initialize(container: HTMLDivElement): Promise<void> {
        if (container) {
            this.container = container;
        }

        await this.createScene();
        this.initStats();
        this.startRenderingLoop();
    }

    private initStats(): void {
        this.stats = new Stats();
        this.stats.dom.style.position = "absolute";
        this.container.appendChild(this.stats.dom);
    }

    private update(): void {
        const timeSinceLastFrame: number = Date.now() - this.lastDate;
        this._car.update(timeSinceLastFrame);
        this._stateCamera.follow();
        this.lastDate = Date.now();
    }

    private async createScene(): Promise<void> {
        this.scene = new Scene();
        this._stateCamera = new ThirdPersonCamera(this);
        this._cameraView = CAMERA_VIEW.THIRD_PERSON;

        await this._car.init();
        this.scene.add(this._car);
        this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
        this.loadSkybox();
    }

    public changeCamera(): void {
        if (this._cameraView === CAMERA_VIEW.THIRD_PERSON ) {
            this._stateCamera = new TopDownCamera(this);
            this._cameraView = CAMERA_VIEW.TOP_DOWN;
        } else {
            this._stateCamera = new ThirdPersonCamera(this);
            this._cameraView = CAMERA_VIEW.THIRD_PERSON;
        }
    }

    public getAspectRatio(): number {
        return this.container.clientWidth / this.container.clientHeight;
    }

    private startRenderingLoop(): void {
        this.renderer = new WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

        this.lastDate = Date.now();
        this.container.appendChild(this.renderer.domElement);
        this.render();
    }

    private render(): void {
        requestAnimationFrame(() => this.render());
        this.update();
        this.renderer.render(this.scene, this._stateCamera.getCamera());
        this.stats.update();
    }

    public onResize(): void {
        this._stateCamera.onResize();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    private loadSkybox(): void {
        const sidesOfSkybox: MeshBasicMaterial[] = [];
        const imageDirectory: string = "../../../assets/skybox/";
        const imageName: string = "stormydays_";
        const imageSuffixes: string[] = ["ft", "bk", "up", "dn", "rt", "lf"];
        const imageType: string = ".png";
        let imageFilePath: string = "";

        for (const imageSuffix of imageSuffixes) {
            imageFilePath = `${imageDirectory}${imageName}${imageSuffix}${imageType}`;
            sidesOfSkybox.push( new MeshBasicMaterial ( {map: new TextureLoader().load( imageFilePath ), side: DoubleSide } ));
        }

        const skyboxGeometry: BoxGeometry = new BoxGeometry(SIZE_SKYBOX, SIZE_SKYBOX, SIZE_SKYBOX);
        const skyboxTexture: MultiMaterial = new MultiMaterial(sidesOfSkybox);
        const skybox: Mesh = new Mesh(skyboxGeometry, skyboxTexture);

        this.scene.add(skybox);
    }
}
