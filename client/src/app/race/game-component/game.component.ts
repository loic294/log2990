import { AfterViewInit, Component, ElementRef, ViewChild, HostListener, OnInit } from "@angular/core";
import { RenderService } from "../render-service/render.service";
import InputManagerService, { Release } from "../input-manager/input-manager.service";
import { TrackCreationRenderer } from "../trackCreationRenderer";
import { Vector3 } from "three";
import { CameraService } from "../camera-service/camera.service";
import { TrackInformation } from "../trackInformation";
import { TrackBuilder } from "../trackBuilder";
import { EnvironmentService } from "../environment-service/environment.service";
import { IGameInformation, TrackProgressionService } from "../trackProgressionService";
import { AudioService } from "../audio-service/audio.service";
import { ResultsService } from "../results-service/results.service";

const SCALE_FACTOR: number = -10;

@Component({
    moduleId: module.id,
    selector: "app-game-component",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.css"],
    providers: [
        RenderService,
        InputManagerService,
        CameraService,
        AudioService,
        EnvironmentService

    ]
})

export class GameComponent implements AfterViewInit, OnInit {

    @ViewChild("container")
    private containerRef: ElementRef;
    private _raceStarted: boolean;
    private _trackLoaded: boolean;
    private _trackInformation: TrackInformation;
    private _trackCreationRenderer: TrackCreationRenderer;
    public _currentGame: IGameInformation;

    public constructor(private renderService: RenderService, private inputManager: InputManagerService,
                       private _trackProgressionService: TrackProgressionService,
                       private resultsService: ResultsService) {
        this._raceStarted = false;
        this._trackLoaded = false;
        this._trackInformation = new TrackInformation();
        this._trackInformation.getTracksList();

        this._currentGame = {gameTime: "0.00", lapTime: "0.00",
                             lapTimes: new Array(), gameIsFinished: true, currentLap: 0, botTimes: new Array()};
    }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.renderService.onResize();
    }

    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
        if (!this._currentGame.gameIsFinished) {
            this.inputManager.handleKey(event, Release.Down);
        }
    }

    @HostListener("window:keyup", ["$event"])
    public onKeyUp(event: KeyboardEvent): void {
        if (!this._currentGame.gameIsFinished) {
            this.inputManager.handleKey(event, Release.Up);
        }
    }

    public async ngAfterViewInit(): Promise<void> {
        await this.renderService
            .initialize(this.containerRef.nativeElement);

    }

    public ngOnInit(): void {
        this._trackProgressionService.game
            .subscribe((_game) => this.actOnProgress(_game));
    }

    public async start(): Promise<void> {
        if (this._trackLoaded) {
            this._trackInformation.track.timesPlayed++;
            await this._trackInformation.patchTrack();

            this.loadTrack();
            this.inputManager.init(this.renderService);

            const trackBuilder: TrackBuilder = new TrackBuilder(this.renderService.scene,
                                                                this._trackCreationRenderer.getVertices(),
                                                                this._trackCreationRenderer.getEdges(),
                                                                this.renderService.car,
                                                                this.renderService.bots);
            trackBuilder.buildTrack();

            this._raceStarted = true;

            this.renderService.start(trackBuilder, this._trackProgressionService);

        }
    }

    private clearScene(): void {
        if (this._trackCreationRenderer !== undefined) {
            while (this._trackCreationRenderer.getVertices().length !== 0) {
                this._trackCreationRenderer.remove();
            }
        }
    }

    private shiftTrack(): void {
        this._trackCreationRenderer.addObjects(new Vector3(0, 0, 0));

        const firstVertex: Array<number> = this._trackInformation.track.vertice[0];
        let nextVertex: Array<number>;
        let vertexIndex: number = 1;
        while (vertexIndex !== this._trackInformation.track.vertice.length) {
            nextVertex = this._trackInformation.track.vertice[vertexIndex];
            this._trackCreationRenderer.addObjects(new Vector3((nextVertex[0] - firstVertex[0]) * SCALE_FACTOR,
                                                               (nextVertex[1] - firstVertex[1]) * SCALE_FACTOR,
                                                               (nextVertex[2] - firstVertex[2]) * SCALE_FACTOR));
            vertexIndex++;
        }
    }

    public loadTrack(): void {
        this.clearScene();

        this.shiftTrack();
        this._trackCreationRenderer.connectToFirst();
        this._trackCreationRenderer.complete();
    }

    public showTrack(): void {
        this.clearScene();

        this._trackCreationRenderer = new TrackCreationRenderer(this.renderService.scene,
                                                                this.renderService.renderer,
                                                                this.renderService.camera);

        for (const vertex of this._trackInformation.track.vertice) {
            this._trackCreationRenderer.addObjects(new Vector3(vertex[0], vertex[1], vertex[2]));
        }
        this._trackCreationRenderer.connectToFirst();
        this._trackCreationRenderer.complete();
        this._trackLoaded = true;
    }

    private actOnProgress(game: IGameInformation): void {
        this._currentGame = game;
        if (game.gameIsFinished && this._raceStarted) {
            this._raceStarted = false;
            this._trackLoaded = false;
            this.saveTime().catch();
            this.resultsService.selectTrackInformation(this._trackInformation);
            this.resultsService.selectGame(game);
            this.resultsService.selectTrackTimes(this._trackInformation.track.completedTimes);
        }
    }

    private async saveTime(): Promise<void> {
        this._trackInformation.track.completedTimes.push(
            {player: "", gameTime: this._currentGame.gameTime, lapTimes: this._currentGame.lapTimes});
        await this._trackInformation.patchTrack();
    }

    public async getTrackInfo(trackName: String): Promise<void> {
        await this._trackInformation.getTrackInfo(trackName);
        this.showTrack();
    }

    public get trackInformation(): TrackInformation {
        return this._trackInformation;
    }

    public get service(): RenderService {
        return this.renderService;
    }

    public get trackLoaded(): boolean {
        return this._trackLoaded;
    }

    public get raceStarted(): boolean {
        return this._raceStarted;
    }

}
