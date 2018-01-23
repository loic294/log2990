import { Case } from './case'
import { GenerationGrille } from "./generation-grille";
import { CaseWithPos } from './case-with-pos'

enum Difficulte {
    facile,
    normal,
    difficile,
}

export class Words{

    constructor(private grille : GenerationGrille){
        
    }

    private findWordLength() : void{
        for (let rows : number  = 0; rows < this.grille.getGrille().length ; rows++){
            for (let col : number = 0; col < this.grille.getGrille().length ;  col++){
                
            }
        }
    }
}