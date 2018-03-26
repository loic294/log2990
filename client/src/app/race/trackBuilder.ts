import {
    Vector3, MeshBasicMaterial, Mesh, Object3D,
    PlaneGeometry, DoubleSide, CircleGeometry
} from "three";
import { LineSegment } from "./DotCommand";
import { PI_OVER_2 } from "../constants";

const WIDTH: number = 10;
const CIRCLE_SEGMENTS: number = 32;
const PLANE_COLOR: number = 0x0055FF;

export class TrackBuilder {
    private _scene: THREE.Scene;
    private _vertice: Array<Object3D>;
    private _edges: Array<LineSegment>;
    private _circleGeometry: CircleGeometry;
    private _material: MeshBasicMaterial;

    public constructor(scene: THREE.Scene, vertice: Array<Object3D>, edges: Array<LineSegment>) {
        this._scene = scene;
        this._vertice = vertice;
        this._edges = edges;
        this._circleGeometry = new CircleGeometry(WIDTH / 2, CIRCLE_SEGMENTS);
        this._material = new MeshBasicMaterial({ color: PLANE_COLOR, side: DoubleSide });
    }

    public buildTrack(): void {
        let lastVertex: Vector3;

        for (let i: number = 0; i < this._vertice.length; i++) {

            this.replaceSphere(this._vertice[i]);

            if (i === 0) {
                lastVertex = this._vertice[this._vertice.length - 1].position;
            }

            this.placePlane(lastVertex, this._vertice[i].position);

            lastVertex = this._vertice[i].position;
        }

        this.removeLines();
    }

    private placePlane(firstSide: Vector3, secondSide: Vector3): void {
        const planeGeometry: PlaneGeometry = new PlaneGeometry(WIDTH, firstSide.distanceTo(secondSide));
        const plane: Mesh = new Mesh(planeGeometry, this._material);
        plane.position.set(firstSide.x, firstSide.y, firstSide.z);

        const dir: Vector3 = new Vector3;
        dir.subVectors(secondSide, firstSide);
        plane.translateOnAxis(dir, 1 / 2);
        const xAxis: Vector3 = new Vector3(0, 0, 1);
        const angle: number = xAxis.angleTo(dir);
        plane.rotateX(PI_OVER_2);

        if (xAxis.cross(dir).y > 0) {
            plane.rotateZ(-angle);
        } else {
            plane.rotateZ(angle);
        }

        this._scene.add(plane);
    }

    private removeLines(): void {
        for (const line of this._edges) {
            this._scene.remove(line);
        }
    }

    private replaceSphere(vertex: Object3D): void {
        this._scene.remove(vertex);
        const circle: Mesh = new Mesh(this._circleGeometry, this._material);
        circle.position.set(vertex.position.x, vertex.position.y, vertex.position.z);
        circle.rotateX(PI_OVER_2);
        this._scene.add(circle);
    }
}
