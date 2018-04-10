import { Vector3, Matrix4, Object3D, ObjectLoader, Euler, Quaternion, Box3, PositionalAudio } from "three";
import { Engine, DEFAULT_SHIFT_RPM } from "./engine";
import { MS_TO_SECONDS, GRAVITY, PI_OVER_2, RAD_TO_DEG } from "../../constants";
import { Wheel } from "./wheel";
import { Resistance } from "./resistance";
import HeadlightsManager from "./headlights";

export const DEFAULT_WHEELBASE: number = 2.78;
export const DEFAULT_MASS: number = 1515;
export const DEFAULT_DRAG_COEFFICIENT: number = 0.35;

const MAXIMUM_STEERING_ANGLE: number = 0.25;
const INITIAL_MODEL_ROTATION: Euler = new Euler(0, PI_OVER_2, 0);
const INITIAL_WEIGHT_DISTRIBUTION: number = 0.5;
export const MINIMUM_SPEED: number = 0.05;
export const NUMBER_REAR_WHEELS: number = 2;
export const NUMBER_WHEELS: number = 4;

export class Car extends Object3D {
    public isAcceleratorPressed: boolean;

    private readonly engine: Engine;
    private readonly _mass: number;
    private readonly _rearWheel: Wheel;
    private readonly wheelbase: number;
    private readonly _dragCoefficient: number;

    private _speed: Vector3;
    private _isBraking: boolean;
    private _mesh: Object3D;
    private steeringWheelDirection: number;
    private _weightRear: number;
    private _boundingBox: Box3;
    private _sound: PositionalAudio;
    private _headlightsManager: HeadlightsManager;

    public constructor(
        engine: Engine = new Engine(),
        rearWheel: Wheel = new Wheel(),
        wheelbase: number = DEFAULT_WHEELBASE,
        mass: number = DEFAULT_MASS,
        dragCoefficient: number = DEFAULT_DRAG_COEFFICIENT) {
        super();

        if (wheelbase <= 0) {
            console.error("Wheelbase should be greater than 0.");
            wheelbase = DEFAULT_WHEELBASE;
        }
        if (mass <= 0) {
            console.error("Mass should be greater than 0.");
            mass = DEFAULT_MASS;
        }
        if (dragCoefficient <= 0) {
            console.error("Drag coefficient should be greater than 0.");
            dragCoefficient = DEFAULT_DRAG_COEFFICIENT;
        }

        this.engine = engine;
        this._rearWheel = rearWheel;
        this.wheelbase = wheelbase;
        this._mass = mass;
        this._dragCoefficient = dragCoefficient;

        this._isBraking = false;
        this.steeringWheelDirection = 0;
        this._weightRear = INITIAL_WEIGHT_DISTRIBUTION;
        this._speed = new Vector3(0, 0, 0);

        this._boundingBox = new Box3().setFromObject(this);
    }

    public get headlightsManager(): HeadlightsManager {
        return this._headlightsManager;
    }

    public get speed(): Vector3 {
        return this._speed.clone();
    }

    public set speed(speed: Vector3) {
        this._speed = speed;
    }

    public get currentGear(): number {
        return this.engine.currentGear;
    }

    public get rpm(): number {
        return this.engine.rpm;
    }

    public get angle(): number {
        return this._mesh.rotation.y * RAD_TO_DEG;
    }

    public get mesh(): Object3D {
        return this._mesh;
    }

    public get direction(): Vector3 {
        const rotationMatrix: Matrix4 = new Matrix4();
        const carDirection: Vector3 = new Vector3(0, 0, -1);

        rotationMatrix.extractRotation(this._mesh.matrix);
        carDirection.applyMatrix4(rotationMatrix);

        return carDirection;
    }

    public get meshPosition(): Vector3 {
        return this._mesh.position;
    }

    public set meshPosition(position: Vector3) {
        this._mesh.position.add(position);
    }

    public get boundingBox(): Box3 {
        return this._boundingBox;
    }

    private async load(): Promise<Object3D> {
        return new Promise<Object3D>((resolve, reject) => {
            const loader: ObjectLoader = new ObjectLoader();
            loader.load("../../assets/camero/camero-2010-low-poly.json", (object) => {
                resolve(object);
            });
        });
    }

    public async init(): Promise<void> {
        this._mesh = await this.load();
        this._mesh.setRotationFromEuler(INITIAL_MODEL_ROTATION);
        this._headlightsManager = new HeadlightsManager();
        this._mesh.add(this._headlightsManager);
        this.add(this._mesh);
    }

