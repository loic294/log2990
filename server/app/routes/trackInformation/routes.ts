import * as trackInfo from "./middleware";

export default {
    base: "/race",
    routes: [{
        method: "GET",
        path: "/tracks",
        middleware: [
            trackInfo.obtainTracks
        ]
<<<<<<< HEAD
    },
             { method: "POST", path: "/tracks", middleware: [ trackInfo.saveTrack ] }]
=======
    }]
>>>>>>> 9278d1d65793fd789f4d94e156bbcf060598b2d1
};
