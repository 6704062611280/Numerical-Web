import React from "react";
import "./GlobalStyle.css"; // ✅ ดึง CSS รวมที่เราทำไว้ก่อนหน้า (nice-table)

export default function ResultTable({ roots = [], fxRoots = [] ,ePer = []}) {
  console.log("🔍 ResultTable Props:", { 
    rootsLength: roots.length, 
    fxRootsLength: fxRoots.length, 
    ePerLength: ePer.length,
    ePer 
  });
  return (
    <table
      className="nice-table"
      border="1"
      cellPadding="10"
      style={{ marginTop: "20px" }}
    >
      <thead>
        <tr>
          <th>Iter</th>
          <th>รากที่หาได้ (x)</th>
          <th>f(x)</th>
          <th>error</th>
        </tr>
      </thead>
      <tbody>
        {roots.length > 0 ? (
          roots.map((item, index) => (
            <tr key={index}>
              <td>{index}</td>
              <td>{item.toFixed(6)}</td>
              <td>{fxRoots[index].toFixed(6)}</td>
              <td>{Math.abs((ePer[index]*100)).toFixed(6)}%</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" style={{ textAlign: "center", color: "#666" }}>
              ยังไม่มีข้อมูล
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
