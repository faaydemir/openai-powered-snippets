export default function getActiveFileName() {
	var vscode = require("vscode");
	var path = require("path");
	var currentlyOpenTabfilePath = vscode.window.activeTextEditor.document.fileName;
	var currentlyOpenTabfileName = path.basename(currentlyOpenTabfilePath);
	return currentlyOpenTabfileName;
}
