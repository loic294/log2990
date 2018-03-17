import { TestBed, inject } from "@angular/core/testing";
import { Difficulty } from "./../../../../common/grid/difficulties";
import { DifficultyService } from "./difficulty.service";

describe("DifficultyService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DifficultyService]
        });
    });

    it("should be created", inject([DifficultyService], (difficultyService: DifficultyService) => {
        expect(difficultyService).toBeTruthy();
    }));
    describe("difficulty()", () => {
        it("should return Easy when selectDifficulty(Difficulty.Easy) is called", inject(
            [DifficultyService], (difficultyService: DifficultyService) => {

            difficultyService.selectDifficulty(Difficulty.Easy);
            difficultyService.difficulty.subscribe((result) => {
                expect(result).toEqual(Difficulty.Easy);

            });
        }));

        it("should return Normal when selectDifficulty(Difficulty.Normal) is called", inject(
            [DifficultyService], (difficultyService: DifficultyService) => {

            difficultyService.selectDifficulty(Difficulty.Normal);
            difficultyService.difficulty.subscribe((result) => {
                expect(result).toEqual(Difficulty.Normal);

            });
        }));

        it("should return Hard when selectDifficulty(Difficulty.Normal) is called", inject(
            [DifficultyService], (difficultyService: DifficultyService) => {

            difficultyService.selectDifficulty(Difficulty.Hard);
            difficultyService.difficulty.subscribe((result) => {
                expect(result).toEqual(Difficulty.Hard);

            });
        }));
    });
});
