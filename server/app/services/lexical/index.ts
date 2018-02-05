/*
    This service will be responsible of requesting and creating lexical content.
*/
import axios, { AxiosResponse } from "axios";
const API_KEY: String = "api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";

interface AxiosWords {
    word: string;
    tags: Array<string>;
}

export default class LexicalService {

    private async baseDefinition(word: string): Promise<AxiosResponse> {
        let WORDNIK_URL: string;
        WORDNIK_URL = `http://api.wordnik.com:80/v4/word.json/${word}/definitions?limit=200&${API_KEY}`;
        try {
            const response: AxiosResponse = await axios.get(WORDNIK_URL);

            return response.data;
        } catch (err) {
            throw err;
        }
    }

    private async baseWordSearch(requirements: string): Promise<AxiosResponse> {
        let DATAMUSE_URL: string;
        DATAMUSE_URL = `https://api.datamuse.com/words?sp=${requirements}&md=f&max=1500`;

        try {
            return axios.get(DATAMUSE_URL);
        } catch (err) {
            throw err;
        }
    }

    private async filterDefinitions(word: string): Promise<Array<string>> {
        const definitions: string [] = [];
        try {
            const data: AxiosResponse = await this.baseDefinition(word);

            for (const def in data) {
                if (!data[def].text.includes(`${word}`)) {
                    definitions.push(data[def].text);
                }
            }
            // Remove examples from definitions
            for (const def in definitions) {
                if (definitions[def].includes(":")) {
                    definitions[def] = definitions[def].substring(0, definitions[def].indexOf(":"));
                }
            }
            // Remove unecessary details from definitions
            for (const def in definitions) {
                if (definitions[def].includes(";")) {
                    definitions[def] = definitions[def].substring(0, definitions[def].indexOf(";"));
                }
            }
        } catch (err) {
            throw err;
        }

        return definitions;
    }

    public async wordDefinition(level: string, word: string): Promise<string> {
        const filteredDefinitions: string[] = await this.filterDefinitions(word);

        try {
            switch (level) {
                case "easy":
                    {
                        return filteredDefinitions[0];
                    }
                case "hard":
                    {
                        if (filteredDefinitions.length > 1) {
                            let min: number;
                            let max: number;
                            min = 1;
                            max = filteredDefinitions.length;

                            return filteredDefinitions[Math.floor((Math.random() * (max - min) + min))];
                        } else {
                            return filteredDefinitions[0];
                        }
                    }
                default: {
                    return filteredDefinitions[0];
                }
            }

        } catch (err) {
            throw err;
        }
    }

    public async wordSearch(researchCriteria: string, common: string): Promise<String> {
        let request: string;
        request = "";

        for (const item of researchCriteria) {
            if (item.match(/[a-z]/i)) {
                request += item;
            }
            request += "?".repeat(+item);
        }

        const { data }: { data: Array<AxiosWords> } = await this.baseWordSearch(request);

        return this.commonFinder(common, data, request);
    }

    private commonFinder(common: string, rawResponse: Array<AxiosWords>, requestString: string): string {

        let responseLength: number = rawResponse.length;
        // tslint:disable-next-line:no-inferrable-types
        const NON_NUMBERS_INDEX: number = 2;
        const FREQ_CUTOFF: Number = 8;

        while (responseLength) {

            const randomInt: number = Math.floor(Math.random() * rawResponse.length);
            const word: string = rawResponse[randomInt].word;
            const freq: number = +rawResponse[randomInt].tags[0].substring(NON_NUMBERS_INDEX);

            if (word.length === requestString.length) {

                if (common === "common" && freq as number > FREQ_CUTOFF) {
                    return word;
                }

                if (common === "uncommon" && freq as number < FREQ_CUTOFF) {
                    return word;
                }

            }
            responseLength--;
        }

        return rawResponse[0].word;
    }
}
