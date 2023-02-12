import Editor from '@monaco-editor/react'
import React, { useEffect, useRef } from 'react'

let editor;
export default function SnippetEditor({ code, language, onCodeChange, onLanguageChange }) {

    const monacoRef = useRef(null);


    function resizeEditor() {
        //TODO move outside of component
        editor?.layout();
    }

    window.addEventListener('resize', resizeEditor);

    function handleEditorDidMount(_editor, monaco) {
        editor = _editor
    }

    const handleChange = (code) => {
        if (onCodeChange) {
            onCodeChange(code);
        }
    }

    return (<>
        <h1>Snippet</h1>
        <div className='input-filename'>
            <span>lang</span>
            <select name="lang" onChange={(event) => { onLanguageChange && onLanguageChange(event.target.value) }}>
                <option value="yaml">yaml</option>
                <option value="json">json</option>
                <option value="javascript">js</option>
            </select>
        </div>
        <Editor
            height="45vh"
            width={"100%"}
            options={{ minimap: { enabled: false }, automaticLayout: { enabled: true } }}
            defaultLanguage={language}
            defaultValue={code}
            language={language}
            onChange={handleChange}
            onMount={handleEditorDidMount}
        />
    </>
    )
}
