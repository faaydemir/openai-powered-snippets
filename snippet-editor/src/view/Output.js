import Editor from '@monaco-editor/react'
import React from 'react'

export default function Output({ language, code }) {
  return (
    <>
      <h1>Output</h1>
      <Editor
        height="50vh"
        defaultLanguage={language}
        defaultValue={code}
      />
    </>
  )
}
