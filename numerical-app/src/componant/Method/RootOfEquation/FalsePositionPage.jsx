import { useState } from "react";
import { parse } from "mathjs";
import BackButton from "../../BackButton";
export default function FalsePositionPage() {
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

  function falsePosition() {
    setErrorMsg("");
    setRoot(null);
    

    let left = Number(a);
    let right = Number(b);
    let ErrorCheck = Number(error);
    let f;
    let mid;
    let count = 0;
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
      mid = (left * f(right) - right * f(left)) / (f(right) - f(left));
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
    <div>
      <BackButton />
      <div className="container">
        <h1>False-Position</h1>
        <div>
          <label>f(x):</label>
          <input value={fn} onChange={(e) => setFn(e.target.value)} />
        </div>
        <div>
            <label htmlFor="a">a</label>
            <input
              id="a"
              value={a}
              type="text"
              onChange={(e) => setA(e.target.value)}
            />
            <label htmlFor="b">b</label>
            <input
              id="b"
              value={b}
              type="text"
              onChange={(e) => setB(e.target.value)}
            />
          </div>
        <div>
          <label>er:</label>
          <input value={error} onChange={(e) => setError(e.target.value)} />
        </div>
        <div>
        <button onClick={falsePosition}>Calculate</button>
        </div>
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
  );
}
