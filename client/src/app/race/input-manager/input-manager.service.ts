import { Car } from "../car/car";
import { Injectable } from "@angular/core";
import AbsCommand from "./AbsCommand";
import AccelerateDownCarCommand from "./CarCommands/AccelerateDownCarCommand";
import AccelerateUpCarCommand from "./CarCommands/AccelerateUpCarCommand";
import LeftDownCarCommand from "./CarCommands/LeftDownCarCommand";
import RightDownCarCommand from "./CarCommands/RightDownCarCommand";
import BrakeDownCarCommand from "./CarCommands/BrakeDownCarCommand";
import ReleaseUpCarCommand from "./CarCommands/ReleaseUpCarCommand";
import BrakeUpCarCommand from "./CarCommands/BrakeUpCarCommand";

const ACCELERATE_KEYCODE: number = 87;  // w
const LEFT_KEYCODE: number = 65;        // a
const BRAKE_KEYCODE: number = 83;       // s
const RIGHT_KEYCODE: number = 68;       // d

interface CommandKeyDict {
    command: AbsCommand;
    keyCode: number;
}

@Injectable()
export default class InputManagerService {

    private keyDownCommands: CommandKeyDict[];
    private keyUpCommands: CommandKeyDict[];

    public init(car: Car): void {
        this.keyDownCommands = [
            {keyCode: ACCELERATE_KEYCODE, command: new AccelerateDownCarCommand(car)},
            {keyCode: LEFT_KEYCODE, command: new LeftDownCarCommand(car)},
            {keyCode: RIGHT_KEYCODE, command: new RightDownCarCommand(car)},
            {keyCode: BRAKE_KEYCODE, command: new BrakeDownCarCommand(car)}
        ];

        this.keyUpCommands = [
            {keyCode: ACCELERATE_KEYCODE, command: new AccelerateUpCarCommand(car)},
            {keyCode: LEFT_KEYCODE, command: new ReleaseUpCarCommand(car)},
            {keyCode: RIGHT_KEYCODE, command: new ReleaseUpCarCommand(car)},
            {keyCode: BRAKE_KEYCODE, command: new BrakeUpCarCommand(car)}
        ];
    }

    public handleKeyDown(event: KeyboardEvent): void {
        const command: CommandKeyDict = this.keyDownCommands.find( (cmd: CommandKeyDict) => {
            return cmd.keyCode === event.keyCode;
        });
        if (command) {
            command.command.subscribe();
        }
    }

    public handleKeyUp(event: KeyboardEvent): void {
        const command: CommandKeyDict = this.keyUpCommands.find( (cmd: CommandKeyDict) => {
            return cmd.keyCode === event.keyCode;
        });
        if (command) {
            command.command.subscribe();
        }
    }
}
