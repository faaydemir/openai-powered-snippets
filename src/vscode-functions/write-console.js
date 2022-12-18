
export default function consoleWrite(text, channelName = "openai-powered-snip") {
    consoleWrite.channles = consoleWrite.channles ?? {};
    let vscode = require("vscode");
    if (!consoleWrite.channles[channelName]) {
        consoleWrite.channles[channelName] = vscode.window.createOutputChannel(channelName);
    }
    let channel = consoleWrite.channles[channelName];
    channel.show(true);
    if (channel) {
        channel.appendLine(text);
    }
}