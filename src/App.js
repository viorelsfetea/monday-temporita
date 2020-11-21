import React from "react";
import mondaySdk from "monday-sdk-js";
import { momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

import ItemsDao from "./data/ItemsDao";
import ItemHandler from "./libs/ItemHandler";

import Utils from "./libs/Utils";
import Preloader from "./partials/Preloader";
import BoardList from "./partials/BoardList";
import TemporitaCalendar from "./partials/TemporitaCalendar";

import "./App.css";
import "./assets/fontawesome/css/all.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "monday-ui-react-core/dist/main.css"
import UsersDao from "./data/UserDao";

const monday = mondaySdk();

const localizer = momentLocalizer(moment) // or globalizeLocalizer

class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      settings: {
        timeFormat: "24h",
        weekends: false,
        dayStart: "9",
        dayEnd: "17",
        hoursInDay: "8"
      },
      name: "",
      loading: true
    };

    this.utils = new Utils(monday);
    this.itemsDao = new ItemsDao(monday);
    this.usersDao = new UsersDao(monday);
    this.itemHandler = new ItemHandler();
  }

  loadApplication() {
      Promise.all([this.itemsDao.getItems(), this.usersDao.getCurrentUser()])
        .then(results => {
          this.setState({
            items: results[0],
            currentUser: results[1].me,
            loading: false
          });
        })
        .catch(error => {
          this.utils.showError(error.message)
        });
  }

  componentDidMount() {
    monday.listen("settings", res => {
      this.setState({ settings: res.data, settingsHash: Utils.hashObject(res.data) });

      this.loadApplication();
    });
    
    monday.listen("context", res => {
      this.setState({context: res.data});
    });
  }

  render() {
    const boards = this.state.items ? this.state.items.boards : null;
    const boardsKey = this.state.items ? Utils.hashObject(this.state.items.boards) : 0; // consider just reading the length instead of hashing

    if(this.state.loading) {
      return <Preloader />
    }

    return <div className="App container-fluid" style={{background: (this.state.settings.background)}}>
        <div className="row">
          <div className="col-3">
            <BoardList 
              monday={monday}
              itemHandler={this.itemHandler}
              boards={boards} 
              draggable={true}
              key={boardsKey}
              onItemClick={this.itemHandler.openItem}
            />
          </div>

          <div className="col-9 pt-4">
            <TemporitaCalendar 
              currentUser={this.state.currentUser}
              monday={monday}
              utils={this.utils}
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
