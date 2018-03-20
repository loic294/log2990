import * as trackInfo from "./middleware";

export default {
    base: "/race",
    routes: [{
        method: "GET",
        path: "/tracks",
        middleware: [
            trackInfo.obtainTracks
        ]
    },
             { method: "POST", path: "/tracks", middleware: [ trackInfo.saveTrack ] },
             { method: "DELETE", path: "/tracks", middleware: [ trackInfo.deleteTrack ] }]
};
