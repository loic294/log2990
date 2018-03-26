import { NgModule } from "@angular/core";
import { async, ComponentFixture, TestBed, inject } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { GameComponent } from "./game.component";
// import { ITrack } from "../../../../../server/app/models/trackInfo";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { TrackInformationService } from "../../../../../server/app/services/trackInformation/trackInformationService";

@NgModule({
    imports: [FormsModule],
    declarations: [GameComponent],
  })
export class FakeTestDialogModule {}

describe("GameComponent", () => {
    let component: GameComponent;
    let fixture: ComponentFixture<GameComponent>;
    let mock: MockAdapter;
    let spy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FakeTestDialogModule],
            providers: [TrackInformationService]
        })
            .compileComponents().catch((error) => {
                throw error;
            });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        mock = new MockAdapter(axios);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should have a list of available tracks", inject([TrackInformationService], (service: TrackInformationService) => {
        /*mock.onGet("http://localhost:3000/race/tracks").reply(200, [{"name": "track1"}, {"name": "track2"}]);
        let tracks: ITrack[];
        axios.get("all").then((data) => {
                tracks = JSON.parse(data.toString());
        });
        expect(tracks.length).toBe(2);*/

        /*component.trackInformation.getTrackInfo("test");
        expect(component.trackInformation.track).toBeTruthy();*/

        spy = spyOn(service, "getTracks");

        component.trackInformation.getTracksList();

        expect(service.getTracks).toHaveBeenCalled();
    }));

});
