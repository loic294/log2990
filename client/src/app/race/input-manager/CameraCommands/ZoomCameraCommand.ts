import AbsCommand from "../AbsCommand";
import { CameraService } from "../../camera-service/camera.service";

export default class ZoomCameraCommand extends AbsCommand {
    public constructor(protected cameraService: CameraService, protected isPositive: boolean) {
        super();
    }
    public subscribe(): void {
        this.cameraService.zoom(this.isPositive);
    }
}
