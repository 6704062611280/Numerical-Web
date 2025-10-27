import { parse } from "mathjs";
import { Component } from "react";

function convertPowerToNthRoot(input) {  //Fixed fn before parse
  let fixed = input.replace(/(\d)([a-zA-Z])/g, "$1*$2");
  fixed = fixed.replace(
    /\(([^()]+)\)\^\((\d+)\/(\d+)\)/g,
    "nthRoot(($1)^$2,$3)"
  );
  return fixed;
}
class BisectionMT extends Component {

  
  complieFn(text) {
    const node = parse(text);
    return (x) => node.evaluate({ x });
  }
  Calculate = () => {
    const { fn, a, b, error } = this.props;
    let fixed_fn = convertPowerToNthRoot(fn) //เก็บค่าที่จัดรูปแล้ว
    let left = Number(a);
    let right = Number(b);
    let ErrorCheck = Number(error);
    let f;
    let mid;
    let count = 0;
    let Max_count = 10000;

    let errorMsg = "";

    try {
      f = this.complieFn(fixed_fn);
    } catch (e) {
      errorMsg = "Error: Invalid function";
      if (this.props.onResult) this.props.onResult({ root: [], fxRoot: [], errorMsg })
      return;
    }

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

    //first iter
    mid = (left + right) / 2;
    let stepX =[mid];
    let stepFx = [f(mid)];
    if (f(left) * f(mid) < 0) {
        right = mid;
      } else {
        left = mid;
      }
    let errorValue = ["N/A"];
    let oldMid = mid;

    while ( oldMid < ErrorCheck) {
      mid = (left + right) / 2;
      stepX.push(mid);
      stepFx.push(f(mid));

      errorValue.push(Math.abs((mid - oldMid)/mid));
      // console.log("mid =  ",mid);
      //   console.log("old Mid = ",oldMid);
      
      
      if(count > Max_count){
        errorMsg = "Exceeded maximum 10,000 iterations";
        break;
      }

      if (f(mid) === 0) {

        break;
      }
      
      if (Math.abs((mid - oldMid)/mid) < ErrorCheck) {
        
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
      // console.log(errorValue[count])
      oldMid = mid;
      count += 1;
    }
    if(this.props.onResult) this.props.onResult({root:stepX,fxRoot:stepFx,ePer:errorValue,errorMsg})
  }
  render() {
    return this.props.children({ Calculate: this.Calculate })
  }
}
export default BisectionMT;