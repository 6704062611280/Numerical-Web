import { Component } from "react";
import BackButton from "../../BackButton";
import { matrix, max } from "mathjs";

export default class GaussSeidelPage extends Component {
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
      matrix_x0: [100, 100, 100],
      maxIteration: 100,
      tolerance: 0.000001,
      matrix_result: [],
      matrix_error: [],
    };
  }

  Calculate = () => {
    const n = this.state.matrixA.length;
    let x = this.state.matrix_x0.map((val) => parseFloat(val)); // ค่าเริ่มต้น
    let resultAll = [];
    let errorAll = [];

    for (let iter = 0; iter < this.state.maxIteration; iter++) {
      let xOld = [...x]; // เก็บค่าเก่าเพื่อคำนวณ error

      for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < n; j++) {
          if (j !== i) {
            sum += parseFloat(this.state.matrixA[i][j]) * x[j]; // ใช้ x ที่อัปเดตแล้วทันที
          }
        }
        x[i] =
          (parseFloat(this.state.matrixB[i]) - sum) /
          parseFloat(this.state.matrixA[i][i]);
      }

      // คำนวณ error
      const error = x.map((val, index) => Math.abs((val - xOld[index]) / val));
      resultAll.push([...x]);
      errorAll.push(Math.max(...error));

      // หยุดถ้า error < tolerance
      if (Math.max(...error) < this.state.tolerance) break;
    }

    this.setState({ matrix_result: resultAll, matrix_error: errorAll });
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

    const newMatrix_x0 = Array.from({ length: size }, () => "");
    this.setState({ matrix_x0: newMatrix_x0 });
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
          <h1 style={{ padding: "20px" }}>Gauss Seidel Method</h1>

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
            <p className="matrix-title">
              x<sub>0</sub>
            </p>
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

          {/* Button Calculate */}
          <div>
            <button onClick={this.Calculate}>Calculate</button>
          </div>
          {/* Show Result */}
          <div style={{ width: "800px" }}>
            <table className="nice-table">
              <thead>
                <tr>
                  <th>Iter</th>
                  <th>
                    x<sub>k</sub>
                  </th>
                  <th>error</th>
                </tr>
              </thead>
              <tbody>
                {this.state.matrix_result.length > 0 ? (
                  this.state.matrix_result.map((item, index) => (
                    <tr key={index}>
                      <td>{index}</td>
                      {/* xK stacked */}
                      <td>
                        {item.map((val, idx) => (
                          <div key={idx}>
                            x<sub>{idx + 1}</sub> = {val.toFixed(2)}
                          </div>
                        ))}
                      </td>
                      {/* error stacked */}
                      <td>
                        {item.map((val, idx) => {
                          const xOld =
                            index === 0
                              ? val
                              : this.state.matrix_result[index - 1][idx];
                          const err =
                            index === 0
                              ? Infinity
                              : Math.abs((val - xOld) / val);
                          return (
                            <div key={idx}>
                              e<sub>{idx + 1}</sub> ={" "}
                              {err === Infinity ? "∞" : err.toFixed(6)}
                            </div>
                          );
                        })}
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
