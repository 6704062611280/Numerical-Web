import BackButton from "../../BackButton";
import { Component } from "react";
import { evaluate } from "mathjs"; // ใช้สำหรับประเมินค่าฟังก์ชันจาก string

export default class NumericalDifferentiationPage extends Component {
  constructor(props) {
    super(props);
    // กำหนดค่าเริ่มต้นของ state
    this.state = {
      fx: "x^2", // สมการ f(x)
      x: 1, // จุดที่ต้องการหาอนุพันธ์
      h: 0.01, // ค่าก้าว h
      order: "first", // เลือก order: first, second, third, fourth
      errorOrder: "O(h)", // เลือก error term
      direction: "forward", // เลือก direction: forward, backward, centered
      result: null, // เก็บผลลัพธ์
    };
  }

  // ฟังก์ชันคำนวณ numerical derivative
  Calculate = () => {
    try {
      const { fx, x, h, order, direction } = this.state;
      const X = parseFloat(x);
      const H = parseFloat(h);

      // ตรวจสอบค่า input
      if (isNaN(X) || isNaN(H) || H <= 0) {
        this.setState({ result: "กรุณากรอกค่า x และ h ให้ถูกต้อง" });
        return;
      }

      // ฟังก์ชันสำหรับประเมินค่า f(x)
      const f = (val) => evaluate(fx.replace(/x/g, `(${val})`));

      let derivative = 0;

      // เลือกวิธีคำนวณตาม order, direction
      if (order === "first") {
        if (direction === "forward") {
          derivative = (f(X + H) - f(X)) / H; // 1st order forward O(h)
        } else if (direction === "backward") {
          derivative = (f(X) - f(X - H)) / H; // 1st order backward O(h)
        } else if (direction === "centered") {
          derivative = (f(X + H) - f(X - H)) / (2 * H); // 2nd order centered O(h^2)
        }
      } else if (order === "second") {
        derivative = (f(X + H) - 2 * f(X) + f(X - H)) / (H * H); // 2nd derivative
      } else if (order === "third") {
        derivative =
          (f(X + 2 * H) - 2 * f(X + H) + 2 * f(X - H) - f(X - 2 * H)) /
          (2 * H * H * H); // 3rd derivative approx
      } else if (order === "fourth") {
        derivative =
          (f(X - 2 * H) -
            4 * f(X - H) +
            6 * f(X) -
            4 * f(X + H) +
            f(X + 2 * H)) /
          (H * H * H * H); // 4th derivative approx
      }

      // อัปเดตผลลัพธ์ลง state
      this.setState({ result: derivative });
    } catch (error) {
      this.setState({ result: "รูปแบบสมการไม่ถูกต้อง" });
    }
  };

  render() {
    const { fx, x, h, order, errorOrder, direction, result } = this.state;

    return (
      <div className="page">
        <BackButton />
        <div className="container">
          <h1 style={{ padding: "20px" }}>Numerical Differentiation</h1>

          <div
            style={{ display: "flex", flexDirection: "column", width: "300px" }}
          >
            {/* Input ฟังก์ชัน */}
            <label>ฟังก์ชัน f(x)</label>
            <input
              type="text"
              value={fx}
              onChange={(e) => this.setState({ fx: e.target.value })}
              placeholder="เช่น x^2 + 3*x"
            />

            {/* Input จุด x */}
            <label>จุด x</label>
            <input
              type="number"
              value={x}
              onChange={(e) => this.setState({ x: e.target.value })}
            />

            {/* Input ก้าว h */}
            <label>ค่า h</label>
            <input
              type="number"
              value={h}
              onChange={(e) => this.setState({ h: e.target.value })}
            />

            {/* Dropdown เลือก order */}
            <label>Order</label>
            <select
              value={order}
              onChange={(e) => this.setState({ order: e.target.value })}
            >
              <option value="first">First</option>
              <option value="second">Second</option>
              <option value="third">Third</option>
              <option value="fourth">Fourth</option>
            </select>

            {/* Dropdown เลือก error term */}
            <label>Error</label>
            <select
              value={errorOrder}
              onChange={(e) => this.setState({ errorOrder: e.target.value })}
            >
              <option value="O(h)">O(h)</option>
              <option value="O(h^2)">O(h^2)</option>
              <option value="O(h^4)">O(h^4)</option>
            </select>

            {/* Dropdown เลือก direction */}
            <label>Direction</label>
            <select
              value={direction}
              onChange={(e) => this.setState({ direction: e.target.value })}
            >
              <option value="forward">Forward</option>
              <option value="backward">Backward</option>
              <option value="centered">Centered</option>
            </select>

            {/* ปุ่มคำนวณ */}
            <button style={{ marginTop: "10px" }} onClick={this.Calculate}>
              Calculate
            </button>
          </div>

          {/* แสดงผลลัพธ์ */}
          {result !== null && (
            <div style={{ marginTop: "20px" }}>
              <h3>ผลลัพธ์:</h3>
              <p>{result}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
