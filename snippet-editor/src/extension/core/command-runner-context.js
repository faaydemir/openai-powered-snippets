import Command from "./command";
import preDefinedFunctions from "./pre-defined-functions";
import { getValueWithKey } from "./utils/object";
import askToOpenAI from "./openai-client";
import Variable from "./variable";
import Fn from "./fn";
import { systemVariableNames } from "./pre-defined-variables";

const DEFAULT_COMMAND_HANDLER = 'replace';
export class VariableContext {
    constructor() {
        /**
         * @type {Object.<String, Variable>}
         */
        this.variables = {};
    }

    //todo rename as set
    /**
     * @param  {Variable} Variable
     */
    set(variable) {
        this.variables[variable.name] = variable;
    }

    /**
     * return variable values
     * @param  {} params=undefined
     */
    getVariables(params = undefined, functions = undefined) {
        return Object.keys(this.variables).reduce(
            (agg, key) => {
                agg[key] = this.variables[key].get(params, functions);
                return agg;
            },
            {}
        );
    }
}

export class FunctionContext {
    constructor() {
        this.functions = {};
    }

    /**
     * @param {Fn} fn
    - */
    set(fn) {
        this.functions[fn.name] = fn;
    }

    /**
     * @param  {String} functionName
     * @returns {Fn}
     */
    get(functionName) {
        return this.functions[functionName];
    }
    /**
     * @param  {String} functionName
     * @returns {Object.<String,Function>}
     */
    getFunctions() {
        return Object.keys(this.functions).reduce(
            (agg, key) => {
                agg[key] = this.functions[key]._fn;
                return agg;
            },
            {}
        );
    }
}

export class CommandRunnerContext {


    constructor() {
        this.systemVariableContext = new VariableContext();
        this.userVariableContext = new VariableContext();
        this.functionContext = new FunctionContext();
        this.commands = {};
    }

    runHandler(handler) {
        const system = this.systemVariableContext.getVariables();
        const functions = this.functionContext.getFunctions();
        const user = this.userVariableContext.getVariables(system, functions);
        const variables = { system, user };

        let functionName;
        let args = {};
        handler = handler ?? DEFAULT_COMMAND_HANDLER;
        if (typeof handler === 'string' || handler instanceof String) {
            functionName = handler;
        } else {
            functionName = handler.func;
            if (handler.args) {
                for (const [key, value] of Object.entries(handler.args)) {
                    args[key] = getValueWithKey(value, variables);
                }
            }
        }
        const fn = this.functionContext.get(functionName);
        fn.run({
            ...args,
            ...variables
        });
    }

    /**
     * @param  {Variable} variable
     */
    setSystemVariable(variable) {
        this.systemVariableContext.set(variable);
    }

    /**
     * @param  {Variable} variable
     */
    setUserVariable(variable) {
        this.userVariableContext.set(variable);
    }

    /**
     * @param  {Fn} fn
     */
    setFunction(fn) {
        this.functionContext.set(fn);
    }

    /**
     * @param  {Command} command
     */
    addCommand(command) {
        this.commands[command.name] = command;
    }

    /**
     * @returns  {Command[]} commands
     */
    getCommands() {
        return Object.values(this.commands);
    }

    /**
     * @param  {Command} command
     */
    //TODO: code duplication refactor runHandler and runCommand
    async runCommand(command) { //TODO: rename executeCommand
        const system = this.systemVariableContext.getVariables();
        const functions = this.functionContext.getFunctions();
        const user = this.userVariableContext.getVariables(system, functions);
        const prompt = command.prepare(system, user);
        this.setSystemVariable(new Variable(systemVariableNames.prompt, prompt));
        const answer = await askToOpenAI(prompt);
        if (!answer) {
            throw Error("Could not get response from OpenAI.");
        }
        this.setSystemVariable(new Variable(systemVariableNames.answer, answer.fullText));
        this.setSystemVariable(new Variable(systemVariableNames.answerCode, answer.code));
        this.runHandler(command.handler);
    }

    getSystemVariables() {
        return this.systemVariableContext.getVariables();
    }

    getUserVariables() {
        const system = this.getSystemVariables();
        const functions = this.functionContext.getFunctions();
        return this.userVariableContext.getVariables(system, functions);
    }

}

let commandRunnerContext;
export function resetContext() {
    commandRunnerContext = undefined;
}
export default function getCommandRunnerContext() {

    if (!commandRunnerContext) {
        commandRunnerContext = initContext();
    }
    return commandRunnerContext;

    function initContext() {
        const commandRunnerContext = new CommandRunnerContext();
        if (preDefinedFunctions) {
            for (const fn of preDefinedFunctions) {
                commandRunnerContext.setFunction(fn);
            }
        }
        return commandRunnerContext;
    }
}