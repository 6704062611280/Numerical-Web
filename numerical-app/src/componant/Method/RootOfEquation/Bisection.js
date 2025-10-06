import { parse } from "mathjs";

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