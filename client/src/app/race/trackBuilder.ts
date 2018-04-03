import {
    Vector3, MeshBasicMaterial, Mesh, Object3D,
    PlaneGeometry, DoubleSide, CircleGeometry, TextureLoader, Texture, RepeatWrapping} from "three";
import { LineSegment } from "./DotCommand";
import { PI_OVER_2 } from "../constants";
import { Car } from "./car/car";

const WIDTH: number = 10;
const CIRCLE_SEGMENTS: number = 32;
const OFFSET_FACTOR: number = -0.1;
const DISTANCE_FACTOR: number = 1.5;
const NUMBER_OF_LINE: number = 2;
const LINE_POSITION_FACTOR: number = 3;
const OFFTRACK_OFFSET: number = 0.02;
const PLANE_OFFSET: number = 0.01;
const OFFTRACK_DIMENSION: number = 10000;
const TEXTURE_DIMENSION: number = 5;

export class TrackBuilder {
    private _circleGeometry: CircleGeometry;
    private _startingLines: Array<Mesh>;
    public constructor(private _scene: THREE.Scene, private _vertice: Array<Object3D>, private _edges: Array<LineSegment>,
                       private _playerCar: Car, private _botCars: Array<Car>) {
        this._circleGeometry = new CircleGeometry(WIDTH / 2, CIRCLE_SEGMENTS);
        this._startingLines = new Array();
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
        this.placeStartingLines();
        this.positionRacers();

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

    private placeStartingLines(): void {
        const lineGeometry: PlaneGeometry = new PlaneGeometry(2, WIDTH);
        const texture: Texture = new TextureLoader().load("../../../assets/track/starting_line.jpg");
        const lineMaterial: MeshBasicMaterial = new MeshBasicMaterial({ map: texture, side: DoubleSide });
        lineMaterial.polygonOffset = true;
        lineMaterial.polygonOffsetFactor = OFFSET_FACTOR;
        const firstLine: Mesh = new Mesh(lineGeometry, lineMaterial);
        const secondLine: Mesh = new Mesh(lineGeometry, lineMaterial);

        const translationDirection: Vector3 = new Vector3(this._vertice[1].position.x,
                                                          this._vertice[1].position.z,
                                                          this._vertice[1].position.y);
        translationDirection.normalize();

        firstLine.rotateX(PI_OVER_2);
        firstLine.translateOnAxis(translationDirection, WIDTH / DISTANCE_FACTOR);
        firstLine.userData.leftPositionTaken = false;
        firstLine.userData.rightPositionTaken = false;
        this._startingLines.push(firstLine);
        this._scene.add(firstLine);

        secondLine.rotateX(PI_OVER_2);
        secondLine.translateOnAxis(translationDirection, WIDTH * DISTANCE_FACTOR);
        secondLine.userData.leftPositionTaken = false;
        secondLine.userData.rightPositionTaken = false;
        this._startingLines.push(secondLine);
        this._scene.add(secondLine);
    }

    private positionRacers(): void {

        if (Math.random() * NUMBER_OF_LINE <= 1) {
            this.placeOnLine(this._playerCar, this._startingLines[0]);
        } else {
            this.placeOnLine(this._playerCar, this._startingLines[1]);
        }

        for (const car of this._botCars) {
            if (Math.random() * NUMBER_OF_LINE <= 1 && (!this._startingLines[0].userData.leftPositionTaken ||
                                                         !this._startingLines[0].userData.rightPositionTaken)) {
                this.placeOnLine(car, this._startingLines[0]);
            } else if ((!this._startingLines[1].userData.leftPositionTaken ||
                        !this._startingLines[1].userData.rightPositionTaken)) {
                this.placeOnLine(car, this._startingLines[1]);
            } else {
                this.placeOnLine(car, this._startingLines[0]);
            }
        }
    }

    private placeOnLine(car: Car, line: Mesh): void {
        const perpendicular: Vector3 = this.findPerpendicularVector(line.position);
        if (Math.random() * NUMBER_OF_LINE <= 1 && !line.userData.leftPositionTaken) {

            car.meshPosition = line.position;
            const direction: Vector3 = new Vector3(perpendicular.x * WIDTH / LINE_POSITION_FACTOR, 0,
                                                   perpendicular.y * WIDTH / LINE_POSITION_FACTOR);
            car.meshPosition = direction;
            line.userData.leftPositionTaken = true;

        } else if (!line.userData.rightPositionTaken) {

            car.meshPosition = line.position;
            const direction: Vector3 = new Vector3(-perpendicular.x * WIDTH / LINE_POSITION_FACTOR, 0,
                                                   -perpendicular.y * WIDTH / LINE_POSITION_FACTOR);
            car.meshPosition = direction;
            line.userData.rightPositionTaken = true;

        } else {

            car.meshPosition = line.position;
            const direction: Vector3 = new Vector3(perpendicular.x * WIDTH / LINE_POSITION_FACTOR, 0,
                                                   perpendicular.y * WIDTH / LINE_POSITION_FACTOR);
            car.meshPosition = direction;
            line.userData.leftPositionTaken = true;
        }
    }

    private findPerpendicularVector(vector: Vector3): Vector3 {
        const orthogonal: Vector3 = new Vector3(0, 0, 1);
        const perpendicular: Vector3 = new Vector3;
        perpendicular.crossVectors(vector, orthogonal);
        perpendicular.normalize();

        return perpendicular;
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
