import { Injectable } from "@angular/core";
import AbsCommand from "./AbsCommand";
import AccelerateDownCarCommand from "./CarCommands/AccelerateDownCarCommand";
import AccelerateUpCarCommand from "./CarCommands/AccelerateUpCarCommand";
import LeftDownCarCommand from "./CarCommands/LeftDownCarCommand";
import RightDownCarCommand from "./CarCommands/RightDownCarCommand";
import BrakeDownCarCommand from "./CarCommands/BrakeDownCarCommand";
import ReleaseUpCarCommand from "./CarCommands/ReleaseUpCarCommand";
import BrakeUpCarCommand from "./CarCommands/BrakeUpCarCommand";
import ChangeCameraViewCommand from "./CameraCommands/ChangeCameraViewCommand";
import { RenderService } from "../render-service/render.service";

const ACCELERATE_KEYCODE: number = 87;  // w
const LEFT_KEYCODE: number = 65;        // a
const BRAKE_KEYCODE: number = 83;       // s
const RIGHT_KEYCODE: number = 68;       // d
const CHANGE_VIEW_KEYCODE: number = 81; // q

interface CommandKeyDict {
    command: AbsCommand;
    keyCode: number;
}

export enum Release {
    Up = 0,
    Down = 1
}

@Injectable()
export default class InputManagerService {

    private keyDownCommands: CommandKeyDict[];
    private keyUpCommands: CommandKeyDict[];

    public init(renderer: RenderService): void {
        this.keyDownCommands = [
            {keyCode: ACCELERATE_KEYCODE, command: new AccelerateDownCarCommand(renderer.car)},
            {keyCode: LEFT_KEYCODE, command: new LeftDownCarCommand(renderer.car)},
            {keyCode: RIGHT_KEYCODE, command: new RightDownCarCommand(renderer.car)},
            {keyCode: BRAKE_KEYCODE, command: new BrakeDownCarCommand(renderer.car)},
            {keyCode: CHANGE_VIEW_KEYCODE, command: new ChangeCameraViewCommand(renderer)}
        ];

        this.keyUpCommands = [
            {keyCode: ACCELERATE_KEYCODE, command: new AccelerateUpCarCommand(renderer.car)},
            {keyCode: LEFT_KEYCODE, command: new ReleaseUpCarCommand(renderer.car)},
            {keyCode: RIGHT_KEYCODE, command: new ReleaseUpCarCommand(renderer.car)},
            {keyCode: BRAKE_KEYCODE, command: new BrakeUpCarCommand(renderer.car)}
        ];
    }

    public handleKey(event: KeyboardEvent, release: Release): void {
        const command: CommandKeyDict = this.assignProperCommandKeyDict(release).find( (cmd: CommandKeyDict) => {
            return cmd.keyCode === event.keyCode;
        });
        if (command) {
            command.command.subscribe();
        }
    }

    private assignProperCommandKeyDict(release: Release): CommandKeyDict[] {
        return (release ? this.keyDownCommands : this.keyUpCommands);
    }
}
