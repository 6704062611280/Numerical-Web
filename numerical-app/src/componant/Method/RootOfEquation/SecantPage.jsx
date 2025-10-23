import BackButton from "../../BackButton";
import { Component } from "react";
import SecantMT from "./SecantMT";
import "../../GlobalStyle.css";
import ResultTable from "../../ResultTable";
import FormatLatex from "../../FormatLatex";

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
      <div className="page">
        <BackButton />
        <div className="container">
          <h1 style={{ padding: "20px" }}>Secant Method</h1>
          <div>
            <FormatLatex fn={fn} />
            <div className="input-text">
              {/* input */}
              <div>
                <label>x<sub>0</sub> </label>
                <input
                  type="text"
                  value={x0}
                  onChange={(e) => this.setState({ x0: e.target.value })}
                />
              </div>
              <div>
                <label>x<sub>1</sub> </label>
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
            </div>
            <ResultTable roots={xRoot} fxRoots={errorPer} />
          </div>
        </div>
      </div>
    );
  }
}
