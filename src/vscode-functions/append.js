export default function append(newValue, position = 'end') {
    var vscode = require("vscode");
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const insert = position === 'end'
            ? editor.selection.end
            : editor.selection.start;
            
        editor.edit(editBuilder => {
            editBuilder.insert(insert, newValue);
        });
    }
}