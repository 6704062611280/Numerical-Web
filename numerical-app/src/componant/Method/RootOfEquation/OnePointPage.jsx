import BackButton from "../../BackButton";
import { Component } from "react";
import OnePointMT from "./OnePointMT";
import "../../GlobalStyle.css";
import FormatLatex from "../../FormatLatex";
import Plot from "react-plotly.js"
import { evaluate } from "mathjs";

class OnePointPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gx: "(1+43x)/86",
      xInitial: 0.01,
      error: 0.000001,
      errorMsg: "",
      ePer: [],
      xRoot: [],
    };
  }
  render() {
    const { gx, xInitial, error, errorMsg, ePer, xRoot } = this.state;
    let plotData = [];
    if (xRoot.length > 0) {
      const xs = xRoot.filter((v) => isFinite(v));
      let minX = Math.min(...xs, -5) - 1;
      let maxX = Math.max(...xs, 5) + 1;
      if (minX === maxX) {
        minX -= 1;
        maxX += 1;
      }

      // สร้างจุดสำหรับ g(x)
      const dataX = [];
      const dataY = [];
      for (let x = minX; x <= maxX; x += (maxX - minX) / 200) {
        try {
          const y = evaluate(gx, { x });
          if (isFinite(y)) {
            dataX.push(x);
            dataY.push(y);
          }
        } catch {}
      }

      // สร้าง staircase (เส้นแดง)
      const stairX = [];
      const stairY = [];
      for (let i = 1; i < xRoot.length; i++) {
        const xOld = xRoot[i - 1];
        const xNew = xRoot[i];
        stairX.push(xOld, xOld, xNew);
        stairY.push(xOld, xNew, xNew);
      }

      plotData = [
        {
          x: dataX,
          y: dataY,
          type: "scatter",
          mode: "lines",
          name: "g(x)",
          line: { color: "green", width: 2 },
        },
        {
          x: dataX,
          y: dataX, //x = x, y = x
          type: "scatter",
          mode: "lines",
          name: "y = x",
          line: { color: "blue", width: 2 },
        },
        {
          x: stairX,
          y: stairY,
          type: "scatter",
          mode: "lines",
          name: "Iterations",
          line: { color: "red", width: 2 },
        },
      ];

      this.plotLayout = {
        title: "One-Point Iteration Graph",
        xaxis: { title: "X", zeroline: true, range: [minX, maxX] },
        yaxis: {
          title: "Y",
          zeroline: true,
          range: [minX, maxX],
          scaleanchor: "x",
          scaleratio: 1,
        },
        margin: { t: 50, l: 50, r: 30, b: 50 },
        dragmode: "pan",
        height: 450,
      };
    }
    return (
      <div className="page">
        <BackButton />
        <div className="container">
          <h1 style={{ padding: "20px" }}>One-point Iteration Methods</h1>
          <div>
            <FormatLatex fn={gx} text="x_{n+1}" />
            <div className="input-text">
              {/* input */}
              <div>
                <label>
                  x<sub>0</sub> Initial{" "}
                </label>
                <input
                  type="text"
                  value={xInitial}
                  onChange={(e) => this.setState({ xInitial: e.target.value })}
                />
              </div>
              <div>
                <label>
                  x<sub>n+1</sub>{" "}
                </label>
                <input
                  type="text"
                  value={gx}
                  onChange={(e) => this.setState({ gx: e.target.value })}
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

              <OnePointMT
                gx={gx}
                xInitial={xInitial}
                error={error}
                onResult={({ xRoot, ePer, errorMsg }) =>
                  this.setState({ xRoot, ePer, errorMsg })
                }
              >
                {({ Calculate }) => (
                  <div>
                    <button onClick={Calculate}>Calculate</button>
                    {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
                  </div>
                )}
              </OnePointMT>
            </div>

            {/* ✅ แสดงกราฟในหน้านี้เลย */}
          {plotData.length > 0 && (
            <div style={{ margin: "30px 0" }}>
              <Plot
                data={plotData}
                layout={this.plotLayout}
                config={{
                  responsive: true,
                  scrollZoom: true,
                  displayModeBar: true,
                }}
                style={{ width: "100%", height: "450px" }}
              />
            </div>
          )}
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
export default OnePointPage;
