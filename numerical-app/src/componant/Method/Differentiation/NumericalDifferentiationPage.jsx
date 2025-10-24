import BackButton from "../../BackButton";
import { Component } from "react";
import { evaluate } from "mathjs";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import FormatDerivative from "../../FormatDerivative";

export default class NumericalDifferentiationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fx: "x^2",
      x: 1,
      h: 0.01,
      order: "first",
      direction: "forward",
      errorOrder: "O(h)", // เพิ่ม error term
      result: null,
      steps: [],
      errorMsg: "",
    };
  }

  Calculate = () => {
    try {
      const { fx, x, h, order, direction } = this.state;
      const X = parseFloat(x);
      const H = parseFloat(h);

      if (isNaN(X) || isNaN(H) || H <= 0) {
        this.setState({
          errorMsg: "กรุณากรอกค่า x และ h ให้ถูกต้อง",
          result: null,
          steps: [],
        });
        return;
      }

      const f = (val) => evaluate(fx.replace(/x/g, `(${val})`));
      let derivative = 0;
      let steps = [];

      if (order === "first") {
        if (direction === "forward") {
          derivative = (f(X + H) - f(X)) / H;
          steps = [
            `f(x+h) = f(${X}+${H}) = ${f(X + H).toFixed(6)}`,
            `f(x) = f(${X}) = ${f(X).toFixed(6)}`,
            `f'(x) \\approx \\frac{f(x+h)-f(x)}{h} = \\frac{${f(X + H).toFixed(
              6
            )}-${f(X).toFixed(6)}}{${H}} = ${derivative.toFixed(6)}`,
          ];
        } else if (direction === "backward") {
          derivative = (f(X) - f(X - H)) / H;
          steps = [
            `f(x) = f(${X}) = ${f(X).toFixed(6)}`,
            `f(x-h) = f(${X}-${H}) = ${f(X - H).toFixed(6)}`,
            `f'(x) \\approx \\frac{f(x)-f(x-h)}{h} = \\frac{${f(X).toFixed(
              6
            )}-${f(X - H).toFixed(6)}}{${H}} = ${derivative.toFixed(6)}`,
          ];
        } else if (direction === "centered") {
          derivative = (f(X + H) - f(X - H)) / (2 * H);
          steps = [
            `f(x+h) = f(${X}+${H}) = ${f(X + H).toFixed(6)}`,
            `f(x-h) = f(${X}-${H}) = ${f(X - H).toFixed(6)}`,
            `f'(x) \\approx \\frac{f(x+h)-f(x-h)}{2h} = \\frac{${f(
              X + H
            ).toFixed(6)}-${f(X - H).toFixed(6)}}{${
              2 * H
            }} = ${derivative.toFixed(6)}`,
          ];
        }
      } else if (order === "second") {
        derivative = (f(X + H) - 2 * f(X) + f(X - H)) / (H * H);
        steps = [
          `f(x+h) = ${f(X + H).toFixed(6)}, f(x) = ${f(X).toFixed(
            6
          )}, f(x-h) = ${f(X - H).toFixed(6)}`,
          `f''(x) \\approx \\frac{f(x+h)-2f(x)+f(x-h)}{h^2} = ${derivative.toFixed(
            6
          )}`,
        ];
      } else if (order === "third") {
        derivative =
          (f(X + 2 * H) - 2 * f(X + H) + 2 * f(X - H) - f(X - 2 * H)) /
          (2 * H * H * H);
        steps = [
          `f(x+2h) = ${f(X + 2 * H).toFixed(6)}, f(x+h) = ${f(X + H).toFixed(
            6
          )}`,
          `f(x-h) = ${f(X - H).toFixed(6)}, f(x-2h) = ${f(X - 2 * H).toFixed(
            6
          )}`,
          `f'''(x) \\approx \\frac{f(x+2h)-2f(x+h)+2f(x-h)-f(x-2h)}{2h^3} = ${derivative.toFixed(
            6
          )}`,
        ];
      } else if (order === "fourth") {
        derivative =
          (f(X - 2 * H) -
            4 * f(X - H) +
            6 * f(X) -
            4 * f(X + H) +
            f(X + 2 * H)) /
          (H * H * H * H);
        steps = [
          `f(x-2h) = ${f(X - 2 * H).toFixed(6)}, f(x-h) = ${f(X - H).toFixed(
            6
          )}`,
          `f(x) = ${f(X).toFixed(6)}, f(x+h) = ${f(X + H).toFixed(
            6
          )}, f(x+2h) = ${f(X + 2 * H).toFixed(6)}`,
          `f''''(x) \\approx \\frac{f(x-2h)-4f(x-h)+6f(x)-4f(x+h)+f(x+2h)}{h^4} = ${derivative.toFixed(
            6
          )}`,
        ];
      }

      this.setState({ result: derivative, steps, errorMsg: "" });
    } catch (error) {
      this.setState({
        result: null,
        steps: [],
        errorMsg: "รูปแบบสมการไม่ถูกต้อง",
      });
    }
  };

  render() {
    const { fx, x, h, order, direction, errorOrder, result, steps, errorMsg } =
      this.state;

    return (
      <div className="page">
        <BackButton />
        <div className="container">
          <h1 style={{ padding: "20px" }}>Numerical Differentiation</h1>
          <FormatDerivative fn={fx} />

          <div>
            <div
              style={{
                display: "flex",
                gap: "20px",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
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
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Direction</label>
                <select
                  value={direction}
                  onChange={(e) => this.setState({ direction: e.target.value })}
                >
                  <option value="forward">Forward</option>
                  <option value="backward">Backward</option>
                  <option value="centered">Centered</option>
                </select>
              </div>

              {/* Dropdown เลือก error term */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label>Error Term</label>
                <select
                  value={errorOrder}
                  onChange={(e) =>
                    this.setState({ errorOrder: e.target.value })
                  }
                >
                  <option value="O(h)">O(h)</option>
                  <option value="O(h^2)">O(h^2)</option>
                  <option value="O(h^4)">O(h^4)</option>
                </select>
              </div>
            </div>

            <div
              className="only-input"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyItems: "center",
              }}
            >
              <div>
                <label>ฟังก์ชัน f(x) </label>
                <input
                  type="text"
                  value={fx}
                  onChange={(e) => this.setState({ fx: e.target.value })}
                />
              </div>

              <div>
                <label>จุด x </label>
                <input
                  type="number"
                  value={x}
                  onChange={(e) => this.setState({ x: e.target.value })}
                />
              </div>

              <div>
                <label>ค่า h </label>
                <input
                  type="number"
                  value={h}
                  onChange={(e) => this.setState({ h: e.target.value })}
                />
              </div>

              <button
                style={{ marginTop: "0px 0px 0px 10px" }}
                onClick={this.Calculate}
              >
                Calculate
              </button>
            </div>
          </div>

          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

          {result !== null && (
            <div style={{ marginTop: "20px" }}>
              <h3>ขั้นตอนการคำนวณ:</h3>
              {steps.map((line, i) => (
                <BlockMath key={i} math={line} />
              ))}

              <h3>✅ ผลลัพธ์สุดท้าย:</h3>
              <BlockMath
                math={`f^{(${
                  order === "first"
                    ? 1
                    : order === "second"
                    ? 2
                    : order === "third"
                    ? 3
                    : 4
                })}(${x}) \\approx ${result.toFixed(6)}`}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}
