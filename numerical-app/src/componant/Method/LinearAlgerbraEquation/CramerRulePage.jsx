import { Component } from "react";
import BackButton from "../../BackButton";
import { matrix, max, det } from "mathjs";
import "../../GlobalStyle.css";

export default class CramerRulePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size_matrix: 3,
      matrixA: [
        [4, -4, 0],
        [-1, 4, -2],
        [0, -2, 4],
      ],
      matrixVariable: ["", "", ""],
      matrixB: [400, 400, 400],
      errorMsg: "",
      maxIteration: 100,
      tolerance: 0.000001,
      matrix_result: [],
      matrix_error: [],
    };
  }

  Calculate = () => {
    const Det_A = det(matrix(this.state.matrixA));
    if (Det_A === 0) {
      this.setState({ errorMsg: "เมทริกซ์ A มีค่า Determinant เป็นศูนย์" });
      return;
    }

    const vars = [];
    for (let col = 0; col < this.state.size_matrix; col++) {
      const newMatrix = this.state.matrixA.map((row, r) =>
        row.map((val, c) => (c === col ? this.state.matrixB[r] : val))
      );
      vars.push(det(matrix(newMatrix)) / Det_A);
    }
    // console.log(vars);
    const resultAns = [];
    for (let i = 0; i < vars.length; i++) {
      resultAns[i] = vars[i];
    }
    this.setState({ matrix_result: resultAns, errorMsg: "" });
  };

  handleGenerate = () => {
    if (this.state.size_matrix > 10) {
      this.setState({ errorMsg: "ขนาดเมทริกซ์ต้องไม่เกิน 10" });
      return;
    }
    const size = parseInt(this.state.size_matrix);
    const newMatrixA = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => "")
    );
    this.setState({ matrixA: newMatrixA });

    const newMatrixVariable = Array.from({ length: size }, () => "");
    this.setState({ matrixVariable: newMatrixVariable });

    const newMatrixB = Array.from({ length: size }, () => "");
    this.setState({ matrixB: newMatrixB, errorMsg: "" });
  };

  handleChangeMatrixA = (r, c, value) => {
    const newMatrixA = this.state.matrixA.map((row, rowIndex) =>
      row.map((col, colIndex) =>
        rowIndex === r && colIndex == c ? value : col
      )
    );
    this.setState({ matrixA: newMatrixA });
  };

  handleChangeMatrixB = (r, value) => {
    const newMatrixB = this.state.matrixB.map((val, index) =>
      index === r ? value : val
    );
    this.setState({ matrixB: newMatrixB });
  };

  render() {
    const {
      size_matrix,
      matrixA,
      matrixB,
      matrixVariable,
      matrix_result,
      errorMsg,
    } = this.state;
    return (
      <div className="page">
        <BackButton />
        <div className="container">
          <h1 style={{ padding: "20px" }}>Cramer's Rule</h1>

          <div className="input-text">
            <label>Matrix size : </label>
            <input
              type="text"
              value={size_matrix}
              onChange={(e) => this.setState({ size_matrix: e.target.value })}
            />
            <button onClick={this.handleGenerate}>Generate</button>
          </div>
          <div>{errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}</div>

          {/* Show MatrixInput */}
          <div className="matrix-container">
            {/* ---------------- [A] ---------------- */}
            <div className="matrix-box">
              <p className="matrix-title">[A]</p>
              <div
                className="matrix-grid"
                style={{
                  gridTemplateColumns: `repeat(${size_matrix}, 60px)`,
                }}
              >
                {matrixA.map((row, r) =>
                  row.map((val, c) => (
                    <input
                      className="matrix-input"
                      key={`A-${r}-${c}`}
                      type="number"
                      value={val}
                      placeholder={`a${r + 1}${c + 1}`}
                      onChange={(e) =>
                        this.handleChangeMatrixA(r, c, e.target.value)
                      }
                    />
                  ))
                )}
              </div>
            </div>

            {/* ---------------- × ---------------- */}
            <span className="symbol">×</span>

            {/* ---------------- {X} ---------------- */}
            <div className="vector-box">
              <p className="vector-title">{"{X}"}</p>
              <div className="vector-grid">
                {matrixVariable.map((val, r) => (
                  <input
                    key={`X-${r}`}
                    type="number"
                    className="vector-input"
                    value={val}
                    placeholder={`x${r + 1}`}
                    disabled
                  />
                ))}
              </div>
            </div>

            {/* ---------------- = ---------------- */}
            <span className="symbol">=</span>

            {/* ---------------- {B} ---------------- */}
            <div className="vector-box">
              <p className="vector-title">{"{B}"}</p>
              <div className="vector-grid">
                {matrixB.map((val, r) => (
                  <input
                    className="vector-input"
                    key={`B-${r}`}
                    type="number"
                    value={val}
                    placeholder={`b${r + 1}`}
                    onChange={(e) =>
                      this.handleChangeMatrixB(r, e.target.value)
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Button Calculate */}
          <div>
            <button onClick={this.Calculate}>Calculate</button>
          </div>
          {/* Show Result */}
          <div>
            {matrix_result.length > 0 && (
              <div>
                <h2>Result:</h2>
                {matrix_result.map((val, r) => (
                  <p key={`result-${r}`}>
                    x{r + 1} = {val}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
