import BackButton from "../../BackButton"; // ปุ่มย้อนกลับไปหน้าเดิม
import { Component } from "react";
import { evaluate } from "mathjs"; // ใช้สำหรับคำนวณสมการ fx

export default class TrapezoidalRulePage extends Component {
  constructor(props) {
    super(props);
    // กำหนดค่าเริ่มต้นของ state
    this.state = {
      fx: "(4x-1)^(1/3)", // สมการฟังก์ชัน f(x)
      a: 1, // ค่าขอบล่าง
      b: 2, // ค่าขอบบน
      result: null, // ผลลัพธ์การหาพื้นที่
      errorMsg: "", // ข้อความ error (ถ้ามี)
    };
  }

  // ฟังก์ชันหลักคำนวณ Trapezoidal Rule
  Calculate = () => {
    try {
      const { fx, a, b } = this.state;

      // แปลง string เป็นตัวเลข
      const A = parseFloat(a);
      const B = parseFloat(b);

      // ตรวจสอบค่าว่าง
      if (isNaN(A) || isNaN(B)) {
        this.setState({
          errorMsg: "กรุณากรอกค่า a และ b ให้ถูกต้อง",
          result: null,
        });
        return;
      }

      // คำนวณ f(a) และ f(b)
      const Fa = evaluate(fx.replace(/x/g, `(${A})`));
      const Fb = evaluate(fx.replace(/x/g, `(${B})`));

      // สูตร Trapezoidal Rule: (b - a)/2 * [f(a) + f(b)]
      const area = ((B - A) / 2) * (Fa + Fb);

      // อัปเดตผลลัพธ์กลับไปใน state
      this.setState({
        result: area,
        errorMsg: "",
      });
    } catch (error) {
      // จัดการ error กรณี fx ไม่ถูกต้อง
      this.setState({
        errorMsg: "รูปแบบสมการไม่ถูกต้อง",
        result: null,
      });
    }
  };

  render() {
    const { fx, a, b, result, errorMsg } = this.state;

    return (
      <div className="page">
        <BackButton />
        <div className="container">
          {/* ส่วนหัวเรื่อง */}
          <h1 style={{ padding: "20px" }}>Trapezoidal Rule</h1>

          {/* กล่อง input */}
          <div
            className="input-text"
            style={{display}}
          >
            {/* fx input */}
            <label>ฟังก์ชัน f(x)</label>
            <input
              type="text"
              value={fx}
              onChange={(e) => this.setState({ fx: e.target.value })}
              placeholder="ใส่สมการ เช่น x^2 + 3x"
            />

            {/* a input */}
            <label>ค่า a (ขอบล่าง)</label>
            <input
              type="number"
              value={a}
              onChange={(e) => this.setState({ a: e.target.value })}
            />

            {/* b input */}
            <label>ค่า b (ขอบบน)</label>
            <input
              type="number"
              value={b}
              onChange={(e) => this.setState({ b: e.target.value })}
            />

            {/* ปุ่มคำนวณ */}
            <button style={{ marginTop: "10px" }} onClick={this.Calculate}>
              Calculate
            </button>
          </div>

          {/* แสดงผลลัพธ์ */}
          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
          {result !== null && (
            <div style={{ marginTop: "20px" }}>
              <h3>ผลลัพธ์:</h3>
              <p>∫ f(x) dx ≈ {result.toFixed(6)}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
