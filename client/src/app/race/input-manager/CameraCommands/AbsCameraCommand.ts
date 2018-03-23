import AbsCommand from "../AbsCommand";
import { CameraService } from "../../camera-service/camera.service";

export default abstract class AbsCameraCommand extends AbsCommand {
    public constructor(protected cameraService: CameraService) {
        super();

    }
}
