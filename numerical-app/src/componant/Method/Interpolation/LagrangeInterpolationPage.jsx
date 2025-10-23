import { Component } from "react";
import BackButton from "../../BackButton";

export default class LagrangeInterpolationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size_table: 3, // จำนวนจุดข้อมูล
      table_x: [5, 6, 9], // x_i
      table_Fx: [150, 172, 249], // f(x_i)
      resultText: "", // สมการ L(x)
      resultValue: null, // ค่าผลลัพธ์ f(x)
      errorMsg: "",
      x_value: 7, // ค่าที่ต้องการหา f(x)
    };
  }

  // -------------------------------------
  // ฟังก์ชันหลัก: คำนวณ Lagrange Interpolation
  // -------------------------------------
  Calculate = () => {
    const { table_x, table_Fx, x_value } = this.state;

    // แปลงค่าเป็นตัวเลข
    const x = table_x.map(Number);
    const fx = table_Fx.map(Number);
    const x_target = Number(x_value);

    // ตรวจสอบการกรอกข้อมูล
    if (x.some(isNaN) || fx.some(isNaN) || isNaN(x_target)) {
      this.setState({ errorMsg: "⚠️ กรุณากรอกข้อมูลให้ครบทุกช่อง" });
      return;
    }

    const n = x.length;
    let result = 0; // ค่าที่จะได้จาก f(x_target)
    let terms = []; // สำหรับเก็บสมการแต่ละเทอมของ Lagrange

    // วนคำนวณตามสูตร Lagrange Polynomial
    for (let i = 0; i < n; i++) {
      // คำนวณตัวส่วนและตัวประกอบของ L_i(x)
      let Li = 1;
      let termText = "";

      for (let j = 0; j < n; j++) {
        if (j !== i) {
          Li *= (x_target - x[j]) / (x[i] - x[j]);
          termText += `((x - ${x[j]}) / (${x[i]} - ${x[j]}))`;
        }
      }

      // คูณด้วย f(x_i)
      result += fx[i] * Li;
      terms.push(`${fx[i]} * ${termText}`);
    }

    // สร้างสมการเป็นข้อความ
    const polynomial = "L(x) = " + terms.join(" + ");

    // อัปเดตผลลัพธ์ใน state
    this.setState({
      resultText: polynomial,
      resultValue: result,
      errorMsg: "",
    });
  };

  // -------------------------------------
  // ฟังก์ชันสร้างช่องกรอกข้อมูลใหม่
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

  // -------------------------------------
  // ฟังก์ชันอัปเดตค่าในตาราง X และ f(X)
  // -------------------------------------
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
  // ส่วนแสดงผลหน้าจอ
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
          <h1 style={{ padding: "20px" }}>Lagrange Interpolation</h1>

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
              <h3>ผลลัพธ์สมการ (Lagrange Form):</h3>
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
