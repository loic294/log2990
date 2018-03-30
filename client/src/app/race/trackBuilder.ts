import {
    Vector3, MeshBasicMaterial, Mesh, Object3D,
    PlaneGeometry, DoubleSide, CircleGeometry, Texture, TextureLoader
} from "three";
import { LineSegment } from "./DotCommand";
import { PI_OVER_2 } from "../constants";
import { Car } from "./car/car";

const WIDTH: number = 10;
const CIRCLE_SEGMENTS: number = 32;
const PLANE_COLOR: number = 0x0055FF;
const OFFSET_FACTOR: number = -0.1;
const DISTANCE_FACTOR: number = 1.5;
const NUMBER_OF_LINE: number = 2;

export class TrackBuilder {
    private _circleGeometry: CircleGeometry;
    private _material: MeshBasicMaterial;
    private _startingLines: Array<Mesh>;

    public constructor(private _scene: THREE.Scene, private _vertice: Array<Object3D>, private _edges: Array<LineSegment>,
                       private _playerCar: Car, private _botCars: Array<Car>) {
        this._circleGeometry = new CircleGeometry(WIDTH / 2, CIRCLE_SEGMENTS);
        this._material = new MeshBasicMaterial({ color: PLANE_COLOR, side: DoubleSide });
        this._startingLines = new Array();
    }

    public buildTrack(): void {
        let lastVertex: Vector3 = this._vertice[this._vertice.length - 1].position;

        for (const vertex of this._vertice) {

            this.replaceSphere(vertex);

            this.placePlane(lastVertex, vertex.position);

            lastVertex = vertex.position;
        }

        this.removeLines();
        this.placeStartingLines();
        this.positionRacers();

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
        this._startingLines.push(firstLine);
        this._scene.add(firstLine);

        secondLine.rotateX(PI_OVER_2);
        secondLine.translateOnAxis(translationDirection, WIDTH * DISTANCE_FACTOR);
        this._startingLines.push(secondLine);
        this._scene.add(secondLine);
    }

    private positionRacers(): void {

        let spotsOnFirstLine: number = 2;
        let spotsOnSecondLine: number = 2;

        if (Math.random() % NUMBER_OF_LINE === 0) {
            this.placeOnFirstLine(this._playerCar);
            spotsOnFirstLine--;
        } else {
            this.placeOnSecondLine(this._playerCar);
            spotsOnSecondLine--;
        }

        for (const car of this._botCars) {
            if (Math.random() % NUMBER_OF_LINE === 0 && spotsOnFirstLine !== 0) {
                this.placeOnFirstLine(car);
                spotsOnFirstLine--;
            } else if (spotsOnSecondLine !== 0) {
                this.placeOnSecondLine(car);
                spotsOnSecondLine--;
            } else {
                this.placeOnFirstLine(car);
            }
        }
    }

    private placeOnFirstLine(car: Car): void {
        car.meshPosition = this._startingLines[0].position;
    }

    private placeOnSecondLine(car: Car): void {
        car.meshPosition = this._startingLines[1].position;
    }

    public get vertices(): Array<Object3D> {
        return this._vertice;
    }

    public set vertices(vertices: Array<Object3D>) {
        this._vertice = vertices;
    }
}
