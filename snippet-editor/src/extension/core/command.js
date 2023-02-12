import { getValueWithKey } from "./utils/object";

export default class Command {
    constructor(name, promptTemplate, handler, description) {
        this.name = name;
        this.description = description ?? name;
        this.promptTemplate = promptTemplate;
        this.handler = handler;
    }
    prepare(systemVariables, userVaribles) {
        const variables = {
            system: systemVariables,
            user: userVaribles
        };
        const prompt = this.promptTemplate.replace(/\{([^}]+)\}/g, (match, key) => {
            return getValueWithKey(key, variables);
        });

        return prompt;
    }
}
