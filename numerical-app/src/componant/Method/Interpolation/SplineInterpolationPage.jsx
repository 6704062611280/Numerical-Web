import { Component } from "react";
import BackButton from "../../BackButton";
import * as math from "mathjs";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import "../../GlobalStyle.css";

export default class SplineInterpolationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size_table: 3,
      table_x: [5, 6, 9],
      table_Fx: [150, 172, 249],
      x_value: 7,
      resultLatex: [],
      resultValue: null,
      errorMsg: "",
    };
  }

  Calculate = () => {
    try {
      const { table_x, table_Fx, x_value } = this.state;
      const x = table_x.map(Number);
      const y = table_Fx.map(Number);
      const n = x.length;

      if (n < 2) {
        this.setState({ errorMsg: "⚠️ ต้องมีจุดอย่างน้อย 2 จุด" });
        return;
      }

      for (let i = 1; i < n; i++) {
        if (x[i] <= x[i - 1]) {
          this.setState({ errorMsg: "⚠️ ค่า x ต้องเพิ่มขึ้นเรื่อย ๆ" });
          return;
        }
      }

      // ✅ สร้าง h_i
      const h = [];
      for (let i = 0; i < n - 1; i++) h.push(x[i + 1] - x[i]);

      // ✅ สร้างระบบ A * M = B
      const A = math.zeros(n, n)._data;
      const B = math.zeros(n)._data;
      A[0][0] = 1;
      A[n - 1][n - 1] = 1;

      for (let i = 1; i < n - 1; i++) {
        A[i][i - 1] = h[i - 1];
        A[i][i] = 2 * (h[i - 1] + h[i]);
        A[i][i + 1] = h[i];
        B[i] =
          (6 / h[i]) * (y[i + 1] - y[i]) -
          (6 / h[i - 1]) * (y[i] - y[i - 1]);
      }

      // ✅ หา M
      const M = math.multiply(math.inv(A), B);

      // ✅ หาช่วงที่ x_value อยู่
      let i = 0;
      for (let j = 0; j < n - 1; j++) {
        if (x_value >= x[j] && x_value <= x[j + 1]) {
          i = j;
          break;
        }
      }

      const h_i = h[i];
      const x_i = x[i];
      const x_i1 = x[i + 1];
      const M_i = M[i];
      const M_i1 = M[i + 1];
      const y_i = y[i];
      const y_i1 = y[i + 1];

      const Sx =
        (M_i1 * Math.pow(x_value - x_i, 3)) / (6 * h_i) +
        (M_i * Math.pow(x_i1 - x_value, 3)) / (6 * h_i) +
        (y_i1 / h_i - (M_i1 * h_i) / 6) * (x_value - x_i) +
        (y_i / h_i - (M_i * h_i) / 6) * (x_i1 - x_value);

      // ✅ สร้างสมการ LaTeX ของแต่ละช่วง
      let resultLatex = [];
      for (let k = 0; k < n - 1; k++) {
        const latexEq = `
S_${k}(x) =
\\frac{${M[k + 1].toFixed(4)}(x - ${x[k]})^3}{6(${h[k]})}
+ \\frac{${M[k].toFixed(4)}(${x[k + 1]} - x)^3}{6(${h[k]})}
+ \\left(\\frac{${y[k + 1]}}{${h[k]}} - \\frac{${M[k + 1].toFixed(4)}(${h[k]})}{6}\\right)(x - ${x[k]})
+ \\left(\\frac{${y[k]}}{${h[k]}} - \\frac{${M[k].toFixed(4)}(${h[k]})}{6}\\right)(${x[k + 1]} - x)
`;
        resultLatex.push(latexEq);
      }

      this.setState({
        resultLatex,
        resultValue: Sx,
        errorMsg: "",
      });
    } catch (err) {
      this.setState({
        errorMsg: "⚠️ เกิดข้อผิดพลาดในการคำนวณ (ตรวจสอบข้อมูลอีกครั้ง)",
      });
    }
  };

  handleGenerate = () => {
    const size = parseInt(this.state.size_table);
    if (size > 10 || size < 2) {
      this.setState({ errorMsg: "⚠️ ขนาดข้อมูลต้องอยู่ระหว่าง 2 ถึง 10" });
      return;
    }

    this.setState({
      table_x: Array(size).fill(""),
      table_Fx: Array(size).fill(""),
      errorMsg: "",
      resultLatex: [],
      resultValue: null,
    });
  };

  handleChangeTable_X = (r, value) => {
    const newTable_x = [...this.state.table_x];
    newTable_x[r] = value;
    this.setState({ table_x: newTable_x });
  };

  handleChangeTable_Fx = (r, value) => {
    const newTable_Fx = [...this.state.table_Fx];
    newTable_Fx[r] = value;
    this.setState({ table_Fx: newTable_Fx });
  };

  render() {
    const {
      size_table,
      x_value,
      table_x,
      table_Fx,
      resultLatex,
      resultValue,
      errorMsg,
    } = this.state;

    return (
      <div className="page">
        <BackButton />
        <div className="container">
          <h1 style={{ padding: "20px" }}>Cubic Spline Interpolation</h1>

          <div className="input-text">
            <label>Number of points: </label>
            <input
              type="number"
              value={size_table}
              onChange={(e) => this.setState({ size_table: e.target.value })}
              style={{ width: "50px", marginRight: "10px" }}
            />
            <button onClick={this.handleGenerate}>Generate</button>
          </div>

          <div className="input-text">
            <label>Find f(x) at x = </label>
            <input
              type="number"
              value={x_value}
              onChange={(e) => this.setState({ x_value: e.target.value })}
              style={{ width: "70px", marginRight: "10px" }}
            />
          </div>

          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

          {/* ตารางค่า X และ f(X) */}
          <div className="table-container" style={{ marginTop: "20px" }}>
            <div className="table-column">
              <p><b>X</b></p>
              <div style={{ display: "grid" }}>
                {table_x.map((val, r) => (
                  <input
                    key={`x-${r}`}
                    type="number"
                    value={val}
                    onChange={(e) => this.handleChangeTable_X(r, e.target.value)}
                    placeholder={`x${r}`}
                  />
                ))}
              </div>
            </div>

            <div className="table-column">
              <p><b>f(x)</b></p>
              <div style={{ display: "grid" }}>
                {table_Fx.map((val, r) => (
                  <input
                    key={`fx-${r}`}
                    type="number"
                    value={val}
                    onChange={(e) => this.handleChangeTable_Fx(r, e.target.value)}
                    placeholder={`f(x${r})`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <button onClick={this.Calculate}>Calculate</button>
          </div>

          {/* ✅ ผลลัพธ์ */}
          {resultLatex.length > 0 && (
            <div
              style={{
                marginTop: "30px",
                
                padding: "15px",
                borderRadius: "10px",
              }}
            >
              <h3>📘 สมการ Spline แต่ละช่วง:</h3>
              {resultLatex.map((eq, i) => (
                <BlockMath key={i} math={eq} />
              ))}

              {resultValue !== null && (
                <>
                  <h3>✅ ค่าที่คำนวณได้:</h3>
                  <BlockMath math={`f(${x_value}) = ${resultValue.toFixed(4)}`} />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
