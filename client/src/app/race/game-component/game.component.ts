import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from "@angular/core";
import { RenderService } from "../render-service/render.service";
import InputManagerService, { Release } from "../input-manager/input-manager.service";
import { DotCommand } from "../DotCommand";
import { Vector3, Object3D } from "three";
import { CameraService } from "../camera-service/camera.service";
import { TrackInformation } from "../trackInformation";
import { TrackBuilder } from "../trackBuilder";

const SCALE_FACTOR: number = -10;

@Component({
    moduleId: module.id,
    selector: "app-game-component",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.css"],
    providers: [
        RenderService,
        InputManagerService,
        CameraService
    ]
})

export class GameComponent implements AfterViewInit {

    @ViewChild("container")
    private containerRef: ElementRef;
    private _raceStarted: boolean;
    private _trackLoaded: boolean;
    private _trackInformation: TrackInformation;
    private _dotCommand: DotCommand;

    public constructor(private renderService: RenderService, private inputManager: InputManagerService) {
        this._raceStarted = false;
        this._trackLoaded = false;
        this._trackInformation = new TrackInformation();
        this._trackInformation.getTracksList();
    }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.renderService.onResize();
    }

    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
        this.inputManager.handleKey(event, Release.Down);
    }

    @HostListener("window:keyup", ["$event"])
    public onKeyUp(event: KeyboardEvent): void {
        this.inputManager.handleKey(event, Release.Up);
    }

    public async ngAfterViewInit(): Promise<void> {
        await this.renderService
            .initialize(this.containerRef.nativeElement);

    }

    public start(): void {
        if (this._trackLoaded) {
            this.loadTrack();
            this.inputManager.init(this.renderService);
            this.renderService.start();

            const trackBuilder: TrackBuilder = new TrackBuilder(this.renderService.scene,
                                                                this._dotCommand.getVertices(),
                                                                this._dotCommand.getEdges());
            trackBuilder.buildTrack();

            this._raceStarted = true;
        }
    }

    private clearScene(): void {
        if (this._dotCommand !== undefined) {
            while (this._dotCommand.getVertices().length !== 0) {
                this._dotCommand.remove();
            }
        }
    }

    private shiftTrack(): void {
        this._dotCommand.addObjects(new Vector3(0, 0, 0));

        const firstVertex: Array<number> = this._trackInformation.track.vertice[0];
        let nextVertex: Array<number>;
        let vertexIndex: number = 1;
        while (vertexIndex !== this._trackInformation.track.vertice.length) {
            nextVertex = this._trackInformation.track.vertice[vertexIndex];
            this._dotCommand.addObjects(new Vector3((nextVertex[0] - firstVertex[0]) * SCALE_FACTOR,
                                                    (nextVertex[1] - firstVertex[1]) * SCALE_FACTOR,
                                                    (nextVertex[2] - firstVertex[2]) * SCALE_FACTOR));
            vertexIndex++;
        }
    }

    private loadTrack(): void {
        this.clearScene();

        this.shiftTrack();
        this._dotCommand.connectToFirst();
        this._dotCommand.complete();
    }

    private showTrack(): void {
        this.clearScene();

        this._dotCommand = new DotCommand(this.renderService.scene,
                                          this.renderService.renderer,
                                          this.renderService.camera);

        for (const vertex of this._trackInformation.track.vertice) {
            this._dotCommand.addObjects(new Vector3(vertex[0], vertex[1], vertex[2]));
        }
        this._dotCommand.connectToFirst();
        this._dotCommand.complete();
        this._trackLoaded = true;
    }

    public async getTrackInfo(trackName: String): Promise<void> {
        await this._trackInformation.getTrackInfo(trackName);
        this.showTrack();
    }

}
