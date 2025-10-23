import { create, all, derivative } from "mathjs";
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

class NewtonRaphsonMT extends Component {

    Calculate = () => {
        const { fn, xInitial, error } = this.props;

        const safeFn = convertPowerToNthRoot(fn);

        let node, compiled, fPrimeNode, fPrimeCompiled;

        try {
            node = math.parse(safeFn);
            compiled = node.compile();
            fPrimeNode = math.derivative(node, "x");
            fPrimeCompiled = fPrimeNode.compile();
        } catch (e) {
            const errorMsg = "Error: Invalid function";
            if (this.props.onResult)
                this.props.onResult({ xRoot: [], errorPer: [], errorMsg });
            return;
        }

        const f = (x) => Number(compiled.evaluate({ x }));
        const fPrime = (x) => Number(fPrimeCompiled.evaluate({ x }));

        let xStart = Number(xInitial);
        let ErrorCheck = Number(error);
        let errorMsg = "";
        // console.log(fn)
        if (isNaN(xStart) || isNaN(ErrorCheck)) {
            errorMsg = "กรุณาใส่ค่าเริ่มต้นและค่า Error ให้ถูกต้อง";
            if (this.props.onResult)
                this.props.onResult({ xRoot: [], errorPer: [], errorMsg });
            return;
        }

        let fPrimeVal = fPrime(xStart);
        if (fPrimeVal === 0) {
            errorMsg = "Error: f'(x) = 0 (หารด้วยศูนย์ไม่ได้)";
            if (this.props.onResult)
                this.props.onResult({ xRoot: [], errorPer: [], errorMsg });
            return;
        }

        let count = 0;
        const Max_count = 10000;

        let xNew = xStart - (f(xStart) / fPrime(xStart));
        let ePer = Math.abs((xNew - xStart) / xNew);

        const xNew_Array = [xNew];
        const ePer_Array = [ePer];
    
        while (ePer >= ErrorCheck && count < Max_count) {
            xStart = xNew;
            xNew = xStart - (f(xStart) / fPrime(xStart));
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

export default NewtonRaphsonMT;
