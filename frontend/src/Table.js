import React from 'react';

function TableHeader() {
  return (
    <thead>
      <tr>
        <th>Medication Name</th>
        <th>Dosage</th>
      </tr>
    </thead>
  );
}

function TableBody (props) {
  const rows = props.characterData.map((row, index) => {
    return (
      <tr key={index}>
        <td>{row.medication}</td>
        <td>{row.dosage}</td>
        <td>
          <button onClick={() => props.removeCharacter(index)}>Delete</button>
        </td>
      </tr>
    );
  });
  return (
      <tbody>
         {rows}
      </tbody>
   );
}

function Table(props) {
   return(
      <table>
        <TableHeader/>
        <TableBody characterData={props.characterData} removeCharacter={props.removeCharacter} />
      </table>
   );
}
export default Table;