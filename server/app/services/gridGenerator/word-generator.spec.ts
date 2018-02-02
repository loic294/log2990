import WordGenerator from './word-generator';
import {Case} from './case'
import Word, { Orientation } from "../../../../common/lexical/word";
import {expect} from 'chai'

const assert = require('assert');


describe('Words', () => {
    let testWords: WordGenerator;
    let testArray: Case[][];
    let expectedLengthArray: number[];
    let expectedWordArray: Word[];

    it("should know the size of all the different words required.", () =>{
        testWords = new WordGenerator();

        testArray = [
            [new Case(), new Case(), new Case()],
            [new Case(), new Case(), new Case()],
            [new Case(), new Case(), new Case()],
          ];

        testArray[0][2].setBlack(true);
        testArray[1][1].setBlack(true);

        testWords.testWordLength(testArray);

        expectedLengthArray = [3 , 1 , 1 , 0 , 2];

        expect(testWords.getVerticalWordLength()).to.be.eql(expectedLengthArray);

        expectedLengthArray = [2 , 1 , 1 , 3];

        expect(testWords.getHorizontalWordLength()).to.be.eql(expectedLengthArray);

    });

    it("should know the initial positions of all the words.", () =>{
        testWords =  new WordGenerator();

        testArray = [
            [new Case(), new Case(), new Case()],
            [new Case(), new Case(), new Case()],
            [new Case(), new Case(), new Case()],
          ];

        testArray[0][2].setBlack(true);
        testArray[1][1].setBlack(true);

        testWords.testWordLength(testArray);
        testWords.testWordPosition(testArray);

        expectedWordArray = [
            new Word("", "", [0, 0], Orientation.horizontal, 0),
            new Word("", "", [0, 0], Orientation.vertical, 0),
            new Word("", "", [0, 2], Orientation.horizontal, 0),
            new Word("", "", [2, 1], Orientation.vertical, 0),
        ];

        for(let index = 0; index < testArray.length; index++){
            expect(testWords.wordArray[index].position, "This is the actual direction "+testWords.wordArray[index].direction + " and this is the expected direction "+expectedWordArray[index].direction).to.be.eql(expectedWordArray[index].position);
        }
        
    });
    
    it('should be able to find a word of the correct size from an outside lexical.');
    
    it('should find all the correct words from a lexical.');

});