import vsCodeAppend from "../../vscode-functions/append";
import writeConsole from "../../vscode-functions/write-console";

export default function append({
    textToAppend,
    position = "end",
    system: { answer }
}) {
    textToAppend = textToAppend ?? answer;
    try {
        vsCodeAppend(textToAppend, position);
    } catch (error) {
        writeConsole(error);
    }
}