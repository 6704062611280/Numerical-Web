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
class FalsePositionMT extends Component {

    compileFn(text) {
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
        try { //เก็บ fn
            f = this.compileFn(fixed_fn);
        } catch (e) {
            errorMsg = "Error: Invalid function";
            if (this.props.onResult) this.props.onResult({ root: [], fxRoot: [], errorMsg })
            return;
        }

        let errorMsg = "";
        if (isNaN(left) || isNaN(right) || isNaN(ErrorCheck) || ErrorCheck <= 0) {
            errorMsg = "กรุณาใส่ค่า a, b, Error ให้ถูกต้อง (Error ต้องมากกว่า 0)";
            if (this.props.onResult) this.props.onResult({ root: [], fxRoot: [], errorMsg })
            return;
        }

        if (!fn || !a || !b || !error) {
            errorMsg = "กรุณากรอกค่า f(x), X Start, X End, และ Error ให้ครบ";
            if (this.props.onResult) this.props.onResult({ roots: [], fxRoots: [], errorMsg });
            return;
        }

        

        let stepX = [left, right];
        let stepFx = [f(left), f(right)];
        console.log("TEST",f(left));
        while ((right - left) / 2 > ErrorCheck) {

            mid = (left * f(right) - right * f(left)) / (f(right) - f(left));
            console.log(f(mid));
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
            if (Math.abs(f(mid)) <= ErrorCheck) {
                break;
            }

        }
        if (this.props.onResult) this.props.onResult({ root: stepX, fxRoot: stepFx, errorMsg })

    }
    render() {
        return this.props.children({ Calculate: this.Calculate });

    }
}
export default FalsePositionMT;
