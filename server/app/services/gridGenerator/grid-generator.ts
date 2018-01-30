import {Case} from './case'

export class GridGenerator {

  private grille : Case[][];
  private readonly TAILLE_GRILLE : number = 10;
  private readonly PERCENT_BLACK_CASES : number = 10;
  private readonly BASE_AMOUNT_BLACK_CASES : number = 10;
  private amountBlackCases : number = Math.floor(Math.random() * this.PERCENT_BLACK_CASES + this.BASE_AMOUNT_BLACK_CASES);

  constructor() {
      this.grille = this.createEmptyGrille();
      this.assignBlackCases();
  }

  public createEmptyGrille() : Array<Array<Case>> {
    let temp : Case[][];
    temp = [];
    for (let rows : number = 0; rows < this.TAILLE_GRILLE; rows++) {
      temp[rows] = [];
      for (let col : number = 0; col < this.TAILLE_GRILLE; col++) {
        temp[rows][col] = new Case();
      }
    }
    return temp;
  }

  /**
   * Starts at 1, because, traditionally, a grille in Quebec doesn't have anything on its first row or column.
   */
  private assignBlackCases() : void {
    let currentAmountBlackCases : number = 0;
    for (let rows : number = 1; rows < this.TAILLE_GRILLE; rows++) {
      for (let col : number = 1; col < this.TAILLE_GRILLE; col++) {
        if (this.grille[rows][col].isBlack()){
          currentAmountBlackCases++;
        }
      }
    }

    currentAmountBlackCases = this.setBlackCases(currentAmountBlackCases);

    currentAmountBlackCases = this.checkGrilleValidity(currentAmountBlackCases);

    if(currentAmountBlackCases != this.amountBlackCases){
      this.assignBlackCases();
    }

  }

  private setBlackCases(currentAmountBlackCases : number) : number {
    for (let rows : number = 1; rows < this.TAILLE_GRILLE; rows++) {
      for (let col : number = 1; col < this.TAILLE_GRILLE; col++) {
        if (currentAmountBlackCases == this.amountBlackCases){
          break;
        }

        if(!this.grille[rows][col].isBlack() && Math.random() > 0.7){
          this.grille[rows][col].setBlack(true);
          currentAmountBlackCases++;
        }
        
      }
    }
    return currentAmountBlackCases;
  }

  public testCheckGrilleValidity(currentAmountBlackCases : number, grille : Array<Array<Case>>) : number{
    let temp : Case[][] = this.grille;
    this.grille = grille;

    currentAmountBlackCases = this.checkGrilleValidity(currentAmountBlackCases);

    this.grille = temp;
    return currentAmountBlackCases;

  }

  private checkGrilleValidity(currentAmountBlackCases : number) : number{
    for (let rows : number = 1; rows < this.grille.length; rows++) {
      for (let col : number = 2; col < this.grille.length; col++) {
        if(this.grille[rows][col].isBlack()){
          if (this.ifSurroundedOnRight(rows, col)){
            this.grille[rows][col].setBlack(false);
            currentAmountBlackCases--;
          }else if (this.ifSurroundedOnBottom(rows, col)){
            this.grille[rows][col].setBlack(false);
            currentAmountBlackCases--;
          }else if(this.ifSurrounded(rows, col)){
            this.grille[rows][col].setBlack(false);
            currentAmountBlackCases--;
          }
        }
      }
    }
    return currentAmountBlackCases;
  }

  private ifSurroundedOnRight(rows : number, col : number) : boolean{
    return rows == this.grille.length -1 && this.grille[rows-1][col-1].isBlack() && this.grille[rows-2][col].isBlack();
  }

  private ifSurroundedOnBottom(rows : number, col : number) : boolean{
    return col == this.grille.length -1 && this.grille[rows-1][col-1].isBlack() && this.grille[rows][col-2].isBlack();
  }

  private ifSurrounded(rows : number, col :number) : boolean{
    return this.grille[rows][col-2].isBlack() && this.grille[rows-1][col-1].isBlack() && this.grille[rows+1][col-1].isBlack();
  }

  public getGrille() : Array<Array<Case>> {
    return this.grille;
  }

  public setGrille(grille : Case[][]) : void{
    this.grille = grille;
  }

  public getPercentBlackCases() : number {
    return this.PERCENT_BLACK_CASES;
  }

  public getAmntBlckCases() : number {
    return this.amountBlackCases;
  }

}
