// tslint:disable:no-magic-numbers no-floating-promises
import { TestBed, async } from "@angular/core/testing";
import { Socket, SocketIoConfig } from "ng-socket-io";
import { WordService } from "../word.service/word.service";
import { SocketService } from "../socket.service/socket.service";
import { GridService } from "./grid.service";
import Word, { Orientation } from "../../../../common/lexical/word";
import { DifficultyService } from "./../difficulty.service/difficulty.service";
import { GridLoadingService } from "../grid-loading.service/grid-loaing.service";

describe("GridService", () => {

    let gridService: GridService;
    const config: SocketIoConfig = { url: "http://localhost:4200", options: {} };
    let socketService: SocketService;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        providers: [ SocketService, DifficultyService, GridLoadingService ]
      })
      .compileComponents();
    }));

    beforeEach(() => {
        socketService = new SocketService(new Socket(config), new DifficultyService(), new GridLoadingService());
        gridService = new GridService(
            new WordService(),
            new SocketService(new Socket(config), new DifficultyService(), new GridLoadingService()),
            new GridLoadingService()
        );
    });

    it("'b' should be a letter", () => {
        expect(gridService.gridTools.isLetter("b")).toBe(true);
    });

    it("'B' should be a letter", () => {
        expect(gridService.gridTools.isLetter("B")).toBe(true);
    });

    it("'4' shouldn't be a letter", () => {
        expect(gridService.gridTools.isLetter("4")).toBe(false);
    });

    it("'{' shouldn't be a letter", () => {
        expect(gridService.gridTools.isLetter("{")).toBe(false);
    });

    it("Word 'hey' should be validated after entering 'hey'", () => {
        gridService.word = new Word("hey", "", [0, 0], Orientation.horizontal, 0);
        const elem: HTMLElement = document.createElement("div");
        gridService.validateWord("hey", elem);
        expect(gridService.word.isValidated).toBe(true);
        expect(gridService.grid[0][0].validated).toBe(true);
        expect(gridService.grid[0][1].validated).toBe(true);
        expect(gridService.grid[0][2].validated).toBe(true);
    });

    it("Word 'hey' should not be validated after entering 'oop'", () => {
        gridService.word = new Word("hey", "", [0, 0], Orientation.vertical, 0);
        const elem: HTMLElement = document.createElement("div");

        gridService.validateWord("oop", elem);
        expect(gridService.word.isValidated).toBe(false);
        expect(gridService.grid[0][0].validated).toBe(false);
        expect(gridService.grid[1][0].validated).toBe(false);
        expect(gridService.grid[2][0].validated).toBe(false);
    });

    describe("Two player game", () => {
        it("player should see that other player selected 'word' from the grid but is not validated", () => {
            const otherWord: Word = gridService.word = new Word("word", "", [0, 0], Orientation.horizontal, 0);

            gridService.selectOtherPlayerWord(otherWord);

            expect(gridService.grid[0][0].isOtherPlayer).toBeTruthy();
            expect(gridService.grid[0][1].isOtherPlayer).toBeTruthy();
            expect(gridService.grid[0][2].isOtherPlayer).toBeTruthy();
            expect(gridService.grid[0][3].isOtherPlayer).toBeTruthy();

            expect(gridService.word.isValidated).toBeFalsy();
        });

        it("validated word 'test' should increment userscore'", () => {
            let userScore: number = socketService.userScoreCount();

            gridService.word = new Word("test", "", [0, 0], Orientation.horizontal, 0);
            const elem: HTMLElement = document.createElement("div");

            gridService.validateWord("test", elem);

            expect(socketService.userScoreCount()).toEqual(userScore++);

        });

        it("other player validated word 'other' should increment opponentScore'", () => {
            let opponentScore: number = socketService.opponentScoreCount();

            gridService.word = new Word("other", "", [0, 0], Orientation.horizontal, 0);
            const elem: HTMLElement = document.createElement("div");

            gridService.validateWord("other", elem);

            expect(socketService.opponentScoreCount()).toEqual(opponentScore++);

        });

        it("player should see validated word 'test' of other player", () => {
            const isOther: boolean = true;
            const wordFromOther: Word =  gridService.word = new Word("test", "", [0, 0], Orientation.horizontal, 0);

            gridService.applyValidation(wordFromOther, isOther);

            expect(gridService.grid[0][0].validatedByOther).toBe(true);
            expect(gridService.grid[0][1].validatedByOther).toBe(true);
            expect(gridService.grid[0][2].validatedByOther).toBe(true);
            expect(gridService.grid[0][3].validatedByOther).toBe(true);
        });

        it("should highlight other player's current selection in a different color", () => {

        });
    });

});
