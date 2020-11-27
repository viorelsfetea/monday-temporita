import React from "react";
import Select from "react-select";
import {Link} from "react-router-dom";
import Item from "./partials/Item";
import Preloader from "./partials/Preloader";
import moment from 'moment'
import EventsDao from "./data/EventsDao";
import Menu from "./partials/Menu";

class Others extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      users: [],
      selectorUsers: [],
      events: [],
      loading: true,
      loadingUser: false,
      currentItem: null
    }
    
    this.eventsDao = new EventsDao(props.monday, props.utils);
  }

  componentDidMount() {
    this.getItems();
    this.updateTime();
  }

  selectUser(user) {
    this.setState({
      user: this.state.users.find(item => item.id === user.value),
      loadingUser: true
    }, () => {
      this.getEventsForUser();
    })
  }

  getItems() {
    if(!this.props.user) return;

    this.props.usersDao.getOtherUsers()
      .then(results => {
        const users = results.users
          .sort((userA, userB) => userA.name.localeCompare(userB.name));

        this.setState({
          users,
          selectorUsers: users.map(user => {
              return {
                value: user.id,
                label: <span><img src={user.photo_thumb} alt={user.name} className="SelectUserPhoto"/>{user.name}</span>
              }
            }),
          loading: false
        });
      })
      .catch(error => this.props.utils.showError(error.message));
  }

  getEventsForUser() {
    this.eventsDao.getTodayEvents(this.state.user, true)
      .then(results => {
        this.setState({
          events: results,
          loadingUser: false
        }, () => {
          this.findCurrentItems();
        });
      })
      .catch(error => this.props.utils.showError(error.message));
  }

  getItem(item) {
    return <div>
      <Item draggable={false} item={item} color={item.color} onItemClick={this.props.itemHandler.openItem.bind(this.props.itemHandler)} />
      <div className="TodayItemTime">{moment(item.start).format(this.getTimeFormat())} - {moment(item.end).format(this.getTimeFormat())}</div>
    </div>;
  }

  getTimeFormat() {
    return this.props.settings.timeFormat === "24h" ? "HH:mm" : "h:mm A";
  }

  updateTime() {
    this.setState({currentTime: moment().format(this.getTimeFormat())});
  }

  findCurrentItem(currentDate) {
    const item = this.state.events.find(event => {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);

      return startDate.getTime() <= currentDate.getTime() && currentDate.getTime() <= endDate.getTime();
    });

    if(!item) return null;

    return this.parseItem(item);
  }

  findNextItem(currentItem, currentDate) {
    const futureEvents = this.state.events
      .filter(event => {
        const startDate = new Date(event.start);

        if(currentItem) {
          return startDate.getTime() > currentDate.getTime() && event.monday_id !== currentItem.id;
        }

        return startDate.getTime() > currentDate.getTime();
      })
      .sort((a, b) => {
        const startDateA = new Date(a.start);
        const startDateB = new Date(b.start);

        if (startDateA < startDateB) return -1;

        if (startDateA > startDateB) return 1;

        return 0;
      });

    return futureEvents.length > 0 ? this.parseItem(futureEvents[0]) : null;
  }

  parseItem(item) {
    return {
      id: parseInt(item.monday_id, 10),
      name: item.title,
      color: item.color,
      start: new Date(item.start),
      end: new Date(item.end)
    }
  }

  findCurrentItems() {
    if(!this.state.events) return;

    const currentDate = new Date();
    const currentItem = this.findCurrentItem(currentDate);
    const nextItem = this.findNextItem(currentItem, currentDate);

    this.setState({
      currentItem, nextItem,
      nextCalculationTime: currentItem ? new Date(currentItem.end) : undefined
    });
  }

  getPlan() {
    const {currentItem, nextItem} = this.state;

    if(!this.state.user) return "";

    if(this.state.loadingUser) return <div style={{height: '100px', margin: '0 auto', position: 'relative'}}><Preloader /></div>

    return <div>
      <h3>
        It's <span className="TodayCurrentTime">{this.state.currentTime}</span>. Right now, {this.state.user.name} has planned to do:
      </h3>

      { currentItem ? this.getItem(currentItem) : "" }
      { !currentItem ? <div className="TodayNoItemSet">There's nothing planned right now.</div> : "" }

      <h3>
        Coming up:
      </h3>
      { nextItem ? this.getItem(nextItem) : "" }
      { !nextItem ? <div className="TodayNoItemSet">Nothing planned ahead</div> : "" }
    </div>
  }

  render() {
    if(this.state.loading) {
      return <Preloader />
    }

    return <div className="TemporitaToday TemporitaOthers">
      <Menu history={this.props.history} location={this.props.location} />
      <h2>
        What other people are doing
      </h2>
      <div className="SelectorUsers">
        <Select
          placeholder="Click here to select someone"
          className="basic-single"
          classNamePrefix="select"
          isSearchable={true}
          name="users"
          options={this.state.selectorUsers}
          onChange={this.selectUser.bind(this)}
        />
      </div>
      {this.getPlan()}
    </div>
  }
}

export default Others;
