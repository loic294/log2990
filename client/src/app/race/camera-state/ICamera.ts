import { RenderService } from "../render-service/render.service";
import { Vector3 } from "three";

export default interface ICamera {
    follow(renderer: RenderService, carMeshPosition: Vector3): void;
}
