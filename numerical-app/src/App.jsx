
import{ BrowserRouter as Router, Routes, Route, BrowserRouter} from "react-router-dom";
import AllLink from "./componant/All-link";

export default function App() {
  return(
    <div>
      <BrowserRouter>
        <AllLink/>
      </BrowserRouter>
    </div>
  )
}