import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { TrackInformationComponent } from "./track-information.component";
import { TrackInformationService } from "../../../../../server/app/services/trackInformation/trackInformationService";
import { CommunicationService } from "../communicationService";

describe("TrackInformationComponent", () => {
    let component: TrackInformationComponent;
    let fixture: ComponentFixture<TrackInformationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [TrackInformationComponent],
            providers: [TrackInformationService, CommunicationService]
        })
            .compileComponents().catch((error) => {
                throw error;
            });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrackInformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should load list of track names containing test1 and test2.", () => {
        component.getTracksList().then(() => {
            expect(component.tracks[0]).toBe("test1");
            expect(component.tracks[1]).toBe("test2");
        }).catch((error) => {
            throw error;
        });
    });

    it("should load track 'test1' informations correctly.", () => {
        component.getTrackInfo("test1")
            .then(() => {
                expect(component.track.name).toBe("test1");
                expect(component.track.type).toBe("test track");
                expect(component.track.description).toBe("this track is for unit testing");
                expect(component.track.timesPlayed).toBe(0);
            })
            .catch((error) => {
                throw error;
            });

    });

});
