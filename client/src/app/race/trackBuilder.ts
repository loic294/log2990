import {
    Vector3, MeshBasicMaterial, Mesh, Object3D,
     Texture, TextureLoader, PlaneGeometry, DoubleSide
} from "three";
import { LineSegment } from "./DotCommand";

const WIDTH: number = 10;

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

    private replaceTexture(line: LineSegment): void {

        this._scene.remove(line);

        const texture: Texture = new TextureLoader().load("../../assets/track/track.jpg");

        const geometry: PlaneGeometry = new PlaneGeometry(1, 1);
        geometry.vertices = new Array();

        if (line.userData.vertices[0].x - line.userData.vertices[1].x > 50 ||
            line.userData.vertices[0].z - line.userData.vertices[1].z > 50) {
                geometry.vertices.push(new Vector3(line.userData.vertices[0].x - WIDTH, 0, line.userData.vertices[0].z - WIDTH));
                geometry.vertices.push(new Vector3(line.userData.vertices[0].x + WIDTH, 0, line.userData.vertices[0].z + WIDTH));
                geometry.vertices.push(new Vector3(line.userData.vertices[1].x - WIDTH, 0, line.userData.vertices[1].z - WIDTH));
                geometry.vertices.push(new Vector3(line.userData.vertices[1].x + WIDTH, 0, line.userData.vertices[1].z + WIDTH));
            } else {
                geometry.vertices.push(new Vector3(line.userData.vertices[0].x - WIDTH / 2, 0, line.userData.vertices[0].z - WIDTH / 2));
                geometry.vertices.push(new Vector3(line.userData.vertices[0].x + WIDTH / 2, 0, line.userData.vertices[0].z + WIDTH / 2));
                geometry.vertices.push(new Vector3(line.userData.vertices[1].x - WIDTH / 2, 0, line.userData.vertices[1].z - WIDTH / 2));
                geometry.vertices.push(new Vector3(line.userData.vertices[1].x + WIDTH / 2, 0, line.userData.vertices[1].z + WIDTH / 2));
            }

        const material: MeshBasicMaterial = new MeshBasicMaterial({ map: texture, side: DoubleSide });
        const temporaryPlane: Mesh = new Mesh(geometry, material);

        this._scene.add(temporaryPlane);
    }
}
