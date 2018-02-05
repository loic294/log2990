import LexicalService from "../lexical"; // USES LEXICAL SERVICE
import WordGenerator from "./word-generator";

export default class GridGeneratorService {

    private lexicalService: LexicalService = new LexicalService();

    constructor () {

    }

    public async getWord() { // This is an asynchronos function
        const result = await this.lexicalService.wordDefinition("hard", "test"); // This line will wait for method1 to complete before procceding

        console.log("Result", result);

        return result;

    }

    public generate() {

        const gridGenerator: WordGenerator = new WordGenerator();

        console.log("GRILLE", gridGenerator.getGrid());

        return gridGenerator.getGrid();

    }

}
