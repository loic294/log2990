import { Vector3 } from "three";
import { GRAVITY, MINIMUM_SPEED, NUMBER_REAR_WHEELS, NUMBER_WHEELS } from "../../constants";

const LATITUDINAL_COEFFICIENT: number = 0.3;

export interface IResistanceParameters {
    speed: Vector3;
    direction: Vector3;
    isGoingForward: boolean;
    isGoingBackward: boolean;
    isBraking: boolean;
    isAcceleratorPressed: boolean;
    brakeForce: Vector3;
    up: Vector3;
    mass: number;
    weightRear: number;
    frictionCoefficient: number;
    engineForce: number;
    dragCoefficient: number;
}

export class Resistance {

    public static getResultingForce(parameters: IResistanceParameters, dir: Vector3): Vector3 {
        const resultingForce: Vector3 = new Vector3();

        if (parameters.speed.length() >= MINIMUM_SPEED) {
            const dragForce: Vector3 = this.getDragForce(parameters);
            const rollingResistance: Vector3 = this.getRollingResistance(parameters);
            const latitudinalResistance: Vector3 = this.getLatitudinalResistance(parameters);
            resultingForce.add(latitudinalResistance);
            const direction: number = parameters.speed.dot(dir) / Math.abs(parameters.speed.dot(dir));
            resultingForce.add(dragForce.multiplyScalar(direction))
                .add(rollingResistance.multiplyScalar(direction));
        }
        if (parameters.isAcceleratorPressed) {
            const tractionForce: number = this.getTractionForce(parameters);
            const accelerationForce: Vector3 = dir;
            accelerationForce.multiplyScalar(tractionForce);
            resultingForce.add(accelerationForce);
        } else if (parameters.isBraking && parameters.isGoingForward) {
            const brakeForce: Vector3 = parameters.brakeForce;
            resultingForce.add(brakeForce);
        } else if (parameters.isBraking && parameters.isGoingBackward) {
            const brakeForce: Vector3 = parameters.brakeForce;
            resultingForce.sub(brakeForce);
        }

        return resultingForce;
    }

    private static getRollingResistance(parameters: IResistanceParameters): Vector3 {
        const tirePressure: number = 1;
        // formula taken from: https://www.engineeringtoolbox.com/rolling-friction-resistance-d_1303.html

        // tslint:disable-next-line:no-magic-numbers
        const rollCoefficient: number = (1 / tirePressure) * (Math.pow(parameters.speed.length() * 3.6 / 100, 2) * 0.0095 + 0.01) + 0.005;

        return parameters.direction.multiplyScalar(rollCoefficient * parameters.mass * GRAVITY);
    }

    private static getLatitudinalResistance(parameters: IResistanceParameters): Vector3 {
        const latitude: Vector3 = parameters.direction.cross(parameters.up);
        const vLaterale: Vector3 = latitude.normalize().multiplyScalar(parameters.speed.dot(latitude));

        return vLaterale.multiplyScalar(LATITUDINAL_COEFFICIENT * parameters.mass * GRAVITY);
    }

    private static getDragForce(parameters: IResistanceParameters): Vector3 {
        const carSurface: number = 3;
        const airDensity: number = 1.2;
        const resistance: Vector3 = parameters.direction;
        resistance.multiplyScalar(airDensity * carSurface * -
            parameters.dragCoefficient * parameters.speed.length() * parameters.speed.length());

        return resistance;
    }

    public static getTractionForce(parameters: IResistanceParameters): number {
        const force: number = parameters.engineForce;
        const maxForce: number =
        parameters.frictionCoefficient * parameters.mass * GRAVITY * parameters.weightRear * NUMBER_REAR_WHEELS / NUMBER_WHEELS;

        return -Math.min(force, maxForce);
    }
}
