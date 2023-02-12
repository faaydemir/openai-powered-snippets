import Fn from "../fn";
import append from "./append";
import replace from "./replace";
import showWebView from "./show-webview";
import writeConsole from "./write-console";
import writeFile from "./write-file";
const preDefinedFunctions = [
    new Fn("append", append),
    new Fn("replace", replace),
    new Fn("writeConsole", writeConsole),
    new Fn("writeFile", writeFile),
    new Fn("showWebView", showWebView)
];

export default preDefinedFunctions;