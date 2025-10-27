import React, { Component } from "react";
import BackButton from "../../BackButton";
import "../../GlobalStyle.css";
import BisectionMT from "./BisectionMT";
import ResultTable from "../../ResultTable";
import FormatLatex from "../../FormatLatex";
import { evaluate } from "mathjs";
import Plot from "react-plotly.js";

class BisectionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fn: "x^3-4x+1",
      a: -3,
      b: 3,
      error: 0.000001,
      root: [],
      fxRoot: [],
      ePer:[],
      errorMsg: "",
      iteration: 0,
    };
  }

  render() {
    const { fn, a, b, error, errorMsg, root, fxRoot,ePer } = this.state;
    return (
      <div className="page">
        <BackButton />
        <div className="container">
          <h1 style={{ padding: "20px" }}>Bisection</h1>

          <div>
            <FormatLatex fn={fn} text="f(x)" />
            <div className="input-text">
              <div>
                <label>f(x) </label>
                <input
                  value={fn}
                  onChange={(e) => this.setState({ fn: e.target.value })}
                />
              </div>

              <div>
                <label>a </label>
                <input
                  value={a}
                  onChange={(e) => this.setState({ a: e.target.value })}
                  style={{ width: "50px", marginRight: "10px" }}
                />
              </div>
              <div>
                <label>b </label>
                <input
                  value={b}
                  onChange={(e) => this.setState({ b: e.target.value })}
                  style={{ width: "50px", marginRight: "10px" }}
                />
              </div>

              <div>
                <label>Error </label>
                <input
                  value={error}
                  onChange={(e) => this.setState({ error: e.target.value })}
                />
              </div>

              <BisectionMT
                fn={fn}
                a={a}
                b={b}
                error={error}
                onResult={({ root, fxRoot, ePer,errorMsg }) =>
                  this.setState({ root, fxRoot, ePer,errorMsg })
                }
              >
                {({ Calculate }) => (
                  <div>
                    <button onClick={Calculate}>Calculate</button>
                    {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
                  </div>
                )}
              </BisectionMT>
            </div>
            <Plot
              data={[
                // เส้น f(x) แบบต่อเนื่อง
                {
                  x: (() => {
                    const p = root[root.length-1];
                    const xVals = [];
                    const start = parseFloat(a)-p;
                    const end = parseFloat(b)+p;
                    const step = (end - start) / 500; // สร้าง 500 จุดเพื่อเส้นต่อเนื่อง
                    for (let i = start; i <= end; i += step) {
                      xVals.push(i);
                      // console.log(i)
                    }
                    return xVals;
                  })(),
                  y: (() => {
                    const p = root[root.length-1];
                    const xVals = [];
                    const start = parseFloat(a)-p;
                    const end = parseFloat(b)+p;
                    const step = (end - start) / 500;
                    for (let i = start; i <= end; i += step) {
                      xVals.push(i);
                      // console.log(i)
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
                  line: { color: "blue", width: 2 },
                  name: "f(x)",
                  hoverinfo: "skip", // ปิด hover tooltip
                },
                // จุดรากที่หาเจอ
                {
                  x: root,
                  y: fxRoot,
                  type: "scatter",
                  mode: "markers",
                  marker: {
                    color: root.map((_, i) =>
                      i === root.length - 1 ? "green" : "red"
                    ), // เช็คจาก originalIndex
                    size: root.map((_, i) => (i === root.length - 1 ? 20 : 10)), // จุดสุดท้ายใหญ่กว่า
                    symbol: "circle",
                  },
                  name: "รากของสมการ (f(x)=0)",
                  hovertemplate: "x: %{x:.6f}<br>f(x): %{y:.6f}<extra></extra>",
                },
                // เส้นแกน y=0
                {
                  x: [parseFloat(a), parseFloat(b)],
                  y: [0, 0],
                  type: "scatter",
                  mode: "lines",
                  line: { color: "black", width: 1, dash: "dash" },
                  name: "y = 0",
                  hoverinfo: "skip",
                },
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
            <ResultTable roots={root} fxRoots={fxRoot} ePer={ePer}/>
          </div>
        </div>
      </div>
    );
  }
}

export default BisectionPage;
