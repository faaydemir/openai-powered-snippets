export function getActiveDocument() {
	var vscode = require("vscode");
	return vscode?.window?.activeTextEditor?.document;
}

export default function getActiveFileName() {
	var currentlyOpenTabfilePath = getActiveDocument()?.fileName;
	var currentlyOpenTabfileName = path.basename(currentlyOpenTabfilePath);
	return currentlyOpenTabfileName;
}
