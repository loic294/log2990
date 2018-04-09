import { Injectable } from "@angular/core";
import { AmbientLight, MeshBasicMaterial, TextureLoader, DoubleSide, BoxGeometry, MultiMaterial, Mesh, Scene } from "three";

const WHITE: number = 0xFFFFFF;
const DAY_LIGHT_OPACITY: number = 1;
const NIGHT_LIGHT_OPACITY: number = 0.2;
const SIZE_SKYBOX: number = 10000;
const DAY_PATH: string = "day/";
const NIGHT_PATH: string = "night/";

@Injectable()
export class EnvironmentService {

    private _light: AmbientLight;
    private _daySkybox: Mesh;
    private _nightSkybox: Mesh;
    private _isNight: boolean;
    private _scene: Scene;

    public initialize(scene: Scene): void {
        this._scene = scene;
        this._isNight = false;
        this._light = new AmbientLight(WHITE, DAY_LIGHT_OPACITY);

        this._daySkybox = this.loadSkybox(DAY_PATH);
        this._nightSkybox = this.loadSkybox(NIGHT_PATH);

        this._scene.add(this._light);
        this._scene.add(this._daySkybox);
    }

    private loadSkybox(skyboxPath: string): Mesh {
        const sidesOfSkybox: MeshBasicMaterial[] = [];
        const imageDirectory: string = "../../../assets/skybox/";
        const imageSuffixes: string[] = ["ft", "bk", "up", "dn", "rt", "lf"];
        const imageType: string = ".png";
        let imageFilePath: string = "";

        for (const imageSuffix of imageSuffixes) {
            imageFilePath = `${imageDirectory}${skyboxPath}${imageSuffix}${imageType}`;
            sidesOfSkybox.push(new MeshBasicMaterial({ map: new TextureLoader().load(imageFilePath), side: DoubleSide }));
        }

        const skyboxGeometry: BoxGeometry = new BoxGeometry(SIZE_SKYBOX, SIZE_SKYBOX, SIZE_SKYBOX);
        const skyboxTexture: MultiMaterial = new MultiMaterial(sidesOfSkybox);

        return new Mesh(skyboxGeometry, skyboxTexture);
    }

    public changeMode(): void {
        if (this._isNight) {
            this._scene.remove(this._nightSkybox);
            this._isNight = false;
            this._light.intensity = DAY_LIGHT_OPACITY;
            this._scene.add(this._daySkybox);
        } else {
            this._scene.remove(this._daySkybox);
            this._isNight = true;
            this._light.intensity = NIGHT_LIGHT_OPACITY;
            this._scene.add(this._nightSkybox);
        }
    }

    public get isNight(): boolean {
        return this._isNight;
    }
}
