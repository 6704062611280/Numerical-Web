import { useState } from "react";
import BackButton from "../../BackButton";
import { parse } from "mathjs";
import "./GraphicalPage.css";

export default function GraphicalPage() {
  const [fn, setFn] = useState("x^3-4x+1");
  const [a, setA] = useState("-3");
  const [b, setB] = useState("3");
  const [tol, setTol] = useState("1");
  const [errorMessage, setErrorMessage] = useState("");
  const [root, setRoot] = useState(null);

  function CompileFn(text) {
    const node = parse(text);
    return (x) => node.evaluate({ x });
  }

  function Graphical() {
    setRoot(null);
    setErrorMessage("");
    let f;
    let left = Number(a);
    let right = Number(b);
    let tolerance = Number(tol);

    if (isNaN(left) || isNaN(right) || isNaN(tolerance) || tolerance <= 0) {
      setErrorMessage(
        "กรุณาใส่ค่า a, b, tolerance ให้ถูกต้อง (tolerance ต้องมากกว่า 0)"
      );
      return;
    }

    try {
      f = CompileFn(fn);
    } catch (e) {
      setErrorMessage("Error: Invalid function");
      return;
    }

    for (let i = left + tolerance; i <= right; i = i + tolerance) {
      let Fx = f(i);
      let Fold = f(i - tolerance);
      if (Fold * Fx < 0) {
        const RRot = (i + (i - tolerance)) / 2;
        setRoot(RRot);
        return;
      }
    }
    return setErrorMessage("ไม่พบค่ารากในช่วง [a,b]");
  }
  return (
    <div>
      <BackButton />
      <div className="container">
        <h1>Graphical Method</h1>
        <div>
          <div>
            <label htmlFor="fn">f(x)</label>
            <input
              id="fn"
              value={fn}
              type="text"
              onChange={(e) => setFn(e.target.value)}
            />
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
            <label htmlFor="tol">tolerance</label>
            <input
              id="tol"
              value={tol}
              type="text"
              onChange={(e) => setTol(e.target.value)}
            />
          </div>
          <div>
            <button onClick={Graphical}>Calculate</button>
          </div>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          {root && <p>x ≈ {root}</p>}
        </div>
      </div>
    </div>
  );
}
