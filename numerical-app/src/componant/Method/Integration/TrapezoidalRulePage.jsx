import BackButton from "../../BackButton";
import { Component } from "react";
import { evaluate } from "mathjs";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import FormatIntegration from "../../FormatIntegration";

export default class TrapezoidalRulePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fx: "4x^3 + 5x^2 + x",
      a: 2,
      b: 8,
      result: null,
      steps: [],
      errorMsg: "",
    };
  }

  Calculate = () => {
    try {
      const { fx, a, b } = this.state;
      const A = parseFloat(a);
      const B = parseFloat(b);

      if (isNaN(A) || isNaN(B)) {
        this.setState({
          errorMsg: "กรุณากรอกค่า a และ b ให้ถูกต้อง",
          result: null,
        });
        return;
      }

      const Fa = evaluate(fx.replace(/x/g, `(${A})`));
      const Fb = evaluate(fx.replace(/x/g, `(${B})`));
      const h = B - A;
      const area = (h / 2) * (Fa + Fb);

      const steps = [
        `I = \\int_{${A}}^{${B}} f(x)\\,dx = \\int_{${A}}^{${B}} (${fx})\\,dx`,
        `f(${A}) = ${Fa.toFixed(6)}`,
        `f(${B}) = ${Fb.toFixed(6)}`,
        `h = ${B} - ${A} = ${h}`,
        `I = \\frac{${h}}{2} [${Fa.toFixed(6)} + ${Fb.toFixed(6)}] = ${area.toFixed(6)}`,
      ];

      this.setState({
        result: area,
        steps,
        errorMsg: "",
      });
    } catch (error) {
      this.setState({
        errorMsg: "รูปแบบสมการไม่ถูกต้อง",
        result: null,
      });
    }
  };

  render() {
    const { fx, a, b, result, steps, errorMsg } = this.state;

    return (
      <div className="page">
        <BackButton />
        <div className="container">
          <h1 style={{ padding: "20px" }}>Trapezoidal Rule</h1>
          <FormatIntegration fn={fx} a={a} b={b} />

          <div className="input-text">
            <label>ฟังก์ชัน f(x)</label>
            <input
              type="text"
              value={fx}
              onChange={(e) => this.setState({ fx: e.target.value })}
              placeholder="ใส่สมการ เช่น x^2 + 3x"
            />

            <label>ค่า a (ขอบล่าง)</label>
            <input
              type="number"
              value={a}
              onChange={(e) => this.setState({ a: e.target.value })}
            />

            <label>ค่า b (ขอบบน)</label>
            <input
              type="number"
              value={b}
              onChange={(e) => this.setState({ b: e.target.value })}
            />

            <button style={{ marginTop: "10px" }} onClick={this.Calculate}>
              Calculate
            </button>
          </div>

          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

          {result !== null && (
            <div style={{ marginTop: "20px" }}>
              <h3>ขั้นตอนการคำนวณ:</h3>
              {steps.map((line, index) => (
                <BlockMath key={index} math={line} />
              ))}

              <h3>✅ ผลลัพธ์สุดท้าย:</h3>
              <BlockMath math={`I \\approx ${result.toFixed(6)}`} />
            </div>
          )}
        </div>
      </div>
    );
  }
}
