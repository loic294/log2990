/*
    This service will be responsible of requesting and creating lexical content.
*/
import axios, { AxiosResponse } from "axios";
import KEYS from "./../../config/index";
import { Level } from "./../../../../common/lexical/level";
import { NO_DEFINITION } from "../gridGeneration/gridGeneration";
interface AxiosWords {
    word: string;
    tags: Array<string>;
}

export default class LexicalService {

    private async baseDefinition(word: string): Promise<AxiosResponse> {
        const WORDNIK_URL: string = `http://api.wordnik.com:80/v4/word.json/${word}/definitions?limit=200&${KEYS.WORDNIK_KEY}`;
        const response: AxiosResponse = await axios.get(WORDNIK_URL);

        return response.data;
    }

    private async baseWordSearch(requirements: string): Promise<AxiosResponse> {
        const DATAMUSE_URL: string = `https://api.datamuse.com/words?sp=${requirements}&md=f&max=1500`;

        return axios.get(DATAMUSE_URL);
    }
    private removeExamplesDefinitions(definitions: string []): void {
        for (const def in definitions) {
            if (definitions[def].includes(":")) {
                definitions[def] = definitions[def].substring(0, definitions[def].indexOf(":"));
            }
        }
    }
    private removeDetailsDefinitions(definitions: string []): void {
        for (const def in definitions) {
            if (definitions[def].includes(";")) {
                definitions[def] = definitions[def].substring(0, definitions[def].indexOf(";"));
            }
        }
    }

    private async filterDefinitions(word: string): Promise<Array<string>> {
        const definitions: string [] = [];
        const data: AxiosResponse = await this.baseDefinition(word);
        for (const def in data) {
            if (!(data[def].text).toLowerCase().includes(word.toLowerCase())) {
                definitions.push(data[def].text);
            }
        }

        this.removeExamplesDefinitions(definitions);
        this.removeDetailsDefinitions(definitions);

        return definitions;
    }

    public async wordDefinition(level: string, word: string): Promise<string> {

        const filteredDefinitions: string[] = await this.filterDefinitions(word);

        if (filteredDefinitions.length === 0) {
            return NO_DEFINITION;
        }
        switch (level) {
            case Level.Easy:
                {
                    return filteredDefinitions[0];
                }
            case Level.Hard:
                {
                    if (filteredDefinitions.length > 1) {
                        return filteredDefinitions[Math.floor((Math.random() * (filteredDefinitions.length - 1) + 1))];
                    } else {
                        return filteredDefinitions[0];
                    }
                }
            default: {
                return filteredDefinitions[0];
            }
        }

    }

    public async wordSearch(researchCriteria: string, common: string): Promise<string> {
        let request: string = "";
        let previousChar: string = "";
        const tenWordLetterRepeat: number = 9;

        for (const item of researchCriteria) {

            if (item.match(/[a-z]/i)) {
                request += item;
            }
            if (previousChar === "1" && item === "0") {
                request += "?".repeat(tenWordLetterRepeat);
            } else {
                request += "?".repeat(+item);
            }
            previousChar = item;
        }

        try {
            const maxTries: number = 5;
            let count: number = 0;
            let rawResponse: { data: Array<AxiosWords> };
            do {
                rawResponse = await this.baseWordSearch(request);
            } while (rawResponse.data.length === 0 && count++ < maxTries);

            return this.commonFinder(common, rawResponse.data, request);
        } catch (err) {
            return NO_DEFINITION;
        }
    }

    public async wordAndDefinition(researchCriteria: string, common: string, level: string): Promise<string[]> {
        const data: string[] = [];
        let word: string;
        let definition: string;
        word = await this.wordSearch(researchCriteria, common);
        definition = await this.wordDefinition(level, word);

        data[0] = word;
        data[1] = definition;

        return data;
    }

    private commonFinder(common: string, rawResponse: Array<AxiosWords>, requestString: string): string {

        let responseLength: number = rawResponse.length;
        const NON_NUMBERS_INDEX: number = 2;
        const FREQ_CUTOFF: Number = 8;

        while (responseLength) {

            const randomInt: number = Math.floor(Math.random() * rawResponse.length);
            const word: string = rawResponse[randomInt].word;
            const freq: number = +rawResponse[randomInt].tags[0].substring(NON_NUMBERS_INDEX);

            if (word.length === requestString.length && word.match(/^[a-z]+$/i) ) {

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
