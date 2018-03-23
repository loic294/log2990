/* tslint:disable */
import { TrackInformationService } from "./trackInformationService";
import { assert } from "chai";
import { ITrack } from "../../models/trackInfo";

const trackService: TrackInformationService = new TrackInformationService();

describe("trackInformationService", () => {

    describe("POST et GET", () => {
        it("should save new track named track1 and get track named track1", () => {
            const tempObject: ITrack = { name: "track1", type: "type1", description: "desc", timesPlayed: 0 };
            trackService.putTrack(tempObject);
            let tempTrack: ITrack;
            trackService.getTracks("track1").then((data) => {
                const tempArray: Array<ITrack> = JSON.parse(data.toString());
                tempTrack = tempArray[0];
            }).then(() => {
                assert.equal(tempTrack.name, "track1");
                assert.equal(tempTrack.type, "type1");
                assert.equal(tempTrack.description, "desc");
                assert.equal(tempTrack.timesPlayed, 0);
            });

        });
    });

    describe("POST et GET all", () => {
        it("should save new track named track2 and get list of track names : track1 and track 2", () => {
            const tempObject: Object = { name: "track2", type: "type1", description: "desc", timesPlayed: 0 };
            let tempArray: Array<String>;
            trackService.putTrack(tempObject);
            trackService.getTracks("all").then((data) => {
                tempArray = JSON.parse(data.toString());
            }).then(() => {
                assert.equal(tempArray[0], "track1");
                assert.equal(tempArray[1], "track2");
            });
        });
    });

    describe("PATCH", () => {
        it("should modify description of track1", () => {
            let track1Desc1: String;
            let track1Desc2: String; 
            let tempTrack: ITrack;

            trackService.getTracks("track1").then((data) => {
                const tempArray: Array<ITrack> = JSON.parse(data.toString());
                tempTrack = tempArray[0];
                track1Desc1 = tempTrack.description;
            }).then(() => {
                tempTrack.description = "new description";
            });

            trackService.patchTrack("track1", tempTrack);

            trackService.getTracks("track1").then((data) => {
                const tempArray: Array<ITrack> = JSON.parse(data.toString());
                tempTrack = tempArray[0];
                track1Desc2 = tempTrack.description;
            }).then(() => {
                assert.notEqual(track1Desc1, track1Desc2);
            });
        });
    });

    describe("DELETE", () => {
        it("BD should contain 2 tracks less after deleting track1 and track 2", () => {
            let tempArray: Array<String>;
            let BdSize: number;
            trackService.getTracks("all").then((data) => {
                tempArray = JSON.parse(data.toString());
            }).then(() => {
                BdSize = tempArray.length;
            });

            trackService.deleteTrack("track1");
            trackService.deleteTrack("track2");
            trackService.getTracks("all").then((data) => {
                tempArray = JSON.parse(data.toString());
            }).then(() => {
                assert.equal(tempArray.length, BdSize - 2);
            });
        });
    });

});
