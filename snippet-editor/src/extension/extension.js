import Variable from "./core/variable";
import Command from "./core/command";
import Fn from "./core/fn";
import getCommandRunnerContext, { resetContext } from "./core/command-runner-context"
import * as YAML from 'yaml';

export async function importFile(fileContent, fileType) {
	resetContext();
	if (!['js', 'json', 'yaml'].includes(fileType)) {
		return;
	}

	if (fileType === 'js') {
		await importJsSnipFile(fileContent);
	} else if (fileType === 'json') {
		await importJsonSnipFile(fileContent);
	} else if (fileType === 'yaml') {
		await importYamlSnipFile(fileContent);
	}
}

async function importJsSnipFile(jsSnippetDefinition) {
	let commandRunnerContext = getCommandRunnerContext();
	let userDefinitions = eval(jsSnippetDefinition);
	if (userDefinitions.commands) {
		userDefinitions.commands.forEach((command) => {
			commandRunnerContext.addCommand(new Command(
				command.name,
				command.template ?? command.prompt,
				command.handler
			));
		});
	}
	if (userDefinitions.variables) {
		userDefinitions.variables.forEach((variable) => {
			commandRunnerContext.setUserVariable(new Variable(variable.name, variable.value));
		});
	}

	if (userDefinitions.functions) {
		userDefinitions.functions.forEach((fn) => {
			commandRunnerContext.setFunction(Fn.fromFunction(fn));
		});
	}
}

async function importJsonSnipFile(jsonDefinition) {
	let userDefinitions = JSON.parse(jsonDefinition);
	importSnippetObject(userDefinitions);
}

async function importYamlSnipFile(yamlDefinition) {
	let userDefinitions = YAML.parse(yamlDefinition);
	importSnippetObject(userDefinitions);
}

export function importSnippetObject(userSnippets) {

	let commandRunnerContext = getCommandRunnerContext();
	if (userSnippets.commands) {
		for (const commandKey in userSnippets.commands) {
			const command = userSnippets.commands[commandKey];
			commandRunnerContext.addCommand(new Command(
				command.name ?? commandKey,
				command.template ?? command.prompt,
				command.handler
			));
		}
	}

	if (userSnippets.variables) {
		if (Array.isArray(userSnippets.variables)) {
			for (const variable of userSnippets.variables) {
				const value = variable?.value?.js
					? eval(variable.value.js)
					: variable.value;
				commandRunnerContext.setUserVariable(new Variable(variable.name, value));
			}
		}
		else {
			for (const variableKey in userSnippets.variables) {
				const variable = userSnippets.variables[variableKey];
				const value = variable.js
					? eval(variable.js)
					: variable;
				commandRunnerContext.setUserVariable(new Variable(variable.name ?? variableKey, value));
			}
		}
	}
	if (userSnippets.functions) {
		if (Array.isArray(userSnippets.functions)) {
			for (const functionText of userSnippets.functions) {
				commandRunnerContext.setFunction(Fn.fromString(functionText));
			}
		}
		else {
			for (const functionKey in userSnippets.functions) {
				const f = userSnippets.functions[functionKey];
				commandRunnerContext.setFunction(Fn.fromString(f));
			}
		}
	}
}

function getFileType(snipFile) {
	if (snipFile) {
		return snipFile.split('.')?.pop()?.toLowerCase();
	}
}

