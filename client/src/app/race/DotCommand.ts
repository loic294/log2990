import { Vector3, SphereGeometry, MeshBasicMaterial, Mesh } from "three";

const TWO: number = 2;
const CAMERA_DISTANCE: number = 50;

export class DotCommand {

    private _sphereMesh: THREE.Mesh;
    private _trackIsCompleted: boolean;
    private _dotMemory: Array<Vector3>;

    public constructor(/*private _scene: THREE.Scene, private _renderer: THREE.WebGLRenderer*/) {
        this._trackIsCompleted = false;
        this._dotMemory = new Array<Vector3>();
        const geometry: THREE.SphereGeometry = new SphereGeometry( 1, 32, 32 );
        const material: THREE.MeshBasicMaterial = new MeshBasicMaterial( { color: 0xffff00 } );
        this._sphereMesh = new Mesh(geometry, material);

    }
    public add(scene: THREE.Scene, renderer: THREE.WebGLRenderer, event: MouseEvent): void {
        if (!this._trackIsCompleted) {
            const relativeDotPosition: Vector3 = this.findRelativePosition(renderer, event);
            this._sphereMesh.position.set(relativeDotPosition.x, relativeDotPosition.y, relativeDotPosition.z);
            scene.add(this._sphereMesh);
            this._dotMemory.push(relativeDotPosition);
        }

    }
    public remove(): void {

    }

    private findRelativePosition(renderer: THREE.WebGLRenderer, event: MouseEvent): Vector3 {
        const canvas: HTMLCanvasElement = renderer.domElement;

        const relativeX: number = event.offsetX - (canvas.clientWidth / TWO);
        const relativeZ: number = event.offsetY - (canvas.clientHeight / TWO);

        return new Vector3(relativeX * CAMERA_DISTANCE / canvas.clientHeight,
                           0, relativeZ * CAMERA_DISTANCE / canvas.clientHeight);

    }
}
