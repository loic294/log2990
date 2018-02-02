import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { GridComponent } from "./grid.component";
import { WordService } from "../../word.service/word.service";

describe("GridComponent", () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ GridComponent ],
      providers: [ WordService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should select first case of push", () => {
    component.selectCaseFromUser(component.grid[0][8]);
    expect(component.x).toBe(0);
    expect(component.y).toBe(8);
  });

  it("should select first case of Push", () => {
    component.selectCaseFromUser(component.grid[2][8]);
    expect(component.x).toBe(0);
    expect(component.y).toBe(8);
  });

  it("should select first case of Clue", () => {
    component.selectCaseFromUser(component.grid[1][8]);
    expect(component.x).toBe(1);
    expect(component.y).toBe(6);
  });

  it("should select first case of Grave", () => {
    component.selectCaseFromUser(component.grid[9][4]);
    expect(component.x).toBe(9);
    expect(component.y).toBe(0);
  });

  it("should select first case of Wound", () => {
    component.selectCaseFromUser(component.grid[0][2]);
    expect(component.x).toBe(0);
    expect(component.y).toBe(2);
  });

  it("should select first case of Worry", () => {
    component.selectCaseFromUser(component.grid[0][2]);
    expect(component.x).toBe(0);
    expect(component.y).toBe(2);
  });

  it("should not be a word", () => {
    component.selectCaseFromUser(component.grid[0][0]);
    expect(component.x).toBe(0);
    expect(component.y).toBe(0);
  });

  it("should be letter", () => {
    expect(component.isLetter("e")).toBe(true);
    expect(component.isLetter("E")).toBe(true);
    expect(component.isLetter("a")).toBe(true);
    expect(component.isLetter("A")).toBe(true);
    expect(component.isLetter("z")).toBe(true);
    expect(component.isLetter("Z")).toBe(true);
  });

  it("should not be letter", () => {
    expect(component.isLetter("ee")).toBe(false);
    expect(component.isLetter("-")).toBe(false);
    expect(component.isLetter("/")).toBe(false);
    expect(component.isLetter("Aa")).toBe(false);
    expect(component.isLetter("9")).toBe(false);
    expect(component.isLetter("10")).toBe(false);
  });

});
