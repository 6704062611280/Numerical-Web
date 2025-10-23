import { Component } from "react";
import BackButton from "../../BackButton";
import "../../GlobalStyle.css";

export default class NewtonDevidedDiffPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size_table: 3, // จำนวนจุดข้อมูล (x, f(x))
      table_x: [5, 6, 9],
      table_Fx: [150, 172, 249],
      resultText: "", // เก็บสมการ Newton
      resultValue: null, // เก็บค่าผลลัพธ์ f(x_value)
      errorMsg: "",
      x_value: 7, // ค่าที่ผู้ใช้ต้องการหา f(x)
    };
  }

  // -------------------------------------
  // ฟังก์ชันหลัก: คำนวณ Newton Divided Difference
  // -------------------------------------
  Calculate = () => {
    const { table_x, table_Fx, x_value } = this.state;

    // แปลงค่าจาก string เป็น number
    const x = table_x.map(Number);
    const fx = table_Fx.map(Number);
    const x_target = Number(x_value);

    // ตรวจสอบว่าผู้ใช้กรอกข้อมูลครบหรือไม่
    if (x.some(isNaN) || fx.some(isNaN) || isNaN(x_target)) {
      this.setState({ errorMsg: "⚠️ กรุณากรอกข้อมูลให้ครบทุกช่อง" });
      return;
    }

    const n = x.length;
    // สร้างตาราง divided difference (n×n)
    const diff = Array.from({ length: n }, () => Array(n).fill(0));

    // ค่าช่องแรกเป็น f(x)
    for (let i = 0; i < n; i++) {
      diff[i][0] = fx[i];
    }

    // คำนวณค่า divided difference แต่ละลำดับ
    for (let j = 1; j < n; j++) {
      for (let i = 0; i < n - j; i++) {
        diff[i][j] = (diff[i + 1][j - 1] - diff[i][j - 1]) / (x[i + j] - x[i]);
      }
    }

    // สร้างสมการ Newton (Newton’s Polynomial Form)
    let polynomial = `f(x) = ${diff[0][0].toFixed(4)}`;
    for (let i = 1; i < n; i++) {
      let term = "";
      for (let j = 0; j < i; j++) {
        term += `(x - ${x[j]})`;
      }
      polynomial += ` + (${diff[0][i].toFixed(4)})${term}`;
    }

    // -------------------------------------
    // คำนวณค่า f(x_target)
    // -------------------------------------
    let result = diff[0][0];
    for (let i = 1; i < n; i++) {
      let term = diff[0][i];
      for (let j = 0; j < i; j++) {
        term *= x_target - x[j];
      }
      result += term;
    }

    // เก็บผลลัพธ์ใน state เพื่อแสดงผล
    this.setState({
      resultText: polynomial,
      resultValue: result,
      errorMsg: "",
    });
  };

  // ฟังก์ชันสร้างช่องกรอกข้อมูลใหม่
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

  // ฟังก์ชันอัปเดตค่าในตาราง X และ f(X)
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
      resultText,
      resultValue,
      errorMsg,
    } = this.state;

    return (
      <div className="page">
        <BackButton />
        <div className="container">
          <h1 style={{ padding: "20px" }}>Newton Divided Difference</h1>

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
              <h3>ผลลัพธ์สมการ (Newton Form):</h3>
              <p style={{ fontFamily: "monospace" }}>{resultText}</p>

              {resultValue !== null && (
                <>
                  <h3>ค่าที่คำนวณได้:</h3>
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
