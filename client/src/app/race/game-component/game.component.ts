import { AfterViewInit, Component, ElementRef, ViewChild, HostListener, OnInit } from "@angular/core";
import { RenderService } from "../render-service/render.service";
import InputManagerService, { Release } from "../input-manager/input-manager.service";
import { ITrack } from "../../../../../server/app/models/trackInfo";
import { CommunicationService } from "../communicationService";
import { DotCommand } from "../DotCommand";
import { Vector3 } from "three";
import { CameraService } from "../camera-service/camera.service";

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

export class GameComponent implements AfterViewInit, OnInit {

    @ViewChild("container")
    private containerRef: ElementRef;
    private _raceStarted: boolean;
    private _trackLoaded: boolean;

    public constructor(private renderService: RenderService, private inputManager: InputManagerService,
                       public _trackCommunication: CommunicationService) {
                           this._raceStarted = false;
                           this._trackLoaded = false;
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

    public ngOnInit(): void {
        this._trackCommunication.track.subscribe((_track) => {
            this.loadTrack(_track);
        });
    }

    public start(): void {
        if (this._trackLoaded) {
            this.inputManager.init(this.renderService);
            this.renderService.start();
            this._raceStarted = true;
        }
    }

    public loadTrack(track: ITrack): void {
        const dotCommand: DotCommand = new DotCommand(this.renderService.scene,
                                                      this.renderService.renderer,
                                                      this.renderService.camera);
        if (track !== undefined) {
            while (dotCommand.getVertices().length !== 0) {
                dotCommand.remove();
            }
            for (const vertex of track.vertice) {
                dotCommand.addObjects(new Vector3(vertex[0], vertex[1], vertex[2]));
            }
            dotCommand.connectToFirst();
            dotCommand.complete();
            this._trackLoaded = true;
        }
    }

}
