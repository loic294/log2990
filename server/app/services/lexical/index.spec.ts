 /* tslint:disable */ 
import { default as LexicalService } from "./index";
import { assert } from "chai";

const service: LexicalService = new LexicalService;

describe("wordSearch('4', 'common')", () => {
    it("should return a 4 letter common word", () => {

        return service.wordSearch("4", "common").then((data: any)=> {
            assert.equal(4, data.length);
        });
    });
});

describe("wordSearch('4', 'uncommon')", () => {
    it("should return a 4 letter uncommon word", () => {
        
        return service.wordSearch("4", "uncommon").then((data: any)=> {
            assert.equal(4, data.length);
        });
    });
});

describe("wordSearch('2a3', 'common')", () => {
    it("should return a 6 letter common word with an a at the 3 position", () => {

        return service.wordSearch("2a3", "uncommon").then((data: any)=> {

            assert.equal(6, data.length);
            assert.equal("a", data[2]);
        });
    });
});


describe("wordDefinition('easy','train')", () => {
    it("should return the first provided definition of the word", () => {
        return service.wordDefinition("easy","train").then((definition: any)=>{
            assert.notInclude(definition, "train", "Should not include the word train in the definition");
            assert.equal(definition, "A series of connected railroad cars pulled or pushed by one or more locomotives.");
        });
     });
});


describe("wordDefinition('hard','train')", () => {
    it("should return an alternative definition of the word", () => {
        return service.wordDefinition("hard","train").then((definition: any) => {
            assert.notInclude(definition, "train", "Should not include the word train in the definition");
            assert.notEqual(definition, "A series of connected railroad cars pulled or pushed by one or more locomotives.");
        });
     });
});

describe("wordAndDefinition('10', 'common', 'easy')", () => {
    it("should return a ten letter word and its definition", () => {
        return service.wordAndDefinition("10", "common", "easy").then((data: any) => {
            assert.equal(10, data[0].length);
            assert.isNotEmpty(data[1]);
        });
     });
});
