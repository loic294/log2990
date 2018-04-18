import { AudioService } from "./audio-service/audio.service";
import { TrackProgressionService } from "./trackProgressionService";
import { TrackBuilder } from "./trackBuilder";
import { Scene } from "three";
import { Car } from "./car/car";
import { RaceStarter } from "./raceStarter";

describe("RaceStarter", () => {
    let raceStarter: RaceStarter;

    beforeEach(() => {
        raceStarter = new RaceStarter(new TrackBuilder(new Scene(), new Array(), new Array(), new Car(), new Array()),
                                      new TrackProgressionService(), new AudioService());
    });

    it("should be created", () => {
        expect(raceStarter).toBeTruthy();
    });

    it("should show a visual countdown signal at raceStarter initialization", async() => {
        await raceStarter.audioService.initializeSounds(new Car(), new Array());
        expect(raceStarter.getCountdown()).toBeGreaterThan(0);
    });

    it("should load and start an audio countdown at raceStarter initialization", async() => {
        await raceStarter.audioService.initializeSounds(new Car(), new Array());
        expect(raceStarter.audioService.countdown).toBeTruthy();
    });
});
