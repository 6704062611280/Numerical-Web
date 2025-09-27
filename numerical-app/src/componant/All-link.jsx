import { Routes, Route } from "react-router-dom"
import BisectionPage from "./Method/RootOfEquation/BisectionPage"
import FalsePositionPage from "./Method/RootOfEquation/FalsePositionPage"
import Manu from "./Manu"

export default function AllLink() {
    return(
        <div>
            <Routes>
                <Route path="/" element={<Manu />}/>
                <Route path="/Bisection search" element={<BisectionPage />}/>
                <Route path="/False-position methods" element={<FalsePositionPage/>}/>
            </Routes>
        </div>
    )
}