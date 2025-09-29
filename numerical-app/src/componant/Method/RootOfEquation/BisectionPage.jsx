import { useState } from "react";
import { count, parse } from "mathjs";
import BackButton from "../../BackButton";
import "./BisectionPage.css";

export default function BisectionPage() {
  const [fn, setFn] = useState("x^3 - x - 2");
  const [a, setA] = useState(1);
  const [b, setB] = useState(2);
  const [error, setError] = useState(1e-7);
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
    let ErrorCheck = Number(error);
    let f;
    let mid;
    let count = Number(iteration);

    if( isNaN(left) || isNaN(right) || isNaN(ErrorCheck) || ErrorCheck <=0){
      setErrorMsg("กรุณาใส่ค่า a, b, Error ให้ถูกต้อง (Error ต้องมากกว่า 0)")
      return;
    }
    
    try {
      f = complieFn(fn);
    } catch (e) {
      setErrorMsg("Error: Invalid function");
      return;
    }

    while ((right - left) / 2 > ErrorCheck) {
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
            <label>er:</label>
            <input value={error} onChange={(e) => setError(e.target.value)} />
          </div>
          <button onClick={bisectionMethod}>Calculate</button>

          <div>
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
            {root && (
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
