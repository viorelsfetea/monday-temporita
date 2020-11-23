import React from "react";
import {Link} from "react-router-dom";
import Item from "./partials/Item";
import Preloader from "./partials/Preloader";
import moment from 'moment'
import EventsDao from "./data/EventsDao";

class Today extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      currentItem: null
    }
    
    this.eventsDao = new EventsDao(props.monday, props.utils);
  }
  
  getItems() {
    if(!this.props.user) return;

    this.eventsDao.getTodayEvents(this.props.user)
      .then(events => {
        this.setState({events, loading: false})
        this.findCurrentItems();
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
    const currentDate = new Date();
    const currentItem = this.findCurrentItem(currentDate);
    const nextItem = this.findNextItem(currentItem, currentDate);

    this.setState({
      currentItem, nextItem,
      nextCalculationTime: currentItem ? new Date(currentItem.end) : undefined
    });
  }
  
  componentDidMount() {
    this.getItems();
    this.updateTime();
  }

  render() {
    const {currentItem, nextItem} = this.state;

    if(this.state.loading) {
      return <Preloader />
    }

    return <div className="TemporitaToday">
      <Link to="/planner">Planner</Link>
      <h2>
        Your day
      </h2>
      <h4>
        Breathe in, Breathe out. Repeat.
      </h4>
      <h3>
        It's <span className="TodayCurrentTime">{this.state.currentTime}</span>. Right now, you've planned to do:
      </h3>

      { currentItem ? this.getItem(currentItem) : "" }
      { !currentItem ? <div className="TodayNoItemSet">There's nothing planned right now. Relax or <Link to="/planner">plan something.</Link></div> : "" }

      <h3>
        Next up is:
      </h3>
      { nextItem ? this.getItem(nextItem) : "" }
      { !nextItem ? <div className="TodayNoItemSet">That was it. You've finished everything. Go you!</div> : "" }

    </div>
  }
}

export default Today;
