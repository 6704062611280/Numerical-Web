import { Component } from "react";
// นำเข้า Component จาก React เพื่อสร้าง class component

import BackButton from "../../BackButton";
// นำเข้า BackButton component จาก path ที่กำหนด (ใช้สำหรับปุ่มย้อนกลับ)

import { BlockMath } from "react-katex";
// นำเข้า BlockMath เพื่อแสดงสมการแบบ KaTeX (แสดงสูตรคณิตศาสตร์สวย ๆ)

import "katex/dist/katex.min.css";
// นำเข้าไฟล์ CSS ของ KaTeX เพื่อให้สมการแสดงผลสวยงาม

import "../../GlobalStyle.css";
// นำเข้า CSS global ของโปรเจค (เช่น สำหรับ layout, styling)

export default class GaussEliminationPage extends Component {
  // สร้าง class component ชื่อ GaussEliminationPage

  constructor(props) {
    super(props);
    // เรียก constructor ของ Component แม่ (React.Component)

    this.state = {
      // กำหนด state เริ่มต้นของ component
      size_matrix: 3,
      // ขนาด matrix (3x3 เริ่มต้น)

      matrixA: [
        [4, -4, 0],
        [-1, 4, -2],
        [0, -2, 4],
      ],
      // Matrix A เริ่มต้น

      matrixVariable: ["", "", ""],
      // ตัวแปร x1, x2, x3 (input disabled)

      matrixB: [400, 400, 400],
      // Vector B (ด้านขวาของสมการ)

      errorMsg: "",
      // เก็บข้อความ error (เช่น ขนาด matrix เกิน 10)

      steps: [],
      // เก็บขั้นตอนการคำนวณเป็น string KaTeX

      matrix_result: [],
      // เก็บผลลัพธ์ของ x
    };
  }

  matrixToKaTeX = (A, B) => {
    // ฟังก์ชันสำหรับแปลง matrix + vector เป็น string KaTeX
    const n = A.length; // จำนวน row ของ matrix
    let lines = []; // สร้าง array เก็บแต่ละแถว
    for (let i = 0; i < n; i++) {
      // loop แต่ละ row
      lines.push(
        [...A[i], B[i]] // รวม A row กับค่า B ของ row นั้น
          .map((v) => Number(v).toFixed(2)) // แปลงเป็น number และ fix 2 ทศนิยม
          .join(" & ") // เชื่อมด้วย & สำหรับ LaTeX (matrix column separator)
      );
    }
    // รวมทุก row เป็น matrix LaTeX
    return `\\begin{bmatrix} ${lines.join(" \\\\ ")} \\end{bmatrix}`;
  };

  Calculate = () => {
    // ฟังก์ชันหลักสำหรับคำนวณ Gauss Elimination
    const n = this.state.size_matrix;
    // ขนาด matrix

    const A = this.state.matrixA.map((row) => [...row]);
    // clone matrix A เพื่อไม่ให้แก้ state โดยตรง

    const B = [...this.state.matrixB];
    // clone vector B

    const steps = [];
    // เก็บขั้นตอนคำนวณ

    // Forward elimination
    for (let k = 0; k < n - 1; k++) {
      // loop ตาม column (ทำ row reduction)
      for (let i = k + 1; i < n; i++) {
        // loop row ที่อยู่ด้านล่าง pivot
        const factor = A[i][k] / A[k][k];
        // หา factor สำหรับลบ pivot
        for (let j = k; j < n; j++) A[i][j] -= factor * A[k][j];
        // ลบ pivot row * factor จาก row ปัจจุบัน
        B[i] -= factor * B[k];
        // ทำเหมือนกันกับ vector B

        // แสดงขั้นตอนการลบ R2 ⇒ f*R2 - R1
        steps.push(
          `R_{${i + 1}} \\Rightarrow (${factor.toFixed(3)}) R_{${i + 1}} - R_{${
            k + 1
          }} : ${this.matrixToKaTeX(A, B)}`
        );
      }
    }

    // Back substitution
    const X = new Array(n).fill(0);
    // สร้าง array สำหรับเก็บผลลัพธ์ x

    for (let i = n - 1; i >= 0; i--) {
      // เริ่มจาก bottom row
      let sumTerms = [];
      // เก็บตัวแปรที่ sum สำหรับ LaTeX
      let sum = 0;
      // sum ของ a_ij * x_j
      for (let j = i + 1; j < n; j++) {
        // loop columns ข้างขวาของ pivot
        sumTerms.push(`${A[i][j].toFixed(2)} x_{${j + 1}}`);
        // เก็บเป็น string สำหรับ KaTeX
        sum += A[i][j] * X[j];
        // บวกเข้ากับ sum จริง
      }

      X[i] = (B[i] - sum) / A[i][i];
      // แก้สมการหา x_i

      // สร้างสูตร KaTeX แสดงรายละเอียด
      const formula =
        sumTerms.length > 0
          ? `x_{${i + 1}} = \\frac{${B[i].toFixed(2)} - (${sumTerms.join(
              " + "
            )})}{${A[i][i].toFixed(2)}} = ${X[i].toFixed(3)}`
          : `x_{${i + 1}} = \\frac{${B[i].toFixed(2)}}{${A[i][i].toFixed(
              2
            )}} = ${X[i].toFixed(3)}`;

      steps.push(formula);
      // เก็บสูตรทีละตัว
    }

    steps.push(
      `\\text{Back substitution result: } ${X.map(
        (val, i) => `x_{${i + 1}} = ${val.toFixed(6)}`
      ).join(", ")}`
    );
    // สรุปผลลัพธ์ทั้งหมด

    this.setState({ matrix_result: X, steps });
    // update state
  };

