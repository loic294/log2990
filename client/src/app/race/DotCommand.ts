import { Vector3, SphereGeometry, MeshBasicMaterial, Mesh, Object3D, LineBasicMaterial, Geometry, Line, Raycaster } from "three";

const TWO: number = 2;
const CAMERA_DISTANCE: number = 50;
const CIRCLE_PIXEL: number = 32;
const CIRCLE_SIZE: number = 1;

export class DotCommand {

    private _trackIsCompleted: boolean;
    private _vertices: Array<Object3D>;
    private _edges: Array<Line>;

    public constructor(private _scene: THREE.Scene, private _renderer: THREE.WebGLRenderer) {
        this._trackIsCompleted = false;
        this._vertices = new Array<Object3D>();
        this._edges = new Array<Line>();

    }

    public add(event: MouseEvent): void {
        if (!this._trackIsCompleted) {
            const relativeDotPosition: Vector3 = this.findRelativePosition(event);
            const sphereMesh: Mesh = this.createSphere(relativeDotPosition);
            this._scene.add(sphereMesh);
            this._vertices.push(sphereMesh);
            this.updateEdges();
            this.detectCompletedTrack();
        }

    }

    private updateEdges(): void {
        if (this._vertices.length > 1) {

            const lineMat: THREE.LineBasicMaterial = new LineBasicMaterial({ color: 0xFF0000, linewidth: 8 });
            const lineGeo: THREE.Geometry = new Geometry();
            lineGeo.vertices.push(this._vertices[this._vertices.length - TWO].position);
            lineGeo.vertices.push(this._vertices[this._vertices.length - 1].position);

            const line: THREE.Line = new Line(lineGeo, lineMat);

            this._edges.push(line);
            this._scene.add(line);
        }
    }

    private detectCompletedTrack(): void {
        
    }

    public remove(): void {
        if (!this._trackIsCompleted) {

            if (this._vertices.length > 0) {
                const dot: Object3D = this._scene.getObjectById(this._vertices[this._vertices.length - 1].id);
                this._scene.remove(dot);
                this._vertices.pop();
            }

            if (this._edges.length > 0) {
                const line: Object3D = this._scene.getObjectById(this._edges[this._edges.length - 1].id);
                this._scene.remove(line);
                this._edges.pop();
            }

        }
    }

    private findRelativePosition(event: MouseEvent): Vector3 {
        const canvas: HTMLCanvasElement = this._renderer.domElement;

        const relativeX: number = event.offsetX - (canvas.clientWidth / TWO);
        const relativeZ: number = event.offsetY - (canvas.clientHeight / TWO);

        return new Vector3(relativeX * CAMERA_DISTANCE / canvas.clientHeight,
                           0, relativeZ * CAMERA_DISTANCE / canvas.clientHeight);

    }

    private createSphere(spherePosition: Vector3): THREE.Mesh {
        const geometry: THREE.SphereGeometry = new SphereGeometry( CIRCLE_SIZE, CIRCLE_PIXEL, CIRCLE_PIXEL );
        const material: THREE.MeshBasicMaterial = (this._vertices.length === 0) ? new MeshBasicMaterial( { color: 0xFFFF00 } ) :
                                                                                  new MeshBasicMaterial( { color: 0xFFFFFF } );
        const sphereMesh: Mesh = new Mesh(geometry, material);
        sphereMesh.position.set(spherePosition.x, spherePosition.y, spherePosition.z);

        return sphereMesh;
    }
}
