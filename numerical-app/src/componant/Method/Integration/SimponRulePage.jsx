import BackButton from "../../BackButton"; // ปุ่มย้อนกลับไปหน้าเดิม
import { Component } from "react";
import { evaluate } from "mathjs"; // ใช้สำหรับประเมินค่าฟังก์ชันจาก string

export default class SimpsonSinglePage extends Component {
  constructor(props) {
    super(props);
    // กำหนดค่าเริ่มต้นของ state
    this.state = {
      fx: "(4x-1)^(1/3)", // สมการ f(x)
      a: 1, // ขอบล่าง
      b: 2, // ขอบบน
      result: null, // เก็บผลลัพธ์
      errorMsg: "", // ข้อความ error
    };
  }

  // ฟังก์ชันคำนวณ Simpson's Rule แบบ 1 ช่วง
  Calculate = () => {
    try {
      const { fx, a, b } = this.state;

      const A = parseFloat(a); // แปลง a เป็น number
      const B = parseFloat(b); // แปลง b เป็น number

      // ตรวจสอบ input
      if (isNaN(A) || isNaN(B)) {
        this.setState({
          errorMsg: "กรุณากรอกค่า a และ b ให้ถูกต้อง",
          result: null,
        });
        return;
      }

      const h = (B - A) / 2; // กึ่งหนึ่งของช่วง (Simpson ใช้ 3 จุด: a, (a+b)/2, b)
      const mid = (A + B) / 2; // จุดกึ่งกลาง

      // คำนวณค่า f(a), f(mid), f(b)
      const Fa = evaluate(fx.replace(/x/g, `(${A})`));
      const Fm = evaluate(fx.replace(/x/g, `(${mid})`));
      const Fb = evaluate(fx.replace(/x/g, `(${B})`));

      // สูตร Simpson 1 interval: (b - a)/6 * [f(a) + 4*f(mid) + f(b)]
      const area = ((B - A) / 6) * (Fa + 4 * Fm + Fb);

      // อัปเดตผลลัพธ์
      this.setState({ result: area, errorMsg: "" });
    } catch (error) {
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
          <h1 style={{ padding: "20px" }}>Simpson's Rule (1 Interval)</h1>

          {/* กล่อง input */}
          <div
            style={{ display: "flex", flexDirection: "column", width: "300px" }}
          >
            {/* ฟังก์ชัน f(x) */}
            <label>ฟังก์ชัน f(x)</label>
            <input
              type="text"
              value={fx}
              onChange={(e) => this.setState({ fx: e.target.value })}
              placeholder="เช่น x^2 + 3*x"
            />

            {/* ค่า a */}
            <label>ค่า a (ขอบล่าง)</label>
            <input
              type="number"
              value={a}
              onChange={(e) => this.setState({ a: e.target.value })}
            />

            {/* ค่า b */}
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
