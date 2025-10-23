import { Component } from "react";
import BackButton from "../../BackButton";
import { matrix, max } from "mathjs";

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
    const n = this.state.size_matrix;
    const A = this.state.matrixA.map((row) => [...row]);
    const I = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
    );

    const steps = []; // เก็บขั้นตอนทีละรอบ

    for (let k = 0; k < n; k++) {
      // Pivot ต้องไม่เป็น 0
      if (A[k][k] === 0) {
        this.setState({ errorMsg: "ไม่สามารถ invert ได้ (Pivot = 0)" });
        return;
      }

      // หาร pivot row ให้ pivot = 1
      const pivot = A[k][k];
      for (let j = 0; j < n; j++) {
        A[k][j] /= pivot;
        I[k][j] /= pivot;
      }

      // ทำให้ column k ของทุกแถวอื่นเป็น 0
      for (let i = 0; i < n; i++) {
        if (i !== k) {
          const factor = A[i][k];
          for (let j = 0; j < n; j++) {
            A[i][j] -= factor * A[k][j];
            I[i][j] -= factor * I[k][j];
          }
        }
      }

      // บันทึกขั้นตอนหลัง pivot row k
      steps.push({
        step: k + 1,
        A: A.map((row) => [...row]),
        I: I.map((row) => [...row]),
      });
    }

    this.setState({
      matrix_result: I,
      matrix_error: new Array(1).fill(0),
      errorMsg: "",
      steps,
    });
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
    const { size_matrix, matrixA, matrixB, matrixVariable, errorMsg } =
      this.state;
    return (
      <div className="page">
        <BackButton />
        <div className="container">
          <h1 style={{ padding: "20px" }}>Matrix Invasion Method</h1>

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
            {this.state.steps && this.state.steps.length > 0 && (
              <div>
                <h3>ขั้นตอน Gauss-Jordan:</h3>
                {this.state.steps.map((s, idx) => (
                  <div key={idx} style={{ marginBottom: "20px" }}>
                    <p>Step {s.step}</p>
                    <div style={{ display: "flex", gap: "30px" }}>
                      <div>
                        <p>A Matrix:</p>
                        {s.A.map((row, r) => (
                          <div key={r}>
                            {row.map((val) => val.toFixed(3)).join(", ")}
                          </div>
                        ))}
                      </div>
                      <div>
                        <p>I Matrix (Inverse):</p>
                        {s.I.map((row, r) => (
                          <div key={r}>
                            {row.map((val) => val.toFixed(3)).join(", ")}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
