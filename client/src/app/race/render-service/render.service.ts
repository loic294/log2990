import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import { PerspectiveCamera, WebGLRenderer, Scene, AmbientLight,
MeshBasicMaterial, TextureLoader, MultiMaterial, Mesh, DoubleSide, BoxGeometry } from "three";
import { Car } from "../car/car";

const FAR_CLIPPING_PLANE: number = 100000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;

const INITIAL_CAMERA_POSITION_Y: number = 25;
const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 1;

const SIZE_SKYBOX: number = 10000;

@Injectable()
export class RenderService {
    private _camera: PerspectiveCamera;
    private _container: HTMLDivElement;
    private _car: Car;
    private _renderer: WebGLRenderer;
    private _scene: THREE.Scene;
    private _stats: Stats;
    private _lastDate: number;

    public get car(): Car {
        return this._car;
    }

    public constructor() {
        this._car = new Car();
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
        this._camera.position.x = this._car.meshPosition.x;
        this._camera.position.z = this._car.meshPosition.z;
        this._car.update(timeSinceLastFrame);
        this._lastDate = Date.now();
    }

    private async createScene(): Promise<void> {
        this._scene = new Scene();

        this._camera = new PerspectiveCamera(
            FIELD_OF_VIEW,
            this.getAspectRatio(),
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );

        await this._car.init();
        this._camera.position.set(0, INITIAL_CAMERA_POSITION_Y, 0);
        this._camera.lookAt(this._car.position);
        this._scene.add(this._car);
        this._scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
        this.loadSkybox();
    }

    private getAspectRatio(): number {
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
        this._renderer.render(this._scene, this._camera);
        this._stats.update();
    }

    public onResize(): void {
        this._camera.aspect = this.getAspectRatio();
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(this._container.clientWidth, this._container.clientHeight);
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

        this._scene.add(skybox);
    }

    public get renderer(): WebGLRenderer {
        return this._renderer;
    }

    public get camera(): THREE.Camera {
        return this._camera;
    }

    public get scene(): THREE.Scene {
        return this._scene;
    }
}
