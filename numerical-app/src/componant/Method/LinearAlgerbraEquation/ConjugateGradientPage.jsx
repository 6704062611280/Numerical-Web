import { Component } from "react";
import BackButton from "../../BackButton";
import "../../GlobalStyle.css";

export default class ConjugateGradientPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size_matrix: 3,
      matrixA: [
        [4, 1, 1],
        [1, 3, -1],
        [1, -1, 2],
      ],
      matrixVariable: ["", "", ""],
      matrixB: [6, 6, 5],
      errorMsg: "",
      matrix_x0: [0, 0, 0],
      maxIteration: 100,
      tolerance: 0.000001,
      matrix_result: [], // เก็บค่า x ของแต่ละ iteration
      matrix_error: [], // เก็บ error ของแต่ละ iteration
    };
  }

  // ฟังก์ชัน Conjugate Gradient
  Calculate = () => {
    const n = parseInt(this.state.size_matrix);
    const A = this.state.matrixA.map((row) => row.map(Number));
    const B = this.state.matrixB.map(Number);
    let x = this.state.matrix_x0.map(Number);

    const maxIter = this.state.maxIteration;
    const tol = this.state.tolerance;

    // r0 = B - A*x0 (residual)
    let r = B.map(
      (b, i) => b - A[i].reduce((sum, aij, j) => sum + aij * x[j], 0)
    );

    // p0 = r0
    let p = [...r];

    // rsOld = r0^T * r0
    let rsOld = r.reduce((sum, ri) => sum + ri * ri, 0);

    const matrix_result = [];
    const matrix_error = [];

    for (let k = 0; k < maxIter; k++) {
      // Ap = A*p
      const Ap = A.map((row, i) =>
        row.reduce((sum, aij, j) => sum + aij * p[j], 0)
      );

      // alpha = (r^T * r) / (p^T * A * p)
      const alpha = rsOld / p.reduce((sum, pi, i) => sum + pi * Ap[i], 0);

      // x_{k+1} = x_k + alpha * p
      x = x.map((xi, i) => xi + alpha * p[i]);

      // r_{k+1} = r_k - alpha * Ap
      r = r.map((ri, i) => ri - alpha * Ap[i]);

      // rsNew = r_{k+1}^T * r_{k+1}
      const rsNew = r.reduce((sum, ri) => sum + ri * ri, 0);

      // เก็บค่า iteration
      matrix_result.push([...x]);
      matrix_error.push(Math.sqrt(rsNew));

      // ถ้า error น้อยกว่า tolerance ให้หยุด
      if (Math.sqrt(rsNew) < tol) break;

      // Update p_{k+1} = r_{k+1} + (rsNew/rsOld) * p_k
      p = r.map((ri, i) => ri + (rsNew / rsOld) * p[i]);
      rsOld = rsNew;
    }

    this.setState({ matrix_result, matrix_error });
  };

  // ฟังก์ชัน Generate เมทริกซ์ว่าง
  handleGenerate = () => {
    const size = parseInt(this.state.size_matrix);
    if (size > 10) {
      this.setState({ errorMsg: "ขนาดเมทริกซ์ต้องไม่เกิน 10" });
      return;
    }

    this.setState({
      matrixA: Array.from({ length: size }, () => Array(size).fill("")),
      matrixVariable: Array.from({ length: size }, () => ""),
      matrixB: Array(size).fill(""),
      matrix_x0: Array(size).fill(""),
      errorMsg: "",
      matrix_result: [],
      matrix_error: [],
    });
  };

  // ฟังก์ชันแก้ไขค่า A, B, x0
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
  handleChangeMatrix_x0 = (r, value) => {
    const newMatrix_x0 = this.state.matrix_x0.map((val, index) =>
      index === r ? value : val
    );
    this.setState({ matrix_x0: newMatrix_x0 });
  };

  render() {
    const {
      size_matrix,
      matrixA,
      matrixB,
      matrix_x0,
      matrixVariable,
      errorMsg,
    } = this.state;

    return (
      <div className="page">
        <BackButton />
        <div className="container">
          <h1 style={{ padding: "20px" }}>Conjugate Gradient Method</h1>
          <div className="input-text">
            <label>Matrix size : </label>
            <input
              type="number"
              value={size_matrix}
              onChange={(e) => this.setState({ size_matrix: e.target.value })}
            />
            <button onClick={this.handleGenerate}>Generate</button>
          </div>

          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

          <div className="matrix-container">
            {/* Matrix A */}
            <div className="matrix-box">
              <p className="matrix-title">[A]</p>
              <div
                className="matrix-grid"
                style={{ gridTemplateColumns: `repeat(${size_matrix}, 60px)` }}
              >
                {matrixA.map((row, r) =>
                  row.map((val, c) => (
                    <input
                      key={`A-${r}-${c}`}
                      type="number"
                      value={val}
                      placeholder={`a${r + 1}${c + 1}`}
                      className="matrix-input"
                      onChange={(e) =>
                        this.handleChangeMatrixA(r, c, e.target.value)
                      }
                    />
                  ))
                )}
              </div>
            </div>

            {/* × symbol */}
            <span className="symbol">×</span>

            {/* Vector X */}
            <div className="vector-box">
              <p className="vector-title">{"{X}"}</p>
              <div className="vector-grid">
                {matrixVariable.map((val, r) => (
                  <input
                    key={`X-${r}`}
                    type="number"
                    value={val}
                    placeholder={`x${r}`}
                    disabled
                    className="vector-input"
                  />
                ))}
              </div>
            </div>

            {/* = symbol */}
            <span className="symbol">=</span>

            {/* Vector B */}
            <div className="vector-box">
              <p className="vector-title">{"{B}"}</p>
              <div className="vector-grid">
                {matrixB.map((val, r) => (
                  <input
                    key={`B-${r}`}
                    type="number"
                    value={val}
                    placeholder={`b${r}`}
                    className="vector-input"
                    onChange={(e) =>
                      this.handleChangeMatrixB(r, e.target.value)
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* x0 */}
          <div className="vector-x0">
            <p className="matrix-title">x<sub>0</sub></p>
            <div
              className="vector-grid"
              style={{ gridTemplateColumns: `repeat(${size_matrix}, 60px)` }}
            >
              {matrix_x0.map((val, r) => (
                <input
                  key={`x0-${r}`}
                  type="number"
                  value={val}
                  placeholder={`x${r}`}
                  className="vector-input"
                  onChange={(e) =>
                    this.handleChangeMatrix_x0(r, e.target.value)
                  }
                />
              ))}
            </div>
          </div>

          {/* Calculate button */}
          <div style={{ marginTop: "20px" }}>
            <button onClick={this.Calculate}>Calculate</button>
          </div>

          {/* Output table */}
          <div style={{ marginTop: "20px" }}>
            <h2>Iteration Results</h2>
            <table border="1" cellPadding="5">
              <thead>
                <tr>
                  <th>Iter</th>
                  <th>xK</th>
                  <th>Residual (Error)</th>
                </tr>
              </thead>
              <tbody>
                {this.state.matrix_result.length > 0 ? (
                  this.state.matrix_result.map((xIter, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{xIter.map((v) => v.toFixed(6)).join(", ")}</td>
                      <td>{this.state.matrix_error[idx].toExponential(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      ยังไม่มีข้อมูล
                    </td>
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
