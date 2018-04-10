import { Scene, Clock, Mesh, FontLoader, TextGeometry, MeshBasicMaterial } from "three";
import { TrackBuilder } from "./trackBuilder";
import { TrackProgressionService } from "./trackProgressionService";

const MAX_COUNTDOWN: number = 3;

export class RaceStarter {
    private _countdownClock: Clock;
    private _visual: Mesh;

    public constructor(private _scene: Scene, private _trackBuilder: TrackBuilder,
                       private _trackProgressionService: TrackProgressionService) {
        this._countdownClock = new Clock();
        this._countdownClock.start();
    }

    public getCountdown(): number {
        this.showCountdown();

        return this._countdownClock.getElapsedTime();
    }

    private showCountdown(): void {
        if (this._countdownClock.getElapsedTime() < 1) {
            this.loadVisual("3");
        } else if (this._countdownClock.getElapsedTime() < 2) {
            this.loadVisual("2");
        } else if (this._countdownClock.getElapsedTime() < MAX_COUNTDOWN) {
            this.loadVisual("1");
        } else {
            this.removeVisual();
        }
    }

    private loadVisual(visual: string): void {
        this.removeVisual();

        let textGeo: TextGeometry;
        const fontLoader: FontLoader = new FontLoader();
        fontLoader.load("fonts/helvetiker_bold.typeface.json", (font) => {
            textGeo = new TextGeometry(visual, {

                font: font,
                size: 200,
                height: 50,
                curveSegments: 12,
                bevelThickness: 2,
                bevelSize: 5,
                bevelEnabled: true
            });
        });
        const textMaterial: MeshBasicMaterial = new MeshBasicMaterial({ color: 0x000000 });
        this._visual = new Mesh(textGeo, textMaterial);

        this._visual.position.set(this._trackBuilder.startingLines[0].position.x,
                                  this._trackBuilder.startingLines[0].position.y,
                                  this._trackBuilder.startingLines[0].position.z);

        this._scene.add(this._visual);
    }

    private removeVisual(): void {
        if (this._visual !== undefined) {
            this._scene.remove(this._visual);
        }
    }

    public get trackBuilder(): TrackBuilder {
        return this._trackBuilder;
    }

    public get trackProgressionService(): TrackProgressionService {
        return this._trackProgressionService;
    }

}
