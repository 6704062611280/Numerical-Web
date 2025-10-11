import React, { Component } from "react";
import { parse } from "mathjs";
import BackButton from "../../BackButton";
import "./BisectionPage.css";
import BisectionMT from "./BisectionMT";
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
      errorMsg: "",
      iteration: 0,
    };
  }

  render() {
    const { fn, a, b, error, errorMsg, root, fxRoot } = this.state;
    return (
      <div className="Bisec-page">
        <BackButton />
        <div className="Bisec-container">
          <h1>Bisection</h1>

          <div>
            <div>
              <label>f(x): </label>
              <input
                value={fn}
                onChange={(e) => this.setState({ fn: e.target.value })}
              />
            </div>

            <div>
              <label>a: </label>
              <input
                value={a}
                onChange={(e) => this.setState({ a: e.target.value })}
              />
            </div>

            <div>
              <label>b: </label>
              <input
                value={b}
                onChange={(e) => this.setState({ b: e.target.value })}
              />
            </div>

            <div>
              <label>er: </label>
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
              onResult={({ root, fxRoot, errorMsg }) =>
                this.setState({ root, fxRoot, errorMsg })
              }
            >
              {({ Calculate }) => (
                <div>
                  <button onClick={Calculate}>Calculate</button>
                  {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
                </div>
              )}
            </BisectionMT>
            {/* <Plot
              data={[
                {
                  x: root,
                  y: fxRoot,
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
            /> */}
            <table>
              <thead>
                <tr>
                  <th>Iter</th>
                  <th>x</th>
                  <th>f(x)</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(root) && root.length > 0 ? (
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
}

export default BisectionPage;
