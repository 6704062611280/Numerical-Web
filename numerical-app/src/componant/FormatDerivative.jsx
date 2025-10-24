import { Component } from "react";
import { BlockMath } from "react-katex"; // แสดงสมการคณิตแบบสวยงาม (LaTeX)
import "katex/dist/katex.min.css"; // CSS ของ KaTeX
export default class FormatIntegration extends Component {
  formatToLaTeX = (equation) => {
    // เช่น x^(2) → x^{2}
    return equation.replace(/\^\((.*?)\)/g, "^{$1}");
  };

  render() {
    const { fn } = this.props;
    return (
      <h1 className="math-text">
        <BlockMath math={`\\frac{dy}{dx} ${this.formatToLaTeX(fn)}`} />
      </h1>
    );
  }
}
