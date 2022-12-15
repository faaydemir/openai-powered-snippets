import * as fs from "fs";
import * as path from "path";
import consoleWrite from "./write-console";

export default function writeFile(filePath, fileContent, isAppend = false) {
    return new Promise((resolve, reject) => {
        const dirname = path.dirname(filePath);
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname);
        }

        fs.writeFile(filePath, fileContent, writeFileError => {
            if (writeFileError) {
                consoleWrite(writeFileError);
                reject(writeFileError);
                return;
            }
            resolve(filePath);
        });
    });
}