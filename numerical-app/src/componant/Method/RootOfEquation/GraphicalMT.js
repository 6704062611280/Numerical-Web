import React, { Component } from "react";
import { parse } from "mathjs";

class GraphicalMT extends Component {
  compileFn = (text) => {
    const node = parse(text);
    return (x) => node.evaluate({ x });
  }

  Calculate = () => {
    const {fn,a,b,error} = this.props;
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
    // console.log(left);
    // console.log(right);
    // console.log("tol = ", tolerance);
    if (isNaN(left) || isNaN(right) || isNaN(tolerance) || tolerance <= 0) {
      errorMsg = "กรุณาใส่ค่า a, b, tolerance ให้ถูกต้อง (tolerance ต้องมากกว่า 0)" 
      if (this.props.onResult) this.props.onResult({ roots: [], fxRoots: [], errorMsg });
      return;
    }

    try {
      f = this.compileFn(fn);
    } catch (e) {
      errorMsg = "Error: Invalid function";
      if (this.props.onResult) this.props.onResult({ roots: [], fxRoots: [], errorMsg});
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



      foundRoots.push(x);
      foundFn.push(f1);
      if (Math.abs(f1) <= CheckError) break;
      console.log("x1 = ", x, "x2 = ", x + tolerance);
      console.log("F1(x) = ", f(x), "F2(x)", f(x + tolerance));

      if (f1 * f2 < 0) {
        foundRoots.push(x + tolerance);
        foundFn.push(f2);
        tolerance *= 0.1;
        x += tolerance;
        count = 0;
        console.log("Found");
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
      // if(count>=100000){
      //   return;
      // }
      x += tolerance;
    }
    console.log(count);
    if (foundRoots.length === 0 || foundFn.length === 0) {
      this.setState({ errorMsg: "ไม่พบรากในช่วง [a,b]" })
      return;
    }
    
    if(this.props.onResult) this.props.onResult({roots: foundRoots, fxRoots: foundFn, errorMsg});
    
  }
  render(){
      return this.props.children({Calculate : this.Calculate});
        }
}
export default GraphicalMT;

