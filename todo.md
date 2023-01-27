# TODO
* modify readme
* write and add sample snippets
* add pre-defined commands ??
* add github action
* investigate writeConsole multiple channel bug
* watch snippet files for changes
------  
* add yaml support
* implement json import
* add license
* make system variables lazy if possible
* unit test
* check if there is a vscode setting type for secrets or key
* add checks > isKeySet, isFileSet etc
* make improvements on error handling
* take user input. is there is {input.variableName} in template get value from user
* add position param to append function
* add command handler decorator to
  * handle errors
  * check inputs
  * ...
 
## TEST
* enable remote snippet file usage


## DONE
* accept string value in command handler args
* set default handler
* add shortcut
* add missing system variables

   | Variable Name        | Status |
   | -------------------- | ------ |
   | system.selection     | ok     |
   | system.question      | ok     |
   | system.answer        | ok     |
   | system.language      | ok     |
   | system.baseFolder    | ok     |
   | system.fileName      | ok     |
   | system.filePath      | ok     |
   | system.fileFolder    | ok     |
   | system.fileExtension | ok     |