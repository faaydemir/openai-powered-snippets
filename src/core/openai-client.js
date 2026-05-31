import { OpenAIApi, Configuration } from "openai";

/**
 * @type {Configuration}
 */
let configuration;

/**
 * @type {OpenAIApi}
 */
let openai;

const models = {
    GPT: "gpt-3.5-turbo",
    DAVINCI: "text-davinci-003"
};

let model = models.GPT;

export class OpenAIAnswer {
    constructor(fullText) {
        this.code = fullText + "\n";
        this.fullText = fullText + "\n";
    }
}

let basePath;

function rebuildClient(apiKey) {
    configuration = new Configuration({ apiKey, basePath });
    openai = new OpenAIApi(configuration);
}

let currentApiKey;
export function setOpenAIApiKey(apiKey) {
    currentApiKey = apiKey;
    rebuildClient(apiKey);
}
export function setOpenAIBaseURL(url) {
    basePath = url || undefined;
    rebuildClient(currentApiKey);
}
export function setOpenAIModel(openAImodel) {
    model = openAImodel;
}


/**
 * @param  {String} prompt
 * @returns {OpenAIAnswer} answer
 */
export async function askToOpenAIDavinci(prompt) {
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

/**
 * @param  {String} prompt
 * @returns {OpenAIAnswer} answer
 */
export async function askToOpenAIGPT(prompt) {
    try {
        const response = await openai.createChatCompletion({
            model: model,
            messages: [
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 2048,
        });
        return new OpenAIAnswer(response.data.choices[0].message.content);
    } catch (error) {
        console.error(error);
    }
}

export default async function askToOpenAI(prompt) {
    if (model === models.DAVINCI) {
        return await askToOpenAIDavinci(prompt);
    } else {
        return await askToOpenAIGPT(prompt);
    }
}