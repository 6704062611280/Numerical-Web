import React, { Component } from "react";
import { create, all } from "mathjs";
const math = create(all, { implicit: "show" });

function convertPowerToNthRoot(input) {
  let fixed = input.replace(/(\d)([a-zA-Z])/g, "$1*$2");
  fixed = fixed.replace(
    /\(([^()]+)\)\^\((\d+)\/(\d+)\)/g,
    "nthRoot(($1)^$2,$3)"
  );
  return fixed;
}

class GraphicalMT extends Component {

  compileFn = (text) => {
    const node = math.parse(text);
    return (x) => {
      const result = node.evaluate({ x });
      if (math.typeOf(result) === "Complex") return result.re;
      return Number(result);
    };
  };

  Calculate = () => {
    const { fn, a, b, error } = this.props;
    let fixed_fn = convertPowerToNthRoot(fn);
    let f;
    let left = Number(a);
    let right = Number(b);
    let CheckError = Number(error);
    let tolerance;

    if (left === 0) {
      tolerance = 1;
    } else {
      tolerance = Math.pow(10, Math.floor(Math.log10(Math.abs(left))) - 1);
    }

    let errorMsg = "";

    if (isNaN(left) || isNaN(right) || isNaN(tolerance) || tolerance <= 0) {
      errorMsg =
        "กรุณาใส่ค่า a, b, tolerance ให้ถูกต้อง (tolerance ต้องมากกว่า 0)";
      if (this.props.onResult)
        this.props.onResult({ roots: [], fxRoots: [], ePer: [], errorMsg });
      return;
    }

    if (!fn || !a || !b || !error) {
      errorMsg =
        "กรุณากรอกค่า f(x), X Start, X End, และ Error ให้ครบ";
      if (this.props.onResult)
        this.props.onResult({ roots: [], fxRoots: [], ePer: [], errorMsg });
      return;
    }

    try {
      f = this.compileFn(fixed_fn);
    } catch (e) {
      errorMsg = "Error: Invalid function";
      if (this.props.onResult)
        this.props.onResult({ roots: [], fxRoots: [], ePer: [], errorMsg });
      return;
    }

    let count = 0;
    const foundRoots = [];
    const foundFn = [];
    const errorValue = [];
    let x = left;
    const maxCount = 10;
    const minTolerance = 1e-20;
    let prevX = null; // ✅ เก็บค่า x ก่อนหน้า

    while (x <= right) {
      let f1 = Number(f(x));
      let f2 = Number(f(x + tolerance));

      foundRoots.push(Number(x));
      foundFn.push(f1);

      // ✅ คำนวณ error จากความต่างของ x (relative error)
      let calculatedError = 0;
      if (prevX !== null) {
        const xDiff = Math.abs(x - prevX);
        if (x !== 0) {
          calculatedError = xDiff / Math.abs(x);
        } else {
          calculatedError = xDiff; // ถ้า x = 0 ใช้ absolute error
        }
      }
      errorValue.push(calculatedError);
      prevX = x;

      if (Math.abs(f1) <= CheckError) break;

      if (f1 * f2 < 0) {
        const newX = x + tolerance;
        foundRoots.push(Number(newX));
        foundFn.push(f2);

        // ✅ คำนวณ error สำหรับจุดที่ 2
        const xDiff2 = Math.abs(newX - x);
        let calculatedError2 = 0;
        if (newX !== 0) {
          calculatedError2 = xDiff2 / Math.abs(newX);
        } else {
          calculatedError2 = xDiff2;
        }
        errorValue.push(calculatedError2);
        prevX = newX;

        tolerance *= 0.1;
        x += tolerance;
        count = 0;
        continue;
      }

      count += 1;
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
      errorMsg = "ไม่พบรากในช่วง [a,b]";
      if (this.props.onResult)
        this.props.onResult({ roots: [], fxRoots: [], ePer: [], errorMsg });
      return;
    }

    if (this.props.onResult)
      this.props.onResult({ 
        roots: foundRoots, 
        fxRoots: foundFn, 
        ePer: errorValue, 
        errorMsg 
      });
  };

  render() {
    return this.props.children({ Calculate: this.Calculate });
  }
}

export default GraphicalMT;