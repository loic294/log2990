import {
    Vector3, Mesh, Object3D, PlaneGeometry, DoubleSide, CircleGeometry,
    TextureLoader, Texture, RepeatWrapping, MeshPhongMaterial } from "three";
import { LineSegment } from "./DotCommand";
import { PI_OVER_2 } from "../constants";
import { Car } from "./car/car";

const WIDTH: number = 10;
const CIRCLE_SEGMENTS: number = 32;
const OFFSET_FACTOR: number = -0.1;
const DISTANCE_FACTOR: number = 1.3;
const NUMBER_OF_LINE: number = 2;
const LINE_POSITION_FACTOR: number = 3;
const OFFTRACK_OFFSET: number = 0.03;
const PLANE_OFFSET: number = 0.01;
const OFFTRACK_DIMENSION: number = 10000;
const TEXTURE_DIMENSION: number = 5;
const OFFTRACK_TEXTURE_PATH: string = "../../assets/grass.jpg";
const TRACK_TEXTURE_PATH: string = "../../assets/track/asphalt.png";

export class TrackBuilder {
    private _planeVariation: number;
    private _circleGeometry: CircleGeometry;
    private _startingLines: Array<Mesh>;
    private _trackSegments: Array<Mesh>;

    public constructor(private _scene: THREE.Scene, private _vertice: Array<Object3D>, private _edges: Array<LineSegment>,
                       private _playerCar: Car, private _botCars: Array<Car>) {
        this._planeVariation = PLANE_OFFSET / 2;
        this._circleGeometry = new CircleGeometry(WIDTH / 2, CIRCLE_SEGMENTS);
        this._startingLines = new Array();
        this._trackSegments = [];
    }

    private generateOffTrack(): void {
        const material: MeshPhongMaterial = new MeshPhongMaterial({
            map: this.generateTexture(OFFTRACK_DIMENSION, OFFTRACK_DIMENSION, OFFTRACK_TEXTURE_PATH),
            side: DoubleSide
        });

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
            this.generateTrackSegment(lastVertex, vertex.position);
            lastVertex = vertex.position;
        }

