import * as path from 'path';
import * as vscode from 'vscode';
import Command from './command';
import Fn from './fn';
import Variable from './variable';
import getBaseFolder from '../vscode-functions/get-base-folder';
import log from '../logger';
import { isHttpAddress } from './utils/url';
import axios from 'axios';
import * as YAML from 'yaml';
import getCommandRunnerContext from './command-runner-context';
import * as fs from 'fs';
export default async function importSnippets(snippetFiles) {

	const allSnipFiles = [
		...searchForSnipFilesUnderVsCodeFolder(),
		...getFilesFromConfig(snippetFiles)
	];
	for (let i = 0; i < allSnipFiles.length; i++) {
		try {
			const isDir = fs.lstatSync(allSnipFiles[i]).isDirectory();
			if (isDir) {
				await importFolder(allSnipFiles[i]);
			}
			else {
				await importFile(allSnipFiles[i]);
			}
		} catch (error) {
			log.error(error);
		}
	};
}

function searchForSnipFilesUnderVsCodeFolder(): Array<string> {
	let validSnipFileName: Array<string> = ['openaisnipets.js', 'openaisnipets.json', 'openaisnipets.yaml'];
	const baseFolderPath = getBaseFolder();
	let snipFiles = validSnipFileName.map(sf => path.join(baseFolderPath, '.vscode', sf));
	return snipFiles;
}

function getFilesFromConfig(snippetFiles: string): Array<string> {
	if (!snippetFiles) {
		return [];
	}
	return snippetFiles.split(";");
}

async function importFile(filePath: string) {


	const fileType = getFileType(filePath);
	if (!['js', 'json', 'yaml'].includes(fileType)) {
		return;
	}
	const fileContent = await read(filePath);

	if (fileType === 'js') {
		await importJsSnipFile(fileContent);
	} else if (fileType === 'json') {
		await importJsonSnipFile(fileContent);
	} else if (fileType === 'yaml') {
		await importYamlSnipFile(fileContent);
	}
}
async function importFolder(folderPath: string) {
	if (!fs.lstatSync(folderPath).isDirectory()) {
		return;
	}
	const allSnipFiles = fs.readdirSync(folderPath, { withFileTypes: true })
		.filter(item => !item.isDirectory())
		.map(item => path.join(folderPath, item.name));

	for (let i = 0; i < allSnipFiles.length; i++) {
		try {
			await importFile(allSnipFiles[i]);
		} catch (error) {
			log.error(error);
		}
	};
}

async function importJsSnipFile(jsSnippetDefinition: string) {
	let commandRunnerContext = getCommandRunnerContext();
	let userDefinitions = eval(jsSnippetDefinition);
	if (userDefinitions.commands) {
		userDefinitions.commands.forEach((command: { name: any; template: any; prompt: any; handler: any; }) => {
			commandRunnerContext.addCommand(new Command(
				command.name,
				command.template ?? command.prompt,
				command.handler
			));
		});
	}
	if (userDefinitions.variables) {
		userDefinitions.variables.forEach((variable: { name: any; value: any; }) => {
			commandRunnerContext.setUserVariable(new Variable(variable.name, variable.value));
		});
	}

	if (userDefinitions.functions) {
		userDefinitions.functions.forEach((fn: Function) => {
			commandRunnerContext.setFunction(Fn.fromFunction(fn));
		});
	}
}
async function read(fileOrUrl: string) {

	if (isHttpAddress(fileOrUrl)) {
		return await readFromUrl(fileOrUrl);
	}
	else {
		return await readFile(fileOrUrl);
	}
}

async function readFromUrl(url: string) {
	const response = await axios.get(url);
	return response.data;
}

async function readFile(file: string) {
	const document = await vscode.workspace.openTextDocument(file);
	let fileContent = document.getText();
	return fileContent;
}

async function importJsonSnipFile(jsonDefinition: string) {
	let userDefinitions = JSON.parse(jsonDefinition);
	importSnippetObject(userDefinitions);
}

async function importYamlSnipFile(yamlDefinition: string) {
	let userDefinitions = YAML.parse(yamlDefinition);
	importSnippetObject(userDefinitions);
}
type SnippetDefinition = {
	commands: any;
	variables: any;
	functions: any;
};

export function importSnippetObject(userSnippets: SnippetDefinition) {

	let commandRunnerContext = getCommandRunnerContext();
	if (userSnippets.commands) {
		if (Array.isArray(userSnippets.commands)) {
			for (const command of userSnippets.commands) {
				commandRunnerContext.addCommand(new Command(
					command.name,
					command.template ?? command.prompt,
					command.handler
				));
			}
		}
		else {
			for (const commandKey in userSnippets.commands) {
				const command = userSnippets.commands[commandKey];
				commandRunnerContext.addCommand(new Command(
					command.name ?? commandKey,
					command.template ?? command.prompt,
					command.handler
				));
			}
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
				commandRunnerContext.setUserVariable(new Variable(variableKey, value));
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


function getFileType(snipFile: string): string | undefined {
	if (snipFile) {
		return snipFile.split('.')?.pop()?.toLowerCase();
	}
}

