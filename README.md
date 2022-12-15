# OpenAI Powered Snips Beta

VS Code provides an extension that allows developers to create code snippets using the power of OpenAI

## Usage

* Get a OpenAI api key you can get it from https://beta.openai.com/
* Create snippet definition as js file like below. 
* Set your api key and  snippet file in extension settings
* Left click in File and select OpenAI Snippet command.

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
| showWebView   | Show web view         | question(system.question),question(system.answer) |
| writeConsole  | write text to console | content(system.answer)                            |
| writeFile     | write text to file    | filePath(),content(system.answer)                 |

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


