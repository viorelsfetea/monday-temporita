import React from "react";
import {momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
import ItemsDao from "./data/ItemsDao";

import Preloader from "./partials/Preloader";
import BoardList from "./partials/BoardList";
import TemporitaCalendar from "./partials/TemporitaCalendar";

import "./App.css";
import "./assets/fontawesome/css/all.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "monday-ui-react-core/dist/main.css"
import Utils from "./libs/Utils";
import Menu from "./partials/Menu";

const localizer = momentLocalizer(moment) // or globalizeLocalizer

class Planner extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      loading: true
    };

    this.monday = this.props.monday;

    this.utils = this.props.utils;
    this.itemsDao = new ItemsDao(this.monday);
    this.itemHandler = this.props.itemHandler;
  }

  componentDidMount() {
    this.itemsDao.getItems()
      .then(items => {
        this.setState({ items, loading: false });
      })
      .catch(error => {
        this.utils.showError(error.message)
      });
  }

  render() {
    const boards = this.state.items ? this.state.items.boards : null;
    const boardsKey = this.state.items ? Utils.hashObject(this.state.items.boards) : 0; // consider just reading the length instead of hashing

    if(this.state.loading) {
      return <Preloader />
    }

    return <div className="App container-fluid">
      <Menu history={this.props.history} location={this.props.location} />

      <div className="row">
          <div className="col-3 sidebar">
            <BoardList 
              monday={this.monday}
              itemHandler={this.itemHandler}
              boards={boards} 
              draggable={true}
              key={boardsKey}
              onItemClick={this.itemHandler.openItem}
              onUpdatesClick={this.props.itemHandler.openUpdates.bind(this.props.itemHandler)}
            />
          </div>

          <div className="col-9 pt-4">
            <TemporitaCalendar 
              currentUser={this.props.user}
              monday={this.monday}
              utils={this.utils}
              boards={boards}
              localizer={localizer}
              itemHandler={this.itemHandler}
              settings={this.props.settings}
            />
          </div>
        </div>
      </div>;
  }
}

export default Planner;
