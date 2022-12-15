import { getValueWithKey } from "./utils/object";

export default class Command {
    constructor(name, questionTemplate, handler, description) {
        this.name = name;
        this.description = description ?? name;
        this.questionTemplate = questionTemplate;
        this.handler = handler;
    }
    prepare(systemVariables, userVaribles) {
        const variables = {
            system: systemVariables,
            user: userVaribles
        };
        const question = this.questionTemplate.replace(/\{([^}]+)\}/g, (match, key) => {
            return getValueWithKey(key, variables);
        });

        return question;
    }
}
