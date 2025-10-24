import BackButton from "../../BackButton";
import { Component } from "react";
import { evaluate } from "mathjs";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import FormatIntegration from "../../FormatIntegration";

export default class CompositeTrapezoidalPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fx: "4x^3 + 5x^2 + x",
      a: 2,
      b: 8,
      n: 4, // จำนวนช่วง
      result: null,
      steps: [],
      errorMsg: "",
    };
  }

  Calculate = () => {
    try {
      const { fx, a, b, n } = this.state;
      const A = parseFloat(a);
      const B = parseFloat(b);
      const N = parseInt(n);

      if (isNaN(A) || isNaN(B) || isNaN(N) || N <= 0) {
        this.setState({
          errorMsg: "กรุณากรอก a, b และ n ให้ถูกต้อง",
          result: null,
          steps: [],
        });
        return;
      }

      const h = (B - A) / N;
      let sum = 0;
      const xiValues = [];

      for (let i = 1; i < N; i++) {
        const x = A + i * h;
        const fxVal = evaluate(fx.replace(/x/g, `(${x})`));
        xiValues.push({ x, fxVal });
        sum += fxVal;
      }

      const Fa = evaluate(fx.replace(/x/g, `(${A})`));
      const Fb = evaluate(fx.replace(/x/g, `(${B})`));
      const area = (h / 2) * (Fa + 2 * sum + Fb);

      // สร้างขั้นตอนการคำนวณแบบ KaTeX
      const steps = [
        `I = \\int_{${A}}^{${B}} (${fx}) \\, dx`,
        `h = \\frac{${B} - ${A}}{${N}} = ${h}`,
        `f(${A}) = ${Fa.toFixed(6)}, \\ f(${B}) = ${Fb.toFixed(6)}`,
        ...xiValues.map(
          (p, i) => `x_${i + 1} = ${p.x.toFixed(4)}, f(x_${i + 1}) = ${p.fxVal.toFixed(6)}`
        ),
        `I = \\frac{h}{2} [f(a) + 2\\sum f(x_i) + f(b)] = ${area.toFixed(6)}`,
      ];

      this.setState({
        result: area,
        steps,
        errorMsg: "",
      });
    } catch (error) {
      this.setState({
        result: null,
        steps: [],
        errorMsg: "รูปแบบสมการไม่ถูกต้อง",
      });
    }
  };

  render() {
    const { fx, a, b, n, result, steps, errorMsg } = this.state;

    return (
      <div className="page">
        <BackButton />
        <div className="container">
          <h1 style={{ padding: "20px" }}>Composite Trapezoidal Rule</h1>
          <FormatIntegration fn={fx} a={a} b={b} />

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

            <label>จำนวนช่วง n</label>
            <input
              type="number"
              value={n}
              onChange={(e) => this.setState({ n: e.target.value })}
            />

            <button style={{ marginTop: "10px" }} onClick={this.Calculate}>
              Calculate
            </button>
          </div>

          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

          {result !== null && (
            <div style={{ marginTop: "20px" }}>
              <h3>ขั้นตอนการคำนวณ:</h3>
              {steps.map((line, i) => (
                <BlockMath key={i} math={line} />
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
