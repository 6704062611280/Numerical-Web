import { Component } from "react";
import BackButton from "../../BackButton";

export default class MultiRegressionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size_table: 4,
      table_X1: [1, 2, 3, 4],
      table_X2: [2, 1, 4, 3],
      table_Y: [5, 6, 10, 12],
      x1_value: 5,
      x2_value: 2,
      resultText: "",
      resultValue: null,
      errorMsg: "",
    };
  }

  // ฟังก์ชันเช็ค linear independence
  isCollinear = (X1, X2) => {
    const n = X1.length;
    let ratio = null;
    for (let i = 0; i < n; i++) {
      if (X1[i] === 0) {
        if (X2[i] !== 0) return true; // collinear (X1 zero, X2 non-zero)
        else continue;
      }
      const currentRatio = X2[i] / X1[i];
      if (ratio === null) ratio = currentRatio;
      else if (Math.abs(currentRatio - ratio) > 1e-10) return false;
    }
    return true; // collinear
  };

  // ฟังก์ชันคำนวณ Multiple Linear Regression
  Calculate = () => {
    const { table_X1, table_X2, table_Y, x1_value, x2_value } = this.state;
    const n = table_X1.length;

    const X1 = table_X1.map((v) => parseFloat(v));
    const X2 = table_X2.map((v) => parseFloat(v));
    const Y = table_Y.map((v) => parseFloat(v));
    const x1Val = parseFloat(x1_value);
    const x2Val = parseFloat(x2_value);

    // ตรวจสอบ input เป็นตัวเลขครบ
    if (
      X1.some(isNaN) ||
      X2.some(isNaN) ||
      Y.some(isNaN) ||
      isNaN(x1Val) ||
      isNaN(x2Val)
    ) {
      this.setState({
        errorMsg: "⚠️ กรุณากรอกค่าตัวเลขให้ครบ",
        resultText: "",
        resultValue: null,
      });
      return;
    }

    // ตรวจสอบ linear independence
    if (this.isCollinear(X1, X2)) {
      this.setState({
        errorMsg:
          "⚠️ ตัวแปร X1 และ X2 เป็น linear combination ทำ regression ไม่ได้",
        resultText: "",
        resultValue: null,
      });
      return;
    }

    try {
      // ---------------- Normal Equations ----------------
      const sumX1 = X1.reduce((a, b) => a + b, 0);
      const sumX2 = X2.reduce((a, b) => a + b, 0);
      const sumY = Y.reduce((a, b) => a + b, 0);
      const sumX1X1 = X1.reduce((a, b) => a + b * b, 0);
      const sumX2X2 = X2.reduce((a, b) => a + b * b, 0);
      const sumX1X2 = X1.reduce((a, b, i) => a + b * X2[i], 0);
      const sumX1Y = X1.reduce((a, b, i) => a + b * Y[i], 0);
      const sumX2Y = X2.reduce((a, b, i) => a + b * Y[i], 0);

      const matA = [
        [n, sumX1, sumX2],
        [sumX1, sumX1X1, sumX1X2],
        [sumX2, sumX1X2, sumX2X2],
      ];
      const matB = [sumY, sumX1Y, sumX2Y];

      const det = (m) =>
        m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
        m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
        m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

      const replaceCol = (A, B, col) =>
        A.map((row, i) => row.map((v, j) => (j === col ? B[i] : v)));

      const detA = det(matA);
      if (detA === 0) throw new Error("Singular matrix");

      const detC = det(replaceCol(matA, matB, 0));
      const detB1 = det(replaceCol(matA, matB, 1));
      const detB2 = det(replaceCol(matA, matB, 2));

      const a = detC / detA;
      const b1 = detB1 / detA;
      const b2 = detB2 / detA;

      const resultText = `Y = ${a.toFixed(4)} + ${b1.toFixed(
        4
      )}*X1 + ${b2.toFixed(4)}*X2`;
      const resultValue = a + b1 * x1Val + b2 * x2Val;

      this.setState({ resultText, resultValue, errorMsg: "" });
    } catch (e) {
      this.setState({
        errorMsg:
          "เกิดข้อผิดพลาดในการคำนวณ (ตรวจสอบข้อมูลว่ามี linear independence)",
        resultText: "",
        resultValue: null,
      });
    }
  };

  render() {
    const {
      size_table,
      table_X1,
      table_X2,
      table_Y,
      x1_value,
      x2_value,
      resultText,
      resultValue,
      errorMsg,
    } = this.state;

    return (
      <div className="page">
        <BackButton />
        <div className="container">
          <h1 style={{ padding: "20px" }}>Multiple Linear Regression</h1>

          {/* จำนวนแถวข้อมูล */}
          <div style={{ marginBottom: "20px" }}>
            <label>Number of points: </label>
            <input
              type="number"
              min={2}
              value={size_table}
              onChange={(e) => {
                const size = parseInt(e.target.value);
                this.setState({
                  size_table: size,
                  table_X1: Array(size).fill(""),
                  table_X2: Array(size).fill(""),
                  table_Y: Array(size).fill(""),
                  errorMsg: "",
                });
              }}
              style={{ width: "50px" }}
            />
          </div>

          {/* ตาราง X1/X2/Y */}
          <div style={{ display: "flex", gap: "50px" }}>
            <div style={{ display: "grid" }}>
              <p>
                <b>X1</b>
              </p>
              {table_X1.map((v, i) => (
                <input
                  key={i}
                  type="number"
                  value={v}
                  onChange={(e) => {
                    const arr = [...table_X1];
                    arr[i] = e.target.value;
                    this.setState({ table_X1: arr });
                  }}
                  style={{ width: "70px", marginBottom: "10px" }}
                />
              ))}
            </div>
            <div style={{ display: "grid" }}>
              <p>
                <b>X2</b>
              </p>
              {table_X2.map((v, i) => (
                <input
                  key={i}
                  type="number"
                  value={v}
                  onChange={(e) => {
                    const arr = [...table_X2];
                    arr[i] = e.target.value;
                    this.setState({ table_X2: arr });
                  }}
                  style={{ width: "70px", marginBottom: "10px" }}
                />
              ))}
            </div>
            <div style={{ display: "grid" }}>
              <p>
                <b>Y</b>
              </p>
              {table_Y.map((v, i) => (
                <input
                  key={i}
                  type="number"
                  value={v}
                  onChange={(e) => {
                    const arr = [...table_Y];
                    arr[i] = e.target.value;
                    this.setState({ table_Y: arr });
                  }}
                  style={{ width: "70px", marginBottom: "10px" }}
                />
              ))}
            </div>
          </div>

          {/* ค่าที่ต้องการทำนาย */}
          <div style={{ marginTop: "20px" }}>
            <label>X1 = </label>
            <input
              type="number"
              value={x1_value}
              onChange={(e) => this.setState({ x1_value: e.target.value })}
              style={{ width: "70px", marginRight: "20px" }}
            />
            <label>X2 = </label>
            <input
              type="number"
              value={x2_value}
              onChange={(e) => this.setState({ x2_value: e.target.value })}
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
              <h3>Predicted Value:</h3>
              <p>Y = {resultValue.toFixed(4)}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
