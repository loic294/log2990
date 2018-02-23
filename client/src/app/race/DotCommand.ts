import { Vector3, SphereGeometry, MeshBasicMaterial, Mesh } from "three";

const TWO: number = 2;
const CAMERA_DISTANCE: number = 50;

export class DotCommand {

    private _trackIsCompleted: boolean;
    private _dotMemory: Array<Vector3>;

    public constructor(private _scene: THREE.Scene, private _renderer: THREE.WebGLRenderer) {
        this._trackIsCompleted = false;
        this._dotMemory = new Array<Vector3>();

    }
    public add(event: MouseEvent): void {
        if (!this._trackIsCompleted) {
            const relativeDotPosition: Vector3 = this.findRelativePosition(event);
            const sphereMesh: Mesh = this.createSphere(relativeDotPosition);
            this._scene.add(sphereMesh);
            this._dotMemory.push(relativeDotPosition);
        }

    }
    public remove(): void {

    }

    private findRelativePosition(event: MouseEvent): Vector3 {
        const canvas: HTMLCanvasElement = this._renderer.domElement;

        const relativeX: number = event.offsetX - (canvas.clientWidth / TWO);
        const relativeZ: number = event.offsetY - (canvas.clientHeight / TWO);

        return new Vector3(relativeX * CAMERA_DISTANCE / canvas.clientHeight,
                           0, relativeZ * CAMERA_DISTANCE / canvas.clientHeight);

    }

    private createSphere(spherePosition: Vector3): THREE.Mesh {
        const geometry: THREE.SphereGeometry = new SphereGeometry( 1, 32, 32 );
        const material: THREE.MeshBasicMaterial = new MeshBasicMaterial( { color: 0xffff00 } );
        const sphereMesh: Mesh = new Mesh(geometry, material);
        sphereMesh.position.set(spherePosition.x, spherePosition.y, spherePosition.z);

        return sphereMesh;
    }
}