    public steerLeft(): void {
        this.steeringWheelDirection = MAXIMUM_STEERING_ANGLE;
    }

    public steerRight(): void {
        this.steeringWheelDirection = -MAXIMUM_STEERING_ANGLE;
    }

    public releaseSteering(): void {
        this.steeringWheelDirection = 0;
    }

    public releaseBrakes(): void {
        this._isBraking = false;
    }

    public brake(): void {
        this._isBraking = true;
    }

    public get isBraking(): boolean {
        return this._isBraking;
    }

    public get mass(): number {
        return this._mass;
    }

    public get dragCoefficient(): number {
        return this._dragCoefficient;
    }

    public get rearWheel(): Wheel {
        return this._rearWheel;
    }

    public get weightRear(): number {
        return this._weightRear;
    }

    public update(deltaTime: number): void {
        deltaTime = deltaTime / MS_TO_SECONDS;

        // Move to car coordinates
        const rotationMatrix: Matrix4 = new Matrix4();
        rotationMatrix.extractRotation(this._mesh.matrix);
        const rotationQuaternion: Quaternion = new Quaternion();
        rotationQuaternion.setFromRotationMatrix(rotationMatrix);
        this._speed.applyMatrix4(rotationMatrix);

        // Physics calculations
        this.physicsUpdate(deltaTime);

        // Move back to world coordinates
        this._speed = this.speed.applyQuaternion(rotationQuaternion.inverse());

        // Angular rotation of the car
        const R: number = DEFAULT_WHEELBASE / Math.sin(this.steeringWheelDirection * deltaTime);
        const omega: number = this._speed.length() / R;
        this._mesh.rotateY(omega);
        this._boundingBox.setFromObject(this._mesh);
        try {
            this.updateSound();
        } catch (error) {
            console.error(error);
        }

    }

    private physicsUpdate(deltaTime: number): void {
        this._rearWheel.angularVelocity += this.getAngularAcceleration() * deltaTime;
        this.engine.update(this._speed.length(), this._rearWheel.radius);
        this._weightRear = this.getWeightDistribution();
        this._speed.add(this.getDeltaSpeed(deltaTime));
        this._speed.setLength(this._speed.length() <= MINIMUM_SPEED ? 0 : this._speed.length());
        this._mesh.position.add(this.getDeltaPosition(deltaTime));
        this.rearWheel.update(this._speed.length());
    }

    private getWeightDistribution(): number {
        const acceleration: number = this.getAcceleration().length();
        /* tslint:disable:no-magic-numbers */
        const distribution: number =
            this._mass + (1 / this.wheelbase) * this._mass * acceleration / 2;

        return Math.min(Math.max(0.25, distribution), 0.75);
        /* tslint:enable:no-magic-numbers */
    }

    private getAngularAcceleration(): number {
        return this.getTotalTorque() / (this._rearWheel.inertia * NUMBER_REAR_WHEELS);
    }

    public getBrakeForce(): Vector3 {
        return this.direction.multiplyScalar(this._rearWheel.frictionCoefficient * this._mass * GRAVITY);
    }

    private getBrakeTorque(): number {
        return this.getBrakeForce().length() * this._rearWheel.radius;
    }

    private getTractionTorque(): number {
        return Resistance.getTractionForce(this) * this._rearWheel.radius;
    }

    private getTotalTorque(): number {
        return this.getTractionTorque() * NUMBER_REAR_WHEELS + this.getBrakeTorque();
    }

    public getEngineForce(): number {
        return this.engine.getDriveTorque() / this._rearWheel.radius;
    }

    private getAcceleration(): Vector3 {
        return Resistance.getResultingForce(this).divideScalar(this._mass);
    }

    private getDeltaSpeed(deltaTime: number): Vector3 {
        return this.getAcceleration().multiplyScalar(deltaTime);
    }

    private getDeltaPosition(deltaTime: number): Vector3 {
        return this.speed.multiplyScalar(deltaTime);
    }

    public isGoingForward(): boolean {
        // tslint:disable-next-line:no-magic-numbers
        return this.speed.normalize().dot(this.direction) > 0.05;
    }

    private updateSound(): void {
        this._sound.setPlaybackRate(this.rpm / (DEFAULT_SHIFT_RPM / 2));
    }

    public getMass(): number {
        return this._mass;
    }

    public set sound(engineSound: PositionalAudio) {
        this._sound = engineSound;
        this._mesh.add(this._sound);
    }

    public toogleLight(): void {
        this.headlightsManager.toogleLight();
    }
// tslint:disable-next-line:max-file-line-count
}
