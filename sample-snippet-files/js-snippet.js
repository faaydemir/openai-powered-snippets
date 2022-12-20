module.exports = {
    commands: [
        {
            name: "Refactor ",
            template: `Refactor given {system.language} code.
            code:
            {system.selection}`,
            handler: 'replace'
        },
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
            name: "Complete.",
            template: `Complete following {system.language} function. Just give code
            code:
            {system.selection}`,
            handler:{
                func: 'append',
                args: {
                    position: 'end'
                }
            }
        },
        {
            name: "Cleanup AirBnB",
            template: `Cleanup and reformat, and fix lint errors on following code. Use Airbnb Style Guide. No explanation needed, just give me code. 
            method:
            {system.selection}`,
            handler: 'replace'
        },
        {
            name: "Explain following code",
            template: `Explain following code. And show me what can be improvements.
            code:
            {system.selection}`,
            handler: {
                func: 'showWebView',
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
                    position: 'user.start'
                }
            }
        },
    ],
    functions: [
        {
        }
    ],
    variables: [
        {
            name: "unitTestFramework",
            value: "test"
        },
        {
            name: "start",
            value: "start"
        },
        {
            name: "end",
            value: "end"
        },
        {
            name: "testFileName",
            value: ({ baseFolder,fileName,fileExtension }) => `${baseFolder}\\tests\\${fileName}.test.${fileExtension}`
        },
    ]
};