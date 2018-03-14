import * as trackInfo from "./middleware";

export default {
    base: "/race",
    routes: [{
        method: "GET",
        path: "/tracks",
        middleware: [
            trackInfo.obtainTracks
        ]
    }]
};
