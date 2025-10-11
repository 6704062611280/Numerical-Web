// FalsePositionPage.jsx
import React, { Component } from "react";
import BackButton from "../../BackButton";
import FalsePositionMT from "./FalsePositionMT";

class FalsePositionPage extends Component {
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
    };
  }

  render() {
    const { fn, a, b, error, root, fxRoot, errorMsg } = this.state;

    return (
      <div>
        <BackButton />
        <div className="container">
          <h1>False-Position</h1>

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
            <label>b: </label>
            <input
              value={b}
              onChange={(e) => this.setState({ b: e.target.value })}
            />
          </div>

          <div>
            <label>Error: </label>
            <input
              value={error}
              onChange={(e) => this.setState({ error: e.target.value })}
            />
          </div>

          <FalsePositionMT
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
          </FalsePositionMT>

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
                    <td>{fxRoot[index]?.toFixed(6)}</td>
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
    );
  }
}

export default FalsePositionPage;
