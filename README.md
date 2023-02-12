# OpenAI Powered Snippets Beta

A Visual Studio Code extension that allows developers to create code snippets using the power of OpenAI

![usage](/media/usage.gif)


## Usage

* Get a OpenAI API key from https://platform.openai.com/account/api-keys
* Create snippet file contains prompts, variable and functions.
* Set your API key and snippet files in the extension VSCode settings `File>Preferences>Settings>Extensions>OpenAI Powered Snippets`
![settings](/media/settings.png)
* In the editor, left-click and select "Run OpenAI Snippet" or use the keyboard shortcut Ctrl+O+A.

# Snippet Files
You can create snippet files using either YAML, JSON, or JavaScript. 

Sample files are available for reference at the following GitHub repository: https://github.com/faaydemir/openai-powered-snippets/tree/main/sample-snippet-files.

Here is a YAML sample file:
```yaml
commands:
  refactor:
    name: refactor
    prompt: >
      Refactor given {system.language} code.
      code:
      {system.selection}
    handler: replace

  createUnitTest:
    name: Create unit test.
    prompt: >
      Create unit test in {user.unitTestFramework} framework for following function. 
      code:
      {system.selection}
    handler: 
        func: writeFile
        args: 
            filePath: user.testFileName

variables:
  testFileName: 
    js: ({ baseFolder,fileName,fileExtension }) => `${baseFolder}\\tests\\${fileName}.test.${fileExtension}`
  unitTestFramework: jest
```

JSON
```json
{
  "commands": {
    "refactor": {
      "name": "refactor",
      "prompt": "Refactor given {system.language} code. code: {system.selection}\n",
      "handler": "replace"
    },
    "createUnitTest": {
      "name": "Create unit test.",
      "prompt": "Create unit test in {user.unitTestFramework} framework for following function.  code: {system.selection}`\n",
      "handler": {
        "func": "writeFile",
        "args": {
          "filePath": "user.testFileName"
        }
      }
    }
  },
  "variables": {
    "testFileName": {
      "js": "({ baseFolder,fileName,fileExtension }) => `${baseFolder}\\\\tests\\\\${fileName}.test.${fileExtension}`"
    },
    "unitTestFramework": "jest"
  }
}
```
Javascript
```js
module.exports = {
    commands: [
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
    variables: [
        {
            name: "unitTestFramework",
            value: "jest"
        },
        {
            name: "testFileName",
            value: ({ baseFolder,fileName,fileExtension }) => `${baseFolder}\\tests\\${fileName}.test.${fileExtension}`
        },
    ],
    functions: [function extractTypeName({ code, system }) {/**/}],
};
```
# Snippet Files in detail
Snippet files contain the following properties : Commands, Functions, and Variables.
## commands
Each command in a snippet file has the following properties
### name 
The name of the command. Required
### prompt|template
prompt template to use for creating an OpenAI request.
Use can use system or user defined variable in template. variables will replaced with proper value while preparing request

To use system variable add `{system.*variableName*}` variableName can be one of Predefined System Variables. See below 

To use user variable add `{user.*variableName*}`. variableName must be in variables field in snippet file.

### handler
The handler is used to handle the OpenAI response. The default function used is replace. The handler function can be one of the predefined system functions or a user-defined function (although user-defined functions may be buggy).

You can set the handler in the following ways:

Just the function name: the function will run with default values:
```js
handler:'replace'
```

With arguments, to set the function arguments:

```js
handler: {
    func: 'replace',
    args: {
       textToReplace: 'user.answerModified'
    }
}
```
## Functions
TODO

## Variables
Any of the items in variables can be used in a command template. User-defined values must have the "user" prefix. For example, if testFileName is defined in variables, it can be used as user.TestFileName in the template file or passed to a function.

Variable values can be static or dynamic. For dynamic values, you should create a getter method. When calling the variable getter, system variables (see the predefined system variables) and functions are passed as arguments. The first argument is a system variable, and the second one is a function.

```js
module.exports = {
variables: [
    {
        //static
        name: "testingFramework",
        value: "xUnit"
    },
    {
        //dynamic
        name: "typeNameInResponse",
        value: ({ answer/*system variable*/ }, { extractTypeName/*user defined function*/ }) => extractTypeName({ code: answer })
    },
]
functions: [function extractTypeName({ code, system }) {/**/}],
commands: [
    {
        name: "Create DTO",
        template: `Create unit test with {user.testingFramework} for following class. 
        class:
        {system.selection}`,
        handler: {
            func: 'writeFile',
            args: {
                filePath: 'user.typeNameInResponse'/*usage for function arg*/
            }
        }
    }
]
}
```


In YAML or JSON snippet files, the value can also be a dynamic JavaScript method. To use a JavaScript method for a value, set it as string as follows:
```yaml
variables:
  testFileName: 
    js: ({ baseFolder,fileName,fileExtension }) => `${baseFolder}\\tests\\${fileName}.test.${fileExtension}`
```


# System variables and functions
### Predefined System Variables


| Variable Name        | Description                           |
| -------------------- | ------------------------------------- |
| system.selection     | Selected text in editor               |
| system.prompt        | Prepared OpenAI prompt                |
| system.answer        | OpenAI answer                         |
| system.language      | Programming language   of active file |
| system.baseFolder    | Project base path                     |
| system.fileName      | Name of active file                   |
| system.filePath      | Full path of active file              |
| system.fileExtension | Extension of active file              |



## Predefined System Function
| Function Name | Description           | params and default values                         |
| ------------- | --------------------- | ------------------------------------------------- |
| append        | Append Text           | textToAppend : system.answer<br> postion :'end'   |
| replace       | Replace selected text | textToReplace : system.answer                     |
| showWebView   | Show Webview          | prompt: system.prompt<br>answer: system.answer    |
| writeConsole  | Write text to console | content: system.answer                            |
| writeFile     | Write text to file    | filePath:<br>content: system.answer               |

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