  handleGenerate = () => {
    // ฟังก์ชันสำหรับ generate matrix ใหม่
    const size = parseInt(this.state.size_matrix);
    // แปลง input เป็น integer

    if (size > 10) {
      // ขนาด matrix ไม่เกิน 10
      this.setState({ errorMsg: "ขนาดเมทริกซ์ต้องไม่เกิน 10" });
      return;
    }

    const newMatrixA = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => "")
    );
    // สร้าง matrix A ว่าง

    const newMatrixB = Array.from({ length: size }, () => "");
    // vector B ว่าง

    const newMatrixVariable = Array.from({ length: size }, () => "");
    // ตัวแปร X ว่าง

    this.setState({
      matrixA: newMatrixA,
      matrixB: newMatrixB,
      matrixVariable: newMatrixVariable,
      steps: [],
      errorMsg: "",
    });
    // update state
  };

  handleChangeMatrixA = (r, c, value) => {
    // ฟังก์ชันสำหรับแก้ไข input matrix A
    const newMatrixA = this.state.matrixA.map((row, ri) =>
      row.map((col, ci) => (ri === r && ci === c ? value : col))
    );
    this.setState({ matrixA: newMatrixA });
  };

  handleChangeMatrixB = (r, value) => {
    // ฟังก์ชันสำหรับแก้ไข input vector B
    const newMatrixB = this.state.matrixB.map((val, i) =>
      i === r ? value : val
    );
    this.setState({ matrixB: newMatrixB });
  };

  render() {
    // destructure state
    const {
      size_matrix,
      matrixA,
      matrixB,
      matrixVariable,
      errorMsg,
      steps,
      matrix_result,
    } = this.state;

    return (
      <div className="page">
        <BackButton />
        {/* ปุ่มย้อนกลับ */}
        <div className="container">
          <h1 style={{ padding: "20px" }}>Gauss Elimination Method</h1>
          <div style={{ margin:"0 auto", textAlign:"center"}}>
            <div className="input-text">
              <label>Matrix size : </label>
              <input
                type="number"
                value={size_matrix}
                onChange={(e) => this.setState({ size_matrix: e.target.value })}
              />
              {/* input ขนาด matrix */}
              <button onClick={this.handleGenerate}>Generate</button>
              {/* สร้าง matrix ใหม่ */}
            </div>

            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
            {/* แสดง error message */}

            {/* Matrix Input */}
            <div className="matrix-container">
              <div className="matrix-box">
                <p className="matrix-title">[A]</p>
                <div
                  className="matrix-grid"
                  style={{
                    gridTemplateColumns: `repeat(${size_matrix}, 60px)`,
                  }}
                >
                  {matrixA.map((row, r) =>
                    row.map((val, c) => (
                      <input
                        key={`A-${r}-${c}`}
                        type="number"
                        className="matrix-input"
                        value={val}
                        placeholder={`a${r + 1}${c + 1}`}
                        onChange={(e) =>
                          this.handleChangeMatrixA(r, c, e.target.value)
                        }
                      />
                    ))
                  )}
                </div>
              </div>

              <span className="symbol">×</span>

              <div className="vector-box">
                <p className="vector-title">{"{X}"}</p>
                <div className="vector-grid">
                  {matrixVariable.map((val, r) => (
                    <input
                      key={`X-${r}`}
                      type="number"
                      className="vector-input"
                      value={val}
                      placeholder={`x${r + 1}`}
                      disabled
                    />
                  ))}
                </div>
              </div>

              <span className="symbol">=</span>

              <div className="vector-box">
                <p className="vector-title">{"{B}"}</p>
                <div className="vector-grid">
                  {matrixB.map((val, r) => (
                    <input
                      key={`B-${r}`}
                      type="number"
                      className="vector-input"
                      value={val}
                      placeholder={`b${r + 1}`}
                      onChange={(e) =>
                        this.handleChangeMatrixB(r, e.target.value)
                      }
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Button Calculate */}
            <button style={{ marginTop: "10px" }} onClick={this.Calculate}>
              Calculate
            </button>
          </div>

          {/* Steps Output */}
          {steps.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h3>ขั้นตอนการคำนวณ:</h3>
              {steps.map((line, i) => (
                <BlockMath key={i} math={line} />
              ))}

              <h3>✅ ผลลัพธ์สุดท้าย:</h3>
              {matrix_result.map((val, i) => (
                <BlockMath
                  key={`res-${i}`}
                  math={`x_{${i + 1}} \\approx ${val.toFixed(6)}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}
