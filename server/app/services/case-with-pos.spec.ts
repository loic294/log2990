import {Case} from './case'
import {CaseWithPos} from './case-with-pos'
import {expect} from 'chai'

describe('CaseWithPos', () => {

    testCaseWithPos : CaseWithPos;

    it('should use its inherited methods.', ()=>{
        let testCaseWithPos = new CaseWithPos(0,0);

        expect(testCaseWithPos.getLetter()).to.be.equal("");
        expect(testCaseWithPos.getCol()).to.be.equal(0);
    });

    it('should cast a Case object correctly.', ()=>{
        let testCase : Case = new Case();
        let testCaseWithPos = new CaseWithPos(0,0);
        
        testCase.setBlack(true);
        testCaseWithPos = testCase as CaseWithPos;

        expect(testCaseWithPos.isBlack()).to.be.equal(testCase.isBlack());
    });
});