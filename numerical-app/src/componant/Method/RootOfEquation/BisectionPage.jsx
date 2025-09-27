import { useState } from "react";
import { count, parse } from "mathjs";
import BackButton from "../../BackButton";
import "./BisectionPage.css";

export default function BisectionPage() {
  const [fn, setFn] = useState("x^3 - x - 2");
  const [a, setA] = useState(1);
  const [b, setB] = useState(2);
  const [tol, setTol] = useState(1e-7);
  const [root, setRoot] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [iteration, setIteration] = useState(0);

  function complieFn(text) {
    const node = parse(text);
    return (x) => node.evaluate({ x });
  }

  function bisectionMethod() {
    setErrorMsg("");
    setRoot(null);

    let left = Number(a);
    let right = Number(b);
    let tolerance = Number(tol);
    let f;
    let mid;
    let count = Number(iteration);

    try {
      f = complieFn(fn);
    } catch (e) {
      setErrorMsg("Error: Invalid function");
      return;
    }

    while ((right - left) / 2 > tolerance) {
      mid = (left + right) / 2;
      if (f(mid) === 0) {
        break;
      }
      if (f(left) * f(mid) < 0) {
        right = mid;
      } else {
        left = mid;
      }
      count += 1;
    }
    setRoot(mid);
    setIteration(count);
  }

  return (
    <div className="Bisec-page">
      <div>
        <BackButton />
      </div>
      <div className="Bisec-container">
        <h1>Bisection</h1>
        <div>
          <div>
            <label>f(x):</label>
            <input value={fn} onChange={(e) => setFn(e.target.value)} />
          </div>
          <div>
            <label>a:</label>
            <input value={a} onChange={(e) => setA(e.target.value)} />
          </div>
          <div>
            <label>b:</label>
            <input value={b} onChange={(e) => setB(e.target.value)} />
          </div>
          <div>
            <label>Tol:</label>
            <input value={tol} onChange={(e) => setTol(e.target.value)} />
          </div>
          <button onClick={bisectionMethod}>Calculate</button>

          <div>
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
            {root !== null && (
              <p>
                Root: {root} Iteration: {iteration}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
