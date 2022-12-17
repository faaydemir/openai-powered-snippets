import path = require('path');
import * as vscode from 'vscode';
import Command from './command';
import Fn from './fn';
import Variable from './variable';
import { commandRunnerContext } from '../extension';
import getBaseFolder from '../vscode-functions/get-base-folder';
import log from '../log';

export default async function importSnippets(snippetFiles) {

	async function readFile(file: string) {
		const document = await vscode.workspace.openTextDocument(file);
		let fileContent = document.getText();
		return fileContent;
	}

	async function importJsSnipFile(snipFile: string) {
		let js = await readFile(snipFile);
		let userDefinitions = eval(js);
		//TODO: check userDefinitions
		if (userDefinitions.commands) {
			userDefinitions.commands.forEach((command: { name: any; template: any; handler: any; }) => {
				commandRunnerContext.addCommand(new Command(
					command.name,
					command.template,
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
	async function importJsonSnipFile(snipFile: string) {
		//TODO: !!not complete implemented!!
		const document = await vscode.workspace.openTextDocument(snipFile);
		let userDefinitions = JSON.parse(document.getText());
		
		if (userDefinitions.commands) {
			userDefinitions.commands.forEach((command: { name: any; template: any; handler: any; }) => {
				commandRunnerContext.addCommand(new Command(
					command.name,
					command.template,
					command.handler
				));
			});
		}
		if (userDefinitions.variables) {
			userDefinitions.variables.forEach((variable: { name: any; value: any; }) => {
				commandRunnerContext.setUserVariable(new Variable(variable.name, variable.value));
			});
		}
	}
	function checkFileExist(snipFile: string): Boolean {
		//TODO: implement
		return true;
	}
	function getFileType(snipFile: string): string | undefined {
		if (snipFile) {
			return snipFile.split('.')?.pop()?.toLowerCase();
		}
	}

	function importFile(filePath: string) {
		if (!checkFileExist(filePath)) {
			return;
		}
		const fileType = getFileType(filePath);
		if (fileType === 'js') {
			importJsSnipFile(filePath);
		} else if (fileType === 'json') {
			importJsonSnipFile(filePath);
		}
	}

	function getFilesFromConfig(): Array<string> {
		if (!snippetFiles) {
			return [];
		}
		return snippetFiles.split(";");
	}
	function searchForSnipFilesUnderVsCodeFolder(): Array<string> {
		let validSnipFileName: Array<string> = ['openaisnipets.js', 'openaisnipets.json'];
		const baseFolderPath = getBaseFolder();
		let snipFiles = validSnipFileName.map(sf => path.join(baseFolderPath, '.vscode', sf));
		return snipFiles;
	}

	const allSnipFiles = searchForSnipFilesUnderVsCodeFolder().concat(getFilesFromConfig());
	log.info(allSnipFiles);
	allSnipFiles.forEach(sf => {
		try {
			importFile(sf);
		} catch (error) {
			log.error(error);
		}
	});
}
