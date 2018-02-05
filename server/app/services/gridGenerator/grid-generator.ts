import { Case } from "../../../../common/grid/case";

export default class GridGenerator {

  private _grid: Case[][];
  private readonly TAILLE_GRILLE: number = 10;
  private readonly PERCENT_BLACK_CASES: number = 10;
  private readonly BASE_AMOUNT_BLACK_CASES: number = 10;
  private readonly _randomGeneration: number = 0.7;
  private _amountBlackCases: number = 0;

  constructor() {
      this.assignAmountOfBlackCases();
      this._grid = this.createEmptyGrille();
      this.assignBlackCases();
  }

  private assignAmountOfBlackCases(): void {
      this._amountBlackCases = Math.floor(Math.random() * this.PERCENT_BLACK_CASES + this.BASE_AMOUNT_BLACK_CASES);
  }

  public createEmptyGrille(): Array<Array<Case>> {
    let temp: Case[][];
    temp = [];
    for (let rows: number = 0; rows < this.TAILLE_GRILLE; rows++) {
      temp[rows] = [];
      for (let col: number = 0; col < this.TAILLE_GRILLE; col++) {
        temp[rows][col] = new Case();
      }
    }

    return temp;
  }

  /**
   * Starts at 1, because, traditionally, a grid in Quebec doesn't have anything on its first row or column.
   */
  private assignBlackCases(): void {
    let currentAmountBlackCases: number = 0;
    for (let rows: number = 1; rows < this.TAILLE_GRILLE; rows++) {
      for (let col: number = 1; col < this.TAILLE_GRILLE; col++) {
        if (this._grid[rows][col].isBlack()) {
          currentAmountBlackCases++;
        }
      }
    }

    currentAmountBlackCases = this.setBlackCases(this.checkGrilleValidity(currentAmountBlackCases));

    if (currentAmountBlackCases !== this._amountBlackCases) {
      this.assignBlackCases();
    }

  }

  private setBlackCases(currentAmountBlackCases: number): number {
    for (let rows: number = 1; rows < this.TAILLE_GRILLE; rows++) {
      for (let col: number = 1; col < this.TAILLE_GRILLE; col++) {
        if (currentAmountBlackCases === this._amountBlackCases) {
          break;
        }

        if (!this._grid[rows][col].isBlack() && Math.random() > this._randomGeneration) {
          this._grid[rows][col].setBlack(true);
          currentAmountBlackCases++;
        }
      }
    }

    return currentAmountBlackCases;
  }

  public testCheckGrilleValidity(currentAmountBlackCases: number, grille: Array<Array<Case>>): number {
    const temp: Case[][] = this._grid;
    this._grid = grille;

    currentAmountBlackCases = this.checkGrilleValidity(currentAmountBlackCases);

    this._grid = temp;

    return currentAmountBlackCases;

  }

  private checkGrilleValidity(currentAmountBlackCases: number): number {
    for (let rows: number = 1; rows < this._grid.length; rows++) {
      for (let col: number = 2; col < this._grid.length; col++) {
        if(this._grid[rows][col].isBlack()) {
          if (this.ifSurroundedOnRight(rows, col)) {
            this._grid[rows][col].setBlack(false);
            currentAmountBlackCases--;
          } else if (this.ifSurroundedOnBottom(rows, col)) {
            this._grid[rows][col].setBlack(false);
            currentAmountBlackCases--;
          } else if (this.ifSurrounded(rows, col)) {
            this._grid[rows][col].setBlack(false);
            currentAmountBlackCases--;
          }
        }
      }
    }

    return currentAmountBlackCases;
  }

  private ifSurroundedOnRight(rows: number, col: number): boolean {
    return rows === this._grid.length - 1 && this._grid[rows - 1][col - 1].isBlack() && this._grid[rows - 2][col].isBlack();
  }

  private ifSurroundedOnBottom(rows: number, col: number): boolean {
    return col === this._grid.length - 1 && this._grid[rows - 1][col - 1].isBlack() && this._grid[rows][col - 2].isBlack();
  }

  private ifSurrounded(rows: number, col: number): boolean {
    return this._grid[rows][col - 2].isBlack() && this._grid[rows - 1][col - 1].isBlack() && this._grid[rows + 1][col - 1].isBlack();
  }

  public getGrid(): Array<Array<Case>> {
    return this._grid;
  }

  public setGrid(grid: Case[][]): void {
    this._grid = grid;
  }

  public getPercentBlackCases(): number {
    return this.PERCENT_BLACK_CASES;
  }

  public getAmntBlckCases(): number {
    return this._amountBlackCases;
  }
}
