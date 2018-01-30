import { WordGenerator } from './word-generator';
import {Case} from './case'
import {expect} from 'chai'
import { GridGenerator } from './grid-generator';

const assert = require('assert');


describe('Words', () => {
    let testWords: WordGenerator;
    let testArray: Case[][];
    let expectedLengthArray: number[];

    it("should know the size of all the different words required.", () =>{
        testWords = new WordGenerator();

        testArray = [
            [new Case(), new Case(), new Case()],
            [new Case(), new Case(), new Case()],
            [new Case(), new Case(), new Case()],
          ];

        testArray[0][2].setBlack(true);
        testArray[1][1].setBlack(true);

        testWords.findWordLength(testArray);

        expectedLengthArray = [3 , 1 , 1 , 0 , 2];

        expect(testWords.getVerticalWordLength()).to.be.eql(expectedLengthArray);

        expectedLengthArray = [2 , 1 , 1 , 3];

        expect(testWords.getHorizontalWordLength()).to.be.eql(expectedLengthArray);

    });

    it('should know the size of all the different words required.');
    
    it('should be able to find a word of the correct size from an outside lexical.');
    
    it('should find all the correct words from a lexical.');

});