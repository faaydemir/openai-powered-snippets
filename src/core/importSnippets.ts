import path = require('path');
import * as vscode from 'vscode';
import Command from './command';
import Fn from './fn';
import Variable from './variable';
import { commandRunnerContext, extensionConfig } from '../extension';
import getBaseFolder from '../vscode-functions/get-base-folder';

export default async function importSnippets() {
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
		const document = await vscode.workspace.openTextDocument(snipFile);
		let userDefinitions = JSON.parse(document.getText());
	}
	function checkFileExist(snipFile: string): Boolean {
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
		if (!extensionConfig['snipFiles']) {
			return [];
		}
		return extensionConfig['snipFiles'].split(";");
	}
	function searchForSnipFilesUnderVsCodeFolder(): Array<string> {
		let validSnipFileName: Array<string> = ['openaisnip.js', 'openaisnip.json'];
		const baseFolderPath = getBaseFolder();
		let snipFiles = validSnipFileName.map(sf => path.join(baseFolderPath, '.vscode', sf));
		return snipFiles;
	}

	const allSnipFiles = searchForSnipFilesUnderVsCodeFolder().concat(getFilesFromConfig());
	allSnipFiles.forEach(sf => {
		importFile(sf);
	});
}
