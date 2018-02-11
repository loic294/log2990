import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from "@angular/core";
import { Vector3, PerspectiveCamera,
     WebGLRenderer, Scene, PointsMaterial, Points, Geometry, /* BufferGeometry, MeshBasicMaterial, BoxGeometry*/ } from "three";

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

    @ViewChild("container")
    private container: ElementRef;

    public constructor() { }

    @HostListener("window:click", ["$event"])
    public onKeyUp(event: MouseEvent): void {
        this.placeDot(event);
    }

    private placeDot(event: MouseEvent): void {
        const x: Element = document.getElementById("x");
        const y: Element = document.getElementById("y");
        const width: Element = document.getElementById("width");
        const height: Element = document.getElementById("height");
        x.innerHTML = event.clientX.toString();
        y.innerHTML = event.clientY.toString();
        width.innerHTML = window.innerWidth.toString();
        height.innerHTML = window.innerHeight.toString();
        this.drawDot(event.clientX, event.clientY);
    }

    private drawDot(x: number, y: number): void {

        const dotGeo: THREE.Geometry = new Geometry();
        const coordonates: Array<number> = this.findCoordonates(x, y);
        dotGeo.vertices.push(new Vector3(coordonates[0], coordonates[1], 0));
        const dotMat: THREE.PointsMaterial = new PointsMaterial({color: 0xFFFFFF, size: 1});
        const dot: THREE.Points = new Points(dotGeo, dotMat);
        this._scene.add(dot);
        dot.position.setX(0);
        dot.position.setY(0);

        this.render();
    }

    private findCoordonates(x: number, y: number): Array<number> {
        const coordonates: Array<number> = new Array();

        (x > window.innerWidth / 2) ? coordonates.push((x / window.innerWidth) * 100) : coordonates.push((x / window.innerWidth) * -100);
        (y > window.innerHeight / 2) ? coordonates.push((y / window.innerHeight) * 100) : coordonates.push((y / window.innerHeight) * -100);

        return coordonates;
    }

    private render(): void {
        this._renderer.render(this._scene, this._camera);
    }

    public ngAfterViewInit(): void {
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.nativeElement.appendChild(this._renderer.domElement);
        this._camera.position.set(0, 0, 50);
        this._scene.add(this._camera);
    }

}
