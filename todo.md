# TODO
* modify readme
   - link to create user in open ai
   - link add token 
   - new gif for yaml 
   -
* write and add sample snippets
* add github action
* fix writeConsole multiple channel bug
* watch snippet files for changes
* create another repo for snippets
------  
* add pre-defined commands ??
* add license
* make system variables lazy if possible
* unit test
* add checks > isKeySet, isFileSet etc
* make improvements on error handling
* take user input. use it with {user.input} in template get value from user
* add command handler decorator to
  * handle errors
  * check inputs
  * ...
* check package.json https://code.visualstudio.com/api/references/extension-manifest
* make code review
* snippet filter base on language. if snippet language is js dont't show for py file 
## TEST
* add editor
   - add editor with better ui
* enable remote snippet file usage
* read snippets from folder (read all or add a file contains all snippets snippet/* etc)
* show process 
    - for loading https://code.visualstudio.com/api/ux-guidelines/status-bar
    - for error https://code.visualstudio.com/api/ux-guidelines/notifications#progress-notification
## DONE
* add position param to append function ??
* add yaml support
* implement json import
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