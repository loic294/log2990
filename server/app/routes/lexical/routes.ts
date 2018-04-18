import * as lexical from "./middleware";

export default {
    base: "/lexical",
    routes: [
    {
        method: "GET",
        path: "/wordAndDefinition/:criteria/:common/:level",
        middleware: [
            lexical.wordAndDefinition
        ]
    },
    {
        method: "GET",
        path: "/definition/:word/:level",
        middleware: [
            lexical.wordDefinition
        ]
    }]
};
