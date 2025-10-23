import BackButton from "../../BackButton"; // ปุ่มย้อนกลับไปหน้าเดิม
import { Component } from "react";
import { evaluate } from "mathjs"; // ใช้สำหรับประเมินค่าฟังก์ชันจาก string

export default class CompositeSimpsonPage extends Component {
  constructor(props) {
    super(props);
    // กำหนดค่าเริ่มต้นของ state
    this.state = {
      fx: "(4x-1)^(1/3)", // สมการ f(x)
      a: 1, // ขอบล่าง
      b: 2, // ขอบบน
      n: 4, // จำนวนช่วง (n ต้องเป็นเลขคู่)
      result: null, // เก็บผลลัพธ์
      errorMsg: "", // เก็บข้อความ error
    };
  }

  // ฟังก์ชันคำนวณ Composite Simpson's Rule
  Calculate = () => {
    try {
      const { fx, a, b, n } = this.state;

      const A = parseFloat(a); // แปลง a เป็น number
      const B = parseFloat(b); // แปลง b เป็น number
      const N = parseInt(n); // แปลง n เป็น integer

      // ตรวจสอบ input
      if (isNaN(A) || isNaN(B) || isNaN(N) || N <= 0 || N % 2 !== 0) {
        this.setState({
          errorMsg: "กรุณากรอก a, b และ n ให้ถูกต้อง (n ต้องเป็นเลขคู่)",
          result: null,
        });
        return;
      }

      const h = (B - A) / N; // ความกว้างแต่ละช่วง

      let sumOdd = 0; // ผลรวม f(x) ของ index คี่
      let sumEven = 0; // ผลรวม f(x) ของ index คู่ (ไม่รวม 0 และ N)

      // วนลูปคำนวณ f(x_i) ของแต่ละจุดย่อย
      for (let i = 1; i < N; i++) {
        const x = A + i * h;
        const fxVal = evaluate(fx.replace(/x/g, `(${x})`)); // ประเมินค่าฟังก์ชัน
        if (i % 2 === 0) sumEven += fxVal; // index คู่
        else sumOdd += fxVal; // index คี่
      }

      const Fa = evaluate(fx.replace(/x/g, `(${A})`)); // f(a)
      const Fb = evaluate(fx.replace(/x/g, `(${B})`)); // f(b)

      // สูตร Composite Simpson: (h/3) * [f(a) + f(b) + 4*Σ(f_odd) + 2*Σ(f_even)]
      const area = (h / 3) * (Fa + Fb + 4 * sumOdd + 2 * sumEven);

      // อัปเดตผลลัพธ์
      this.setState({ result: area, errorMsg: "" });
    } catch (error) {
      // กรณีสมการ fx ไม่ถูกต้อง
      this.setState({ errorMsg: "รูปแบบสมการไม่ถูกต้อง", result: null });
    }
  };

  render() {
    const { fx, a, b, n, result, errorMsg } = this.state;

    return (
      <div className="page">
        <BackButton />
        <div className="container">
          <h1 style={{ padding: "20px" }}>Composite Simpson's Rule</h1>

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

            {/* จำนวนช่วง n */}
            <label>จำนวนช่วง n (ต้องเป็นเลขคู่)</label>
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
