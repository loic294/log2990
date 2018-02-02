import { TestBed, inject } from "@angular/core/testing";

import { WordService } from "./word.service";
import Word, { Orientation } from "../../../../common/lexical/word";

describe("WordService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WordService]
    });
  });

  it("should be created", inject([WordService], (service: WordService) => {
    expect(service).toBeTruthy();
  }));

 /* it("should convert Subject and convert Observable", inject([WordService], (service: WordService) => {
   service.selectWordFromClue(new Word("hi", "a greeting", [0, 4], Orientation.horizontal));
   service.wordFromClue.subscribe((_wordFromClue) => {
       expect(service.wordFromClue.name).toBe("hi");
       expect(service.wordFromClue.desc).toBe("a greeting");
       expect(service.wordFromClue.col).toBe(0);
       expect(service.wordFromClue.row).toBe(4);
       expect(service.wordFromClue.direction).toBe(Orientation.horizontal);
    });
   service.selectWordFromGrid(new Word("hey", "another greeting", [1, 0], Orientation.vertical));
   service.wordFromGrid.subscribe((_wordFromGrid) => {
       expect(service.wordFromGrid.name).toBe("hey");
       expect(service.wordFromGrid.desc).toBe("another greeting");
       expect(service.wordFromGrid.col).toBe(1);
       expect(service.wordFromGrid.row).toBe(0);
       expect(service.wordFromGrid.direction).toBe(Orientation.vertical);
    });
  }));*/
});
