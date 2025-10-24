import { Component } from "react";
import BackButton from "../../BackButton";
import { matrix, max, det, im } from "mathjs";
import "../../GlobalStyle.css";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

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
      steps: [],
    };
  }

  Calculate = () => {
    const Det_A = det(matrix(this.state.matrixA));
    if (Det_A === 0) {
      this.setState({ errorMsg: "เมทริกซ์ A มีค่า Determinant เป็นศูนย์" });
      return;
    }

    const vars = [];
    const steps = [`\\det(A) = ${Det_A}`];

    for (let col = 0; col < this.state.size_matrix; col++) {
      const newMatrix = this.state.matrixA.map((row, r) =>
        row.map((val, c) => (c === col ? this.state.matrixB[r] : val))
      );
      const Det_Ai = det(matrix(newMatrix));
      vars.push(Det_Ai / Det_A);
      steps.push(`\\det(A_{${col + 1}}) = ${Det_Ai} \\Rightarrow x_${col + 1} = \\frac{${Det_Ai}}{${Det_A}} = ${(Det_Ai / Det_A).toFixed(6)}`);
    }

    this.setState({ matrix_result: vars, steps, errorMsg: "" });
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
      steps
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
          {/* Show Steps */}
          {steps.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h3>ขั้นตอนการคำนวณ:</h3>
              {steps.map((line, i) => (
                <BlockMath key={i} math={line} />
              ))}

              <h3>✅ ผลลัพธ์สุดท้าย:</h3>
              {matrix_result.map((val, i) => (
                <BlockMath
                  key={`res-${i}`}
                  math={`x_{${i + 1}} \\approx ${val.toFixed(6)}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}
