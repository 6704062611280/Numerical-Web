import { useState } from "react";
import "./Manu.css";
import { useNavigate } from "react-router-dom";



export default function Manu() {
    
    
    const [problem, setProblem] = useState("");
    const [solution, setSolution] = useState("");

    const menu = {
    "Root of Equation": [
      "Graphical method",
      "Bisection search",
      "False-position methods",
      "One-point iteration methods",
      "Newton-Raphson methods",
      "Secant methods",
    ],
    "Linear Algebra Equation": [
      "Cramer's rule",
      "Gauss elimination",
      "Gauss Jordan elimination",
      "Matrix Inversion",
      "LU decomposition Methods",
      "Jacobi iteration methods",
      "Conjugate Gradient Methods",
    ],
    Interpolation: [
      "Newton devided-differences",
      "Lagrange interpolation",
      "Spline interpolation",
    ],
    Extrapolation: ["Simple Regression", "Multiple Regression"],
    Integration: [
      "Trapezoidal Rule",
      "Composite Trapezoidal Rule",
      "Simpson Rule",
      "Composite Simpson Rule",
    ],
    Differentiation: ["Numerical Differentiation"],
    };

    const navigate = useNavigate();
    


   
    return(
        
        <div className="Manu">
              
            <h1>Numerical Method</h1>
            <div className="select-Manu">
                <div className="select-problem">
                    <label id="">Type of Problem: </label>
                    <select value={problem} onChange={(e) => setProblem(e.target.value)}>
                        <option value="">-- เลือกปัญหา --</option>
                        {Object.keys(menu).map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                                
                            </option>
                        ))}
                    </select>
                </div>
                
                {problem && (
                    <div className="select-solution">
                        <label>Solution: </label>
                        <select value={solution} onChange={(e) => setSolution(e.target.value)}>
                            <option value="">-- เลือกวิธี --</option>
                            {menu[problem].map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {solution && ( 
                    navigate(`/${solution}`)
                )}
            </div>
        </div>
    );
}