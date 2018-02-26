import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from "@angular/core";
import { OrthographicCamera, WebGLRenderer, Scene, Vector3 } from "three";
import { DotCommand } from "../DotCommand";

const FAR_CLIPPING_PLANE: number = 10000;
const NEAR_CLIPPING_PLANE: number = 1;
const CAMERA_DISTANCE: number = 50;
const ASPECT: number = window.innerWidth / window.innerHeight;

const LEFT_CLICK: number = 1;
const RIGHT_CLICK: number = 3;

@Component({
    selector: "app-track-creation",
    templateUrl: "./track-creation.component.html",
    styleUrls: ["./track-creation.component.css"]
})
export class TrackCreationComponent implements AfterViewInit {

    private _scene: THREE.Scene = new Scene();
    private _camera: THREE.OrthographicCamera;
    private _renderer: THREE.WebGLRenderer = new WebGLRenderer();
    private _dotCommand: DotCommand;

    @ViewChild("container")
    private container: ElementRef;

    public constructor() {}

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this._camera.left = CAMERA_DISTANCE * ASPECT / - 2;
        this._camera.right = CAMERA_DISTANCE * ASPECT / 2;
        this._camera.top = CAMERA_DISTANCE / 2;
        this._camera.bottom = CAMERA_DISTANCE / - 2;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
    }

    @HostListener("window:mousedown", ["$event"])
    public onKeyDown(event: MouseEvent): void {
        if (event.which === LEFT_CLICK) {
            this.placeDot(event);
        } else if (event.which === RIGHT_CLICK) {
            this.remove();
        }
    }

    @HostListener("window:mouseup", ["$event"])
    public onKeyUp(event: MouseEvent): void {
        if (event.which === LEFT_CLICK) {
            this._dotCommand.unselect();
        }
    }

    @HostListener("window:mousemove", ["$event"])
    public onKeyMove(event: MouseEvent): void {
        this.drag(event);
    }

    private drag(event: MouseEvent): void {
        this._dotCommand.dragDot(event);
        this.render();
    }

    private placeDot(event: MouseEvent): void {
        this._dotCommand.add(event);
        this.render();
    }

    private remove(): void {
        this._dotCommand.remove();
        this.render();
    }

    private render(): void {
        this._renderer.render(this._scene, this._camera);
    }

    public ngAfterViewInit(): void {

        this._camera = new OrthographicCamera(CAMERA_DISTANCE * ASPECT / - 2, CAMERA_DISTANCE * ASPECT / 2,
                                              CAMERA_DISTANCE / 2, CAMERA_DISTANCE / - 2, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);
        this._camera.position.set(0, CAMERA_DISTANCE , 0);
        this._camera.lookAt(new Vector3(0, 0, 0));

        this._renderer.setSize(window.innerWidth, window.innerHeight);

        this.container.nativeElement.appendChild(this._renderer.domElement);

        this._scene.add(this._camera);

        this._renderer.render(this._scene, this._camera);
        this._dotCommand = new DotCommand(this._scene, this._renderer, this._camera);
    }

    public getScene(): THREE.Scene {
        return this._scene;
    }

    public getDotCommand(): DotCommand {
        return this._dotCommand;
    }

}
