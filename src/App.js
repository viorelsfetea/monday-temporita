import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      settings: {
        background: '#000'
      },
      name: "",
    };
  }

  componentDidMount() {
    monday.listen("settings", res => {
      this.setState({ settings: res.data });
    });
  }

  render() {
    return <div className="App" style={{background: (this.state.settings.background), color: '#FFF'}}>
        Hello, monday Apps!
      </div>;
  }
}

export default App;
