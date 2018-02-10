import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { PerspectiveCamera, WebGLRenderer, Scene } from "three";

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 0.1;
const FIELD_OF_VIEW: number = 75;

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

    @ViewChild("container")
    private container: ElementRef;

    public constructor() { }

    public render(): void {
        this._renderer.render(this._scene, this._camera);
    }

    public ngAfterViewInit(): void {
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.nativeElement.appendChild(this._renderer.domElement);
    }

}
