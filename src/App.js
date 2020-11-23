import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Planner from "./Planner";
import Today from "./Today";
import ItemHandler from "./libs/ItemHandler";
import mondaySdk from "monday-sdk-js";
import Utils from "./libs/Utils";
import Preloader from "./partials/Preloader";
import UsersDao from "./data/UserDao";

class App extends React.Component {
  constructor() {
    super();

    this.monday = mondaySdk();
    this.utils = new Utils(this.monday);
    this.itemHandler = new ItemHandler(this.monday);
    this.usersDao = new UsersDao(this.monday);

    this.state = {
      loading: true,
      settings: {
        time_format: "24h",
        weekends: false,
        dayStart: "9",
        dayEnd: "17",
        hoursInDay: "8"
      }
    };
  }

  componentDidMount() {
    this.monday.listen("settings", res => {
      this.setState({ settings: res.data, settingsHash: Utils.hashObject(res.data), loading: false});
    });

    this.monday.listen("context", res => {
      this.setState({context: res.data});
    });

    this.usersDao.getCurrentUser()
      .then(user => {
        this.setState({user: user.me, loading: false})
      })
      .catch(error => {
        this.utils.showError(error.message)
      });
  }

  render() {
    if(this.state.loading) {
      return <Preloader />
    }

    return <BrowserRouter>
      <Route exact={true} path="/" component={() => <Today user={this.state.user} itemHandler={this.itemHandler} monday={this.monday} settings={this.state.settings} utils={this.utils} />} />
      <Route exact={true} path="/today" component={() => <Today user={this.state.user} itemHandler={this.itemHandler} monday={this.monday} settings={this.state.settings} utils={this.utils}/>} />
      <Route exact={true} path="/planner" component={() => <Planner user={this.state.user} itemHandler={this.itemHandler} monday={this.monday} settings={this.state.settings} utils={this.utils} />} />
    </BrowserRouter>
  }
}

export default App;