        this.removeLines();
        this.placeStartingLines();
        this.positionRacers();
    }

    private generateTexture(textureWidth: number, textureLength: number, texturePath: string): Texture {
        const texture: Texture = new TextureLoader().load(texturePath);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(textureWidth / TEXTURE_DIMENSION, textureLength / TEXTURE_DIMENSION);

        return texture;
    }

    private generateTrackSegment(firstVertex: Vector3, secondVertex: Vector3): void {
        // create length
        const length: number = firstVertex.distanceTo(secondVertex);
        // create Material
        const material: MeshPhongMaterial = new MeshPhongMaterial({
            map: this.generateTexture(WIDTH, length, TRACK_TEXTURE_PATH),
            side: DoubleSide
        });
        // initial position of track
        const planeGeometry: PlaneGeometry = new PlaneGeometry(WIDTH, length);
        const track: Mesh = new Mesh(planeGeometry, material);
        track.position.set(firstVertex.x, firstVertex.y, firstVertex.z);

        this._scene.add(this.placeObjectCorrectly(firstVertex, secondVertex, track));

        this._trackSegments.push(track);
    }

    private placeObjectCorrectly(firstVertex: Vector3, secondVertex: Vector3, object: Mesh): Mesh {

        this.centerOnAxis(firstVertex, secondVertex, object);

        object.rotateX(PI_OVER_2);

        if (this.isToTheRightOfAxis(firstVertex, secondVertex)) {
            object.rotateZ(-this.calculateCorrectionAngle(firstVertex, secondVertex));
        } else {
            object.rotateZ(this.calculateCorrectionAngle(firstVertex, secondVertex));
        }
        object.position.setY(-PLANE_OFFSET - this._planeVariation);
        this._planeVariation = - this._planeVariation;

        return object;
    }

    private centerOnAxis(firstVertex: Vector3, secondVertex: Vector3, object: Mesh): Mesh {
        object.translateOnAxis(this.calculateAxis(firstVertex, secondVertex) , 1 / 2);

        return object;
    }

    private calculateAxis(firstVertex: Vector3, secondVertex: Vector3): Vector3 {
        return new Vector3().subVectors(secondVertex, firstVertex);
    }

    private calculateCorrectionAngle(firstVertex: Vector3, secondVertex: Vector3): number {
        return new Vector3(0, 0, 1).angleTo(this.calculateAxis(firstVertex, secondVertex));
    }

    private isToTheRightOfAxis(firstVertex: Vector3, secondVertex: Vector3): boolean {
        return new Vector3(0, 0, 1).cross(this.calculateAxis(firstVertex, secondVertex)).y > 0;
    }

    private removeLines(): void {
        for (const line of this._edges) {
            this._scene.remove(line);
        }
    }

    private replaceSphere(vertex: Object3D): void {
        this._scene.remove(vertex);
        const material: MeshPhongMaterial = new MeshPhongMaterial({
            map: this.generateTexture(WIDTH, WIDTH, TRACK_TEXTURE_PATH),
            side: DoubleSide
        });

        const circle: Mesh = new Mesh(this._circleGeometry, material);
        circle.position.set(vertex.position.x, vertex.position.y, vertex.position.z);
        circle.rotateX(PI_OVER_2);
        this._scene.add(circle);
    }

    private placeStartingLines(): void {
        const lineGeometry: PlaneGeometry = new PlaneGeometry(2, WIDTH);
        const texture: Texture = new TextureLoader().load("../../../assets/track/starting_line.jpg");
        const lineMaterial: MeshPhongMaterial = new MeshPhongMaterial({ map: texture, side: DoubleSide });
        lineMaterial.polygonOffset = true;
        lineMaterial.polygonOffsetFactor = OFFSET_FACTOR;
        const firstLine: Mesh = new Mesh(lineGeometry, lineMaterial);
        const secondLine: Mesh = new Mesh(lineGeometry, lineMaterial);

        this.positionMesh(firstLine, WIDTH / DISTANCE_FACTOR);
        this.initiateLineStats(firstLine);
        this.positionMesh(secondLine, WIDTH * DISTANCE_FACTOR);
        this.initiateLineStats(secondLine);
    }

    private positionMesh(mesh: Mesh, distance: number): void {
        const dir: Vector3 = new Vector3;
        dir.subVectors(this._vertice[1].position, this._vertice[0].position);
        dir.normalize();
        mesh.translateOnAxis(dir, distance);
        const xAxis: Vector3 = new Vector3(0, 0, 1);
        const angle: number = xAxis.angleTo(dir);
        mesh.rotateX(PI_OVER_2);

        if (xAxis.cross(dir).y > 0) {
            mesh.rotateZ(-angle);
        } else {
            mesh.rotateZ(angle);
        }
        mesh.rotateZ(Math.PI / 2);
    }

    private initiateLineStats(line: Mesh): void {
        line.userData.leftPositionTaken = false;
        line.userData.rightPositionTaken = false;
        this._startingLines.push(line);
        this._scene.add(line);
    }

    private positionRacers(): void {

        this.chooseLine(this._playerCar);

        for (const car of this._botCars) {
            this.chooseLine(car);
        }
    }

    private lineAsFreePosition(line: Mesh): boolean {
        return !line.userData.leftPositionTaken || !line.userData.rightPositionTaken;
    }

    private chooseLine(car: Car): void {
        if (Math.random() * NUMBER_OF_LINE <= 1 && this.lineAsFreePosition(this._startingLines[0])) {
            this.chooseLineSide(car, this._startingLines[0]);
        } else if (this.lineAsFreePosition(this._startingLines[1])) {
            this.chooseLineSide(car, this._startingLines[1]);
        } else {
            this.chooseLineSide(car, this._startingLines[0]);
        }
    }

    private chooseLineSide(car: Car, line: Mesh): void {
        const perpendiculars: Array<Vector3> = this.findPerpendicularVectors(line.position);
        if (Math.random() * NUMBER_OF_LINE <= 1 && !line.userData.leftPositionTaken) {
            this.placeOnLine(car, line, perpendiculars[0]);
            line.userData.leftPositionTaken = true;
        } else if (!line.userData.rightPositionTaken) {
            this.placeOnLine(car, line, perpendiculars[1]);
            line.userData.rightPositionTaken = true;
        } else {
            this.placeOnLine(car, line, perpendiculars[0]);
            line.userData.leftPositionTaken = true;
        }
    }

    private placeOnLine(car: Car, line: Mesh, perpendicular: Vector3): void {
        car.meshPosition = line.position;
        const direction: Vector3 = car.direction;
        car.mesh.rotateY(direction.angleTo(this._vertice[1].position));
        car.meshPosition = new Vector3(perpendicular.x * LINE_POSITION_FACTOR, 0, perpendicular.z * LINE_POSITION_FACTOR);
    }

    private findPerpendicularVectors(vector: Vector3): Array<Vector3> {
        const orthogonal1: Vector3 = new Vector3(0, 1, 0);
        const orthogonal2: Vector3 = new Vector3(0, -1, 0);
        const perpendiculars: Array<Vector3> = new Array();

        perpendiculars.push(new Vector3().crossVectors(vector, orthogonal1).normalize());
        perpendiculars.push(new Vector3().crossVectors(vector, orthogonal2).normalize());

        return perpendiculars;
    }

    public get vertices(): Array<Object3D> {
        return this._vertice;
    }

    public set vertices(vertices: Array<Object3D>) {
        this._vertice = vertices;
    }

    public get startingLines(): Array<Mesh> {
        return this._startingLines;
    }
}
