import * as grid from "./middleware";

export default {
    base: "/grid",
    routes: [
        {
            method: "GET",
            path: "/generate/:level",
            middleware: [
                grid.generate
            ]
        }
    ]
};
