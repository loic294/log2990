import AbsCommand from "./AbsCommand";
import { RenderService } from "./../render-service/render.service";

export default class ChangeLightStateCommand extends AbsCommand {
    public constructor(private _renderService: RenderService) {
        super();
    }
    public subscribe(): void {
        this._renderService.changeLightState();
    }
}
