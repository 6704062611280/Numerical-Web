import { Component } from "react";
import BackButton from "../../BackButton";
import { matrix, max } from "mathjs";

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
      maxIteration: 100,
      tolerance: 0.000001,
      matrix_result: [],
      matrix_error: [],
    };
  }

  Calculate = () => {
    const n = this.state.size_matrix;
    const A = this.state.matrixA.map((row) => [...row]);
    const B = [...this.state.matrixB];

    // Gauss-Jordan Elimination
    for (let k = 0; k < n; k++) {
      // ทำให้ pivot เป็น 1
      const pivot = A[k][k];
      if (pivot === 0) {
        this.setState({
          errorMsg: "ไม่สามารถใช้ Gauss-Jordan ได้ (Pivot = 0)",
        });
        return;
      }
      for (let j = 0; j < n; j++) {
        A[k][j] /= pivot;
      }
      B[k] /= pivot;

      // ทำให้ทุกตัวใน column k ของแถวอื่น = 0
      for (let i = 0; i < n; i++) {
        if (i !== k) {
          const factor = A[i][k];
          for (let j = 0; j < n; j++) {
            A[i][j] -= factor * A[k][j];
          }
          B[i] -= factor * B[k];
        }
      }
    }

    // ตอนนี้ B คือคำตอบของ x1, x2, ..., xn
    this.setState({
      matrix_result: [B], // เก็บเป็น array of array เพื่อ render
      matrix_error: new Array(1).fill(0),
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
          <h1 style={{ padding: "20px" }}>Gauss-Jordan Eliminate Method</h1>

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
            <table>
              <thead>
                <tr>
                  <th>Iter</th>
                  <th>xK</th>
                  <th>error</th>
                </tr>
              </thead>
              <tbody>
                {this.state.matrix_result.length > 0 ? (
                  this.state.matrix_result.map((item, index) => (
                    <tr key={index}>
                      <td>{index}</td>
                      <td>
                        {item.map((val) => Number(val).toFixed(6)).join(", ")}
                      </td>
                      <td>
                        {Number(this.state.matrix_error[index]).toExponential(
                          2
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>ยังไม่มีข้อมูล</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
