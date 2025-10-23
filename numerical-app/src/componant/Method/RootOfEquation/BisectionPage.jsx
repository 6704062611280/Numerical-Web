import React, { Component } from "react";
import BackButton from "../../BackButton";
import "../../GlobalStyle.css";
import BisectionMT from "./BisectionMT";
import ResultTable from "../../ResultTable";
import FormatLatex from "../../FormatLatex";

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
      <div className="page">
        <BackButton />
        <div className="container">
          <h1 style={{padding:"20px"}}>Bisection</h1>

          <div>
            <FormatLatex fn={fn} />
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

              

              
            </div>
            <ResultTable roots={root} fxRoots={fxRoot} />
          </div>
        </div>
      </div>
    );
  }
}

export default BisectionPage;
