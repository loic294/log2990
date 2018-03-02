import AbsCommand from "../AbsCommand";
import { RenderService } from "../../render-service/render.service";

export default abstract class AbsCameraCommand extends AbsCommand {
    public constructor(protected renderer: RenderService) {
        super();
    }
}
