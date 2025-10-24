import { Component } from "react";
import BackButton from "../../BackButton";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import "../../GlobalStyle.css";

export default class GaussJordanEliminationPage extends Component {
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
      matrix_result: [],
      steps: [],
    };
  }

  matrixToKaTeX = (A, B) => {
    // แปลง matrix + vector เป็น string KaTeX
    const n = A.length;
    let lines = [];
    for (let i = 0; i < n; i++) {
      lines.push([...A[i], B[i]].map((v) => Number(v).toFixed(2)).join(" & "));
    }
    return `\\begin{bmatrix} ${lines.join(" \\\\ ")} \\end{bmatrix}`;
  };

  Calculate = () => {
    const n = this.state.size_matrix;
    const A = this.state.matrixA.map((row) => [...row]);
    const B = [...this.state.matrixB];
    const steps = [];

    // Gauss-Jordan Elimination
    for (let k = 0; k < n; k++) {
      // ทำ pivot ให้ = 1
      const pivot = A[k][k];
      if (pivot === 0) {
        this.setState({
          errorMsg: "ไม่สามารถใช้ Gauss-Jordan ได้ (Pivot = 0)",
        });
        return;
      }
      for (let j = 0; j < n; j++) A[k][j] /= pivot;
      B[k] /= pivot;

      steps.push(
        `R_{${k + 1}} \\Rightarrow R_{${
          k + 1
        }} / ${pivot} : ${this.matrixToKaTeX(A, B)}`
      );

      // ทำให้ column k ของแถวอื่น = 0
      for (let i = 0; i < n; i++) {
        if (i !== k) {
          const factor = A[i][k];
          for (let j = 0; j < n; j++) A[i][j] -= factor * A[k][j];
          B[i] -= factor * B[k];
          steps.push(
            `R_{${i + 1}} \\Rightarrow R_{${i + 1}} - (${factor.toFixed(
              3
            )}) R_{${k + 1}} : ${this.matrixToKaTeX(A, B)}`
          );
        }
      }
    }

    this.setState({ matrix_result: B, steps, errorMsg: "" });
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
          <h1>Gauss-Jordan Elimination</h1>
          <div style={{ margin:"0 auto", textAlign:"center"}}>
          <div className="input-text">
            <label>Matrix size: </label>
            <input
              type="number"
              value={size_matrix}
              onChange={(e) => this.setState({ size_matrix: e.target.value })}
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
                
          <button onClick={this.Calculate} style={{ marginTop: "10px" }}>
            Calculate
          </button>
          </div>

          {/* แสดงขั้นตอนแบบ KaTeX */}
          {steps.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h3>ขั้นตอนการคำนวณ:</h3>
              {steps.map((line, i) => (
                <BlockMath key={i} math={line} />
              ))}
              <h3>✅ ผลลัพธ์สุดท้าย:</h3>
              {matrix_result.map((val, i) => (
                <BlockMath
                  key={i}
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
