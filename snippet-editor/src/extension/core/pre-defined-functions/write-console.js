import vsCodeWriteConsole from "../../vscode-functions/write-console";

export default function writeConsole({ content, channel, system: { answer } }) {
    content = content ?? answer;
    vsCodeWriteConsole(content, channel);
}