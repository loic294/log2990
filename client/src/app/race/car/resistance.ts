import { Vector3 } from "three";
import { Car , MINIMUM_SPEED, NUMBER_REAR_WHEELS, NUMBER_WHEELS } from "../car/car";
import { GRAVITY } from "../../constants";

export class Resistance {

    public static getResultingForce(car: Car): Vector3 {
        const resultingForce: Vector3 = new Vector3();

        if (car.speed.length() >= MINIMUM_SPEED) {
            const dragForce: Vector3 = this.getDragForce(car);
            const rollingResistance: Vector3 = this.getRollingResistance(car);
            const latitudinalResistance: Vector3 = this.getLatitudinalResistance(car);
            resultingForce.add(latitudinalResistance);
            const direction: number = car.speed.dot(car.direction) / Math.abs(car.speed.dot(car.direction));
            resultingForce.add(dragForce.multiplyScalar(direction))
                .add(rollingResistance.multiplyScalar(direction));

        }
        if (car.isAcceleratorPressed) {
            const tractionForce: number = this.getTractionForce(car);
            const accelerationForce: Vector3 = car.direction;
            accelerationForce.multiplyScalar(tractionForce);
            resultingForce.add(accelerationForce);
        } else if (car.isBraking && car.isGoingForward()) {
            const brakeForce: Vector3 = car.getBrakeForce();
            resultingForce.add(brakeForce);
        } else if (car.isBraking && car.isGoingBackward()) {
            const brakeForce: Vector3 = car.getBrakeForce();
            resultingForce.sub(brakeForce);
        }

        return resultingForce;
    }

    private static getRollingResistance(car: Car): Vector3 {
        const tirePressure: number = 1;
        // formula taken from: https://www.engineeringtoolbox.com/rolling-friction-resistance-d_1303.html

        // tslint:disable-next-line:no-magic-numbers
        const rollingCoefficient: number = (1 / tirePressure) * (Math.pow(car.speed.length() * 3.6 / 100, 2) * 0.0095 + 0.01) + 0.005;

        return car.direction.multiplyScalar(rollingCoefficient * car.mass * GRAVITY);
    }

    private static getLatitudinalResistance(car: Car): Vector3 {
        const latitudinalCoefficient: number = 0.1;
        const latitude: Vector3 = car.direction.cross(car.up);
        const vLaterale: Vector3 = latitude.normalize().multiplyScalar(car.speed.dot(latitude));

        return vLaterale.multiplyScalar(latitudinalCoefficient * car.mass * GRAVITY);
    }

    private static getDragForce(car: Car): Vector3 {
        const carSurface: number = 3;
        const airDensity: number = 1.2;
        const resistance: Vector3 = car.direction;
        resistance.multiplyScalar(airDensity * carSurface * - car.dragCoefficient * car.speed.length() * car.speed.length());

        return resistance;
    }

    public static getTractionForce(car: Car): number {
        const force: number = car.getEngineForce();
        const maxForce: number =
            car.rearWheel.frictionCoefficient * car.mass * GRAVITY * car.weightRear * NUMBER_REAR_WHEELS / NUMBER_WHEELS;

        return -Math.min(force, maxForce);
    }
}
