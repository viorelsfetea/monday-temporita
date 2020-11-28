import React from "react";
import {Link} from "react-router-dom";
import moment from 'moment'
import Wand from 'monday-ui-react-core/dist/icons/Wand';
import Calendar from 'monday-ui-react-core/dist/icons/Calendar'
import AttentionBox from "monday-ui-react-core/dist/AttentionBox";

import Cache from "./data/Cache";
import Item from "./partials/Item";
import Preloader from "./partials/Preloader";
import EventsDao from "./data/EventsDao";
import ImplementationIntentionsDao from "./data/ImplementationIntentionsDao";
import Quote from "./partials/Quote";
import Menu from "./partials/Menu";
import WelcomeScreen from "./partials/WelcomeScreen";

class Today extends React.Component {
  constructor(props) {
    super(props);

    const quote = new Quote();

    const todayDate = new Date();

    this.welcomeScreenKey = `welcome-screen-${todayDate.getDate()}-${todayDate.getMonth()}-${todayDate.getFullYear()}`;
    const welcomeScreenValue = Cache.read(this.welcomeScreenKey);

    this.state = {
      events: [],
      intentions: [],
      loading: true,
      currentItem: null,
      quote: quote.getRandom(),
      welcomeScreenShown: welcomeScreenValue ? welcomeScreenValue : false
    }
    
    this.eventsDao = new EventsDao(props.monday, props.utils);
    this.intentionsDao = new ImplementationIntentionsDao(props.monday);
  }
  
  getItems() {
    if(!this.props.user) return;

    Promise.all([this.eventsDao.getTodayEvents(this.props.user), this.intentionsDao.getImplementationsForDay(this.props.user, new Date())])
      .then(results => {
        this.setState({
          events: results[0],
          intentions: results[1] ? results[1] : [],
          loading: false
        }, () => {
          this.findCurrentItems();
        });
      })
      .catch(error => this.props.utils.showError(error.message));
  }

  getItem(item) {
    return <div>
      <Item
        draggable={false}
        item={item}
        color={item.color}
        onItemClick={this.props.itemHandler.openItem.bind(this.props.itemHandler)}
        onUpdatesClick={this.props.itemHandler.openUpdates.bind(this.props.itemHandler)}
      />
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

    if(currentItem !== null) {
      this.findIntentionsForItem(currentItem);
    }

    this.setState({
      currentItem, nextItem,
      nextCalculationTime: currentItem ? new Date(currentItem.end) : undefined
    });
  }

  findIntentionsForItem(event) {
    event["monday_id"] = event.id;
    this.intentionsDao.getImplementationsForItem(this.props.user, event)
      .then(intentions => {
        if(!intentions) return;
        this.setState({intentions: this.state.intentions.concat(intentions)});
      })
      .catch(error => this.props.utils.showError(error.message));
  }
  
  componentDidMount() {
    this.getItems();
    this.updateTime();
  }

  getIntentions() {
    let intentions = this.state.intentions;
    let ids = [];

    if(!intentions || intentions.length === 0) return;

    intentions = intentions.filter(intention => {
      if(ids.includes(intention.id)) {
        return false
      } else {
        ids.push(intention.id);
        return true;
      }
    });

    return <div className="TodayIntentions">
      <h3>Having trouble?</h3>
      <h4>Don't sweat it. You've planned for this!</h4>
      {intentions.map(intention =>
        <div key={intention.id}>If <strong><em>{intention.situation}</em></strong> then <strong><em>{intention.action}</em></strong></div>
      )}
    </div>

  }

  closeWelcomeScreen() {
    this.setState({welcomeScreenShown: true});
    Cache.write(this.welcomeScreenKey, true);
  }

  getContent() {
    if(this.state.events.length === 0) {
      return <button className="GoToPlanner" onClick={() => this.props.history.push("/planner")}>
        <AttentionBox
          title="Oops… looks like you're starting off with a clean slate"
          text="Let's fill it up"
          icon={() => <Calendar />}
          type={AttentionBox.types.PRIMARY}
        />
      </button>
    }

    const {currentItem, nextItem} = this.state;

    return <div>
      <h3>
        Hey there, it's <span className="TodayCurrentTime">{this.state.currentTime}</span>. Right now, you should be focusing on:
      </h3>

      { currentItem ? this.getItem(currentItem) : "" }
      { !currentItem ? <div className="TodayNoItemSet">There's nothing planned right now. Relax or <Link to="/planner">plan something.</Link></div> : "" }

      {this.getIntentions()}

      <h3>
        Next up on your agenda:
      </h3>
      { nextItem ? this.getItem(nextItem) : "" }
      { !nextItem ? <div className="TodayNoItemSet">That was it. You've finished everything. Go you!</div> : "" }
    </div>
  }

  render() {
    if(!this.state.welcomeScreenShown) {
      return <WelcomeScreen onClick={() => this.closeWelcomeScreen()} />
    }

    if(this.state.loading) {
      return <Preloader />
    }

    return <div className="TemporitaToday">
      <Menu history={this.props.history} location={this.props.location} />
      <h2>
        Your day
      </h2>
      <h4>
        <Wand /> {this.state.quote.text} <em>({this.state.quote.author})</em>
      </h4>

      {this.getContent()}
    </div>
  }
}

export default Today;
