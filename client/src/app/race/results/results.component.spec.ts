import { ComponentFixture, TestBed, async, inject } from "@angular/core/testing";
import { ResultsComponent } from "./results.component";
import { ResultsService } from "../results-service/results.service";
import { PlayerStats } from "../../../../../common/race/playerStats";
import { of } from "rxjs/observable/of";
import { IGameInformation } from "../trackProgressionService";

const mockBotTimes: Array<Array<String>> = [
    ["20", "30", "40"],
    ["25", "35", "45"],
    ["30", "40", "50"]
];

const mockGame: IGameInformation =  {
    gameTime: "3.00",
    lapTime: "0.00" ,
    lapTimes: ["1.00", "1.00", "1.00"],
    gameIsFinished: true,
    currentLap: 4,
    botTimes: mockBotTimes
};

const mockPlayer: PlayerStats = {
    player: "player",
    gameTime: "3.00",
    lapTimes: ["1.00", "1.00", "1.00"],
};

const mockTimes: Array<PlayerStats> = [
    {player: "1", gameTime: "10.00", lapTimes: ["3", "3", "4"]},
    {player: "2", gameTime: "20.00", lapTimes: ["3", "13", "4"]},
    {player: "3", gameTime: "30.00", lapTimes: ["3", "3", "24"]},
    {player: "4", gameTime: "40.00", lapTimes: ["10", "10", "20"]},
    {player: "5", gameTime: "50.00", lapTimes: ["15", "15", "20"]},
    {player: "6", gameTime: "60.00", lapTimes: ["15", "15", "30"]},
    {player: "7", gameTime: "70.00", lapTimes: ["30", "20", "20"]}
];

describe("ResultsComponent", () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;
  let service: ResultsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsComponent ],
      providers: [
          ResultsService
      ]
    })
    .compileComponents().catch((e) => {
        console.error(e.message);
    });

  }));

  beforeEach(inject([ResultsService], (s: ResultsService) => {
    service = s;
    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOnProperty(service, "game", "get").and.returnValue(of(mockGame));
    spyOnProperty(service, "trackTimes", "get").and.returnValue(of(mockTimes));
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should show the top 5 times of track", async (() => {
    const expectedTimes: Array<PlayerStats> = [
        {player: "1", gameTime: "10.00", lapTimes: ["3", "3", "4"]},
        {player: "2", gameTime: "20.00", lapTimes: ["3", "13", "4"]},
        {player: "3", gameTime: "30.00", lapTimes: ["3", "3", "24"]},
        {player: "4", gameTime: "40.00", lapTimes: ["10", "10", "20"]},
        {player: "5", gameTime: "50.00", lapTimes: ["15", "15", "20"]},
    ];
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.bestTimes()).toEqual(expectedTimes);
  }));

  it("should be a best time if player time is in top 5 times of track", async (() => {

    const expectedTimes: Array<PlayerStats> = [
        {player: "player", gameTime: "3.00", lapTimes: ["1.00", "1.00", "1.00"]},
        {player: "1", gameTime: "10.00", lapTimes: ["3", "3", "4"]},
        {player: "2", gameTime: "20.00", lapTimes: ["3", "13", "4"]},
        {player: "3", gameTime: "30.00", lapTimes: ["3", "3", "24"]},
        {player: "4", gameTime: "40.00", lapTimes: ["10", "10", "20"]}
    ];

    mockTimes.push(mockPlayer);
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.bestTimes()).toEqual(expectedTimes);
    expect(component.isBestTime()).toBe(true);
  }));

  it("should be first if player time is faster than bot times", async (() => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.isFirst()).toBe(true);
  }));

  it("should not be first if player time is slower than one of bot times", async (() => {
    mockGame.gameTime = "10000";
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.isFirst()).toBe(false);
  }));

  it("should input be enabled if player is first and is in top 5 times of track", async (() => {
    mockGame.gameTime = "3.00";
    mockTimes.push(mockPlayer);
    component.ngOnInit();
    fixture.detectChanges();

    const hostElement: Element = fixture.nativeElement;
    const input: HTMLInputElement = hostElement.querySelector("input");
    expect(input.disabled).toBe(false);
  }));

  it("should update the player name to 'Name' if player inputed 'Name'", async (() => {
    mockGame.gameTime = "3.00";
    mockTimes.push(mockPlayer);
    component.ngOnInit();
    fixture.detectChanges();

    const hostElement: Element = fixture.nativeElement;
    const input: HTMLInputElement = hostElement.querySelector("input");
    expect(input.disabled).toBe(false);

    input.value = "Name";
    input.dispatchEvent(new Event("input"));

    expect(component.bestTimeName).toEqual("Name");

  }));
});
