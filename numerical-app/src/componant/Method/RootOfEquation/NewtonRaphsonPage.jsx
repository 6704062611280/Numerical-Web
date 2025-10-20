import BackButton from "../../BackButton";
import { Component } from "react";
import NewtonRaphsonMT from "./NewtonRaphsonMT";
export default class NewtonRaphsonPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fn: "x^3-4x+1",
      xInitial: 0,
      error: 0.000001,
      errorMsg: "",
      errorPer: [],
      xRoot: [],
    };
  }
  render() {
    const { fn, xInitial, error, errorMsg, errorPer, xRoot } = this.state;
    return (
      <div>
        <BackButton />
        <div>
          <h1>NewtonRaphson</h1>
          <div>
            {/* input */}
            <div>
              <label>x Initial</label>
              <input
                type="text"
                value={xInitial}
                onChange={(e) => this.setState({ xInitial: e.target.value })}
              />
            </div>
            <div>
              <label>f(x)</label>
              <input
                type="text"
                value={fn}
                onChange={(e) => this.setState({ fn: e.target.value })}
              />
            </div>
            <div>
              <label>error</label>
              <input
                type="text"
                value={error}
                onChange={(e) => this.setState({ error: e.target.value })}
              />
            </div>

            <NewtonRaphsonMT
              fn={fn}
              xInitial={xInitial}
              error={error}
              onResult={({ xRoot, errorPer, errorMsg }) =>
                this.setState({ xRoot, errorPer, errorMsg })
              }
            >
              {({ Calculate }) => (
                <div>
                  <button onClick={Calculate}>Calculate</button>
                  {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
                </div>
              )}
            </NewtonRaphsonMT>
            <table>
              <thead>
                <tr>
                  <th>Iter</th>
                  <th>x</th>
                  <th>error</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(xRoot) && xRoot.length > 0 ? (
                  xRoot.map((item, index) => (
                    <tr key={index}>
                      <td>{index}</td>
                      <td>{Number(item).toFixed(6)}</td>
                      <td>{Number(errorPer[index]).toFixed(6)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      
                    >
                      ยังไม่มีข้อมูล
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}