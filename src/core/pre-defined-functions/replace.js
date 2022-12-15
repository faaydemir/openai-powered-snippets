import vsCodeReplace from "../../vscode-functions/replace";
import writeConsole from "../../vscode-functions/write-console";

export default function replace({
    textToReplace,
    system: { answer }
}) {
    textToReplace = textToReplace ?? answer;
    try {
        vsCodeReplace(textToReplace);
    } catch (error) {
        writeConsole(error);
    }
}