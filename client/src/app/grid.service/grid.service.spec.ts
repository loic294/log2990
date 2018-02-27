import { TestBed, inject, async } from "@angular/core/testing";
import { Socket, SocketIoConfig } from "ng-socket-io";
import { WordService } from "../word.service/word.service";
import { SocketService } from "../socket.service/socket.service";
import { GridService } from "./grid.service";
import Word, { Orientation } from "../../../../common/lexical/word";

describe("GridService", () => {

    let service: GridService;
    const config: SocketIoConfig = { url: "http://localhost:4200", options: {} };

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        providers: [ SocketService ]
      })
      .compileComponents();
    }));

    beforeEach(() => {
        service = new GridService(new WordService(), new SocketService(new Socket(config)));
    });

    it("'b' should be a letter", () => {
        expect(service.isLetter("b")).toBe(true);
    });

    it("'B' should be a letter", () => {
        expect(service.isLetter("B")).toBe(true);
    });

    it("'4' shouldn't be a letter", () => {
        expect(service.isLetter("4")).toBe(false);
    });

    it("'{' shouldn't be a letter", () => {
        expect(service.isLetter("{")).toBe(false);
    });

    it("Word clue shoud be validated after entering 'clue'", () => {
        service.word = new Word("clue", "", [0, 0], Orientation.vertical, 0);
        const elem: HTMLElement = document.createElement("div");
        service.validateWord("clue", elem);
        expect(service.word.isValidated).toBe(true);

    });

    it("Word clue shoud not be validated after entering 'oops'", () => {
        service.word = new Word("clue", "", [0, 0], Orientation.vertical, 0);
        const elem: HTMLElement = document.createElement("div");

        service.validateWord("oops", elem);
        expect(service.word.isValidated).toBe(false);

    });

});
