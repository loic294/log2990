import { default as LexicalService } from "./index"; 
import { assert } from 'chai'; 
 
describe("Function baseDefinition", () => { 
    it("should return an array of json objects", () => { 
        const service = new LexicalService; 
        return service.baseDefinition("car").then((data: any)=>{ 
            assert.typeOf(data, 'array', 'We have an array of json objects'); 
        });    
     });  
}); 
 
describe("baseDefinition('apple')", () => { 
    it("should return the correct definitions", () => { 
        const service = new LexicalService; 
        return service.baseDefinition('apple').then((data: any)=>{ 
            const firstDefinition = data[0].text; 
            const expected = "A deciduous Eurasian tree (Malus pumila) having alternate simple leaves and white or pink flowers."; 
            assert.deepEqual(firstDefinition, expected); 
        });    
     }); 
}); 