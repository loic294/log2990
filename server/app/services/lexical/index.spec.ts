import { default as LexicalService } from "./index"; 
import { assert } from 'chai'; 

const service = new LexicalService; 
 
 
describe("Function baseDefinition", () => { 
    it("should return an array of json objects", () => { 
        return service.baseDefinition("car").then((data: any)=>{ 
            assert.typeOf(data, 'array', 'We have an array of json objects'); 
        });    
     });  
}); 
 
describe("baseDefinition('apple')", () => { 
    it("should return the correct definitions", () => { 
        return service.baseDefinition('apple').then((data: any)=>{ 
            const firstDefinition = data[0].text; 
            const expected = "A deciduous Eurasian tree (Malus pumila) having alternate simple leaves and white or pink flowers."; 
            assert.deepEqual(firstDefinition, expected); 
        });    
     }); 
});

describe("lengthSearch('4', 'true')", () => {
    it("should return a 4 letter common word", () => {
        
        return service.lengthSearch(4, true).then((data: any)=> {
            assert.equal(4, data.length);
        });
    });
});

describe("positionSearch('2a3', 'true')", () => {
    it("should return a 6 letter common word with an a at the 3 position", () => {

        return service.positionSearch("2a3", false).then((data: any)=> {
            
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
        return service.wordDefinition("hard","train").then((definition: any)=>{  
            assert.notInclude(definition, "train", "Should not include the word train in the definition");
            assert.notEqual(definition, "A series of connected railroad cars pulled or pushed by one or more locomotives.");
        });    
     });   
}); 
