// src/pages/GraphicalPage/graphicalMethod.js
import { isNull, parse } from "mathjs";

export function compileFn(text) {
  const node = parse(text);
  return (x) => node.evaluate({ x });
}

export function GraphicalMethod({ fn, a, b, error }) {
  let f;
  let left = Number(a);
  let right = Number(b);
  let CheckError = Number(error);
  let tolerance = Math.pow(10, Math.floor(Math.log10(Math.abs(left)))-1);
  // console.log(tolerance);
  // if (isNull(left) || isNull(right) || isNull(tolerance) || tolerance <= 0) {
  //   return { error: "กรุณาใส่ค่า a, b, tolerance ให้ถูกต้อง (tolerance ต้องมากกว่า 0)" };
  // }
  if (isNaN(left) || isNaN(right) || isNaN(tolerance) || tolerance <= 0) {
    return { error: "กรุณาใส่ค่า a, b, tolerance ให้ถูกต้อง (tolerance ต้องมากกว่า 0)" };
  }

  try {
    f = compileFn(fn);
  } catch (e) {
    return { error: "Error: Invalid function" };
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

    
    
    foundRoots.push(x);
    foundFn.push(f1);
    if (Math.abs(f1) <= CheckError) break;
    // console.log("x1 = ",x,"x2 = ",x+tolerance);
    // console.log("F1(x) = ",f(x),"F2(x)",f(x+tolerance));

    if (f1 * f2 < 0) {
      foundRoots.push(x + tolerance);
      foundFn.push(f2);
      tolerance *= 0.1;
      x += tolerance;
      count = 0;
      // console.log("Found");
      continue;
    }

    count += 1;
    // console.log(tolerance);
    if (count >= maxCount) {
      if (tolerance > minTolerance) {
        x -= tolerance * count;
        tolerance *= 0.1;
        count = 0;
        continue;
      } else {
        break;
      }
    }
    
    x += tolerance;
  }

  if (foundRoots.length === 0 || foundFn.length === 0) {
    return { error: "ไม่พบรากในช่วง [a,b]" };
  }

  return {
    roots: foundRoots,
    fx: foundFn,
  };
}
