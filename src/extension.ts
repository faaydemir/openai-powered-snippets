import * as vscode from 'vscode';
import Variable from './core/variable';
import getCommandRunnerContext, { CommandRunnerContext } from './core/command-runner-context';
import { setOpenAIApiKey } from './core/openai-client';
import GenericWebViewPanel from './vscode-functions/webview-panel';
import importSnippets from './core/importSnippets';
import getSelectedText from './vscode-functions/get-selected-text';
import getBaseFolder from './vscode-functions/get-base-folder';
import getFileNameAndExtension from './core/utils/path';
import { systemVariableNames } from './core/pre-defined-variables';

export let commandRunnerContext: CommandRunnerContext;

export function activate(context: vscode.ExtensionContext) {
	commandRunnerContext = getCommandRunnerContext();

	if (vscode.window.registerWebviewPanelSerializer) {
		vscode.window.registerWebviewPanelSerializer(GenericWebViewPanel.viewType, {
			async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {/*TODO! ??*/ }
		});
	}

	const config = initConfiguration();
	//TODO: make baseFolder lazy
	commandRunnerContext.setSystemVariable(new Variable(systemVariableNames.baseFolder, getBaseFolder()));
	
	setOpenAIApiKey(config.get('openAIToken'));
	importSnippets(config.get('snippetFiles'));
	initVsCodeCommands(context);
	initEvents();
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

		let selectedCommand = await vscode.window.showQuickPick(commandRunnerContext.getCommands().map(c => ({
			label: c.name,
			description: c.description,
			command: c
		})));
		if (selectedCommand) {
			await commandRunnerContext.runCommand(selectedCommand?.command);
		}
	});
	context.subscriptions.push(commandExplain);

}
export let extensionConfig: { [key: string]: string | undefined; } = {};
function initConfiguration() {
	
	vscode.workspace.onDidChangeConfiguration((event: vscode.ConfigurationChangeEvent) => {
		if (event.affectsConfiguration('"openaipoweredsnippet.openAIToken')) {
			const config = vscode.workspace.getConfiguration('openaipoweredsnippet');
			setOpenAIApiKey(config.get('openAIToken') as string | undefined);

		} else if (event.affectsConfiguration('openaipoweredsnippet.snippetFiles')) {
			const config = vscode.workspace.getConfiguration('openaipoweredsnippet');
			importSnippets(config.get('snippetFiles'));
		}
	});
	return vscode.workspace.getConfiguration('openaipoweredsnippet');
}


export function deactivate() { }
