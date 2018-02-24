import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from "@angular/core";
import { OrthographicCamera, WebGLRenderer, Scene, /* GridHelper, AxisHelper, */ Vector3 } from "three";
import { DotCommand } from "../DotCommand";

const FAR_CLIPPING_PLANE: number = 10000;
const NEAR_CLIPPING_PLANE: number = 0;
const CAMERA_DISTANCE: number = 50;
const ASPECT: number = window.innerWidth / window.innerHeight;
const TWO: number = 2;

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

    @HostListener("window:drag", ["event"])
    public dragDot(event: DragEvent): void {
        // this._dotCommand.dragDot(event, this._renderer);
        this.render();
    }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this._camera.left = CAMERA_DISTANCE * ASPECT / - TWO;
        this._camera.right = CAMERA_DISTANCE * ASPECT / TWO;
        this._camera.top = CAMERA_DISTANCE / TWO;
        this._camera.bottom = CAMERA_DISTANCE / - TWO;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
    }

    @HostListener("window:click", ["$event"])
    public onKeyUp(event: MouseEvent): void {
        if (event.which === LEFT_CLICK) {
            this.placeDot(event);
        } else if (event.which === RIGHT_CLICK) {
            this.remove();
        }
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
        // Debug help
        /*const gridHelper: THREE.GridHelper = new GridHelper(10, 10);
        const axes: THREE.AxisHelper = new AxisHelper(2);
        this._scene.add(axes);
        gridHelper.position.set(0, 0, 0);
        gridHelper.scale.set(2, 2, 2);
        this._scene.add(gridHelper);*/
        /////////////////////////////////////////////////////////////////

        this._camera = new OrthographicCamera(CAMERA_DISTANCE * ASPECT / - TWO, CAMERA_DISTANCE * ASPECT / TWO,
                                              CAMERA_DISTANCE / TWO, CAMERA_DISTANCE / - TWO, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);

        this._camera.position.set(0, CAMERA_DISTANCE , 0);
        this._camera.lookAt(new Vector3(0, 0, 0));
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.nativeElement.appendChild(this._renderer.domElement);

        this._scene.add(this._camera);

        this._renderer.render(this._scene, this._camera);
        this._dotCommand = new DotCommand(this._scene, this._renderer, this._camera);
    }

}
