import { Component } from "react";
import BackButton from "../../BackButton";
import { matrix, max } from "mathjs";

export default class JacobiIterationPage extends Component {
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
    let xOld = this.state.matrix_x0.map((val) => parseFloat(val));
    let xNew = [...xOld];
    let n = this.state.matrixA.length;

    let resultAll = [xOld]; // เก็บค่า x ของแต่ละ iteration
    let errorAll = []; // เก็บ error ของแต่ละ iteration
    for (let iter = 0; iter < this.state.maxIteration; iter++) {
      for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < n; j++) {
          if (j !== i) {
            sum += parseFloat(this.state.matrixA[i][j]) * xOld[j];
          }
        }
        xNew[i] =
          (parseFloat(this.state.matrixB[i]) - sum) /
          parseFloat(this.state.matrixA[i][i]);
        console.log("xNew = ", xNew);
      }

      const error = xNew.map((val, index) =>
        Math.abs((val - xOld[index]) / val)
      );
      resultAll.push([...xNew]);
      errorAll.push(Math.max(...error));
      if (Math.max(...error) < this.state.tolerance) {
        break;
      }

      xOld = [...xNew];
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
          <h1 style={{ padding: "20px" }}>Jacobi Iteration Method</h1>

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

          {/* Button Calculate */}
          <div style={{ margin: "20px" }}>
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
