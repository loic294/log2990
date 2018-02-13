import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from "@angular/core";
import { Vector3, PerspectiveCamera,
     WebGLRenderer, Scene, PointsMaterial, Points, Geometry, LineBasicMaterial, Line } from "three";

const FAR_CLIPPING_PLANE: number = 10000;
const NEAR_CLIPPING_PLANE: number = 0.1;
const FIELD_OF_VIEW: number = 75;
const CAMERA_DISTANCE: number = 100;
const TWO: number = 2;

const magicNumberX: number = 1288.194; // a changer
const magicNumberY: number = 1292.105; // a changer

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
    private _dotMemory: Array<Vector3> = new Array();

    @ViewChild("container")
    private container: ElementRef;

    public constructor() { }

    @HostListener("window:click", ["$event"])
    public onKeyUp(event: MouseEvent): void {
        this.placeDot(event);
    }

    private placeDot(event: MouseEvent): void {
        // infos pour debugger
        const x: Element = document.getElementById("x");
        const ox: Element = document.getElementById("ox");
        const y: Element = document.getElementById("y");
        const oy: Element = document.getElementById("oy");
        const width: Element = document.getElementById("width");
        const height: Element = document.getElementById("height");
        x.innerHTML = event.clientX.toString();
        ox.innerHTML = event.offsetX.toString();
        y.innerHTML = event.clientY.toString();
        oy.innerHTML = event.offsetY.toString();
        width.innerHTML = window.innerWidth.toString();
        height.innerHTML = window.innerHeight.toString();
        // fin infos pour debugger

        const dotGeo: THREE.Geometry = new Geometry();
        this.findCoordinates(event.offsetX, event.offsetY);
        dotGeo.vertices.push(new Vector3(this._dotMemory[this._dotMemory.length - 1].x,
                                         this._dotMemory[this._dotMemory.length - 1].y,
                                         this._dotMemory[this._dotMemory.length - 1].z));
        const dotMat: THREE.PointsMaterial = new PointsMaterial({color: 0xFFFFFF, size: 1});
        const dot: THREE.Points = new Points(dotGeo, dotMat);
        this._scene.add(dot);

        this.updateLines();

        this.render();
    }

    /*
    A changer coordonner pas bonnes -- formule douteuse
    */
    private findCoordinates(offsetX: number, offsetY: number): void {

        const tempX: number = offsetX - (window.innerWidth / TWO);
        const tempY: number = offsetY - (window.innerHeight / TWO);

        this._dotMemory.push( new Vector3((tempX * TWO) / (magicNumberX / this._camera.position.z),
                                          -(tempY * TWO) / (magicNumberY / this._camera.position.z),
                                          0));
    }

    private updateLines(): void {
        if (this._dotMemory.length > 1) {
            const lineMat: THREE.LineBasicMaterial = new LineBasicMaterial({color: 0xFFFFFF});
            const lineGeo: THREE.Geometry = new Geometry();
            lineGeo.vertices.push(this._dotMemory[this._dotMemory.length - 1]);
            lineGeo.vertices.push(this._dotMemory[this._dotMemory.length - TWO]);
            const line: THREE.Line = new Line(lineGeo, lineMat);
            this._scene.add(line);
        }
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
