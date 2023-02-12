import SnippetEditor from './view/Editor';
import Simulator from './view/Input';
import { useEffect, useState } from 'react';
import { codeSamples, defaultSnippets } from './constants';
import { importFile } from './extension/extension';
import Context from './view/Context';
import getCommandRunnerContext from './extension/core/command-runner-context';
import { systemVariableNames } from './extension/core/pre-defined-variables';
import Variable from './extension/core/variable';
import getFileNameAndExtension from './extension/core/utils/path';

function App() {

  const [context, setContext] = useState({
    commands: [],
    userVariables: [],
    systemVariables: []
  });
  const [command, setCommand] = useState();

  const [snippet, setSnippet] = useState({
    language: "yaml",
    code: defaultSnippets["yaml"]
  })

  const [sampleCode, setSampleCode] = useState({
    filePath: "src/test.js",
    language: "javascript",
    selection: undefined,
    code: codeSamples.javascript.fibonacci
  });
  function handleSnippetChange(snippet) {
    setSnippet((pre) => ({ ...pre, code: snippet }));
  }
  function handleSnippetLanguageChange(language) {
    setSnippet((pre) => ({ ...pre, language }));
  }
  function handleCommandChange(selectedCommand) {
    setCommand(selectedCommand);
  }

  function handleFileNameChange(filePath) {
    setSampleCode((pre) => ({ ...pre, filePath }))
  }
  function handleLanguageChange(language) {
    setSampleCode((pre) => ({ ...pre, language }))
  }
  function handleSelectionChange(selection) {
    setSampleCode((pre) => ({ ...pre, selection }))
  }

  function syncContext() {
    const commandContextcontext = getCommandRunnerContext();
    commandContextcontext.setSystemVariable(new Variable(systemVariableNames.baseFolder, "src"));
    commandContextcontext.setSystemVariable(new Variable(systemVariableNames.selection, sampleCode.selection));
    commandContextcontext.setSystemVariable(new Variable(systemVariableNames.language, sampleCode.language));
    commandContextcontext.setSystemVariable(new Variable(systemVariableNames.filePath, sampleCode.filePath));
    const { extension, fileName, fileFolder } = getFileNameAndExtension(sampleCode.filePath);
    commandContextcontext.setSystemVariable(new Variable(systemVariableNames.fileName, fileName));
    commandContextcontext.setSystemVariable(new Variable(systemVariableNames.fileExtension, extension));
    commandContextcontext.setSystemVariable(new Variable(systemVariableNames.fileFolder, fileFolder));

    if (command) {
      const prompt = command.prepare(
        commandContextcontext?.getSystemVariables(),
        commandContextcontext?.getUserVariables()
      );
      commandContextcontext.setSystemVariable(new Variable(systemVariableNames.prompt, prompt));
    }

    setContext({
      commands: commandContextcontext?.commands,
      userVariables: commandContextcontext?.getUserVariables(),
      systemVariables: commandContextcontext?.getSystemVariables(),
    });
  }

  function load() {
    importFile(snippet.code, snippet.language);
  }

  useEffect(() => {
    syncContext();
  }, [snippet, sampleCode, command]);

  useEffect(() => {
    load();
    syncContext();
  }, [snippet]);

  return (
    <div className="container">
      <div className='column'>
        <SnippetEditor {...snippet} onCodeChange={handleSnippetChange} onLanguageChange={handleSnippetLanguageChange} />
        <Simulator code={sampleCode.code} filePath={sampleCode.filePath} onSelectedChange={handleSelectionChange} onFileNameChange={handleFileNameChange} onLanguageChange={handleLanguageChange} />

      </div>
      <div className='column'>
        <Context {...context} onCommandRun={handleCommandChange}></Context>
      </div>
    </div>
  );
}

export default App;
