export const defaultSnippets = {

yaml:
`commands:
- name: Generate DTO
  prompt: |
    Dear OpenAI, please generate request and response DTO types for following method. No explanation needed, just give me code.
    method:
    {system.selection}
  handler:
    func: writeFile
    args:
      filePath: user.typeNameInResponse

- name: Complete
  prompt: |
    Complete following code piece. No explanation needed, just give me code.
    method:
    {system.selection}
  handler:
    func: append
    args:
      position: end

- name: Cleanup
  prompt: |
    Cleanup and reformat following code. No explanation needed, just give me code.
    method:
    {system.selection}
  handler: replace

- name: Give advice for naming
  prompt: |
    Give advice for naming this code snippet.
    code:
    {system.selection}
  handler: writeConsole

- name: Refactor for better performance
  prompt: |
    Refactor following {system.language} code to get better performance and minimal memory usage. No explanation needed ,just give me code.
    code:
    {system.selection}
  handler: append

- name: Write doc
  prompt: |
    Create xml formated method documentation comments for following method.
    method:
    {system.selection}
  handler:
    func: append
    args:
      position: start
      
- name: Create unit test.
  prompt: |
    Create unit test in {user.unitTestFramework} framework for following function. 
    code:
    {system.selection}
  handler: 
      func: 'writeFile'
      args: 
          filePath: 'user.testFileName'
        
variables:
- name: typeNameInResponse
  value:
    js: "({ answer }, { extractTypeName }) => extractTypeName({ code: answer })"

- name: testFileName
  value:
    js: ({ baseFolder,fileName,fileExtension }) => \`$\{baseFolder}\\\\tests\\$\{fileName}.test.$\{fileExtension}\`

functions:
- |
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


`
}



export const codeSamples = {
  javascript: {
    fibonacci:
      `function fibonacci(n) {
    return n < 1 ? 0
      : n <= 2 ? 1
      : fibonacci(n - 1) + fibonacci(n - 2)
}`
  }
}