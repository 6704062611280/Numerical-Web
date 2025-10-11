import { parse } from "mathjs";
import { Component } from "react";
class BisectionMT extends Component {
  complieFn(text) {
    const node = parse(text);
    return (x) => node.evaluate({ x });
  }
  Calculate = () => {
    const { fn, a, b, error } = this.props;

    let left = Number(a);
    let right = Number(b);
    let ErrorCheck = Number(error);
    let f;
    let mid;
    let count = 0;

    let errorMsg = "";

    if (isNaN(left) || isNaN(right) || isNaN(ErrorCheck) || ErrorCheck <= 0) {
      errorMsg = "กรุณาใส่ค่า a, b, Error ให้ถูกต้อง (Error ต้องมากกว่า 0)";
      if (this.props.onResult) this.props.onResult({ root: [], fxRoot: [], errorMsg })
      return;
    }

    if (!fn || !a || !b || !error) {
      errorMsg = "กรุณากรอกค่า f(x), X Start, X End, และ Error ให้ครบ";
      if (this.props.onResult) this.props.onResult({ roots: [], fxRoots:[], errorMsg });  
      return;
    }

    try {
      f = this.complieFn(fn);
    } catch (e) {
      errorMsg = "Error: Invalid function";
      if (this.props.onResult) this.props.onResult({ root: [], fxRoot: [], errorMsg })
      return;
    }

    let stepX = [left, right];
    let stepFx = [f(left), f(right)];

    while ((right - left) / 2 > ErrorCheck) {
      mid = (left + right) / 2;
      stepX.push(mid);
      stepFx.push(f(mid));

      
      if (f(mid) === 0) {

        break;
      }


      if (f(left) * f(mid) < 0) {
        right = mid;
      } else {
        left = mid;
      }
      // if(Math.abs(f(mid)) <= ErrorCheck){
      //   break;
      // }
      count += 1;
    }
    if(this.props.onResult) this.props.onResult({root:stepX,fxRoot:stepFx,errorMsg})
  }
  render() {
    return this.props.children({ Calculate: this.Calculate })
  }
}
export default BisectionMT;