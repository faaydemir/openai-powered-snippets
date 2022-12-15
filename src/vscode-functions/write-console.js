export default function consoleWrite(text, channelName = "openai-powered-snip") {
    let vscode = require("vscode");
    let channel = vscode.window.createOutputChannel(channelName);
    if (channel) {
        channel.appendLine(text);
    }
}