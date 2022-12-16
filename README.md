# OpenAI Powered Snippets Beta

VS Code provides an extension that allows developers to create code snippets using the power of OpenAI

![usage](/media/usage.gif)


## Usage

* Get a OpenAI api key you can get it from https://beta.openai.com/
* Set your api key and  snippet file in extension settings `File>Preferences>Settings>Extensions>OpenAI Powered Snippets`
![settings](/media/settings.png)

* Left click in File and select OpenAI Snippet command.
* Create snippet definition as js file like below and add it in settings

Here is sample snippet file:
```js
module.exports = {
    commands: [
        {
            name: "Refactor",
            template: `Refactor following function.
            function:
            {system.selection}`
        },
    ],
};
```

Here is complex snippet file:
```js
module.exports = {
    commands: [
        {
            name: "Create unit test.",
            template: `Create unit test in {user.unitTestFramework} framework for following function.
            code:
            {system.selection}`,
            handler: { 
                func: 'writeFile',
                args: {
                    filePath: 'user.testFileName'
                }
            }
        },
        {
            name: "Write jsdoc",
            template: `Write jsdoc for following functions.
            code:
            {system.selection}`,
            handler: {
                func: 'append',
                args: {
                    position: 'start'
                }
            }
        },
    ],
    functions: [
        {
            // you could also write your own handler
            myHandler({system,user}){
                console.table({system});
                console.table({user});
            }
        }
    ],
    variables: [
        {
            name: "unitTestFramework",
            value: "jest"
        },
        {
            name: "testFileName",
            value: ({ baseFolder,fileName,fileExtension }) => `${baseFolder}\\tests\\${fileName}.test.${fileExtension}`
        },
    ]
};
```

Samples:

https://github.com/faaydemir/openai-powered-snippets/tree/main/sample-snippet-files

## Creating Command
### name 
Requiered. Name of command can ve whatever you want
### template
Requiered. prompt template to use for create OpenAI request.
Use can use system or user defined variable in template. variables will replaced with proper value while preparing request

To use system variable add `{system.*variableName*}` variableName can be one of Predefined System Variables

To use system variable add `{user.*variableName*}`. variableName must be in variables field in snippet file.

### handler
handler is use to handle openAI response. by default replace function is used. handle function can ve one of Predefined System Function or an a User defined function (user defined function can be buggy).

You can set handler in following ways

Just function name. function run with default values
```js
handler:'replace'
```

With args function name to set function args
```js
handler: {
    func: 'replace',
    args: {
       textToReplace: 'user.answerModified'
    }
}
```

### Predefined System Variables

| Variable Name        | Description                           |
| -------------------- | ------------------------------------- |
| system.selection     | Selected text in editor               |
| system.question      | OpenAI question                       |
| system.answer        | OpenAI answer                         |
| system.language      | Programming language   of active file |
| system.baseFolder    | Project base path                     |
| system.fileName      | Name of active file                   |
| system.filePath      | Full path of active file              |
| system.fileExtension | Extension of active file              |



## Predefined System Function
| Function Name | Description           | params(default)                                   |
| ------------- | --------------------- | ------------------------------------------------- |
| append        | Append Text           | textToAppend(system.answer),postion('end')        |
| replace       | Replace selected text | textToReplace(system.answer)                      |
| showWebView   | Show Webview         | question(system.question),question(system.answer) |
| writeConsole  | Write text to console | content(system.answer)                            |
| writeFile     | Write text to file    | filePath(),content(system.answer)                 |

#### Replace
Replace text with selection. Take optional parameter `textToReplace` In default value equals to OpenAI answer

Default Usage
```js
    ...
    commands: [
        {
            name: "Refactor",
            template: `Refactor following function.
            function:
            {system.selection}`
            handler:'replace'
        },
    ],
```
Usage with params
```js
    ...
    commands: [
        {
            name: "Refactor",
            template: `Refactor following function.
            function:
            {system.selection}`
            handler:{
                func: 'replace',
                args: {
                    textToReplace: 'user.answerModified'
                }
            }
        },
    ],
    variables: [
        {
            name: "answerModified",
            value: ({answer})=>`/*\n${anwer}\n*/`
        },
    ],
```

#### Append
Append text with selection. Take optional parameter `textToAppend` and `postion`. `postion` can be `start` or `end`
In default `textToAppend` equals to OpenAI `postion` is end of selection

Sample usage
```js
    ...
    commands: [
        {
            name: "Append",
            template: `Write jsdoc for following function.
            function:
            {system.selection}`
            handler:{
                func: 'append',
                args: {
                    position: 'start'
                }
            }
        },
    ],
```


