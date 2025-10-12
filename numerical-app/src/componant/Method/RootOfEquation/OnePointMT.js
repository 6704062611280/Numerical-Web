import { create, all } from "mathjs";
import { Component } from "react";

const math = create(all, { implicit: "show" });

function convertPowerToNthRoot(input) {
  let fixed = input.replace(/(\d)([a-zA-Z])/g, "$1*$2");
  fixed = fixed.replace(
    /\(([^()]+)\)\^\((\d+)\/(\d+)\)/g,
    "nthRoot(($1)^$2,$3)"
  );
  return fixed;
}

class OnePointMT extends Component {

  Calculate = () => {
    const { gx, xInitial, error } = this.props;

    const safeFn = convertPowerToNthRoot(gx);
    
    let node, compiled;
    try {
      node = math.parse(safeFn);
      compiled = node.compile();
    } catch (e) {
      const errorMsg = "Error: Invalid function";
      if (this.props.onResult)
        this.props.onResult({ xRoot: [], errorPer: [], errorMsg });
      return;
    }

    const f = (x) => Number(compiled.evaluate({ x }));

    let xStart = Number(xInitial);
    let ErrorCheck = Number(error);
    let errorMsg = "";

    if (isNaN(xStart) || isNaN(ErrorCheck)) {
      errorMsg = "กรุณาใส่ค่าเริ่มต้นและค่า Error ให้ถูกต้อง";
      if (this.props.onResult)
        this.props.onResult({ xRoot: [], errorPer: [], errorMsg });
      return;
    }

    let count = 0;
    const Max_count = 10000;

    let xNew = f(xStart);
    let ePer = Math.abs((xNew - xStart) / xNew);

    const xNew_Array = [xNew];
    const ePer_Array = [ePer];

    while (ePer >= ErrorCheck && count < Max_count) {
      xStart = xNew;
      xNew = f(xStart);
      ePer = Math.abs((xNew - xStart) / xNew);

      xNew_Array.push(xNew);
      ePer_Array.push(ePer);

      count += 1;
    }

    if (this.props.onResult)
      this.props.onResult({ xRoot: xNew_Array, errorPer: ePer_Array, errorMsg });
  };

  render() {
    return this.props.children({ Calculate: this.Calculate });
  }
}

export default OnePointMT;
