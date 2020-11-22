import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Planner from "./Planner";
import Today from "./Today";

class App extends React.Component {
  render() {
    return <BrowserRouter>
      <Route exact={true} path="/" component={Planner} />
      <Route exact={true} path="/today" component={Today} />
    </BrowserRouter>
  }
}

export default App;