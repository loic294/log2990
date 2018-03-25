import {
    Vector3, /*SphereGeometry,*/ MeshBasicMaterial, Mesh, Object3D,
    /*LineBasicMaterial, Geometry, LineSegments, Raycaster, Intersection,
    Color,*/ Texture, TextureLoader, PlaneGeometry, DoubleSide, Quaternion
} from "three";
import { PI_OVER_2 } from "../constants";
import { LineSegment } from "./DotCommand";

const PLANE_WIDTH: number = 10;

export class TrackBuilder {
    private _scene: THREE.Scene;
    private _vertice: Array<Object3D>;
    private _edges: Array<LineSegment>;

    public constructor(scene: THREE.Scene, vertice: Array<Object3D>, edges: Array<LineSegment>) {
        this._scene = scene;
        this._vertice = vertice;
        this._edges = edges;
    }

    public buildTrack(): void {
        for (const sphere of this._vertice) {
            this._scene.remove(sphere);
        }
        for (const line of this._edges) {
            this.replaceTexture(line);
        }
    }

    private findPlaneHeight(line: LineSegment): number {
        const height1: number = line.userData.vertices[0].x - line.userData.vertices[1].x;
        const height2: number = line.userData.vertices[0].z - line.userData.vertices[1].z;

        return (height1 > height2) ? height1 : height2;
    }

    private findSegmentMiddle(line: LineSegment): Vector3 {
        return new Vector3((line.userData.vertices[0].x + line.userData.vertices[1].x) / 2, 0,
                           (line.userData.vertices[0].z + line.userData.vertices[0].z) / 2);
    }

    private findLineAngle(line: LineSegment): number {

        /*const vectorLength: number = Math.sqrt(Math.pow(line.userData.vertices[0].x + line.userData.vertices[1].x, 2) +
            Math.pow(line.userData.vertices[0].z + line.userData.vertices[1].z, 2));
        const vector1: Vector3 = new Vector3(line.userData.vertices[0].x / vectorLength,
                                             0, line.userData.vertices[0].z / vectorLength);
        const vector2: Vector3 = new Vector3(line.userData.vertices[1].x / vectorLength,
                                             0, line.userData.vertices[1].z / vectorLength);*/
        const vector1: Vector3 = new Vector3().subVectors(new Vector3(0, 0, 0), line.userData.vertices[0]).normalize();
        const vector2: Vector3 = new Vector3().subVectors(new Vector3(0, 0, 0), line.userData.vertices[1]).normalize();

        return Math.acos(vector1.dot(vector2));
    }

    private replaceTexture(line: LineSegment): void {

        this._scene.remove(line);

        const texture: Texture = new TextureLoader().load("../../assets/track/track.jpg");
        const height: number = this.findPlaneHeight(line);

        const geometry: PlaneGeometry = new PlaneGeometry(height, PLANE_WIDTH);
        const material: MeshBasicMaterial = new MeshBasicMaterial({ map: texture, side: DoubleSide });
        const temporaryPlane: Mesh = new Mesh(geometry, material);

        const middle: Vector3 = this.findSegmentMiddle(line);
        const distance: number = Math.sqrt(Math.pow(middle.x, 2) + Math.pow(middle.y, 2));
        const angle: number = this.findLineAngle(line);

        temporaryPlane.rotateX(PI_OVER_2);
        temporaryPlane.rotateZ(angle);
        /*temporaryPlane.translateOnAxis(middle.normalize(), distance / 2);*/
        temporaryPlane.position.copy(middle);

        this._scene.add(temporaryPlane);
    }
}
