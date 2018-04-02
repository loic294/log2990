import { Injectable } from "@angular/core";
import { AmbientLight, Light, MeshBasicMaterial, TextureLoader, DoubleSide, BoxGeometry, MultiMaterial, Mesh } from "three";

const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.2;
const SIZE_SKYBOX: number = 10000;

@Injectable()
export class EnvironmentService {

    private _light: AmbientLight;
    private _skybox: Mesh;

    public initialize(): void {
        this._light = new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY);
        this.loadSkybox();
    }

    private loadSkybox(): void {
        // const sidesOfSkybox: MeshBasicMaterial[] = [];
        // const imageDirectory: string = "../../../assets/skybox/";
        // const imageName: string = "stormydays_";
        // const imageSuffixes: string[] = ["ft", "bk", "up", "dn", "rt", "lf"];
        // const imageType: string = ".png";
        // let imageFilePath: string = "";
        const sidesOfSkybox: MeshBasicMaterial[] = [];
        const imageDirectory: string = "../../../assets/skybox/";
        const imageName: string = "night/";
        const imageSuffixes: string[] = ["ft", "bk", "up", "dn", "rt", "lf"];
        const imageType: string = ".png";
        let imageFilePath: string = "";

        for (const imageSuffix of imageSuffixes) {
            imageFilePath = `${imageDirectory}${imageName}${imageSuffix}${imageType}`;
            sidesOfSkybox.push(new MeshBasicMaterial({ map: new TextureLoader().load(imageFilePath), side: DoubleSide }));
        }

        const skyboxGeometry: BoxGeometry = new BoxGeometry(SIZE_SKYBOX, SIZE_SKYBOX, SIZE_SKYBOX);
        const skyboxTexture: MultiMaterial = new MultiMaterial(sidesOfSkybox);
        this._skybox = new Mesh(skyboxGeometry, skyboxTexture);
    }

    public get light(): Light {
        return this._light;
    }

    public get skybox(): Mesh {
        return this._skybox;
    }
}
