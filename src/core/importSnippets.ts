import * as path from 'path';
import * as vscode from 'vscode';
import Command from './command';
import Fn from './fn';
import Variable from './variable';
import { commandRunnerContext } from '../extension';
import getBaseFolder from '../vscode-functions/get-base-folder';
import log from '../logger';
import { isHttpAddress } from './utils/url';
import axios from 'axios';
import * as YAML from 'yaml';

export default async function importSnippets(snippetFiles) {

	const allSnipFiles = searchForSnipFilesUnderVsCodeFolder().concat(getFilesFromConfig(snippetFiles));
	for (let i = 0; i < allSnipFiles.length; i++) {
		try {
			await importFile(allSnipFiles[i]);
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

async function importJsSnipFile(jsSnippetDefinition: string) {

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
	try {
		const document = await vscode.workspace.openTextDocument(file);
		let fileContent = document.getText();
		return fileContent;
	} catch {
		return undefined;
	}

}
async function importJsonSnipFile(jsonDefinition: string) {
	let userDefinitions = JSON.parse(jsonDefinition);
	importSnippetObject(userDefinitions);
}

async function importYamlSnipFile(yamlDefinition: string) {
	let userDefinitions = YAML.parse(yamlDefinition);
	importSnippetObject(userDefinitions);
}
export function importSnippetObject(userSnippets: SnippetDefinition) {

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
		for (const variableKey in userSnippets.variables) {
			const variable = userSnippets.variables[variableKey];
			const value = variable.js
				? eval(variable.js)
				: variable;
			commandRunnerContext.setUserVariable(new Variable(variableKey, value));
		}
	}
}
type SnippetDefinition = {
	commands: any;
	variables: any;
};

function getFileType(snipFile: string): string | undefined {
	if (snipFile) {
		return snipFile.split('.')?.pop()?.toLowerCase();
	}
}

