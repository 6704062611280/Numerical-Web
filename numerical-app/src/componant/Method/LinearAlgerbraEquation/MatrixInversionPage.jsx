import { Component } from "react";
import BackButton from "../../BackButton";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

export default class MatrixInversionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size_matrix: 3,
      matrixA: [
        [4, -4, 0],
        [-1, 4, -2],
        [0, -2, 4],
      ],
      matrixB: [400, 400, 400],
      matrixVariable: ["", "", ""],
      errorMsg: "",
      steps: [],
      matrix_result: [],
    };
  }

  matrixToKaTeX = (matrix) => {
    return `\\begin{bmatrix} ${matrix
      .map((row) => row.map((v) => v.toFixed(3)).join(" & "))
      .join(" \\\\ ")} \\end{bmatrix}`;
  };

  vectorToKaTeX = (vector) => {
    return `\\begin{bmatrix} ${vector
      .map((v) => v.toFixed(3))
      .join(" \\\\ ")} \\end{bmatrix}`;
  };

  Calculate = () => {
    const n = this.state.size_matrix;
    const A = this.state.matrixA.map((row) => [...row]);
    const I = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
    );
    const B = [...this.state.matrixB];
    const steps = [];

    // Gauss-Jordan elimination
    for (let k = 0; k < n; k++) {
      if (A[k][k] === 0) {
        this.setState({ errorMsg: "ไม่สามารถ invert ได้ (Pivot = 0)" });
        return;
      }
      const pivot = A[k][k];
      for (let j = 0; j < n; j++) {
        A[k][j] /= pivot;
        I[k][j] /= pivot;
      }
      for (let i = 0; i < n; i++) {
        if (i !== k) {
          const factor = A[i][k];
          for (let j = 0; j < n; j++) {
            A[i][j] -= factor * A[k][j];
            I[i][j] -= factor * I[k][j];
          }
        }
      }
      steps.push({
        step: k + 1,
        A: A.map((row) => [...row]),
        I: I.map((row) => [...row]),
      });
    }

    // x = A^-1 * B
    const x = I.map((row) =>
      row.reduce((sum, val, idx) => sum + val * B[idx], 0)
    );

    this.setState({ steps, matrix_result: x, errorMsg: "" });
  };

  handleGenerate = () => {
    const size = parseInt(this.state.size_matrix);
    if (size > 10) {
      this.setState({ errorMsg: "ขนาดเมทริกซ์ต้องไม่เกิน 10" });
      return;
    }

    const newMatrixA = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => "")
    );
    const newMatrixB = Array.from({ length: size }, () => "");
    const newMatrixVariable = Array.from({ length: size }, () => "");

    this.setState({
      matrixA: newMatrixA,
      matrixB: newMatrixB,
      matrixVariable: newMatrixVariable,
      steps: [],
      errorMsg: "",
    });
  };

  handleChangeMatrixA = (r, c, value) => {
    const newMatrixA = this.state.matrixA.map((row, ri) =>
      row.map((col, ci) => (ri === r && ci === c ? value : col))
    );
    this.setState({ matrixA: newMatrixA });
  };

  handleChangeMatrixB = (r, value) => {
    const newMatrixB = this.state.matrixB.map((val, i) =>
      i === r ? value : val
    );
    this.setState({ matrixB: newMatrixB });
  };

  render() {
    const {
      size_matrix,
      matrixA,
      matrixB,
      matrixVariable,
      errorMsg,
      steps,
      matrix_result,
    } = this.state;

    return (
      <div className="page">
        <BackButton />
        <div className="container">
          <h1 style={{ padding: "20px" }}>Matrix Inversion Method</h1>
          <div style={{ margin: "0 auto", textAlign: "center" }}>
            {/* Input */}
            <div className="input-text">
              <label>Matrix size : </label>
              <input
                type="number"
                value={size_matrix}
                onChange={(e) =>
                  this.setState({ size_matrix: parseInt(e.target.value) })
                }
              />
              <button onClick={this.handleGenerate}>Generate</button>
            </div>
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

            {/* Matrix Input */}
            <div className="matrix-container">
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
                        key={`A-${r}-${c}`}
                        type="number"
                        className="matrix-input"
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

              <span className="symbol">×</span>

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

              <span className="symbol">=</span>

              <div className="vector-box">
                <p className="vector-title">{"{B}"}</p>
                <div className="vector-grid">
                  {matrixB.map((val, r) => (
                    <input
                      key={`B-${r}`}
                      type="number"
                      className="vector-input"
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

            {/* Button */}
            <button style={{ marginTop: "10px" }} onClick={this.Calculate}>
              Calculate
            </button>
          </div>
          {/* Output */}
          {steps.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h3>Solution:</h3>
              <BlockMath math={`\\mathbf{A^{-1} B = X}`} />

              <h4>ขั้นตอนการคำนวณ:</h4>
              {steps.map((s, idx) => (
                <div key={idx} style={{ marginBottom: "20px" }}>
                  <p>Step {s.step}</p>
                  <BlockMath math={`A = ${this.matrixToKaTeX(s.A)}`} />
                  <BlockMath math={`A^{-1} = ${this.matrixToKaTeX(s.I)}`} />
                </div>
              ))}

              <h4>✅ ผลลัพธ์สุดท้าย:</h4>
              <BlockMath
                math={`\\mathbf{X = ${this.vectorToKaTeX(matrix_result)}}`}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}
