import ICamera from "./ICamera";
import { Vector3 } from "three";
import { RenderService } from "../render-service/render.service";

export default class ThirdPersonCamera implements ICamera {
    public follow(renderer: RenderService, carMeshPosition: Vector3): void {
    }
}