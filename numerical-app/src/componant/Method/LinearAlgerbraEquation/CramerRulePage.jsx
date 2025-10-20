import { Component } from "react";
import BackButton from "../../BackButton";
import { matrix, max } from "mathjs";


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
    };
  }

  Calculate = () => {
  
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
      <div>
        <BackButton />
        <div>
          <h1>CramerRule</h1>
        </div>
        <div>
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
        <div style={{ display: "flex", gap: "50px", marginTop: "20px" }}>
          <div>
            <p style={{ display: "block", alignItems: "center" }}>[A]</p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${size_matrix}, 60px)`,
                gap: "20px",
                marginTop: "15px",
              }}
            >
              {matrixA.map((row, r) =>
                row.map((val, c) => (
                  <input
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "5px",
                    }}
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

          <div>
            <p style={{ display: "block", alignItems: "center" }}>{"{X}"}</p>
            <div
              style={{
                display: "grid",
                gap: "20px",
                marginTop: "15px",
              }}
            >
              {matrixVariable.map((val, r) => (
                <input
                  style={{ width: "50px", height: "50px", borderRadius: "5px" }}
                  key={`X-${r}`}
                  type="number"
                  value={val}
                  placeholder={`x${r}`}
                  disabled
                />
              ))}
            </div>
          </div>

          <div>
            <p style={{ display: "block", alignItems: "center" }}>{"{B}"}</p>
            <div
              style={{
                display: "grid",
                gap: "20px",
                marginTop: "15px",
              }}
            >
              {matrixB.map((val, r) => (
                <input
                  style={{ width: "50px", height: "50px", borderRadius: "5px" }}
                  key={`B-${r}`}
                  type="number"
                  value={val}
                  placeholder={`b${r}`}
                  onChange={(e) => this.handleChangeMatrixB(r, e.target.value)}
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
                      {Number(this.state.matrix_error[index]).toExponential(2)}
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
    );
  }
}
