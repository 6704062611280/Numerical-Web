import { Component } from "react";
import BackButton from "../../BackButton";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import "../../GlobalStyle.css";

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

  // 🧮 คำนวณ Lagrange Interpolation
  Calculate = () => {
    const { table_x, table_Fx, x_value } = this.state;
    const x = table_x.map(Number);
    const fx = table_Fx.map(Number);
    const x_target = Number(x_value);

    if (x.some(isNaN) || fx.some(isNaN) || isNaN(x_target)) {
      this.setState({ errorMsg: "⚠️ กรุณากรอกข้อมูลให้ครบทุกช่อง" });
      return;
    }

    const n = x.length;
    let result = 0;
    let latexEquation = `L(x) = `;

    for (let i = 0; i < n; i++) {
      let Li = 1;
      let termLatex = `${fx[i]}`;
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          Li *= (x_target - x[j]) / (x[i] - x[j]);
          termLatex += ` \\left( \\frac{x - ${x[j]}}{${x[i]} - ${x[j]}} \\right)`;
        }
      }
      result += fx[i] * Li;
      latexEquation += termLatex;
      if (i < n - 1) latexEquation += " + ";
    }

    this.setState({
      resultText: latexEquation,
      resultValue: result,
      errorMsg: "",
    });
  };

  // ⚙️ สร้างช่องกรอกข้อมูลใหม่
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

  // 🧩 อัปเดตค่าในตาราง
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
          <h1 style={{ padding: "20px" }}>Lagrange Interpolation</h1>

          {/* ส่วนควบคุมจำนวนจุดข้อมูล */}
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

          {/* ช่องกรอก x ที่ต้องการหา f(x) */}
          <div className="input-text">
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

          {/* ปุ่มคำนวณ */}
          <div style={{ marginTop: "20px" }}>
            <button onClick={this.Calculate}>Calculate</button>
          </div>

          {/* แสดงผลลัพธ์ */}
          {resultText && (
            <div
              style={{
                marginTop: "30px",
                
                padding: "15px",
                borderRadius: "10px",
              }}
            >
              <h3>ผลลัพธ์สมการ (Lagrange Form):</h3>
              <BlockMath math={resultText} />

              {resultValue !== null && (
                <>
                  <h3>ค่าที่คำนวณได้:</h3>
                  <BlockMath
                    math={`f(${x_value}) = ${resultValue.toFixed(4)}`}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
