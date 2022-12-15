import vsCodeShowWebView from "../../vscode-functions/show-webview";

export default function showWebView({ system: { question, answer, extensionUri } }) {

    vsCodeShowWebView(questionAndAnswerHtml, extensionUri);

    function questionAndAnswerHtml(webview) {
        var vscode = require("vscode");

        // Local path to css styles
        const styleResetPath = vscode.Uri.joinPath(extensionUri, 'media', 'reset.css');
        const stylesPathMainPath = vscode.Uri.joinPath(extensionUri, 'media', 'vscode.css');

        // Uri to load styles into webview
        const stylesResetUri = webview.asWebviewUri(styleResetPath);
        const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);


        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${stylesResetUri}" rel="stylesheet">
                <link href="${stylesMainUri}" rel="stylesheet">
                <title>Cat Coding</title>
            </head>
            <body>
                <h3>Question</h3>
                <div>${question}<div/>
                <h3>Answer</h3>
                <div>${answer}<div/>
            </body>
            </html>`;
    }
}

