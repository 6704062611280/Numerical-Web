// import { useState } from "react";
import React, { Component } from "react";
import BackButton from "../../BackButton";
import Plot from "react-plotly.js";
import "./GraphicalPage.css";
import GraphicalMT from "./GraphicalMT";
// import { GraphicalMethod } from "./GraphicalMT";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

class GraphicalPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fn: "x^3-4x+1",
      a: "-1000",
      b: "1000",
      error: "0.000001",
      errorMsg: "",
      roots: [],
      fxRoots: [],
    };
  }
  Graphical = () => {
    const { fn, a, b, error } = this.state;
    this.setState({
      roots: [],
      fxRoots: [],
      errorMsg: "",
    });

    // setRoot([]);
    // setFxRoot([]);
    // setErrorMessage("");
    console.log("fn = ", fn, " ,a = ", a, " b = ", b, " error = ", error);
    // ตรวจสอบค่าว่าง
    if (!fn || !a || !b || !error) {
      this.setState({
        errorMsg: "กรุณากรอกค่า f(x), X Start, X End, และ Error ให้ครบ",
      });
      return;
    }
    //เรียก function
    const result = GraphicalMethod({ fn, a, b, error });
    //set errorMsg
    if (result.error) {
      this.setState({ errorMsg: result.error });
      // setErrorMessage(result.error);
    } else {
      this.setState({
        roots: result.roots,
        fxRoots: result.fxRoots,
      });
      // setRoot(result.roots);
      // setFxRoot(result.fx);
    }
  };
  //show Math text
  formatToLaTeX = (equation) => {
    return equation.replace(/\^(\d+)/g, "^{$1}");
  };

  render() {
    const { fn, a, b, error, roots, fxRoots, errorMsg } = this.state;
    //เรียงdata
    const sortedData = roots
      .map((val, i) => ({ x: val, y: fxRoots[i] }))
      .sort((a, b) => a.x - b.x); // เรียงจากน้อยไปมาก

    const sortedX = sortedData.map((d) => d.x);
    const sortedY = sortedData.map((d) => d.y);
    return (
      <div className="page">
        <BackButton />
        <div className="container">
          <h1 style={{ padding: "20px 0px 0px 0px" }}>Graphical Method</h1>
          <div>
            <h1 className="math-text">
              <BlockMath math={`f(x) = ${this.formatToLaTeX(fn)}`} />
            </h1>
            {/* input */}
            <div className="input-text">
              <div>
                <label htmlFor="fn">f(x)</label>
                <input
                  id="fn"
                  value={fn}
                  type="text"
                  onChange={(e) => this.setState({ fn: e.target.value })}
                  style={{ width: "250px" }}
                />
              </div>
              <div>
                <label htmlFor="a">X Start</label>
                <input
                  id="a"
                  value={a}
                  type="text"
                  onChange={(e) => this.setState({ a: e.target.value })}
                  style={{ width: "50px", marginRight: "10px" }}
                />
                <label htmlFor="b">X End</label>
                <input
                  id="b"
                  value={b}
                  type="text"
                  onChange={(e) => this.setState({ b: e.target.value })}
                  style={{ width: "50px" }}
                />
              </div>
              <div>
                <label htmlFor="error">Error</label>
                <input
                  id="error"
                  value={error}
                  type="text"
                  onChange={(e) => this.setState({ error: e.target.value })}
                />
              </div>

              <GraphicalMT fn={fn} a={a} b={b} error={error} 
                onResult={({roots,fxRoots,errorMsg}) => this.setState({ roots,fxRoots,errorMsg})}>
                {({Calculate}) => (
                  <div>
                    <button onClick={Calculate}>Calculate</button>
                    {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
                  </div>
                )}
              </GraphicalMT>
              {/* <div>
                <button onClick={this.Graphical}>Calculate</button>
              </div> */}
            </div>
            {/* {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>} */}


            {/* plot */}
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
            {/* table */}
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
                {roots.length > 0 ? (
                  roots.map((item, index) => (
                    <tr key={index}>
                      <td>{index}</td>
                      <td>{item.toFixed(6)}</td>
                      <td>{fxRoots[index].toFixed(6)}</td>
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

export default GraphicalPage;
