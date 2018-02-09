import * as lexical from "./middleware";

// Use these routes to test services that are normally only accessible via another service/route

export default {
    base: "/lexical",
    routes: [{
        method: "GET",
        path: "/wordsearch/:common/:word",
        middleware: [
            lexical.wordSearch
        ]
    },       {
        method: "GET",
        path: "/wordDefinition/:level/:word",
        middleware: [
            lexical.wordDefinition
        ]
    },       {
        method: "GET",
        path: "/wordAndDef/:criteria/:common/:level",
        middleware: [
            lexical.wordAndDefinition
        ]
    }]
};
