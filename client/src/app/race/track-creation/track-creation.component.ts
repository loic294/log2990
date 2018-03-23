import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from "@angular/core";
import { OrthographicCamera, WebGLRenderer, Scene, Vector3, Color } from "three";
import { DotCommand } from "../DotCommand";
import { TrackInformation } from "../trackInformation";

const FAR_CLIPPING_PLANE: number = 10000;
const NEAR_CLIPPING_PLANE: number = 1;
const CAMERA_DISTANCE: number = 50;
const ASPECT: number = window.innerWidth / window.innerHeight;
const CANVAS_ASPECT: number = window.innerHeight / window.innerWidth;
const COLOR_LINE_ERROR: number = 0xEF1F1F;

const LEFT_CLICK: number = 1;
const RIGHT_CLICK: number = 3;

@Component({
    selector: "app-track-creation",
    templateUrl: "./track-creation.component.html",
    styleUrls: ["./track-creation.component.css"]
})
export class TrackCreationComponent implements AfterViewInit {

    private _scene: THREE.Scene;
    private _camera: THREE.OrthographicCamera;
    private _renderer: THREE.WebGLRenderer;
    private _dotCommand: DotCommand;
    private _trackInformation: TrackInformation;
    private _isSaved: boolean;

    @ViewChild("container")
    private container: ElementRef;

    public constructor() {
        this._scene = new Scene();
        this._renderer = new WebGLRenderer();
        this._isSaved = false;
        this._trackInformation = new TrackInformation();
        this._trackInformation.getTracksList();
        this._trackInformation.resetTrack();
    }

    public startNewTrack(): void {
        while (this._dotCommand.getVertices().length !== 0) {
            this._dotCommand.remove();
        }
        this._trackInformation.resetTrack();
        this._isSaved = false;
    }

    public async deleteTrack(): Promise<void> {
        await this._trackInformation.deleteTrack();
        this.startNewTrack();
    }

    private separateVertice(): void {
        const trackVertices: Array<Array<number>> = new Array();
        for (const vertex of this._dotCommand.getVertices()) {
            trackVertices.push(new Array<number>(vertex.position.x, vertex.position.y, vertex.position.z));
        }
        this._trackInformation.track.vertice = trackVertices;
    }

    private loadTrack(): void {
        for (const vertex of this._trackInformation.track.vertice) {
                this._dotCommand.addObjects(new Vector3(vertex[0], vertex[1], vertex[2]));
            }
        this._dotCommand.connectToFirst();
        this._dotCommand.complete();
    }

    public async getTrackInfo(trackName: String): Promise<void> {
        this.startNewTrack();
        await this._trackInformation.getTrackInfo(trackName);
        this.loadTrack();
    }

    private async sendToDb(): Promise<void> {
        let isNewTrack: boolean = true;

        for (const name of this._trackInformation.tracks) {
            if (name === this._trackInformation.track.name) {
                isNewTrack = false;
                break;
            }
        }

        if (isNewTrack) {
            await this._trackInformation.putTrack();
        } else {
            await this._trackInformation.patchTrack();
        }
    }

    public save(): void {
        let trackIsValid: boolean = true;
        const errorColor: Color = new Color(COLOR_LINE_ERROR);

        for (const i of this._dotCommand.getEdges()) {
            if (i.material.color.r === errorColor.r) {
                trackIsValid = false;
            }
        }

        this._isSaved = (trackIsValid && this._dotCommand.getTrackIsCompleted());

        if (this._isSaved && this._trackInformation.track.name !== "") {
            this.separateVertice();
            this.sendToDb();
        }
    }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this._camera.left = CAMERA_DISTANCE * ASPECT / - 2;
        this._camera.right = CAMERA_DISTANCE * ASPECT / 2;
        this._camera.top = CAMERA_DISTANCE / 2;
        this._camera.bottom = CAMERA_DISTANCE / - 2;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(this.getWindowSize()[0], this.getWindowSize()[1]);
    }

    public onKeyDown(event: MouseEvent): void {
        if (!this._isSaved) {
            if (event.which === LEFT_CLICK) {
                this.placeDot(event);
            } else if (event.which === RIGHT_CLICK) {
                this.remove();
            }
        }
    }

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
        this._camera.position.set(0, CAMERA_DISTANCE, 0);
        this._camera.lookAt(new Vector3(0, 0, 0));

        this._renderer.setSize(this.getWindowSize()[0], this.getWindowSize()[1]);

        this.container.nativeElement.appendChild(this._renderer.domElement);

        this._scene.add(this._camera);

        this._renderer.render(this._scene, this._camera);
        this._dotCommand = new DotCommand(this._scene, this._renderer, this._camera);

    }

    private getWindowSize(): Array<number> {
        const design: number = 360;
        const canvasWidth: number = window.innerWidth - design;

        return [canvasWidth, canvasWidth * CANVAS_ASPECT];
    }

    public getScene(): THREE.Scene {
        return this._scene;
    }

    public getDotCommand(): DotCommand {
        return this._dotCommand;
    }

    public isSaved(): boolean {
        return this._isSaved;
    }

}
