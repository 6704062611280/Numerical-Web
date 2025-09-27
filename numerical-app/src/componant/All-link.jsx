import { Routes, Route } from "react-router-dom"
import GraphicalPage from "./Method/RootOfEquation/GraphicalPage"
import BisectionPage from "./Method/RootOfEquation/BisectionPage"
import NewtonRaphsonPage from "./Method/RootOfEquation/NewtonRaphsonPage"
import FalsePositionPage from "./Method/RootOfEquation/FalsePositionPage"
import OnePointPage from "./Method/RootOfEquation/OnePointPage"
import SecantPage from "./Method/RootOfEquation/SecantPage"

import ConjugateGradientPage from "./Method/LinearAlgerbraEquation/ConjugateGradientPage"
import CramerRulePage from "./Method/LinearAlgerbraEquation/CramerRulePage"
import GaussEliminationPage from "./Method/LinearAlgerbraEquation/GaussEliminationPage"
import GaussJordanEliminationPage from "./Method/LinearAlgerbraEquation/GaussEliminationPage"
import MatrixInversionPage from "./Method/LinearAlgerbraEquation/MatrixInversionPage"
import JacobiIterationPage from "./Method/LinearAlgerbraEquation/JacobiIterationPage"
import LuDecompositionPage from "./Method/LinearAlgerbraEquation/LuDecompositionPage"

import NewtonDevidedDiffPage from "./Method/Interpolation/NewtonDevidedDiffPage"
import LagrangeInterpolationPage from "./Method/Interpolation/LagrangeInterpolationPage"
import SplineInterpolationPage from "./Method/Interpolation/SplineInterpolationPage"

import SimpleRegressionPage from "./Method/Extrapolation/SimpleRegressionPage"
import MultipleRegressionPage from "./Method/Extrapolation/MultipleRegressionPage"

import TrapezoidalRulePage from "./Method/Integration/TrapezoidalRulePage"
import CompositeTrapezoidalRulePage from "./Method/Integration/CompositeTrapezoidalRulePage"
import SimpsonRulePage from "./Method/Integration/SimponRulePage"
import CompositeSimpsonRulePage from "./Method/Integration/CompositeSimpsonRulePage"

import NumericalDifferentiationPage from "./Method/Differentiation/NumericalDifferentiationPage"
import Manu from "./Manu"

export default function AllLink() {
    return(
        <div>
            <Routes>
                <Route path="/" element={<Manu />}/>

                {/* Root of Equation */}
                <Route path="/Graphical method" element={<GraphicalPage />}/>
                <Route path="/Bisection search" element={<BisectionPage />}/>
                <Route path="/Newton-Raphson methods" element={<NewtonRaphsonPage />}/>
                <Route path="/False-position methods" element={<FalsePositionPage/>}/>
                <Route path="/One-point iteration methods" element={<OnePointPage />}/>
                <Route path="/Secant methods" element={<SecantPage />}/>
                
                {/* Linear Algerbra Equation */}
                <Route path="/Conjugate Gradient Methods" element={<ConjugateGradientPage />}/>
                <Route path="/Cramer's rule" element={<CramerRulePage />}/>
                <Route path="/Gauss elimination" element={<GaussEliminationPage />}/>
                <Route path="/Gauss Jordan elimination" element={<GaussJordanEliminationPage />}/>
                <Route path="/Jacobi iteration methods" element={<JacobiIterationPage />}/>
                <Route path="/LU decomposition Methods" element={<LuDecompositionPage />}/>
                <Route path="/Matrix Inversion" element={<MatrixInversionPage />}/>
                
                {/* Interpolation */}
                <Route path="/Lagrange interpolation" element={<LagrangeInterpolationPage />}/>
                <Route path="/Newton devided-differences" element={<NewtonDevidedDiffPage />}/>
                <Route path="/Spline interpolation" element={<SplineInterpolationPage />}/>

                {/* Integration */}
                <Route path="/Composite Simpson Rule" element={<CompositeSimpsonRulePage />}/>
                <Route path="/Composite Trapezoidal Rule" element={<CompositeTrapezoidalRulePage />}/>
                <Route path="/Simpson Rule" element={<SimpsonRulePage />}/>
                <Route path="/Trapezoidal Rule" element={<TrapezoidalRulePage />}/>
                
                {/* Extrapolation */}
                <Route path="/Simple Regression" element={<SimpleRegressionPage />}/>
                <Route path="/Multiple Regression" element={<MultipleRegressionPage />}/>

                {/* Differentiation */}
                <Route path="/Numerical Differentiation" element={<NumericalDifferentiationPage />}/>



            </Routes>
        </div>
    )
}