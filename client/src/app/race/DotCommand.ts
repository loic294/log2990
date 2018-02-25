import {
    Vector3, SphereGeometry, MeshBasicMaterial, Mesh, Object3D,
    LineBasicMaterial, Geometry, Line, Raycaster, Intersection
} from "three";
/*import { DragControls} from "three-dragcontrols";*/

const CAMERA_DISTANCE: number = 50;
const CIRCLE_PIXEL: number = 20;
const CIRCLE_SIZE: number = 1;

export class DotCommand {

    private _trackIsCompleted: boolean;
    private _vertices: Array<Object3D>;
    private _edges: Array<Line>;
    private _selectedObject: Object3D;
    private _selectedLines: Array<Line>;
    // private _controls: DragControls;

    public constructor(private _scene: THREE.Scene, private _renderer: THREE.WebGLRenderer, private _camera: THREE.OrthographicCamera) {
        this._trackIsCompleted = false;
        this._vertices = new Array<Object3D>();
        this._edges = new Array<Line>();
        this._selectedObject = null;
        this._selectedLines = new Array<Line>();
    }

    public add(event: MouseEvent): void {

        if (!this._trackIsCompleted && !this.detectCompletedTrack(event)) {

            const relativeDotPosition: Vector3 = this.findRelativePosition(event);
            const sphereMesh: Mesh = this.createSphere(relativeDotPosition);
            this._scene.add(sphereMesh);
            this._vertices.push(sphereMesh);
            this.updateEdges();
        }

    }

    private updateEdges(): void {
        if (this._vertices.length > 1) {

            const lineMat: THREE.LineBasicMaterial = new LineBasicMaterial({ color: 0xFF0000, linewidth: 8 });
            const lineGeo: THREE.Geometry = new Geometry();
            lineGeo.vertices.push(this._vertices[this._vertices.length - 2].position);
            lineGeo.vertices.push(this._vertices[this._vertices.length - 1].position);


            const line: THREE.Line = new Line(lineGeo, lineMat);

            this._vertices[this._vertices.length - 2].userData.edges1 = line;
            this._vertices[this._vertices.length - 1].userData.edges2 = line;
            this._edges.push(line);
            this._scene.add(line);
        }
    }

    private detectCompletedTrack(event: MouseEvent): boolean {
        let foundCircle: boolean = false;
        if (this._vertices.length > 0) {
            const mouse3D: Vector3 = this.findRelativePosition(event);
            const raycaster: THREE.Raycaster = new Raycaster(this._camera.position, mouse3D.sub(this._camera.position).normalize());
            const intersects: Intersection[] = raycaster.intersectObjects(this._vertices);
            if (intersects.length > 0 && intersects[0].object === this._vertices[0]) {
                this.connectToFirst();
                this._trackIsCompleted = true;
                foundCircle = true;
            } else if (intersects.length > 0) {
                this.drag(intersects[0].object, event);
               // this.findConnectedEdges();
                foundCircle = true;
            }
        }

        return foundCircle;
    }

    /*private findConnectedEdges(): void {
        this._edges[0].
        for (let i in this._edges) {
            if (i.vertices)
        }
    }*/

    private drag(object: Object3D, event: MouseEvent): void {
        this._selectedObject = object;
        /*object.position.set(0, 0, 0);
        event.preventDefault();
        this._renderer.render(this._scene, this._camera);*/
    }

    private connectToFirst(): void {
        //this.remove();
        const lineMat: THREE.LineBasicMaterial = new LineBasicMaterial({ color: 0xFF0000, linewidth: 8 });
        const lineGeo: THREE.Geometry = new Geometry();
        lineGeo.vertices.push(this._vertices[this._vertices.length - 1].position);
        lineGeo.vertices.push(this._vertices[0].position);
        const line: THREE.Line = new Line(lineGeo, lineMat);
        this._scene.add(line);
        this._edges.push(line);
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

        const relativeX: number = event.offsetX - (canvas.clientWidth / 2);
        const relativeZ: number = event.offsetY - (canvas.clientHeight / 2);

        return new Vector3(relativeX * CAMERA_DISTANCE / canvas.clientHeight,
                           0, relativeZ * CAMERA_DISTANCE / canvas.clientHeight);

    }

    private createSphere(spherePosition: Vector3): THREE.Mesh {
        const geometry: THREE.SphereGeometry = new SphereGeometry(CIRCLE_SIZE, CIRCLE_PIXEL, CIRCLE_PIXEL);
        const material: THREE.MeshBasicMaterial = (this._vertices.length === 0) ?
            new MeshBasicMaterial({ color: 0xFFFF00 }) :
            new MeshBasicMaterial({ color: 0xFFFFFF });
        const sphereMesh: Mesh = new Mesh(geometry, material);
        sphereMesh.position.set(spherePosition.x, spherePosition.y, spherePosition.z);

        return sphereMesh;

    }

    public dragDot(event: MouseEvent): void {
        if (this._selectedObject !== null) {
            const mouse3D: THREE.Vector3 = this.findRelativePosition(event);
            this._selectedObject.position.set(mouse3D.x, mouse3D.y, mouse3D.z);

            if (this._selectedObject.userData.edges1) {
                this.dragLine(this._selectedObject.userData.edges1, mouse3D);
            }
            if (this._selectedObject.userData.edges2) {
                this.dragLine(this._selectedObject.userData.edges2, mouse3D);
            }
            this._renderer.render(this._scene, this._camera);
        }
    }

    private dragLine(line: Line, pos: Vector3): void {

        //this._selectedObject.userData.edges[0].vertices.pop();
    }

    public unselect(): void {
        this._selectedObject = null;
    }
}
