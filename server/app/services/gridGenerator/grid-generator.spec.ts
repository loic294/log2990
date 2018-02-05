import GridGenerator from './grid-generator';
import { Case } from "../../../../common/grid/case";
import {expect} from 'chai'

const assert = require('assert');


describe('GenerationGrille', () => {
  let expectedTestArray : Array<Array<Case>>;
  let actualTestArray : Array<Array<Case>>;
  let testAmntOfBlacks : number = 0;
  let generationGrille : GridGenerator = new GridGenerator();

  it('should create a 10x10 empty array of cases', () => {
    actualTestArray = generationGrille.createEmptyGrille();
    expectedTestArray = [
      [new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case(),new Case()],
    ]

    expect(actualTestArray).to.eql(expectedTestArray);

  })

  it('should have ' + generationGrille.getAmntBlckCases() + ' black cases', () => {

    for(var rows = 0; rows < generationGrille.getGrille().length; rows ++){
      for (var col = 0; col < generationGrille.getGrille().length; col ++){
        if (generationGrille.getGrille()[rows][col].isBlack()){
          testAmntOfBlacks++
        }
      }
    }
    expect(testAmntOfBlacks).to.equal(generationGrille.getAmntBlckCases());
  });
  
  it('should have only words of at least 2 in length(rechecking the validity)', () => { 
    for(var rows = 1; rows < generationGrille.getGrille().length -1; rows ++){
      for (var col = 2; col < generationGrille.getGrille().length; col ++){
         if (generationGrille.getGrille()[rows][col].isBlack())
           if(generationGrille.getGrille()[rows][col-2].isBlack() && 
           generationGrille.getGrille()[rows-1][col-1].isBlack() && 
           generationGrille.getGrille()[rows+1][col-1].isBlack()){
             assert.ok(false, 'Has an invalid location.');
           }
      }
    }
  });

  it('should have no invalid locations. (a white case surrounded by black cases)', () => {
    actualTestArray = [
      [new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case()],
    ];
    
    actualTestArray[0][1].setBlack(true);
    actualTestArray[1][0].setBlack(true);
    actualTestArray[2][1].setBlack(true);
    actualTestArray[1][2].setBlack(true);

    let nmbrBlackCases: number = 4;

    nmbrBlackCases = generationGrille.testCheckGrilleValidity(nmbrBlackCases, actualTestArray);
    expect(nmbrBlackCases).to.equal(3);
  })

  it('should have no invalid locations. (a white case on the right side surrounded by black cases)', () => {
    actualTestArray = [
      [new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case()],
    ];
    
    actualTestArray[0][2].setBlack(true);
    actualTestArray[1][1].setBlack(true);
    actualTestArray[2][2].setBlack(true);
    
    let nmbrBlackCases: number = 3;
    
    nmbrBlackCases = generationGrille.testCheckGrilleValidity(nmbrBlackCases, actualTestArray);
    expect(nmbrBlackCases).to.equal(2);
  })

  it('should have no invalid locations. (a white case on the bottom surrounded by black cases)', () => {
    actualTestArray = [
      [new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case()],
      [new Case(),new Case(),new Case()],
    ];
    
    actualTestArray[1][1].setBlack(true);
    actualTestArray[2][0].setBlack(true);
    actualTestArray[2][2].setBlack(true);

    
    let nmbrBlackCases: number = 3;

    nmbrBlackCases = generationGrille.testCheckGrilleValidity(nmbrBlackCases, actualTestArray);
    expect(nmbrBlackCases).to.equal(2);
  })

  it('should be filled with letters except for the black ones');
});


