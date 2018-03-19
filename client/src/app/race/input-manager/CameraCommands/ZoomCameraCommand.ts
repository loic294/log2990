import { RenderService } from "../../render-service/render.service";
import AbsCommand from "../AbsCommand";

export default class ZoomCameraCommand extends AbsCommand {
    public constructor(protected renderer: RenderService, protected isPositive: boolean) {
        super();
    }
    public subscribe(): void {
        this.renderer.zoom(this.isPositive);
    }
}
