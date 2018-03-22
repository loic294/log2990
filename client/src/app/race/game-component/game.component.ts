import { AfterViewInit, Component, ElementRef, ViewChild, HostListener, OnInit } from "@angular/core";
import { RenderService } from "../render-service/render.service";
import { Car } from "../car/car";
import InputManagerService, { Release } from "../input-manager/input-manager.service";
import { ITrack } from "../../../../../server/app/models/trackInfo";
import { CommunicationService } from "../communicationService";
import { DotCommand } from "../DotCommand";
import { Vector3 } from "three";

@Component({
    moduleId: module.id,
    selector: "app-game-component",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.css"],
    providers: [
        RenderService,
        InputManagerService
    ]
})

export class GameComponent implements AfterViewInit, OnInit {

    @ViewChild("container")
    private containerRef: ElementRef;
    private _dotCommand: DotCommand;

    public constructor(private renderService: RenderService, private inputManager: InputManagerService,
                       public _trackCommunication: CommunicationService) { }

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

    public ngAfterViewInit(): void {
        this.renderService
            .initialize(this.containerRef.nativeElement)
            .then(/* do nothing */)
            .catch((err) => console.error(err));
        this.inputManager.init(this.car);
        this._dotCommand = new DotCommand(this.renderService.scene, this.renderService.renderer, this.renderService.camera);
    }

    public ngOnInit(): void {
        this._trackCommunication.track.subscribe((_track) => {
            this.loadTrack(_track);
        });
    }

    public get car(): Car {
        return this.renderService.car;
    }

    public loadTrack(track: ITrack): void {
        if (track !== undefined) {
            while (this._dotCommand.getVertices().length !== 0) {
                this._dotCommand.remove();
            }
            for (const vertex of track.vertice) {
                this._dotCommand.addObjects(new Vector3(vertex[0], vertex[1], vertex[2]));
            }
            this._dotCommand.connectToFirst();
            this._dotCommand.complete();
        }
    }

}
