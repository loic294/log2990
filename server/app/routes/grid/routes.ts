import * as grid from "./middleware";

// Use these routes to test services that are normally only accessible via another service/route

export default {
    base: "/grid",
    routes: [
        {
            method: "GET",
            path: "/",
            middleware: [
                grid.generate
            ]
        },
        {
            method: "GET",
            path: "/mock",
            middleware: [
                grid.mock
            ]
        }
    ]
};
