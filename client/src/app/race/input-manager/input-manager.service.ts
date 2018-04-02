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
import ZoomCameraCommand from "./CameraCommands/ZoomCameraCommand";
import ChangeModeCommand from "./EnvironmentCommands/ChangeModeCommand";

const ACCELERATE_KEYCODE: number = 87;  // w
const LEFT_KEYCODE: number = 65;        // a
const BRAKE_KEYCODE: number = 83;       // s
const RIGHT_KEYCODE: number = 68;       // d
const CHANGE_VIEW_KEYCODE: number = 67; // c
const CHANGE_ENVIRONMENT: number = 77;  // m
const ZOOM_IN: number = 187; // = (+)
const ZOOM_OUT: number = 189; // -

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
            {keyCode: CHANGE_VIEW_KEYCODE, command: new ChangeCameraViewCommand(renderer.cameraService)},
            {keyCode: ZOOM_IN, command: new ZoomCameraCommand(renderer.cameraService, true)},
            {keyCode: ZOOM_OUT, command: new ZoomCameraCommand(renderer.cameraService, false)},
            {keyCode: CHANGE_ENVIRONMENT, command: new ChangeModeCommand(renderer.environmentService)}

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
