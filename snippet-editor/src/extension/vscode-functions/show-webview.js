export default function showWebView(htmlBuilder, extensionUri) {
    // htmlBuilder = htmlBuilder ?? defaultHtmlBuilder;
    // GenericWebViewPanel.createOrShow(htmlBuilder, extensionUri);
}

// function defaultHtmlBuilder(webview) {
//     var vscode = require("vscode");

//     // Local path to css styles
//     const styleResetPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css');
//     const stylesPathMainPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css');

//     // Uri to load styles into webview
//     const stylesResetUri = webview.asWebviewUri(styleResetPath);
//     const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);


//     return `<!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <link href="${stylesResetUri}" rel="stylesheet">
//             <link href="${stylesMainUri}" rel="stylesheet">
//             <title>Cat Coding</title>
//         </head>
//         <body>
//             <div>WebView</div>
//         </body>
//         </html>`;
// }

