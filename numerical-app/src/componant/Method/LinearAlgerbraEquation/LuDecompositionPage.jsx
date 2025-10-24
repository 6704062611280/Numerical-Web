import { Component } from "react";
import BackButton from "../../BackButton";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

export default class LuDecompositionPage extends Component {
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
    const B = [...this.state.matrixB];

    const L = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
    );
    const U = Array.from({ length: n }, () => Array(n).fill(0));
    const steps = [];

    // LU Decomposition
    for (let i = 0; i < n; i++) {
      for (let j = i; j < n; j++) {
        let sum = 0;
        for (let k = 0; k < i; k++) sum += L[i][k] * U[k][j];
        U[i][j] = A[i][j] - sum;
      }
      for (let j = i + 1; j < n; j++) {
        let sum = 0;
        for (let k = 0; k < i; k++) sum += L[j][k] * U[k][i];
        L[j][i] = (A[j][i] - sum) / U[i][i];
      }
      steps.push({
        step: `Decompose row ${i + 1}`,
        L: L.map((r) => [...r]),
        U: U.map((r) => [...r]),
      });
    }

    // Forward substitution Ly = B
    const Y = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < i; j++) sum += L[i][j] * Y[j];
      Y[i] = B[i] - sum;
      steps.push({ step: `Forward Substitution y${i + 1}`, Y: [...Y] });
    }

    // Backward substitution Ux = Y
    const X = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) sum += U[i][j] * X[j];
      X[i] = (Y[i] - sum) / U[i][i];
      steps.push({ step: `Back Substitution x${i + 1}`, X: [...X] });
    }

    this.setState({ steps, matrix_result: X, errorMsg: "" });
  };

  handleGenerate = () => {
    const size = parseInt(this.state.size_matrix);
    if (size > 10) {
      this.setState({ errorMsg: "ขนาดเมทริกซ์ต้องไม่เกิน 10" });
      return;
    }
    this.setState({
      matrixA: Array.from({ length: size }, () =>
        Array.from({ length: size }, () => "")
      ),
      matrixB: Array.from({ length: size }, () => ""),
      matrixVariable: Array.from({ length: size }, () => ""),
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
          <h1 style={{ padding: "20px" }}>LU Decomposition Method</h1>
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
              <h3>ขั้นตอนการคำนวณ:</h3>
              {steps.map((s, idx) => (
                <div key={idx} style={{ marginBottom: "20px" }}>
                  <h4>{s.step}</h4>
                  {s.L && <BlockMath math={`L = ${this.matrixToKaTeX(s.L)}`} />}
                  {s.U && <BlockMath math={`U = ${this.matrixToKaTeX(s.U)}`} />}
                  {s.Y && <BlockMath math={`Y = ${this.vectorToKaTeX(s.Y)}`} />}
                  {s.X && <BlockMath math={`X = ${this.vectorToKaTeX(s.X)}`} />}
                </div>
              ))}

              <h4>✅ ผลลัพธ์สุดท้าย:</h4>
              <BlockMath math={`X = ${this.vectorToKaTeX(matrix_result)}`} />
            </div>
          )}
        </div>
      </div>
    );
  }
}
