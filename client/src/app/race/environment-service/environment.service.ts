import { Injectable } from "@angular/core";
import { AmbientLight, MeshBasicMaterial, TextureLoader, DoubleSide, BoxGeometry, MultiMaterial, Mesh, Scene } from "three";
import { DAY, NIGHT } from "../../constants";

const WHITE: number = 0xFFFFFF;
const DAY_LIGHT_OPACITY: number = 1;
const NIGHT_LIGHT_OPACITY: number = 0.2;
const SIZE_SKYBOX: number = 10000;

@Injectable()
export class EnvironmentService {

    private _light: AmbientLight;
    private _skybox: Mesh;
    private _mode: string;
    private _scene: Scene;

    public initialize(scene: Scene): void {
        this._scene = scene;
        this._mode = DAY;
        this._light = new AmbientLight(WHITE, DAY_LIGHT_OPACITY);
        this.loadSkybox();
        this._scene.add(this._light);
        this._scene.add(this._skybox);
    }

    private loadSkybox(): void {
        const sidesOfSkybox: MeshBasicMaterial[] = [];
        const imageDirectory: string = "../../../assets/skybox/";
        const imageSuffixes: string[] = ["ft", "bk", "up", "dn", "rt", "lf"];
        const imageType: string = ".png";
        let imageFilePath: string = "";

        for (const imageSuffix of imageSuffixes) {
            imageFilePath = `${imageDirectory}${this._mode}${imageSuffix}${imageType}`;
            sidesOfSkybox.push(new MeshBasicMaterial({ map: new TextureLoader().load(imageFilePath), side: DoubleSide }));
        }

        const skyboxGeometry: BoxGeometry = new BoxGeometry(SIZE_SKYBOX, SIZE_SKYBOX, SIZE_SKYBOX);
        const skyboxTexture: MultiMaterial = new MultiMaterial(sidesOfSkybox);
        this._skybox = new Mesh(skyboxGeometry, skyboxTexture);
    }

    public changeMode(): void {
        this._scene.remove(this._light);
        this._scene.remove(this._skybox);
        if (this._mode === DAY) {
            this._mode = NIGHT;
            this._light = new AmbientLight(WHITE, NIGHT_LIGHT_OPACITY);
        } else {
            this._mode = DAY;
            this._light = new AmbientLight(WHITE, DAY_LIGHT_OPACITY);
        }
        this.loadSkybox();
        this._scene.add(this._light);
        this._scene.add(this._skybox);
    }

    public get mode(): string {
        return this._mode;
    }
}
