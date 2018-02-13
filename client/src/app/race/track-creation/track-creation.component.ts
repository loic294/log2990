import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from "@angular/core";
import { PerspectiveCamera, WebGLRenderer, Scene } from "three";
import { PlaceCommand } from "../PlaceCommands/PlaceCommand";
import { PlaceDotCommand } from "../PlaceCommands/PlaceDotCommand";

const FAR_CLIPPING_PLANE: number = 10000;
const NEAR_CLIPPING_PLANE: number = 0.1;
const FIELD_OF_VIEW: number = 75;
const CAMERA_DISTANCE: number = 100;

const LEFT_CLICK: number = 1;
const RIGHT_CLICK: number = 3;

@Component({
    selector: "app-track-creation",
    templateUrl: "./track-creation.component.html",
    styleUrls: ["./track-creation.component.css"]
})
export class TrackCreationComponent implements AfterViewInit {

    private _scene: THREE.Scene = new Scene();
    private _camera: THREE.PerspectiveCamera = new PerspectiveCamera(
        FIELD_OF_VIEW, window.innerWidth / window.innerHeight,
        NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);
    private _renderer: THREE.WebGLRenderer = new WebGLRenderer();
    private _dotCommand: PlaceCommand = new PlaceDotCommand(CAMERA_DISTANCE);

    @ViewChild("container")
    private container: ElementRef;

    public constructor() { }

    @HostListener("window:click", ["$event"])
    public onKeyUp(event: MouseEvent): void {
        if (event.which === LEFT_CLICK) {
            this.placeDot(event);
        } else if (event.which === RIGHT_CLICK) {
            this.undo();
        }
    }

    private placeDot(event: MouseEvent): void {

        this._dotCommand.place(this._scene, event);

        this.render();
    }

    private undo(): void {
        this._dotCommand.undo(this._scene);

        this.render();
    }

    private render(): void {
        this._renderer.render(this._scene, this._camera);
    }

    public ngAfterViewInit(): void {
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.nativeElement.appendChild(this._renderer.domElement);
        this._camera.position.set(0, 0, CAMERA_DISTANCE);
        this._scene.add(this._camera);
    }

}
