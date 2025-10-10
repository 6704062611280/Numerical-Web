import React, { Component } from "react";
import { parse } from "mathjs";
import BackButton from "../../BackButton";
import "./BisectionPage.css";

class BisectionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fn: "x^3-x-2",
      a: 1,
      b: 2,
      error: 1e-7,
      root: null,
      errorMsg: "",
      iteration: 0,
    };
  }

  compileFn(text) {
    const node = parse(text);
    return (x) => node.evaluate({ x });
  }

  bisectionMethod = () => {
    this.setState({ errorMsg: "", root: null });

    let left = Number(this.state.a);
    let right = Number(this.state.b);
    let errorVal = Number(this.state.error);
    let f;
    let mid;
    let count = 0;

    if (isNaN(left) || isNaN(right) || isNaN(errorVal) || errorVal <= 0) {
      this.setState({
        errorMsg: "กรุณาใส่ค่า a, b, Error ให้ถูกต้อง (Error ต้องมากกว่า 0)",
      });
      return;
    }

    try {
      f = this.compileFn(this.state.fn);
    } catch (e) {
      this.setState({ errorMsg: "Error: Invalid function" });
      return;
    }

    while ((right - left) / 2 > errorVal) {
      mid = (left + right) / 2;
      if (f(mid) === 0) break;
      if (f(left) * f(mid) < 0) right = mid;
      else left = mid;
      count++;
    }

    this.setState({ root: mid, iteration: count });
  };

  render() {
    return (
      <div className="Bisec-page">
        <BackButton />
        <div className="Bisec-container">
          <h1>Bisection</h1>

          <div>
            <div>
              <label>f(x): </label>
              <input
                value={this.state.fn}
                onChange={(e) => this.setState({ fn: e.target.value })}
              />
            </div>

            <div>
              <label>a: </label>
              <input
                value={this.state.a}
                onChange={(e) => this.setState({ a: e.target.value })}
              />
            </div>

            <div>
              <label>b: </label>
              <input
                value={this.state.b}
                onChange={(e) => this.setState({ b: e.target.value })}
              />
            </div>

            <div>
              <label>er: </label>
              <input
                value={this.state.error}
                onChange={(e) => this.setState({ error: e.target.value })}
              />
            </div>

            <button onClick={this.bisectionMethod}>Calculate</button>

            <div>
              {this.state.errorMsg && (
                <p style={{ color: "red" }}>{this.state.errorMsg}</p>
              )}
              {this.state.root && (
                <p>
                  Root: {this.state.root} Iteration: {this.state.iteration}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BisectionPage;
