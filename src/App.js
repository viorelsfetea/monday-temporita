import React from "react";
import mondaySdk from "monday-sdk-js";

import ItemsDao from "./data/ItemsDao";
import Utils from "./libs/Utils";
import BoardList from "./partials/BoardList";

import "./App.css";
import "./assets/fontawesome/css/all.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "monday-ui-react-core/dist/main.css"

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
        .then(items => {
          this.setState({items});
        })
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
    return <div className="App container-fluid" style={{background: (this.state.settings.background)}}>
        <div className="row">
          <div className="col-3">
            <BoardList boards={this.state.items ? this.state.items.boards : null} key={this.state.items ? this.state.items.boards : 0}/>
          </div>
          <div className="col-9">
            The rest of the app
          </div>
        </div>
      </div>;
  }
}

export default App;
