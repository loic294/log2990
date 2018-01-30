import {Case} from './case'
import {CaseWithPos} from './case-with-pos'
import {expect} from 'chai'

describe('CaseWithPos', () => {

    testCaseWithPos : CaseWithPos;

    it('should use its inherited methods.', ()=>{
        let testCaseWithPos = new CaseWithPos(new Case(), 0, 0);

        expect(testCaseWithPos.getLetter()).to.be.equal("");
        expect(testCaseWithPos.getCol()).to.be.equal(0);
    });

    it('should add a position and cast a Case object', () => {
        let testCase : Case = new Case();
        let testCaseWithPos = new CaseWithPos(testCase, 10 , 10);

        expect(testCaseWithPos.getCol()).to.be.equal(10);
    });
});