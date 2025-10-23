import { Component } from "react";
import BackButton from "../../BackButton";
import * as math from "mathjs"; // ใช้คำนวณเมทริกซ์ได้สะดวก

export default class SplineInterpolationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size_table: 3, // จำนวนจุดข้อมูล (x, f(x))
      table_x: [5, 6, 9], // ค่าของ x
      table_Fx: [150, 172, 249], // ค่าของ f(x)
      x_value: 7, // จุดที่ต้องการคำนวณค่า f(x)
      resultText: "", // แสดงสมการแต่ละช่วง
      resultValue: null, // ค่าที่ได้จากการคำนวณ
      errorMsg: "", // แสดงข้อความแจ้งเตือน
    };
  }

  // -------------------------------------
  // ✅ ฟังก์ชันคำนวณ Cubic Spline Interpolation
  // -------------------------------------
  Calculate = () => {
    try {
      const { table_x, table_Fx, x_value } = this.state;

      // ✅ แปลงข้อมูลจาก string → number
      const x = table_x.map(Number);
      const y = table_Fx.map(Number);
      const n = x.length;

      if (n < 2) {
        this.setState({ errorMsg: "⚠️ ต้องมีจุดอย่างน้อย 2 จุด" });
        return;
      }

      // ✅ ตรวจสอบว่าค่า x ต้องเรียงจากน้อยไปมาก
      for (let i = 1; i < n; i++) {
        if (x[i] <= x[i - 1]) {
          this.setState({ errorMsg: "⚠️ ค่า x ต้องเพิ่มขึ้นเรื่อย ๆ" });
          return;
        }
      }

      // ✅ สร้าง h_i = x_{i+1} - x_i
      const h = [];
      for (let i = 0; i < n - 1; i++) {
        h.push(x[i + 1] - x[i]);
      }

      // ✅ สร้างระบบสมการ A * M = B เพื่อหาค่า M_i (second derivatives)
      const A = math.zeros(n, n)._data;
      const B = math.zeros(n)._data;

      // เงื่อนไข boundary: M_0 = 0 และ M_n = 0 (Natural Spline)
      A[0][0] = 1;
      A[n - 1][n - 1] = 1;

      // ✅ เติมสมการภายใน
      for (let i = 1; i < n - 1; i++) {
        A[i][i - 1] = h[i - 1];
        A[i][i] = 2 * (h[i - 1] + h[i]);
        A[i][i + 1] = h[i];
        B[i] =
          (6 / h[i]) * (y[i + 1] - y[i]) - (6 / h[i - 1]) * (y[i] - y[i - 1]);
      }

      // ✅ คำนวณหา M (second derivative)
      const M = math.multiply(math.inv(A), B);

      // ✅ หาช่วงที่ x_value อยู่
      let i = 0;
      for (let j = 0; j < n - 1; j++) {
        if (x_value >= x[j] && x_value <= x[j + 1]) {
          i = j;
          break;
        }
      }

      // ✅ คำนวณค่า S(x) ที่ช่วง i
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

      // ✅ สร้างข้อความสมการของแต่ละช่วงให้อ่านง่าย
      let eqText = "";
      for (let k = 0; k < n - 1; k++) {
        eqText += `S${k}(x) = (${M[k + 1].toFixed(4)} * (x - ${x[k]}))^3 / (6*${
          h[k]
        }) + `;
        eqText += `(${M[k].toFixed(4)} * (${x[k + 1]} - x))^3 / (6*${h[k]}) + `;
        eqText += `(((${y[k + 1]} / ${h[k]}) - (${M[k + 1].toFixed(4)}*${
          h[k]
        }/6))*(x - ${x[k]})) + `;
        eqText += `(((${y[k]} / ${h[k]}) - (${M[k].toFixed(4)}*${h[k]}/6))*(${
          x[k + 1]
        } - x))\n\n`;
      }

      // ✅ อัปเดตผลลัพธ์
      this.setState({
        resultText: eqText,
        resultValue: Sx,
        errorMsg: "",
      });
    } catch (err) {
      this.setState({
        errorMsg: "⚠️ เกิดข้อผิดพลาดในการคำนวณ (ตรวจสอบข้อมูลอีกครั้ง)",
      });
    }
  };

  // -------------------------------------
  // ✅ ฟังก์ชันสร้างช่องกรอกข้อมูลใหม่
  // -------------------------------------
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
      resultText: "",
      resultValue: null,
    });
  };

  // ✅ ฟังก์ชันอัปเดตค่าตาราง
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

  // -------------------------------------
  // ✅ ส่วนแสดงผลหน้าจอ
  // -------------------------------------
  render() {
    const {
      size_table,
      x_value,
      table_x,
      table_Fx,
      resultText,
      resultValue,
      errorMsg,
    } = this.state;

    return (
      <div className="page">
        <BackButton />
        <div className="container">
          <h1 style={{ padding: "20px" }}>Cubic Spline Interpolation</h1>

          {/* ส่วนควบคุมจำนวนจุดข้อมูล */}
          <div style={{ marginBottom: "20px" }}>
            <label>Number of points: </label>
            <input
              type="number"
              value={size_table}
              onChange={(e) => this.setState({ size_table: e.target.value })}
              style={{ width: "50px", marginRight: "10px" }}
            />
            <button onClick={this.handleGenerate}>Generate</button>
          </div>

          {/* ช่องกรอก x ที่ต้องการหาค่า f(x) */}
          <div style={{ marginBottom: "20px" }}>
            <label>Find f(x) at x = </label>
            <input
              type="number"
              value={x_value}
              onChange={(e) => this.setState({ x_value: e.target.value })}
              style={{ width: "70px", marginRight: "10px" }}
            />
          </div>

          {/* แสดงข้อความแจ้งเตือน */}
          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

          {/* ตารางกรอกค่า X และ f(X) */}
          <div style={{ display: "flex", gap: "50px" }}>
            <div>
              <p>
                <b>X</b>
              </p>
              <div style={{ display: "grid" }}>
                {table_x.map((val, r) => (
                  <input
                    key={`x-${r}`}
                    type="number"
                    value={val}
                    onChange={(e) =>
                      this.handleChangeTable_X(r, e.target.value)
                    }
                    placeholder={`x${r}`}
                    style={{ width: "70px", marginBottom: "10px" }}
                  />
                ))}
              </div>
            </div>

            <div>
              <p>
                <b>f(x)</b>
              </p>
              <div style={{ display: "grid" }}>
                {table_Fx.map((val, r) => (
                  <input
                    key={`fx-${r}`}
                    type="number"
                    value={val}
                    onChange={(e) =>
                      this.handleChangeTable_Fx(r, e.target.value)
                    }
                    placeholder={`f(x${r})`}
                    style={{ width: "70px", marginBottom: "10px" }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ปุ่มคำนวณ */}
          <div style={{ marginTop: "20px" }}>
            <button onClick={this.Calculate}>Calculate</button>
          </div>

          {/* แสดงผลลัพธ์ */}
          {resultText && (
            <div
              style={{
                marginTop: "30px",
                backgroundColor: "#f0f0f0",
                padding: "15px",
                borderRadius: "10px",
              }}
            >
              <h3>📘 สมการ Spline แต่ละช่วง:</h3>
              <pre style={{ fontFamily: "monospace" }}>{resultText}</pre>

              {resultValue !== null && (
                <>
                  <h3>✅ ค่าที่คำนวณได้:</h3>
                  <p>
                    f({x_value}) = <b>{resultValue.toFixed(4)}</b>
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
