import {
    Vector3, SphereGeometry, MeshBasicMaterial, Mesh, Object3D,
    LineBasicMaterial, Geometry, Line, Raycaster, Intersection
} from "three";

const CAMERA_DISTANCE: number = 50;
const CIRCLE_PIXEL: number = 20;
const CIRCLE_SIZE: number = 1;
const COLOR_LINE: number = 0xFFF000;
const COLOR_FIRST_LINE: number = 0xFF0000;

export class DotCommand {

    private _trackIsCompleted: boolean;
    private _vertices: Array<Object3D>;
    private _edges: Array<Line>;
    private _selectedObject: Object3D;

    public constructor(private _scene: THREE.Scene, private _renderer: THREE.WebGLRenderer, private _camera: THREE.OrthographicCamera) {
        this._trackIsCompleted = false;
        this._vertices = new Array<Object3D>();
        this._edges = new Array<Line>();
        this._selectedObject = null;
    }

    public add(event: MouseEvent): void {

        if (!this.detectObjectsAtMouse(event) && !this._trackIsCompleted && event.srcElement.localName === "canvas") {

            const relativeDotPosition: Vector3 = this.findRelativePosition(event);
            const sphereMesh: Mesh = this.createSphere(relativeDotPosition);
            this._scene.add(sphereMesh);
            this._vertices.push(sphereMesh);
            this.updateEdges();
        }
    }

    private updateEdges(): void {
        if (this._vertices.length > 1) {

            const lineMat: THREE.LineBasicMaterial = (this._vertices.length === 2 ?
                new LineBasicMaterial({ color: COLOR_FIRST_LINE, linewidth: 8 }) :
                new LineBasicMaterial({ color: COLOR_LINE, linewidth: 8 }));
            const lineGeo: THREE.Geometry = new Geometry();
            lineGeo.vertices.push(this._vertices[this._vertices.length - 2].position);
            lineGeo.vertices.push(this._vertices[this._vertices.length - 1].position);

            const line: THREE.Line = new Line(lineGeo, lineMat);

            line.userData.vertices = [];
            line.userData.vertices.push(this._vertices[this._vertices.length - 2].position);
            line.userData.vertices.push(this._vertices[this._vertices.length - 1].position);

            this._edges.push(line);
            this._scene.add(line);
        }
    }

    private detectObjectsAtMouse(event: MouseEvent): boolean {

        let foundCircle: boolean = false;

        if (this._vertices.length > 0) {

            const mouse3D: Vector3 = this.findRelativePosition(event);
            const raycaster: THREE.Raycaster = new Raycaster(this._camera.position, mouse3D.sub(this._camera.position).normalize());
            const intersects: Intersection[] = raycaster.intersectObjects(this._vertices);

            if (intersects.length > 0 && intersects[0].object === this._vertices[0] && this._vertices.length > 1) {
                if (!this._trackIsCompleted) {
                    this.connectToFirst();
                    this._trackIsCompleted = true;
                }
                this._selectedObject = intersects[0].object;
                foundCircle = true;
            } else if (intersects.length > 0) {
                this._selectedObject = intersects[0].object;
                foundCircle = true;
            }
        }

        return foundCircle;
    }

    private connectToFirst(): void {
        // this.remove();
        const lineMat: THREE.LineBasicMaterial = new LineBasicMaterial({ color: COLOR_LINE, linewidth: 8 });
        const lineGeo: THREE.Geometry = new Geometry();

        lineGeo.vertices.push(this._vertices[this._vertices.length - 1].position);
        lineGeo.vertices.push(this._vertices[0].position);

        const line: THREE.Line = new Line(lineGeo, lineMat);

        line.userData.vertices = [];
        line.userData.vertices.push(this._vertices[this._vertices.length - 1].position);
        line.userData.vertices.push(this._vertices[0].position);

        this._scene.add(line);
        this._edges.push(line);
    }

    public remove(): void {
        if (!this._trackIsCompleted) {

            if (this._vertices.length > 0) {
                this.removeLastVertex();
            }
            if (this._edges.length > 0) {
                this.removeLastEdge();
            }

        } else {
            this.removeLastEdge();
            this._trackIsCompleted = false;
        }
    }

    private removeLastVertex(): void {
        const dot: Object3D = this._scene.getObjectById(this._vertices[this._vertices.length - 1].id);
        this._scene.remove(dot);
        this._vertices.pop();
    }

    private removeLastEdge(): void {
        const line: Object3D = this._scene.getObjectById(this._edges[this._edges.length - 1].id);
        this._scene.remove(line);
        this._edges.pop();
    }

    private findRelativePosition(event: MouseEvent): Vector3 {
        const canvas: HTMLCanvasElement = this._renderer.domElement;

        const relativeX: number = event.offsetX - (canvas.clientWidth / 2);
        const relativeZ: number = event.offsetY - (canvas.clientHeight / 2);

        return new Vector3(relativeX * CAMERA_DISTANCE / canvas.clientHeight, 0, relativeZ * CAMERA_DISTANCE / canvas.clientHeight);

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
            const newPos: THREE.Vector3 = this.findRelativePosition(event);
            const oldPos: THREE.Vector3 = this._selectedObject.position;
            this._selectedObject.position.set(newPos.x, newPos.y, newPos.z);

            this.dragLines(oldPos, newPos);
        }
    }

    private findConnectedLines(oldPos: THREE.Vector3): Array<Line> {
        const connectedLines: Array<Line> = new Array<Line>();

        for (const i of this._edges) {
            if (i.userData.vertices[0] === oldPos || i.userData.vertices[1] === oldPos) {
                connectedLines.push(i);
            }
        }

        return connectedLines;
    }

    private dragLines(oldPos: THREE.Vector3, newPos: THREE.Vector3): void {

        const connectedLines: Array<Line> = this.findConnectedLines(oldPos);

        for (const i of connectedLines) {
            const lineGeometry: Geometry = i.geometry as Geometry;
            lineGeometry.verticesNeedUpdate = true;
        }
    }

    public unselect(): void {
        this._selectedObject = null;
    }
}
