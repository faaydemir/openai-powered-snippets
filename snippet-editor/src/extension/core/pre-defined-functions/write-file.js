import vsCodeWriteFile from "../../vscode-functions/write-file";

export default function writeFile({ filePath, content, system: { answer } }) {
    content = content ?? answer;
    vsCodeWriteFile(filePath, content);
}