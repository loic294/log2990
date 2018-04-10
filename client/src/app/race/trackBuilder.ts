import {
    Vector3, Mesh, Object3D, PlaneGeometry, DoubleSide, CircleGeometry,
    TextureLoader, Texture, RepeatWrapping, MeshPhongMaterial, CubeGeometry } from "three";
import { LineSegment } from "./DotCommand";
import { PI_OVER_2 } from "../constants";
import { Car } from "./car/car";

const WIDTH: number = 10;
const WALL_HEIGHT: number = 2;
const WALL_WIDTH_DIVISOR: number = 10;
const CIRCLE_SEGMENTS: number = 32;
const OFFSET_FACTOR: number = -0.1;
const DISTANCE_FACTOR: number = 1.5;
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
    public constructor(private _scene: THREE.Scene, private _vertice: Array<Object3D>, private _edges: Array<LineSegment>,
                       private _playerCar: Car, private _botCars: Array<Car>) {
        this._planeVariation = PLANE_OFFSET / 2;
        this._circleGeometry = new CircleGeometry(WIDTH / 2, CIRCLE_SEGMENTS);
        this._startingLines = new Array();
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
            this.generateTrackPortion(lastVertex, vertex.position);
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

    private generateTrackPortion(firstVertex: Vector3, secondVertex: Vector3): void {
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

        this.generateWall(firstVertex, secondVertex);

    }

    private generateWall(firstVertex: Vector3, secondVertex: Vector3): void {
        const length: number = firstVertex.distanceTo(secondVertex);

        const material: MeshPhongMaterial = new MeshPhongMaterial({
            map: this.generateTexture(WIDTH, length, TRACK_TEXTURE_PATH),
            side: DoubleSide
        });

        const wall: Mesh = new Mesh(new CubeGeometry(WIDTH / WALL_WIDTH_DIVISOR, length, WALL_HEIGHT), material);
        wall.position.set(firstVertex.x, firstVertex.y, firstVertex.z);

        this._scene.add(this.placeObjectCorrectly(firstVertex, secondVertex, wall));
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

        this.positionStartingLine(firstLine, WIDTH / DISTANCE_FACTOR);
        this.positionStartingLine(secondLine, WIDTH * DISTANCE_FACTOR);
    }

    private positionStartingLine(line: Mesh, distance: number): void {
        const translationDirection: Vector3 = new Vector3(this._vertice[1].position.x,
                                                          this._vertice[1].position.z,
                                                          this._vertice[1].position.y);
        translationDirection.normalize();

        line.rotateX(PI_OVER_2);
        line.translateOnAxis(translationDirection, distance);
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
        const perpendicular: Vector3 = this.findPerpendicularVector(line.position);
        if (Math.random() * NUMBER_OF_LINE <= 1 && !line.userData.leftPositionTaken) {
            line.userData.leftPositionTaken = true;
        } else if (!line.userData.rightPositionTaken) {
            perpendicular.x = -perpendicular.x;
            perpendicular.y = -perpendicular.y;
            line.userData.rightPositionTaken = true;
        } else {
            line.userData.leftPositionTaken = true;
        }
        this.placeOnLine(car, line, perpendicular);
    }

    private placeOnLine(car: Car, line: Mesh, perpendicular: Vector3): void {
        const direction: Vector3 = new Vector3(perpendicular.x * WIDTH / LINE_POSITION_FACTOR, 0,
                                               perpendicular.y * WIDTH / LINE_POSITION_FACTOR);
        car.meshPosition = new Vector3().addVectors(line.position, direction);
    }

    private findPerpendicularVector(vector: Vector3): Vector3 {
        const orthogonal: Vector3 = new Vector3(0, 0, 1);

        return new Vector3().crossVectors(vector, orthogonal).normalize();
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
