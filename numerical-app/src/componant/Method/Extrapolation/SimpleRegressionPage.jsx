import { Component } from "react";
import BackButton from "../../BackButton";

export default class SimpleRegressionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size_table: 3,
      table_x: [5, 6, 9],
      table_Fx: [150, 172, 249],
      x_value: 7,
      m_order: 1, // 1 = Linear, 2 = Quadratic
      resultText: "",
      resultValue: null,
      errorMsg: "",
    };
  }

  // ฟังก์ชันคำนวณ regression
  Calculate = () => {
    const { table_x, table_Fx, x_value, m_order } = this.state;
    const n = table_x.length;
    const X = table_x.map((v) => parseFloat(v));
    const Y = table_Fx.map((v) => parseFloat(v));
    const xVal = parseFloat(x_value);

    // ตรวจสอบ input เป็นตัวเลข
    if (X.some(isNaN) || Y.some(isNaN) || isNaN(xVal)) {
      this.setState({
        errorMsg: "⚠️ กรุณากรอกค่าตัวเลขให้ครบ",
        resultText: "",
        resultValue: null,
      });
      return;
    }

    // ตรวจสอบจำนวนจุดสำหรับ Quadratic
    if (m_order == 2 && n < 3) {
      this.setState({
        errorMsg: "⚠️ Quadratic regression ต้องมีข้อมูลอย่างน้อย 3 จุด",
        resultText: "",
        resultValue: null,
      });
      return;
    }

    try {
      let resultText = "";
      let resultValue = 0;

      if (m_order == 1) {
        // ---------------- Linear Regression ----------------
        const sumX = X.reduce((a, b) => a + b, 0);
        const sumY = Y.reduce((a, b) => a + b, 0);
        const sumXY = X.reduce((a, b, i) => a + b * Y[i], 0);
        const sumXX = X.reduce((a, b) => a + b * b, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        resultText = `y = ${intercept.toFixed(4)} + ${slope.toFixed(4)} x`;
        resultValue = intercept + slope * xVal;
      } else if (m_order == 2) {
        // ---------------- Quadratic Regression ----------------
        const sumX = X.reduce((a, b) => a + b, 0);
        const sumX2 = X.reduce((a, b) => a + b * b, 0);
        const sumX3 = X.reduce((a, b) => a + b * b * b, 0);
        const sumX4 = X.reduce((a, b) => a + b * b * b * b, 0);
        const sumY = Y.reduce((a, b) => a + b, 0);
        const sumXY = X.reduce((a, b, i) => a + b * Y[i], 0);
        const sumX2Y = X.reduce((a, b, i) => a + b * b * Y[i], 0);

        const matA = [
          [n, sumX, sumX2],
          [sumX, sumX2, sumX3],
          [sumX2, sumX3, sumX4],
        ];
        const matB = [sumY, sumXY, sumX2Y];

        // ฟังก์ชันหาดีเทอร์มิแนนต์ 3x3
        const det = (m) =>
          m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
          m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
          m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

        const replaceCol = (A, B, col) =>
          A.map((row, i) => row.map((v, j) => (j === col ? B[i] : v)));

        const detA = det(matA);
        if (detA === 0) throw new Error("Singular matrix"); // ตรวจสอบ singular

        const detC = det(replaceCol(matA, matB, 0));
        const detB = det(replaceCol(matA, matB, 1));
        const detA2 = det(replaceCol(matA, matB, 2));

        const c = detC / detA;
        const b = detB / detA;
        const a = detA2 / detA;

        resultText = `y = ${a.toFixed(4)} x^2 + ${b.toFixed(4)} x + ${c.toFixed(
          4
        )}`;
        resultValue = a * xVal * xVal + b * xVal + c;
      }

      this.setState({ resultText, resultValue, errorMsg: "" });
    } catch (e) {
      this.setState({
        errorMsg: "เกิดข้อผิดพลาดในการคำนวณ (อาจเป็น singular matrix)",
        resultText: "",
        resultValue: null,
      });
    }
  };

  render() {
    const {
      size_table,
      table_x,
      table_Fx,
      x_value,
      m_order,
      resultText,
      resultValue,
      errorMsg,
    } = this.state;

    return (
      <div className="page">
        <BackButton />
        <div className="container">
          <h1 style={{ padding: "20px" }}>Simple Regression</h1>

          {/* จำนวนจุด */}
          <div style={{ marginBottom: "20px" }}>
            <label>Number of points: </label>
            <input
              type="number"
              value={size_table}
              min={2}
              onChange={(e) => {
                const size = parseInt(e.target.value);
                if (m_order == 2 && size < 3) {
                  this.setState({
                    errorMsg: "Quadratic regression ต้องมีข้อมูล ≥ 3",
                  });
                  return;
                }
                this.setState({
                  size_table: size,
                  table_x: Array(size).fill(""),
                  table_Fx: Array(size).fill(""),
                  errorMsg: "",
                });
              }}
              style={{ width: "50px" }}
            />
          </div>

          {/* ตาราง X / f(X) */}
          <div className="table-container">
            <div className="table-column">
              <p>
                <b>X</b>
              </p>
              {table_x.map((v, i) => (
                <input
                  key={i}
                  type="number"
                  value={v}
                  onChange={(e) => {
                    const arr = [...table_x];
                    arr[i] = e.target.value;
                    this.setState({ table_x: arr });
                  }}
                  style={{ width: "70px", marginBottom: "10px" }}
                />
              ))}
            </div>
            <div style={{ display: "grid" }}>
              <p>
                <b>f(X)</b>
              </p>
              {table_Fx.map((v, i) => (
                <input
                  key={i}
                  type="number"
                  value={v}
                  onChange={(e) => {
                    const arr = [...table_Fx];
                    arr[i] = e.target.value;
                    this.setState({ table_Fx: arr });
                  }}
                  style={{ width: "70px", marginBottom: "10px" }}
                />
              ))}
            </div>
          </div>

          {/* เลือก Linear / Quadratic */}
          <div style={{ marginTop: "20px" }}>
            <label>Order (1=Linear, 2=Quadratic) </label>
            <input
              type="number"
              value={m_order}
              min={1}
              max={2}
              onChange={(e) => {
                const order = parseInt(e.target.value);
                if (order == 2 && size_table < 3) {
                  this.setState({
                    errorMsg: "Quadratic regression ต้องมีข้อมูล ≥ 3",
                  });
                  return;
                }
                this.setState({ m_order: order, errorMsg: "" });
              }}
              style={{ width: "50px" }}
            />
          </div>

          {/* จุด x ที่ต้องการหา y */}
          <div style={{ marginTop: "10px" }}>
            <label>Find y at x = </label>
            <input
              type="number"
              value={x_value}
              onChange={(e) => this.setState({ x_value: e.target.value })}
              style={{ width: "70px" }}
            />
          </div>

          {/* ปุ่มคำนวณ */}
          <div style={{ marginTop: "20px" }}>
            <button onClick={this.Calculate}>Calculate</button>
          </div>

          {/* แสดงผลลัพธ์ */}
          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
          {resultText && (
            <div style={{ marginTop: "20px" }}>
              <h3>Regression Equation:</h3>
              <p>{resultText}</p>
              <h3>Value at x={x_value}:</h3>
              <p>{resultValue}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
