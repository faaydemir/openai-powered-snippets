export default function getSelectedText() {
	var vscode = require("vscode");
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const document = editor.document;
		const selection = editor.selection;
		const selectedText = document.getText(selection);
		return selectedText;
	}
}
