// -----------------------------
// 🔹 Import libraries และ components ที่ใช้
// -----------------------------
import React, { Component } from "react"; // ใช้สร้าง class component
import BackButton from "../../BackButton"; // ปุ่มย้อนกลับหน้าเดิม
import Plot from "react-plotly.js"; // ใช้ plot กราฟแบบ interactive
import ResultTable from "../../ResultTable"; // ไฟล์ CSS สำหรับตกแต่งหน้า
import GraphicalMT from "./GraphicalMT"; // ไฟล์ที่มี logic คำนวณจริง
import FormatLatex from "../../FormatLatex";
import "../../GlobalStyle.css"; // ดึง CSS รวมที่เราทำไว้ก่อนหน้า (nice-table)

// -----------------------------
// 🔹 สร้างคลาสหลัก GraphicalPage
// -----------------------------
class GraphicalPage extends Component {
  constructor(props) {
    super(props);
    // กำหนดค่าเริ่มต้นของ state
    this.state = {
      fn: "x^3-4x+1", // สมการเริ่มต้น f(x)
      a: "-1000", // ค่าต่ำสุดของช่วง (เริ่ม plot จาก x=-1000)
      b: "1000", // ค่าสูงสุดของช่วง (ถึง x=1000)
      error: "0.000001", // ค่าความคลาดเคลื่อนที่ยอมรับได้
      errorMsg: "", // เก็บข้อความแจ้งเตือน error
      roots: [], // เก็บค่าราก (x) ที่หาได้
      fxRoots: [], // เก็บค่าฟังก์ชัน f(x) ของแต่ละราก
    };
  }

  // -----------------------------
  // 🔹 แปลงสมการให้เป็นรูป LaTeX เพื่อแสดงผลทางคณิตศาสตร์
  // -----------------------------
  formatToLaTeX = (equation) => {
    // เช่น x^(2) → x^{2}
    return equation.replace(/\^\((.*?)\)/g, "^{\$1}");
  };

  // -----------------------------
  // 🔹 ส่วนการแสดงผลหน้าจอ (render)
  // -----------------------------
  render() {
    const { fn, a, b, error, roots, fxRoots, errorMsg } = this.state;

    // สร้างข้อมูลเรียงตามค่า x สำหรับ plot กราฟ
    const sortedData = roots
      .map((val, i) => ({ x: val, y: fxRoots[i] })) // รวม x และ f(x) เป็น object
      .sort((a, b) => a.x - b.x); // เรียงจากน้อย → มาก

    // แยกเป็นอาเรย์ของ x และ y เพื่อส่งให้ Plotly
    const sortedX = sortedData.map((d) => d.x);
    const sortedY = sortedData.map((d) => d.y);

    // -----------------------------
    // 🔹 ส่วนที่ return (HTML + Logic)
    // -----------------------------
    return (
      <div className="page">
        {/* ปุ่มย้อนกลับ */}
        <BackButton />

        <div className="container">
          {/* หัวข้อหลัก */}
          <h1 style={{ padding: "20px 0px 0px 0px" }}>Graphical Method</h1>

          <div>
            {/* แสดงสมการในรูปแบบ LaTeX */}
            <FormatLatex fn={fn} />

            {/* -----------------------------
                🔹 ส่วนกรอกข้อมูลอินพุต
               ----------------------------- */}
            <div className="input-text">
              {/* ฟังก์ชัน f(x) */}
              <div>
                <label htmlFor="fn">f(x) </label>
                <input
                  id="fn"
                  value={fn}
                  type="text"
                  onChange={(e) => this.setState({ fn: e.target.value })}
                  style={{ width: "250px" }}
                />
              </div>

              {/* ช่วงค่า x ที่ต้องการหา */}
              <div>
                <label htmlFor="a">X Start </label>
                <input
                  id="a"
                  value={a}
                  type="text"
                  onChange={(e) => this.setState({ a: e.target.value })}
                  style={{ width: "50px", marginRight: "10px" }}
                />
                <label htmlFor="b">X End </label>
                <input
                  id="b"
                  value={b}
                  type="text"
                  onChange={(e) => this.setState({ b: e.target.value })}
                  style={{ width: "50px" }}
                />
              </div>

              {/* ค่า Error */}
              <div>
                <label htmlFor="error">Error </label>
                <input
                  id="error"
                  value={error}
                  type="text"
                  onChange={(e) => this.setState({ error: e.target.value })}
                />
              </div>

              {/* -----------------------------
                  🔹 เรียก Component GraphicalMT ที่คำนวณจริง
                 ----------------------------- */}
              <GraphicalMT
                fn={fn} // ส่งสมการ f(x)
                a={a} // ค่าจุดเริ่มต้น
                b={b} // ค่าจุดสิ้นสุด
                error={error} // ค่าความคลาดเคลื่อน
                onResult={({ roots, fxRoots, errorMsg }) =>
                  // รับค่าผลลัพธ์จาก GraphicalMT และอัปเดต state
                  this.setState({ roots, fxRoots, errorMsg })
                }
              >
                {/* children function → รับ Calculate จาก GraphicalMT */}
                {({ Calculate }) => (
                  <div>
                    <button onClick={Calculate}>Calculate</button>
                    {/* แสดงข้อความ error ถ้ามี */}
                    {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
                  </div>
                )}
              </GraphicalMT>
            </div>

            {/* -----------------------------
                🔹 ส่วนกราฟ (Plotly)
               ----------------------------- */}
            <Plot
              data={[
                {
                  x: sortedX, // แกน X
                  y: sortedY, // แกน Y
                  type: "scatter", // ใช้เส้นเชื่อมต่อ
                  mode: "lines+markers", // เส้น + จุด
                  line: { color: "blue" }, // เส้นสีน้ำเงิน
                  marker: { color: "red" }, // จุดสีแดง
                },
              ]}
              layout={{
                width: 1000, // ความกว้างกราฟ
                height: 440, // ความสูงกราฟ
                title: "กราฟแสดง f(x)", // ชื่อกราฟ
                xaxis: { title: "แกน X" }, // ป้ายแกน X
                yaxis: {
                  title: "แกน Y", // ป้ายแกน Y
                  autorange: true, // ให้ปรับช่วงอัตโนมัติ
                  range: [0, null], // ค่าเริ่มต้นที่แกน y จาก 0
                },
              }}
            />

            {/* -----------------------------
                🔹 ตารางแสดงผลลัพธ์การคำนวณ
               ----------------------------- */}
            <ResultTable roots={roots} fxRoots={fxRoots}/>
          </div>
        </div>
      </div>
    );
  }
}

// -----------------------------
// 🔹 export component
// -----------------------------
export default GraphicalPage;
