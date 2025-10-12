import BackButton from "../../BackButton";
import { Component } from "react";
import SecantMT from "./SecantMT";
export default class SecantPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fn: "x^3-4x+1",
      x0: 0,
      x1: 1,
      error: 0.000001,
      errorMsg: "",
      errorPer: [],
      xRoot: [],
    };
  }
  render() {
    const { fn, x0, x1, error, errorMsg, errorPer, xRoot } = this.state;
    return (
      <div>
        <BackButton />
        <div>
          <h1>Secant Method</h1>
          <div>
            {/* input */}
            <div>
              <label>x0</label>
              <input
                type="text"
                value={x0}
                onChange={(e) => this.setState({ x0: e.target.value })}
              />
            </div>
            <div>
              <label>x1</label>
              <input
                type="text"
                value={x1}
                onChange={(e) => this.setState({ x1: e.target.value })}
              />
            </div>
            <div>
              <label>f(x)</label>
              <input
                type="text"
                value={fn}
                onChange={(e) => this.setState({ fn: e.target.value })}
              />
            </div>
            <div>
              <label>error</label>
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
              onResult={({ xRoot, errorPer, errorMsg }) =>
                this.setState({ xRoot, errorPer, errorMsg })
              }
            >
              {({ Calculate }) => (
                <div>
                  <button onClick={Calculate}>Calculate</button>
                  {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
                </div>
              )}
            </SecantMT>
            <table>
              <thead>
                <tr>
                  <th>Iter</th>
                  <th>x</th>
                  <th>error</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(xRoot) && xRoot.length > 0 ? (
                  xRoot.map((item, index) => (
                    <tr key={index}>
                      <td>{index}</td>
                      <td>{Number(item).toFixed(6)}</td>
                      <td>{Number(errorPer[index]).toFixed(6)}</td>
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
