import AbsCommand from "../AbsCommand";
import { EnvironmentService } from "../../environment-service/environment.service";

export default class ChangeModeCommand extends AbsCommand {
    public constructor(private environmentService: EnvironmentService) {
        super();
    }
    public subscribe(): void {
        this.environmentService.changeMode();
    }
}
