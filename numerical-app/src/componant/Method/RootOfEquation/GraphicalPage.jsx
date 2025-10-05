import { useState } from "react";
import BackButton from "../../BackButton";
import { parse, to } from "mathjs";
import "./GraphicalPage.css";

export default function GraphicalPage() {
  const [fn, setFn] = useState("x^3-4x+1");
  const [a, setA] = useState("-3");
  const [b, setB] = useState("3");
  const [error, setError] = useState("0.000001");
  const [errorMessage, setErrorMessage] = useState("");
  const [root, setRoot] = useState([]);
  const [fxRoot, setFxRoot] = useState([]);

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
    let CheckError = Number(error); // ค่า Error
    let tolerance = 1;
    setRoot([]);
    setFxRoot([]);

    // if (CheckError < 0.00001) {
    //   setErrorMessage(
    //     "Error ไม่เกิน 0.000001" // ค่า Check Error
    //   );
    //   return;
    // }

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
    let count = 0;
    const foundRoots = [];
    const foundFn = [];
    let x = left;
    const maxCount = 10;
    const minTolerance = 1e-20;
    while (x <= right) {
      
      let f1 = f(x);
      let f2 = f(x + tolerance);
      if (Math.abs(f1) <= CheckError) {
        break;
      }
      foundRoots.push(x); //เหมือนรุ่นพี่
      foundFn.push(f1);
      console.log(x,x +tolerance," ",f1,f2);
      if (f1 * f2 < 0) {
        // foundRoots.push(x);
        // foundFn.push(f1);
        foundRoots.push(x + tolerance);
        foundFn.push(f2);
        tolerance = tolerance * 0.1;
        x=x+tolerance; //x ต่อไป
        console.log("Found")
        count = 0;
        continue;
      }
      console.log("tol = ",tolerance);
      

      
      count += 1;
      console.log("Count =", count);
      if (count >= maxCount) {
        if (tolerance > minTolerance) {
          
          console.log("x = ",x)
          x -= tolerance * count; // ถอยกลับเพื่อละเอียดขึ้น
          tolerance *= 0.1;
          console.log("tolerance*count = ",tolerance*count)
          count = 0;
          continue;
        } else {
          break; // tolerance เล็กสุดแล้ว หยุดเลย
        }
      }
      x=x+tolerance; // x ต่อไป
    }

    // for (let x = left; x <= right; x += tolerance) {
    //   let f1 = f(x);
    //   let f2 = f(x + tolerance);

    //   console.log(x,x +tolerance," ",f1,f2);
    //   // foundRoots.push(x);    //เหมือนรุ่นพี่
    //   // foundFn.push(f1);
    //   if (f1 * f2 < 0) {
    //     foundRoots.push(x);
    //     foundFn.push(f1);
    //     foundRoots.push(x + tolerance); //เหมือนรุ่นพี่
    //     foundFn.push(f2);
    //     tolerance = tolerance / 10;
    //     count=0;
    //     console.log("Found");
    //   }
    //   if(count>9){
    //     tolerance = tolerance / 10;
    //     x=foundRoots[foundRoots.length-1];
    //     count=0;
    //   }
    //   if (Math.abs(f1) <= CheckError) {
    //     break;
    //   }
    //   count+=1;
    // }
    setRoot(foundRoots);
    setFxRoot(foundFn);
    console.log("fxRoot[13] =", fxRoot[13]);
    console.log("f(-2.11491	) =", f(-2.11491));
    

    if (foundRoots.length === 0 || foundFn.length === 0) {
      return setErrorMessage("ไม่พบรากในช่วง [a,b]");
    }
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
            <label htmlFor="error">Error</label>
            <input
              id="error"
              value={error}
              type="text"
              onChange={(e) => setError(e.target.value)}
            />
          </div>
          <div>
            <button onClick={Graphical}>Calculate</button>
          </div>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          {root.length > 0 && (
            <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
              <thead>
                <tr>
                  <th>ลำดับ</th>
                  <th>รากที่หาได้ (x)</th>
                  <th>f(x)</th>
                </tr>
              </thead>
              <tbody>
                {root.map((r, index) => (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>{r.toFixed(6)}</td>
                    <td>{fxRoot[index].toFixed(6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
