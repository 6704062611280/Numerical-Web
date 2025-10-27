import BackButton from "../../BackButton";
import { Component } from "react";
import NewtonRaphsonMT from "./NewtonRaphsonMT";
import "../../GlobalStyle.css";
import ResultTable from "../../ResultTable";
import FormatLatex from "../../FormatLatex";
import { evaluate } from "mathjs";
import Plot from "react-plotly.js";

export default class NewtonRaphsonPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fn: "x^3-4x+1",
      xInitial: 0,
      error: 0.000001,
      errorMsg: "",
      ePer: [],
      xRoot: [],
      fxRoot:[],
      lineX:[],
      lineY:[]
    };
  }
  render() {
    const { fn, xInitial, error, fxRoot, errorMsg, lineX,lineY,ePer, xRoot } = this.state;
    const iterationLines = lineX.map((point, i) => ({
      x: point, // สมมติว่า lineX[i] เป็น array [x1, x2]
      y: lineY[i], // สมมติว่า lineY[i] เป็น array [y1, y2]
      type: "scatter",
      mode: "lines+markers",
      line: { color: "red"},
      marker: {color:"black"},
      name: `f'(x${i + 1})`,
    }));
    return (
      <div className="page">
        <BackButton />
        <div className="container">
          <h1 style={{ padding: "20px" }}>Newton Raphson</h1>
          <div>
            <FormatLatex fn={fn} text="f(x)" />
            <div className="input-text">
              {/* input */}
              <div>
                <label>X Initial </label>
                <input
                  type="text"
                  value={xInitial}
                  onChange={(e) => this.setState({ xInitial: e.target.value })}
                />
              </div>
              <div>
                <label>f(x) </label>
                <input
                  type="text"
                  value={fn}
                  onChange={(e) => this.setState({ fn: e.target.value })}
                />
              </div>
              <div>
                <label>Error </label>
                <input
                  type="text"
                  value={error}
                  onChange={(e) => this.setState({ error: e.target.value })}
                />
              </div>

              <NewtonRaphsonMT
                fn={fn}
                xInitial={xInitial}
                error={error}
                onResult={({ xRoot, fxRoot,ePer, lineX, lineY, errorMsg }) =>
                  this.setState({ xRoot, fxRoot,ePer, lineX, lineY, errorMsg })
                }
              >
                {({ Calculate }) => (
                  <div>
                    <button onClick={Calculate}>Calculate</button>
                    {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
                  </div>
                )}
              </NewtonRaphsonMT>
            </div>
            {/* -----------------------------
                            🔹 ส่วนกราฟ (Plotly)
                           ----------------------------- */}
            <Plot
              data={[
                // เส้น f(x) แบบต่อเนื่อง
                {
                  x: (() => {
                    const xVals = [];
                    const start = parseFloat(xInitial);
                    const end = start * 2+1;

                    let step = (end - start) / 500; // สร้าง 500 จุดเพื่อเส้นต่อเนื่อง
                    // ป้องกัน step = 0
                    if (step === 0){
                      step = 1;
                    }
                    for (let i = start; i <= end; i += step) {
                      xVals.push(i);
                    }
                    return xVals;
                  })(),
                  y: (() => {
                    const xVals = [];
                    const start = parseFloat(xInitial);
                    const end = start * 2+1;
                    let step = (end - start) / 500;
                    // ป้องกัน step = 0
                    if (step === 0) {step = 1;}
                    for (let i = start; i <= end; i += step) {
                      xVals.push(i);
                    }
                    return xVals.map((x) => {
                      try {
                        return evaluate(fn, { x });
                      } catch {
                        return null;
                      }
                    });
                  })(),
                  type: "scatter",
                  mode: "lines",
                  line: { color: "blue", width: 2, },
                  name: "f(x)",
                  hoverinfo: "skip", // ปิด hover tooltip
                },
                ...iterationLines
              ]}
              layout={{
                width: 1000,
                height: 440,
                title: "กราฟแสดง f(x) และจุดตัดแกน x",
                xaxis: { title: "แกน X", zeroline: true },
                yaxis: {
                  title: "แกน Y",
                  zeroline: true,
                },
                showlegend: true,
                legend: { x: 1, y: 1 },
                dragmode: "pan", // เปิดใช้การลากกราฟเพื่อเลื่อนดู
              }}
              config={{
                scrollZoom: true, // เปิดใช้ scroll mouse ซูม
                displayModeBar: true, // แสดงแถบเครื่องมือ
                displaylogo: false, // ซ่อนโลโก้ Plotly
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
                  <th>Iter</th>
                  <th>รากที่หาได้ (x)</th>
                  <th>error</th>
                </tr>
              </thead>
              <tbody>
                {xRoot.length > 0 ? (
                  xRoot.map((item, index) => (
                    <tr key={index}>
                      <td>{index}</td>
                      <td>{item.toFixed(6)}</td>
                      <td>{Math.abs(ePer[index] * 100).toFixed(6)}%</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
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
}
