import { useState } from "react";
import BackButton from "../../BackButton";
import Plot from "react-plotly.js";
import "./GraphicalPage.css";
import { GraphicalMethod } from "./GraphicalMT";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

export default function GraphicalPage() {
  const [fn, setFn] = useState("x^3-4x+1");
  const [a, setA] = useState("-3");
  const [b, setB] = useState("3");
  const [error, setError] = useState("0.000001");
  const [errorMessage, setErrorMessage] = useState("");
  const [root, setRoot] = useState([]);
  const [fxRoot, setFxRoot] = useState([]);

  function Graphical() {
    setRoot([]);
    setFxRoot([]);
    setErrorMessage("");

    // ตรวจสอบค่าว่าง
    if (!fn || !a || !b || !error) {
    setErrorMessage("กรุณากรอกค่า f(x), X Start, X End, และ Error ให้ครบ");
    return;
  }
    const result = GraphicalMethod({ fn, a, b, error });

    if (result.error) {
      setErrorMessage(result.error);
    } else {
      setRoot(result.roots);
      setFxRoot(result.fx);
    }
  }

  function formatToLaTeX(equation) {
    return equation.replace(/\^(\d+)/g, "^{$1}");
  }

  const sortedData = root
    .map((val, i) => ({ x: val, y: fxRoot[i] }))
    .sort((a, b) => a.x - b.x); // เรียงจากน้อยไปมาก

  const sortedX = sortedData.map((d) => d.x);
  const sortedY = sortedData.map((d) => d.y);

  return (
    <div className="page">
      <BackButton />
      <div className="container">
        <h1 style={{padding:"20px 0px 0px 0px"}}>Graphical Method</h1>
        <div>
          <h1 className="math-text">
            <BlockMath math={`f(x) = ${formatToLaTeX(fn)}`} />
          </h1>
          <div className="input-text">
            <div>
              <label htmlFor="fn">f(x)</label>
              <input
                id="fn"
                value={fn}
                type="text"
                onChange={(e) => setFn(e.target.value)}
                style={{width : "250px"}}
              />
            </div>
            <div>
              <label htmlFor="a">X Start</label>
              <input
                id="a"
                value={a}
                type="text"
                onChange={(e) => setA(e.target.value)}
                style={{width : "50px",marginRight : "10px"}}
              />
              <label htmlFor="b">X End</label>
              <input
                id="b"
                value={b}
                type="text"
                onChange={(e) => setB(e.target.value)}
                style={{width : "50px"}}
              />
            </div>
            <div>
              <label htmlFor="error">Error</label>
              <input
                id="error"
                value={error}
                type="text"
                onChange={(e) => setError(e.target.value)}
              />
            </div>
            <div>
              <button onClick={Graphical}>Calculate</button>
            </div>
          </div>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <Plot
            data={[
              {
                x: sortedX,
                y: sortedY,
                type: "scatter",
                mode: "lines+markers",
                line: { color: "blue" },
                marker: { color: "red" },
              },
            ]}
            layout={{
              width: 1000,
              height: 440,
              title: "กราฟเส้นตัวอย่าง",
              xaxis: { title: "แกน X" },
              yaxis: {
                title: "แกน Y",
                autorange: true, // ให้ Plotly ปรับ max อัตโนมัติ
                range: [0, null], // min = 0, max = auto
              },
            }}
          />
          <table
            className="nice-table"
            border="1"
            cellPadding="10"
            style={{ marginTop: "20px" }}
          >
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>รากที่หาได้ (x)</th>
                <th>f(x)</th>
              </tr>
            </thead>
            <tbody>
              {root.length > 0 ? (
                root.map((item, index) => (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>{item.toFixed(6)}</td>
                    <td>{fxRoot[index].toFixed(6)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    style={{ textAlign: "center", color: "#666" }}
                  >
                    ยังไม่มีข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
