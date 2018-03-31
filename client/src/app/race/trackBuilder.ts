import {
    Vector3, MeshBasicMaterial, Mesh, Object3D,
    PlaneGeometry, DoubleSide, CircleGeometry, TextureLoader, Texture, RepeatWrapping} from "three";
import { LineSegment } from "./DotCommand";
import { PI_OVER_2 } from "../constants";

const WIDTH: number = 10;
const CIRCLE_SEGMENTS: number = 32;
const OFFTRACK_OFFSET: number = 0.02;
const PLANE_OFFSET: number = 0.01;
const OFFTRACK_DIMENSION: number = 10000;
const TEXTURE_DIMENSION: number = 5;

export class TrackBuilder {
    private _circleGeometry: CircleGeometry;

    public constructor(private _scene: THREE.Scene, private _vertice: Array<Object3D>, private _edges: Array<LineSegment>) {
        this._circleGeometry = new CircleGeometry(WIDTH / 2, CIRCLE_SEGMENTS);
    }

    private generateOffTrack(): void {
        const texture: Texture = new TextureLoader().load("../../assets/grass.jpg");
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(OFFTRACK_DIMENSION / TEXTURE_DIMENSION, OFFTRACK_DIMENSION / TEXTURE_DIMENSION);

        const material: MeshBasicMaterial = new MeshBasicMaterial({ map: texture, side: DoubleSide });
        const planeGeometry: PlaneGeometry = new PlaneGeometry(OFFTRACK_DIMENSION, OFFTRACK_DIMENSION);
        const offTrackPlane: Mesh = new Mesh(planeGeometry, material);

        offTrackPlane.rotateX(PI_OVER_2);
        offTrackPlane.position.setY(-OFFTRACK_OFFSET);
        this._scene.add(offTrackPlane);
    }

    public buildTrack(): void {
        this.generateOffTrack();
        let lastVertex: Vector3 = this._vertice[this._vertice.length - 1].position;
        for (const vertex of this._vertice) {
            this.replaceSphere(vertex);
            this.generatePlane(lastVertex, vertex.position);
            lastVertex = vertex.position;
        }

        this.removeLines();
    }

    private generateTexture(textureLength: number): Texture {
        const texture: Texture = new TextureLoader().load("../../assets/track/asphalt.png");
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(WIDTH / TEXTURE_DIMENSION, textureLength / TEXTURE_DIMENSION);

        return texture;
    }

    private generatePlane(firstSide: Vector3, secondSide: Vector3): void {
        const length: number = firstSide.distanceTo(secondSide);

        const material: MeshBasicMaterial = new MeshBasicMaterial({ map: this.generateTexture(length), side: DoubleSide });
        const planeGeometry: PlaneGeometry = new PlaneGeometry(WIDTH, length);
        const plane: Mesh = new Mesh(planeGeometry, material);
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
        plane.position.setY(-PLANE_OFFSET);

        this._scene.add(plane);
    }

    private removeLines(): void {
        for (const line of this._edges) {
            this._scene.remove(line);
        }
    }

    private replaceSphere(vertex: Object3D): void {
        this._scene.remove(vertex);
        const material: MeshBasicMaterial = new MeshBasicMaterial({ map: this.generateTexture(WIDTH), side: DoubleSide });
        const circle: Mesh = new Mesh(this._circleGeometry, material);
        circle.position.set(vertex.position.x, vertex.position.y, vertex.position.z);
        circle.rotateX(PI_OVER_2);
        this._scene.add(circle);
    }

    public get vertices(): Array<Object3D> {
        return this._vertice;
    }

    public set vertices(vertices: Array<Object3D>) {
        this._vertice = vertices;
    }
}
