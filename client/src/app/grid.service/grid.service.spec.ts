// tslint:disable:no-magic-numbers no-floating-promises
import { TestBed, async } from "@angular/core/testing";
import { Socket, SocketIoConfig } from "ng-socket-io";
import { WordService } from "../word.service/word.service";
import { SocketService } from "../socket.service/socket.service";
import { GridService } from "./grid.service";
import Word, { Orientation } from "../../../../common/lexical/word";
import { DifficultyService } from "./../difficulty.service/difficulty.service";

describe("GridService", () => {

    let service: GridService;
    const config: SocketIoConfig = { url: "http://localhost:4200", options: {} };

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        providers: [ SocketService, DifficultyService ]
      })
      .compileComponents();
    }));

    beforeEach(() => {
        service = new GridService(new WordService(), new SocketService(new Socket(config), new DifficultyService()));
    });

    it("'b' should be a letter", () => {
        expect(service.gridTools.isLetter("b")).toBe(true);
    });

    it("'B' should be a letter", () => {
        expect(service.gridTools.isLetter("B")).toBe(true);
    });

    it("'4' shouldn't be a letter", () => {
        expect(service.gridTools.isLetter("4")).toBe(false);
    });

    it("'{' shouldn't be a letter", () => {
        expect(service.gridTools.isLetter("{")).toBe(false);
    });

    it("Word 'hey' shoud be validated after entering 'hey'", () => {
        service.word = new Word("hey", "", [0, 0], Orientation.vertical, 0);
        const elem: HTMLElement = document.createElement("div");
        service.validateWord("hey", elem);
        expect(service.word.isValidated).toBe(true);
        expect(service.grid[0][0].validated).toBe(true);
        expect(service.grid[1][0].validated).toBe(true);
        expect(service.grid[2][0].validated).toBe(true);
    });

    it("Word 'hey' shoud not be validated after entering 'oop'", () => {
        service.word = new Word("hey", "", [0, 0], Orientation.vertical, 0);
        const elem: HTMLElement = document.createElement("div");

        service.validateWord("oop", elem);
        expect(service.word.isValidated).toBe(false);
        expect(service.grid[0][0].validated).toBe(false);
        expect(service.grid[1][0].validated).toBe(false);
        expect(service.grid[2][0].validated).toBe(false);
    });

});
