import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import ItemsDao from "./data/ItemsDao";
import Utils from "./libs/Utils";

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

    this.itemsDao = new ItemsDao(monday);
  }

  componentDidMount() {
    monday.listen("settings", res => {
      this.setState({ settings: res.data });

      this.itemsDao.getItems()
        .then(items => console.log(items))
        .catch(error => {
          Utils.logError(error);

          monday.execute("notice", { 
            message: "Couldn't retrieve your boards. Please refresh this page.",
            type: "error",
            timeout: 10000,
          });
        })
    });
    
    monday.listen("context", res => {
      this.setState({context: res.data});
    });
  }

  render() {
    return <div className="App" style={{background: (this.state.settings.background), color: '#FFF'}}>
        Hello, monday Apps!
      </div>;
  }
}

export default App;
