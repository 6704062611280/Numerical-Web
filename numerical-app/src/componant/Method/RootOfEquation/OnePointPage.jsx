import BackButton from "../../BackButton";
import { Component } from "react";
import OnePointMT from "./OnePointMT";
import "../../GlobalStyle.css";
import ResultTable from "../../ResultTable";
import FormatLatex from "../../FormatLatex";

class OnePointPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gx: "(4x-1)^(1/3)",
      xInitial: 0,
      error: 0.000001,
      errorMsg: "",
      errorPer: [],
      xRoot: [],
    };
  }
  render() {
    const { gx, xInitial, error, errorMsg, errorPer, xRoot } = this.state;
    return (
      <div className="page">
        <BackButton />
        <div className="container">
          <h1 style={{padding:"20px"}}>One-point Iteration Methods</h1>
          <div>
            <FormatLatex fn={gx} />
            <div className="input-text">
              {/* input */}
              <div>
                <label>x Initial </label>
                <input
                  type="text"
                  value={xInitial}
                  onChange={(e) => this.setState({ xInitial: e.target.value })}
                />
              </div>
              <div>
                <label>gx </label>
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
              </OnePointMT>
              
            </div>
            <ResultTable roots={xRoot} fxRoots={errorPer} />
          </div>
        </div>
      </div>
    );
  }
}
export default OnePointPage;
