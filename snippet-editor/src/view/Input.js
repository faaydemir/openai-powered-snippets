import Editor from '@monaco-editor/react'
import React, { useRef } from 'react'
let editor

export default function Input({ code, filePath, onSelectedChange, onFileNameChange, onLanguageChange }) {

    const monacoRef = useRef(null);

    function resizeEditor() {
        editor?.layout();
    }
    window.addEventListener('resize', resizeEditor);
    function handleEditorDidMount(_editor, monaco2) {
        editor = _editor
        monacoRef.current = monaco2;
        editor?.onDidChangeModelLanguage((...args) => {
            alert(args)
        })
        editor?.onDidChangeModel((...args) => {
            onFileNameChange && onLanguageChange(editor.getModel().getLanguageId())
        })
        editor?.onDidChangeCursorSelection((selection) => {
            const selectedText = editor.getModel().getValueInRange(selection.selection);
            if (onSelectedChange) onSelectedChange(selectedText);
        })

    }

    const handleChange = (...args) => {
        // console.log(args);
    }

    return (
        <>
            <h1>Editor</h1>
            <div className='input-filename'>
                <span>file</span>
                <input value={filePath} onChange={onFileNameChange && ((event) => onFileNameChange(event.target.value))} />
            </div>
            <Editor
                height="45vh"
                options={{ minimap: { enabled: false } }}
                defaultValue={code}
                onChange={handleChange}
                onMount={handleEditorDidMount}
                path={filePath}
            />
        </>
    )
}
