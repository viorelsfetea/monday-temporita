import React from "react";
import mondaySdk from "monday-sdk-js";
import { momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

import ItemsDao from "./data/ItemsDao";
import ItemHandler from "./libs/ItemHandler";

import Utils from "./libs/Utils";
import BoardList from "./partials/BoardList";
import TemporitaCalendar from "./partials/TemporitaCalendar";

import "./App.css";
import "./assets/fontawesome/css/all.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "monday-ui-react-core/dist/main.css"

const monday = mondaySdk();

const localizer = momentLocalizer(moment) // or globalizeLocalizer

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
    this.itemHandler = new ItemHandler();

  }

  componentDidMount() {
    monday.storage.instance.getItem('mykey').then(res => {
      console.log(res.data.value);
    });

    monday.listen("settings", res => {
      this.setState({ settings: res.data, settingsHash: Utils.hashObject(res.data) });

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

  openItem(item) {
    monday.execute('openItemCard', { itemId: item.id, kind: "updates" });
  }

  render() {
    const boards = this.state.items ? this.state.items.boards : null;
    const boardsKey = this.state.items ? Utils.hashObject(this.state.items.boards) : 0; // consider just reading the length instead of hashing

    return <div className="App container-fluid" style={{background: (this.state.settings.background)}}>
        <div className="row">
          <div className="col-3">
            <BoardList 
              monday={monday}
              itemHandler={this.itemHandler}
              boards={boards} 
              draggable={true}
              key={boardsKey}
              onItemClick={this.openItem}
            />
          </div>

          <div className="col-9 pt-4">
            <TemporitaCalendar 
              monday={monday}
              boards={boards}
              localizer={localizer}
              itemHandler={this.itemHandler}
              settings={this.state.settings}
            />
          </div>
        </div>
      </div>;
  }
}

export default App;
