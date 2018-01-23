import {Case} from './case'
import {expect} from 'chai';

describe('Case', () => {

  let testCase : Case = new Case();

  it('should have working getters.', () => {
    expect(testCase.getLetter()).to.equal("");
    expect(testCase.isBlack()).to.equal(false);
    expect(testCase.isSelected()).to.equal(false);
  })

  it('should have working setters.', () => {
    testCase.setLetter("a");
    testCase.setBlack(true);
    testCase.setSelected(true);
    
    expect(testCase.getLetter()).to.equal("a");
    expect(testCase.isBlack()).to.equal(true);
    expect(testCase.isSelected()).to.equal(true);
  })

  
});

