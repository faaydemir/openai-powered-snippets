import Command from "./command";
import preDefinedFunctions from "./pre-defined-functions";
import { getValueWithKey } from "./utils/object";
import askToOpenAI from "./openai-client";
import Variable from "./variable";
import Fn from "./fn";
import { systemVariableNames } from "./pre-defined-variables";

const DEFAULT_COMMAND_HANDLER = 'replace'
export class VariableContext {
    constructor() {
        this.variables = {};
    }

    //todo rename as set
    /**
     * @param  {Variable} Variable
     */
    set(variable) {
        this.variables[variable.name] = variable;
    }
    get(params = undefined) {
        return Object.keys(this.variables).reduce(
            (agg, key) => {
                agg[key] = this.variables[key].get(params);
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

    set(fn) {
        this.functions[fn.name] = fn;
    }
    /**
     * @param  {string} functionName
     * @returns {Fn}
     */
    get(functionName) {
        return this.functions[functionName];
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
        const system = this.systemVariableContext.get();
        const user = this.userVariableContext.get(system);
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
    setSystemVariable(variable) {
        this.systemVariableContext.set(variable);
    }
    setUserVariable(variable) {
        this.userVariableContext.set(variable);
    }
    addCommand(command) {
        this.commands[command.name] = command;
    }
    getCommands() {
        return Object.values(this.commands);
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
    async runCommand(command) { //TODO: rename executeCommand
        const system = this.systemVariableContext.get();
        const user = this.userVariableContext.get(system);
        const question = command.prepare(system, user);
        this.setSystemVariable(new Variable(systemVariableNames.question, question));
        const answer = await askToOpenAI(question);
        if (!answer) {
            throw Error("Could not get response from OpenAI.");
        }
        this.setSystemVariable(new Variable(systemVariableNames.answer, answer.fullText));
        this.setSystemVariable(new Variable(systemVariableNames.answerCode, answer.code));
        this.runHandler(command.handler);
    }
}

let commandRunnerContext;
export default function getCommandRunnerContext() {

    if (!commandRunnerContext) {
        commandRunnerContext = initContext();
    }
    return commandRunnerContext;

    function initContext() {
        const commandRunnerContext = new CommandRunnerContext();
        if (preDefinedFunctions) {
            for (const fn of preDefinedFunctions) {
                commandRunnerContext.setFunction(Fn.fromFunction(fn));
            }
        }
        return commandRunnerContext;
    }
}