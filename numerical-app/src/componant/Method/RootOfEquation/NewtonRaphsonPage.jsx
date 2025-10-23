import BackButton from "../../BackButton";
import { Component } from "react";
import NewtonRaphsonMT from "./NewtonRaphsonMT";
import "../../GlobalStyle.css";
import ResultTable from "../../ResultTable";
import FormatLatex from "../../FormatLatex";

export default class NewtonRaphsonPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fn: "x^3-4x+1",
      xInitial: 0,
      error: 0.000001,
      errorMsg: "",
      errorPer: [],
      xRoot: [],
    };
  }
  render() {
    const { fn, xInitial, error, errorMsg, errorPer, xRoot } = this.state;
    return (
      <div className="page">
        <BackButton />
        <div className="container">
          <h1 style={{padding:"20px"}}>Newton Raphson</h1>
          <div>
            <FormatLatex fn={fn} />
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
              </NewtonRaphsonMT>
              
            </div>
            <ResultTable roots={xRoot} fxRoots={errorPer} />
          </div>
        </div>
      </div>
    );
  }
}
