import { TestBed } from "@angular/core/testing";

import { GridService } from "./grid.service";
// import { WordService } from "../word.service/word.service";
// import Word, { Orientation } from "../../../../common/lexical/word";

describe("GridService", () => {
    // const service: GridService = new GridService(new WordService());
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GridService]
        });
    });

    /*it("should be a letter", () => {
        let letter: string = "b";
        expect(service.isLetter(letter)).toBe(true);

        letter = "e";
        expect(service.isLetter(letter)).toBe(true);

        letter = "o";
        expect(service.isLetter(letter)).toBe(true);

        letter = "D";
        expect(service.isLetter(letter)).toBe(true);

        letter = "L";
        expect(service.isLetter(letter)).toBe(true);
    });*/

    /*it("shouldn't be a letter", () => {
        let letter: string = "4";
        expect(service.isLetter(letter)).toBe(false);

        letter = "^";
        expect(service.isLetter(letter)).toBe(false);

        letter = "ç";
        expect(service.isLetter(letter)).toBe(false);

        letter = "à";
        expect(service.isLetter(letter)).toBe(false);

        letter = ";";
        expect(service.isLetter(letter)).toBe(false);

        letter = "?";
        expect(service.isLetter(letter)).toBe(false);

        letter = "#";
        expect(service.isLetter(letter)).toBe(false);
    });
/*
    it("Word shoud be validated", () => {
        const word: string = "clue";
        service.word = new Word("clue", "", [0, 0], Orientation.vertical, 0);
        expect(service.word.isValidated).toBe(false);
        const elem: HTMLElement = document.getElementById("16");
        service.validateWord(word, elem);
        expect(service.word.isValidated).toBe(true);
    });

    it("Word shoud not be validated", () => {
        let word: string = "oops";
        service.word = new Word("clue", "", [0, 0], Orientation.vertical, 0);
        expect(service.word.isValidated).toBe(false);
        const elem: HTMLElement = document.getElementById("16");

        service.validateWord(word, elem);
        expect(service.word.isValidated).toBe(false);

        word = "cluue";
        service.validateWord(word, elem);
        expect(service.word.isValidated).toBe(false);
    });
*/
});
