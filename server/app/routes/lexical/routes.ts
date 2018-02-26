import * as lexical from "./middleware";

// Use these routes to test services that are normally only accessible via another service/route

export default {
    base: "/lexical",
    routes: [{
        method: "GET",
        path: "/wordAndDefinition/:criteria/:common/:level",
        middleware: [
            lexical.wordAndDefinition
        ]
    }]
};
