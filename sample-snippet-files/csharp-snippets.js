module.exports = {
    commands: [
        {
            name: "Generate DTO",
            template: `Dear OpenAI, please generate request and response DTO types for following method. No explanation needed, just give me code. 
            method:
            {system.selection}`,
            handler: {
                func: 'writeFile',
                args: {
                    filePath: 'user.typeNameInResponse'
                }
            }
        },
        {
            name: "Complete",
            template: `Complete following code piece. No explanation needed, just give me code. 
            method:
            {system.selection}`,
            handler: {
                func: 'append',
                args: {
                    position: 'end'
                }
            }
        },
        {
            name: "Cleanup",
            template: `Cleanup and reformat following code. No explanation needed, just give me code. 
            method:
            {system.selection}`,
            handler: 'replace'
        },
        {
            name: "Give advice for naming",
            template: `Give advice for naming this code snippet.
            code:
            {system.selection}`,
            handler: 'writeConsole'
        },
        {
            name: "Refactor for better performance",
            template: `Refactor following {system.language} code to get better performance and minimal memory usage. No explanation needed ,just give me code. 
            code:
            {system.selection}`,
            handler: 'append'
        },
        {
            name: "Write doc",
            template: `Create xml formated method documentation comments for following method.
            method:
            {system.selection}`,
            handler: {
                func: 'append',
                args: {
                    position: 'start'
                }
            }
        },
        {
            name: "Create Benchmark",
            template: `Create benchmark code to compare these methods. Use Benchmark.Net package. No explanation needed ,just give me code.
            code:
            {system.selection}`,
            handler: {
                func: 'writeFile',
                args: {
                    filePath: 'user.benchmarkFileName'
                }
            }
        },
    ],
    functions: [
        //ChatGPT generated
        function extractTypeName({ code, system }) {
            code = code ?? system?.answer;
            if (!code) return;
            // Use a regular expression to find a type declaration
            const typeDeclarationRegex = /(class|struct|record)\s+(\w+)/;
            const match = code.match(typeDeclarationRegex);

            // If a match was found, return the type name
            if (match && match.length > 2) {
                return match[2];
            }
        }
    ],
    variables: [
        {
            name: "typeNameInResponse",
            value: ({ answer }, { extractTypeName }) => extractTypeName({ code: answer })
        },
        {
            name: "benchmarkFileName",
            value: ({ baseFolder, fileName, fileExtension }) => `${baseFolder}\\Benchmark\\${fileName}.${fileExtension}`
        },
    ]
};