import BackButton from "../../BackButton";
import { Component } from "react";
import SecantMT from "./SecantMT";
import "../../GlobalStyle.css";
import ResultTable from "../../ResultTable";
import FormatLatex from "../../FormatLatex";
import Plot from "react-plotly.js";
import { evaluate, i } from "mathjs";

export default class SecantPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fn: "x^3-4x+1",
      x0: 0,
      x1: 1,
      error: 0.000001,
      errorMsg: "",
      ePer: [],
      xRoot: [],
      fxRoot: [],
      lineX: [],
      lineY: [],
    };
  }

  render() {
    const { fn, x0, x1, error, errorMsg, ePer, fxRoot, lineX, lineY, xRoot } =
      this.state;
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
          <h1 style={{ padding: "20px" }}>Secant Method</h1>
          <div>
            <FormatLatex fn={fn} text="f(x)" />
            <div className="input-text">
              {/* input */}
              <div>
                <label>
                  x<sub>0</sub>{" "}
                </label>
                <input
                  type="text"
                  value={x0}
                  onChange={(e) => this.setState({ x0: e.target.value })}
                />
              </div>
              <div>
                <label>
                  x<sub>1</sub>{" "}
                </label>
                <input
                  type="text"
                  value={x1}
                  onChange={(e) => this.setState({ x1: e.target.value })}
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

              <SecantMT
                fn={fn}
                x0={x0}
                x1={x1}
                error={error}
                onResult={({ xRoot, fxRoot, ePer, lineX, lineY, errorMsg }) =>
                  this.setState({ xRoot, fxRoot, ePer, lineX, lineY, errorMsg })
                }
              >
                {({ Calculate }) => (
                  <div>
                    <button onClick={Calculate}>Calculate</button>
                    {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
                  </div>
                )}
              </SecantMT>
            </div>

            <Plot
              data={[
                // เส้น f(x) แบบต่อเนื่อง
                {
                  x: (() => {
                    const p = xRoot[xRoot.length - 1];
                    const xVals = [];
                    let start = parseFloat(x0) - p;
                    let end = parseFloat(x1) + p;
                    // if(end === start){
                    //   end = end ;
                    //   start = start -100;
                    // }
                    const step = (end - start) / 500; // สร้าง 500 จุดเพื่อเส้นต่อเนื่อง

                    for (let i = start; i <= end; i += step) {
                      xVals.push(i);
                      // console.log(i);
                    }
                    return xVals;
                  })(),
                  y: (() => {
                    const p = xRoot[xRoot.length - 1];
                    const xVals = [];
                    let start = parseFloat(x0) - p;
                    let end = parseFloat(x1) + p;
                    // if(end === start){
                    //   end = end + 100;
                    //   start = start -100;
                    // }
                    const step = (end - start) / 500;
                    for (let i = start; i <= end; i += step) {
                      xVals.push(i);
                      // console.log(i);
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
                ...iterationLines,

                // เส้นแกน y=0
                {
                  x: [parseFloat(x0), parseFloat(x1)],
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
            <ResultTable roots={xRoot} fxRoots={fxRoot} ePer={ePer} />
          </div>
        </div>
      </div>
    );
  }
}
