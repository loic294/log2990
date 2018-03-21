import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { TrackInformationComponent } from "./track-information.component";
import { TrackInformationService } from "../../../../../server/app/services/trackInformation/trackInformationService";

describe("TrackInformationComponent", () => {
    let component: TrackInformationComponent;
    let fixture: ComponentFixture<TrackInformationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [TrackInformationComponent],
            providers: [TrackInformationService]
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

    /*it("should POST and GET new track named track1 and its informations", () => {
        // const  tempObject: Object = {name: "track1", type: "type1", description: "desc1", timesPlayed: 0};
        component.name = "track1";
        component.type = "type1";
        component.description = "desc1";
        component.timesPlayed = 0;
        component.putTrack();
        component.getTracksList();
        expect(component.tracks[0]).toBe("track1");
    });*/
});
