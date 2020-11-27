import React from "react";
import Menu from "./Menu";
import {Link} from "react-router-dom";
import EventsDao from "../data/EventsDao";
import LinearProgressBar from "monday-ui-react-core/dist/LinearProgressBar";
import Button from "monday-ui-react-core/dist/Button";
import NavigationChevronLeft from "monday-ui-react-core/dist/icons/NavigationChevronLeft";
import NavigationChevronRight from "monday-ui-react-core/dist/icons/NavigationChevronRight";
import moment from "moment";
import Preloader from "./Preloader";
import Item from "./Item";
import BoardIcon from "monday-ui-react-core/dist/icons/Board";

class Reports extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      week: this.getCurrentWeek(props),
      previousWeek: this.getPreviousWeek(new Date(), props),
      nextWeek: this.getNextWeek(new Date(), props),
      events: {},
      loading: true
    }

    this.eventsDao = new EventsDao(this.props.monday, this.props.utils);
  }

  componentDidMount() {
    this.getEvents(this.state.week.start, this.state.week.end);
  }

  getCurrentWeek(props) {
    return this.getWeekByDay(new Date(), props);
  }

  getPreviousWeek(currentDate, props) {
    const date = new Date();
    date.setDate(currentDate.getDate() - 7);

    return this.getWeekByDay(date, props);
  }

  getNextWeek(currentDate, props) {
    const date = new Date();
    date.setDate(currentDate.getDate() + 7);

    return this.getWeekByDay(date, props);
  }

  getWeekByDay(day, props) {
    const start = new Date(day.toString()); //JS passes objects by reference, we need to clone it
    const end = new Date(day.toString());

    const incrementDateBy = props.settings.weekends ? 7 : 5;

    start.setDate(start.getDate() - start.getDay() + 1);
    end.setDate(start.getDate() + incrementDateBy - 1);

    return {
      start, end
    }
  }

  getProgressBar() {
    return <div className="ReportsProgressBar">
      <LinearProgressBar
        value={this.state.totalMinutes}
        animated={true}
        max={this.props.settings.hoursInWeek * 60}
        min={0}
        size={LinearProgressBar.sizes.LARGE}
        indicateProgress={false}
        barStyle={LinearProgressBar.styles.PRIMARY}
        className="TemporitaProgressBar"
      />
      <div>
        {this.getFormattedTime(this.state.totalMinutes)} / {this.props.settings.hoursInWeek}h
      </div>
    </div>
  }

  getEvents(start, end) {
    this.setState({loading: true});

    let calls = [];
    
    let currentDate = new Date(start.toString());
    
    while(currentDate.getTime() <= end.getTime()) {
      const requestedDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1);
      requestedDate.setDate(currentDate.getDate());
      
      calls.push(this.eventsDao.getDayEvents(this.props.user, currentDate));
    }
    
    Promise.all(calls)
      .then(results => {
        let events = [];
        results.forEach(result => {
          if(result) events = events.concat(result);
        });

        this.setEvents(events);
      })
      .catch(() => this.props.utils.showError("Could not retrieve the events for this week"));
  }

  setEvents(events) {
    let groupedEvents = {};
    let totalMinutes = 0;

    events.forEach(event => {
      const timeSpent = this.getMinutesBetweenDates(new Date(event.start), new Date(event.end));

      if(!groupedEvents.hasOwnProperty(event.board)) {
        groupedEvents[event.board] = {}
      }
      
      if(!groupedEvents[event.board].hasOwnProperty(event.monday_id)) {
        groupedEvents[event.board][event.monday_id] = {
          event: {
            id: event.monday_id,
            name: event.title,
            color: event.color,
            board: event.board
          },
          total: timeSpent
        };
      } else {
        groupedEvents[event.board][event.monday_id]["total"] += timeSpent;
      }

      totalMinutes += timeSpent;
    })

    this.setState({events: groupedEvents, totalMinutes, loading: false});
  }

  getMinutesBetweenDates(start, end) {
    const timeDiff = Math.abs(start - end);
    return Math.floor((timeDiff/1000)/60);
  }

  getFormattedTime(totalMinutes) {
    const hours = Math.floor(totalMinutes/60);
    const minutes = Math.floor(totalMinutes % 60)

    let result = '';

    if(hours > 0) {
      result = `${hours}h`;
    }

    if(minutes > 0) {
      if(result) {
        result += `${minutes}m`;
      } else {
        result = `${minutes}m`;
      }
    }

    if(!result) {
      result = '0h';
    }

    return result;
  }

  getBoard(id, board) {
   let totalMinutesInBoard = 0;
   let items = [];
   
   Object.keys(board).forEach(key => {
     const item = board[key];
     
     totalMinutesInBoard += item.total;

     item.event.total = item.total;
     items.push(item.event);
   });
   
   return <div key={id}>
     <h4><BoardIcon /> {id} - {this.getFormattedTime(totalMinutesInBoard)}</h4>
     {items.map(item => this.getItem(item))}
   </div>
  }
  
  getItem(item) {
    return <div key={item.id}>
      <Item
        draggable={false}
        item={item}
        color={item.color}
        onItemClick={this.props.itemHandler.openItem.bind(this.props.itemHandler)}
        columns={[{text: this.getFormattedTime(item.total), width: "80px"}]}
        key={item.id}
        onUpdatesClick={this.props.itemHandler.openUpdates.bind(this.props.itemHandler)}
      />
    </div>;
  }

  getLabel() {
    return `${moment(this.state.week.start).format("DD.MM.YYYY")} to ${moment(this.state.week.end).format("DD.MM.YYYY")}`;
  }

  goToPreviousWeek() {
    this.setState({
      nextWeek: this.state.week,
      week: this.state.previousWeek,
      previousWeek: this.getPreviousWeek(this.state.previousWeek.start, this.props)
    }, () => {
      this.getEvents(this.state.week.start, this.state.week.end)
    });
  }

  goToNextWeek() {
    this.setState({
      previousWeek: this.state.week,
      week: this.state.nextWeek,
      nextWeek: this.getNextWeek(this.state.nextWeek.start, this.props),
    }, () => {
      this.getEvents(this.state.week.start, this.state.week.end)
    });
  }

  getReport() {
    if(this.state.loading) {
      return <div style={{height: '100px', margin: '0 auto', position: 'relative'}}><Preloader /></div>
    }

    return <div>
      {this.getProgressBar()}

      <div className="ReportsItems">
        {this.state.events && Object.keys(this.state.events).length > 0 ? Object.keys(this.state.events).map(key => this.getBoard(key, this.state.events[key])) : <div className="ReportsNoItems">You didn't plan anything in this particular week.</div> }
      </div>
    </div>
  }

  render() {
    return <div>
      <Menu history={this.props.history} location={this.props.location} />

      <div className="Reports">
        <h2>
          Reports
        </h2>
        <h4>
          Here is a log of your work. Like a timesheet. To update the logs, go to the <Link to="/planner">Planner</Link> and change the past days.
        </h4>

        <div className="ReportsWeekNavigator">
          <Button
            size={Button.sizes.SMALL} kind={Button.kinds.TERTIARY}
            onClick={() => this.goToPreviousWeek()}
          >
            <NavigationChevronLeft />
          </Button>

            {this.getLabel()}

          <Button
            size={Button.sizes.SMALL} kind={Button.kinds.TERTIARY}
            onClick={() => this.goToNextWeek()}
            disabled={this.state.nextWeek.start.getTime() > new Date().getTime()}
          >
            <NavigationChevronRight />
          </Button>
        </div>

        {this.getReport()}
      </div>
    </div>;
  }
}

export default Reports;
