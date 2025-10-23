import BackButton from "../../BackButton"; // ปุ่มย้อนกลับไปหน้าเดิม
import { Component } from "react";
import { evaluate } from "mathjs"; // ใช้คำนวณสมการ fx

export default class CompositeTrapezoidalPage extends Component {
  constructor(props) {
    super(props);
    // กำหนดค่าเริ่มต้นของ state
    this.state = {
      fx: "(4x-1)^(1/3)", // สมการ f(x)
      a: 1, // ขอบล่าง
      b: 2, // ขอบบน
      n: 4, // จำนวนช่วง (subintervals)
      result: null, // ผลลัพธ์การหาพื้นที่
      errorMsg: "", // ข้อความ error
    };
  }

  // ฟังก์ชันหลักคำนวณ Composite Trapezoidal Rule
  Calculate = () => {
    try {
      const { fx, a, b, n } = this.state;

      // แปลงค่าจาก string เป็นตัวเลข
      const A = parseFloat(a);
      const B = parseFloat(b);
      const N = parseInt(n);

      // ตรวจสอบความถูกต้องของค่า input
      if (isNaN(A) || isNaN(B) || isNaN(N) || N <= 0) {
        this.setState({
          errorMsg: "กรุณากรอก a, b และ n ให้ถูกต้อง",
          result: null,
        });
        return;
      }

      // กำหนดความกว้างของแต่ละช่วง
      const h = (B - A) / N;

      // คำนวณ f(a) และ f(b)
      let sum = 0;
      for (let i = 1; i < N; i++) {
        const x = A + i * h;
        sum += evaluate(fx.replace(/x/g, `(${x})`)); // คำนวณ f(x_i) และบวกลง sum
      }

      const Fa = evaluate(fx.replace(/x/g, `(${A})`));
      const Fb = evaluate(fx.replace(/x/g, `(${B})`));

      // สูตร Composite Trapezoidal Rule: h/2 * [f(a) + 2*Σf(x_i) + f(b)]
      const area = (h / 2) * (Fa + 2 * sum + Fb);

      // อัปเดตผลลัพธ์ใน state
      this.setState({ result: area, errorMsg: "" });
    } catch (error) {
      // จัดการ error กรณี fx ไม่ถูกต้อง
      this.setState({ errorMsg: "รูปแบบสมการไม่ถูกต้อง", result: null });
    }
  };

  render() {
    const { fx, a, b, n, result, errorMsg } = this.state;

    return (
      <div className="page">
        <BackButton />
        <div className="container">
          <h1 style={{ padding: "20px" }}>Composite Trapezoidal Rule</h1>

          <div
            style={{ display: "flex", flexDirection: "column", width: "300px" }}
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

            {/* n input */}
            <label>จำนวนช่วง n</label>
            <input
              type="number"
              value={n}
              onChange={(e) => this.setState({ n: e.target.value })}
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
