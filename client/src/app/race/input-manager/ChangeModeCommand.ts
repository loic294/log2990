import AbsCommand from "./AbsCommand";
import { EnvironmentService } from "./../environment-service/environment.service";
import { RenderService } from "./../render-service/render.service";

export default class ChangeModeCommand extends AbsCommand {
    public constructor(private _environmentService: EnvironmentService, private _renderService: RenderService) {
        super();
    }
    public subscribe(): void {
        this._environmentService.changeMode();
        this._renderService.changeLightState(this._environmentService.mode);
    }
}
