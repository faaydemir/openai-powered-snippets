import React from 'react'


function Variables({ variables }) {
  return variables && <table>
    {variables && Object.keys(variables).map(v => <tr>
      <td style={{width:150}}>{v}</td>
      <td><pre>{variables[v]}</pre></td>
    </tr>)}
  </table >
}

function Commands({ commands, onCommandRun }) {

  let commandValues = commands ? Object.values(commands) : [];
  return commands && <table>
    {commands && commandValues.map(c => <tr>
      <td style={{width:150}}>{c.name}</td>
      <td><button onClick={onCommandRun && (() => onCommandRun(c))}>prepare prompt</button></td>
    </tr>)}
  </table >
}

export default function Context({ commands, userVariables, systemVariables, onCommandRun }) {
  return (
    <>
      <h1>Snippet Context</h1>
      <h5>Commands</h5>
      <Commands commands={commands} onCommandRun={onCommandRun} />
      <h5>User Variables</h5>
      <Variables variables={userVariables} />
      <h5>System Variables</h5>
      <Variables variables={systemVariables} />
    </>
  )
}
