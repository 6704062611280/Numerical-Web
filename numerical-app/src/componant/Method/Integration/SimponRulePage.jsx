import BackButton from "../../BackButton";
import { Component } from "react";
import { evaluate } from "mathjs";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import FormatIntegration from "../../FormatIntegration";

export default class SimpsonSinglePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fx: "4x^3 + 5x^2 + x", // ตัวอย่างสมการ
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

      const mid = (A + B) / 2;
      const h = (B - A) / 2;

      // คำนวณ f(a), f(mid), f(b)
      const Fa = evaluate(fx.replace(/x/g, `(${A})`));
      const Fm = evaluate(fx.replace(/x/g, `(${mid})`));
      const Fb = evaluate(fx.replace(/x/g, `(${B})`));

      // สูตร Simpson’s 1/3 Rule
      const area = ((B - A) / 6) * (Fa + 4 * Fm + Fb);

      // เก็บขั้นตอนการคำนวณแบบ LaTeX
      const steps = [
        `I = \\int_{${A}}^{${B}} f(x)\\,dx = \\int_{${A}}^{${B}} (${fx})\\,dx`,
        `h = \\frac{${B} - ${A}}{2} = ${h}`,
        `f(${A}) = ${Fa.toFixed(6)}, \\quad f(${mid}) = ${Fm.toFixed(6)}, \\quad f(${B}) = ${Fb.toFixed(6)}`,
        `I = \\frac{${B}-${A}}{6} [f(${A}) + 4f(${mid}) + f(${B})]`,
        `I = \\frac{${B}-${A}}{6} [${Fa.toFixed(6)} + 4(${Fm.toFixed(
          6
        )}) + ${Fb.toFixed(6)}]`,
        `I = ${area.toFixed(6)}`,
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
          <h1 style={{ padding: "20px" }}>Simpson's Rule (1 Interval)</h1>
          <FormatIntegration fn={fx} a={a} b={b} />
          {/* Input Section */}
          <div className="input-text">
            <label>ฟังก์ชัน f(x)</label>
            <input
              type="text"
              value={fx}
              onChange={(e) => this.setState({ fx: e.target.value })}
              placeholder="เช่น x^2 + 3x"
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

          {/* Result Section */}
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
