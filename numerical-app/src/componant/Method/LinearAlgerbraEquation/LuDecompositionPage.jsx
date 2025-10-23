import { Component } from "react";
import BackButton from "../../BackButton";
import { matrix, max } from "mathjs";

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
      maxIteration: 100,
      tolerance: 0.000001,
      matrix_result: [],
      matrix_error: [],
      steps: [],
    };
  }

  Calculate = () => {
    const n = this.state.size_matrix;
    const A = this.state.matrixA.map((row) => [...row]);
    const B = [...this.state.matrixB];

    const L = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
    );
    const U = Array.from({ length: n }, () => Array(n).fill(0));

    const steps = [];

    // Decomposition
    for (let i = 0; i < n; i++) {
      // คำนวณ U[i][j]
      for (let j = i; j < n; j++) {
        let sum = 0;
        for (let k = 0; k < i; k++) sum += L[i][k] * U[k][j];
        U[i][j] = A[i][j] - sum;
      }

      // คำนวณ L[j][i]
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

    // Forward Substitution Ly = B
    const Y = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < i; j++) sum += L[i][j] * Y[j];
      Y[i] = B[i] - sum;
      steps.push({
        step: `Forward Substitution y${i + 1}`,
        Y: [...Y],
      });
    }

    // Back Substitution Ux = Y
    const X = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) sum += U[i][j] * X[j];
      X[i] = (Y[i] - sum) / U[i][i];
      steps.push({
        step: `Back Substitution x${i + 1}`,
        X: [...X],
      });
    }

    this.setState({
      matrix_result: X,
      matrix_error: new Array(1).fill(0),
      steps,
      errorMsg: "",
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
          <h1 style={{ padding: "20px" }}>LU Decomposition Method</h1>

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
            <h2>Steps</h2>
            {this.state.steps.length === 0 ? (
              <p>ยังไม่มีขั้นตอน</p>
            ) : (
              this.state.steps.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: "20px",
                    border: "1px solid #ccc",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  <h4>{s.step}</h4>

                  {/* L Matrix */}
                  {s.L && (
                    <div>
                      <strong>L:</strong>
                      <table
                        style={{
                          borderCollapse: "collapse",
                          marginBottom: "10px",
                        }}
                      >
                        <tbody>
                          {s.L.map((row, rIdx) => (
                            <tr key={rIdx}>
                              {row.map((v, cIdx) => (
                                <td
                                  key={cIdx}
                                  style={{
                                    border: "1px solid #ddd",
                                    padding: "5px",
                                  }}
                                >
                                  {v.toFixed(2)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* U Matrix */}
                  {s.U && (
                    <div>
                      <strong>U:</strong>
                      <table
                        style={{
                          borderCollapse: "collapse",
                          marginBottom: "10px",
                        }}
                      >
                        <tbody>
                          {s.U.map((row, rIdx) => (
                            <tr key={rIdx}>
                              {row.map((v, cIdx) => (
                                <td
                                  key={cIdx}
                                  style={{
                                    border: "1px solid #ddd",
                                    padding: "5px",
                                  }}
                                >
                                  {v.toFixed(2)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Y or X */}
                  {(s.Y || s.X) && (
                    <div>
                      <strong>{s.Y ? "Y:" : "X:"}</strong>{" "}
                      {(s.Y || s.X).map((v) => v.toFixed(2)).join(", ")}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }
}
