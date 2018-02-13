import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from "@angular/core";
import { Vector3, PerspectiveCamera,
     WebGLRenderer, Scene, PointsMaterial, Points, Geometry, LineBasicMaterial, Line } from "three";

const FAR_CLIPPING_PLANE: number = 10000;
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

        this.drawDot(event.clientX, event.clientY, event.offsetX, event.offsetY);
    }

    private drawDot(x: number, y: number, ox: number, oy: number): void {

        const dotGeo: THREE.Geometry = new Geometry();
        const coordinates: Array<number> = this.findCoordonates(x, y, ox, oy);
        dotGeo.vertices.push(new Vector3(coordinates[0], coordinates[1], 0));
        const dotMat: THREE.PointsMaterial = new PointsMaterial({color: 0xFFFFFF, size: 1});
        const dot: THREE.Points = new Points(dotGeo, dotMat);
        this._scene.add(dot);

        this.updateLines();

        this.render();
    }


    /*
    A changer coordonner pas bonnes -- formule douteuse
    */
    private findCoordonates(x: number, y: number, ox: number, oy: number): Array<number> {
        const coordinates: Array<number> = new Array();

        const tempX: number = ox - (window.innerWidth / 2);
        const tempY: number = oy - (window.innerHeight / 2);

        coordinates.push( (tempX * 2) / (1288.194 / this._camera.position.z));
        coordinates.push(-(tempY * 2) / (1292.105 / this._camera.position.z));

        this._dotMemory.push(new Vector3((tempX * 2) / (1288.194 / this._camera.position.z),-(tempY * 2) / (1292.105 / this._camera.position.z),0));

        return coordinates;

    }

    private updateLines(): void {
        if (this._dotMemory.length > 1) {
            const lineMat: THREE.LineBasicMaterial = new LineBasicMaterial({color: 0xFFFFFF});
            const lineGeo: THREE.Geometry = new Geometry();
            lineGeo.vertices.push(this._dotMemory[this._dotMemory.length-1]);
            lineGeo.vertices.push(this._dotMemory[this._dotMemory.length-2]);
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
        this._camera.position.set(0, 0, 100);
        this._scene.add(this._camera);
    }

}
