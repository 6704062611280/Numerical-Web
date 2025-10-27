// -----------------------------
// 🔹 Import libraries และ components ที่ใช้
// -----------------------------
import React, { Component } from "react"; // ใช้สร้าง class component
import BackButton from "../../BackButton"; // ปุ่มย้อนกลับหน้าเดิม
import Plot from "react-plotly.js"; // ใช้ plot กราฟแบบ interactive
import ResultTable from "../../ResultTable"; // ไฟล์ CSS สำหรับตกแต่งหน้า
import GraphicalMT from "./GraphicalMT"; // ไฟล์ที่มี logic คำนวณจริง
import FormatLatex from "../../FormatLatex";
import { evaluate } from "mathjs"; // ใช้คำนวณสมการ
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
      ePer: [], // เก็บค่าความคลาดเคลื่อนของแต่ละราก
    };
  }

  // -----------------------------
  // 🔹 แปลงสมการให้เป็นรูป LaTeX เพื่อแสดงผลทางคณิตศาสตร์
  // -----------------------------
  formatToLaTeX = (equation) => {
    // เช่น x^(2) → x^{2}
    return equation.replace(/\^\((.*?)\)/g, "^{$1}");
  };

  // -----------------------------
  // 🔹 ส่วนการแสดงผลหน้าจอ (render)
  // -----------------------------
  render() {
    const { fn, a, b, error, roots, fxRoots, ePer,errorMsg } = this.state;

    // สร้างข้อมูลเรียงตามค่า x สำหรับแสดงจุดรากบนกราฟ
    const sortedData = roots
      .map((val, i) => ({ 
        x: val, 
        y: fxRoots[i],
        originalIndex: i // ✨ เก็บ index เดิมก่อน sort
      }))
      .sort((a, b) => a.x - b.x); // เรียงจากน้อย → มาก

    // แยกเป็นอาเรย์ของ x และ y สำหรับจุดรากเท่านั้น
    const sortedX = sortedData.map((d) => d.x);
    const sortedY = sortedData.map((d) => d.y);
    const lastRootIndex = roots.length - 1; // ✨ index ของรากตัวสุดท้าย (ก่อน sort)

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
            <FormatLatex fn={fn} text="f(x)" />

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
                onResult={({ roots, fxRoots, ePer,errorMsg }) =>
                  // รับค่าผลลัพธ์จาก GraphicalMT และอัปเดต state
                  this.setState({ roots, fxRoots, ePer,errorMsg })
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
                // เส้น f(x) แบบต่อเนื่อง
                {
                  x: (() => {
                    const p = root[root.length-1];
                    const xVals = [];
                    const start = parseFloat(a)-p;
                    const end = parseFloat(b)+p;
                    const step = (end - start) / 500; // สร้าง 500 จุดเพื่อเส้นต่อเนื่อง
                    for (let i = start; i <= end; i += step) {
                      xVals.push(i);
                    }
                    return xVals;
                  })(),
                  y: (() => {
                    const p = root[root.length-1];
                    const xVals = [];
                    const start = parseFloat(a)-p;
                    const end = parseFloat(b)+p;
                    const step = (end - start) / 500;
                    for (let i = start; i <= end; i += step) {
                      xVals.push(i);
                    }
                    return xVals.map(x => {
                      try {
                        return evaluate(fn, { x });
                      } catch {
                        return null;
                      }
                    });
                  })(),
                  type: "scatter",
                  mode: "lines",
                  line: { color: "blue", width: 2 },
                  name: "f(x)",
                  hoverinfo: "skip", // ปิด hover tooltip
                },
                // จุดรากที่หาเจอ
                {
                  x: sortedX,
                  y: sortedY,
                  type: "scatter",
                  mode: "markers",
                  marker: { 
                    color: sortedData.map((d) => d.originalIndex === lastRootIndex ? 'green' : 'red'), // เช็คจาก originalIndex
                    size: sortedData.map((d) => d.originalIndex === lastRootIndex ? 20 : 10), // จุดสุดท้ายใหญ่กว่า
                    symbol: "circle"
                  },
                  name: "รากของสมการ (f(x)=0)",
                  hovertemplate: "x: %{x:.6f}<br>f(x): %{y:.6f}<extra></extra>",
                },
                // เส้นแกน y=0
                {
                  x: [parseFloat(a), parseFloat(b)],
                  y: [0, 0],
                  type: "scatter",
                  mode: "lines",
                  line: { color: "black", width: 1, dash: "dash" },
                  name: "y = 0",
                  hoverinfo: "skip",
                },
              ]}
              layout={{
                width: 1000,
                height: 440,
                title: "กราฟแสดง f(x) และจุดตัดแกน x",
                xaxis: { title: "แกน X", zeroline: true },
                yaxis: { 
                  title: "แกน Y",
                  zeroline: true,
                },
                showlegend: true,
                legend: { x: 1, y: 1 },
                dragmode: "pan", // เปิดใช้การลากกราฟเพื่อเลื่อนดู
              }}
              config={{
                scrollZoom: true, // เปิดใช้ scroll mouse ซูม
                displayModeBar: true, // แสดงแถบเครื่องมือ
                displaylogo: false, // ซ่อนโลโก้ Plotly
              }}
            />

            {/* -----------------------------
                🔹 ตารางแสดงผลลัพธ์การคำนวณ
               ----------------------------- */}
            <ResultTable roots={roots} fxRoots={fxRoots} ePer={ePer}/>
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