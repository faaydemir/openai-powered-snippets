import * as vscode from 'vscode';
import Variable from './core/variable';
import getCommandRunnerContext, { CommandRunnerContext } from './core/command-runner-context';
import { setOpenAIApiKey, setOpenAIModel } from './core/openai-client';
import GenericWebViewPanel from './vscode-functions/webview-panel';
import importSnippets from './core/importSnippets';
import getSelectedText from './vscode-functions/get-selected-text';
import getBaseFolder from './vscode-functions/get-base-folder';
import getFileNameAndExtension from './core/utils/path';
import { systemVariableNames } from './core/pre-defined-variables';
import log from './logger';
import { getActiveDocument } from './vscode-functions/get-active-file-name';
import Command from './core/command';

let commandRunnerContext;
export async function activate(context: vscode.ExtensionContext) {
	commandRunnerContext = getCommandRunnerContext();

	if (vscode.window.registerWebviewPanelSerializer) {
		try {
			vscode.window.registerWebviewPanelSerializer(GenericWebViewPanel.viewType, {
				async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {/*TODO! ??*/ }
			});
		} catch (error) {
			//TODO: control register error
			log.error(error);
		}
	}

	const config = initConfiguration();
	//TODO: make baseFolder lazy
	initSnippetSystemVariables();
	setOpenAIApiKey(config.get('openAIToken'));
	setOpenAIModel(config.get('openAIModel'));

	await importSnippets(config.get('snippetFiles'));
	initVsCodeCommands(context);
	initEvents();
}

//TODO: compare with initEvent and refactor
function initSnippetSystemVariables() {
	commandRunnerContext.setSystemVariable(new Variable(systemVariableNames.baseFolder, getBaseFolder()));
	const document = getActiveDocument();
	if (document) {
		commandRunnerContext.setSystemVariable(new Variable(systemVariableNames.language, document.languageId));
		commandRunnerContext.setSystemVariable(new Variable(systemVariableNames.filePath, document.fileName));
		const { extension, fileName, fileFolder } = getFileNameAndExtension(document.fileName);
		commandRunnerContext.setSystemVariable(new Variable(systemVariableNames.fileName, fileName));
		commandRunnerContext.setSystemVariable(new Variable(systemVariableNames.fileExtension, extension));
		commandRunnerContext.setSystemVariable(new Variable(systemVariableNames.fileFolder, fileFolder));
	}
}
function initEvents() {
	vscode.window.onDidChangeActiveTextEditor((e) => {
		if (!e) {
			return;
		}
		//TODO: make lazy
		commandRunnerContext.setSystemVariable(new Variable(systemVariableNames.language, e.document.languageId));
		commandRunnerContext.setSystemVariable(new Variable(systemVariableNames.filePath, e.document.fileName));
		const { extension, fileName, fileFolder } = getFileNameAndExtension(e.document.fileName);
		commandRunnerContext.setSystemVariable(new Variable(systemVariableNames.fileName, fileName));
		commandRunnerContext.setSystemVariable(new Variable(systemVariableNames.fileExtension, extension));
		commandRunnerContext.setSystemVariable(new Variable(systemVariableNames.fileFolder, fileFolder));
	});

	vscode.window.onDidChangeTextEditorSelection(async (e) => {
		if (!e) {
			return;
		}
		//TODO: make lazy
		commandRunnerContext.setSystemVariable(new Variable(systemVariableNames.selection, getSelectedText()));
	});

}
function initVsCodeCommands(context: vscode.ExtensionContext) {
	const commandExplain = vscode.commands.registerCommand('openaipoweredsnippet.run', async () => {

		commandRunnerContext.setSystemVariable(new Variable(systemVariableNames.extensionUri, context.extensionUri));

		let selectedCommand = await vscode.window.showQuickPick<{ label: string, description: string, command: Command }>(commandRunnerContext.getCommands().map(c => ({
			label: c.name,
			description: c.description,
			command: c
		})));
		if (selectedCommand) {

			vscode.window.withProgress({
				location: vscode.ProgressLocation.Window,
				cancellable: false,
				title: `Executing. ${selectedCommand.label}`
			}, async (progress) => {

				try {
					progress.report({ increment: 0 });
					await commandRunnerContext.runCommand(selectedCommand?.command);
				} catch (err) {
					vscode.window.showErrorMessage(`Error. ${err?.message}`);
					throw err;
				}
				finally {
					progress.report({ increment: 100 });
				}
			});
		}
	});
	context.subscriptions.push(commandExplain);

}
let extensionConfig: { [key: string]: string | undefined; } = {};
function initConfiguration() {

	vscode.workspace.onDidChangeConfiguration((event: vscode.ConfigurationChangeEvent) => {
		if (event.affectsConfiguration('"openaipoweredsnippet.openAIToken')) {
			const config = vscode.workspace.getConfiguration('openaipoweredsnippet');
			setOpenAIApiKey(config.get('openAIToken') as string | undefined);
			if (!config.get('openAIToken')) {
				log.error("Open AI api key required");
			}
		} else if (event.affectsConfiguration('openaipoweredsnippet.snippetFiles')) {
			const config = vscode.workspace.getConfiguration('openaipoweredsnippet');
			importSnippets(config.get('snippetFiles'));
			if (!config.get('snippetFiles')) {
				log.error("SnippetFile key required");
			}
		}
	});
	return vscode.workspace.getConfiguration('openaipoweredsnippet');
}

export function deactivate() { }
