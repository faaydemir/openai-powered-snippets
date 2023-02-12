import { OpenAIApi, Configuration } from "openai";

/**
 * @type {Configuration}
 */
let configuration;

/**
 * @type {OpenAIApi}
 */
let openai;

export class OpenAIAnswer {
    constructor(fullText) {
        this.code = fullText + "\n";
        this.fullText = fullText + "\n";
    }
}

export function setOpenAIApiKey(apiKey) {
    configuration = new Configuration({ apiKey });
    openai = new OpenAIApi(configuration);
}

/**
 * @param  {String} prompt
 * @returns {OpenAIAnswer} answer
 */
export default async function askToOpenAI(prompt) {
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0,
            max_tokens: 2048,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0
        });
        return new OpenAIAnswer(response.data.choices[0].text);
    } catch (error) {
        console.error(error);
    }
}

