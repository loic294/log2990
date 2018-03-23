import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import { WebGLRenderer, Scene, AmbientLight,
MeshBasicMaterial, TextureLoader, MultiMaterial, Mesh, DoubleSide, BoxGeometry, PlaneGeometry, Texture } from "three";
import { Car } from "../car/car";
import { PI_OVER_2 } from "../../constants";
import { CameraService } from "../camera-service/camera.service";

const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 1;

const SIZE_SKYBOX: number = 10000;

@Injectable()
export class RenderService {

    private _container: HTMLDivElement;
    private _car: Car;
    private _renderer: WebGLRenderer;
    private _scene: THREE.Scene;
    private _stats: Stats;
    private _lastDate: number;

    public constructor(private _cameraService: CameraService) {
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
        this._car.update(timeSinceLastFrame);
        this._cameraService.follow();
        this._lastDate = Date.now();
    }

    private async createScene(): Promise<void> {
        this._scene = new Scene();

        await this._car.init();
        this.scene.add(this._car);
        this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));

        this._cameraService.initialize( this._car, this.getAspectRatio());
        this._cameraService.changeCamera();
    }

    public start(): void {

        this._cameraService.changeCamera();
        const texture: Texture = new TextureLoader().load( "../../../assets/track/track.jpg" );
        // tslint:disable-next-line:no-magic-numbers (temporary plane)
        const geometry: PlaneGeometry = new PlaneGeometry( 100, 100, 32 );
        const material: MeshBasicMaterial = new MeshBasicMaterial( {map: texture , side: DoubleSide} );
        const temporaryPlane: Mesh = new Mesh( geometry, material );

        temporaryPlane.rotateX(PI_OVER_2);
        this.scene.add(temporaryPlane);
        this.loadSkybox();
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
    }

    public onResize(): void {
        this._cameraService.onResize(this.getAspectRatio());
        this.renderer.setSize(this._container.clientWidth, this._container.clientHeight);
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
}
