import React from 'react'
import {Calendar, Views} from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import EventsDao from "../data/EventsDao";

import TemporitaCalendarEventDay from "./calendar/TemporitaCalendarEventDay";
import TemporitaCalendarEventWeek from "./calendar/TemporitaCalendarEventWeek";
import TemporitaCalendarToolbar from "./calendar/TemporitaCalendarToolbar";

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import Preloader from "./Preloader";
import ModalBoardList from "./modals/ModalBoardList";

const DragAndDropCalendar = withDragAndDrop(Calendar)

class TemporitaCalendar extends React.Component {
  constructor(props) {
    super(props)

    this.eventsDao = new EventsDao(this.props.monday, this.props.utils);

    this.state = {
      events: [],
      displayDragItemInCell: true,
      modalIsOpen: false,
      loading: true
    }

    this.moveEvent = this.moveEvent.bind(this)
    this.newEvent = this.newEvent.bind(this)

    this.selectedTimes = {
      start: null, end: null
    }
  }

  componentDidMount() {
    this.eventsDao.getCurrentEvents(this.props.currentUser, new Date(), this.props.settings.weekends)
      .then(events => {
        this.updateEvents(events);
        this.setState({loading: false})
      })
  }

  updateEvents(events) {
    let totalsPerDay = {};
    
    events.forEach(event => {
      const dayKey = this.getDayKey(event.start);
      
      if(!totalsPerDay.hasOwnProperty(dayKey)) {
        totalsPerDay[dayKey] = 0;
      }
     
      totalsPerDay[dayKey] += Math.floor((Math.abs(event.start - event.end)/1000)/60);
    });

    this.setState({events, totalsPerDay});
  }

  handleDragStart = event => {
    this.setState({ draggedEvent: event })
  }

  dragFromOutsideItem = () => {
    return this.state.draggedEvent
  }

  onDropFromOutside = ({ start, end, allDay }) => {
    const draggedEvent = this.props.itemHandler.getDraggedItem();

    // make end always an hour after the start date
    end.setHours(start.getHours() + 1, start.getMinutes(), 0, 0);

    const event = {
      id: draggedEvent.id,
      title: draggedEvent.title,
      start,
      end,
      allDay: allDay,
      color: draggedEvent.color
    }

    this.setState({ draggedEvent: null })
    this.newEvent(event);
  }

  handleSelect({ start, end }) {
    this.setState({modalIsOpen: true});
    this.selectedTimes.start = start;
    this.selectedTimes.end = end;
  }

  moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    event.allDay = droppedOnAllDaySlot;

    this.resizeEvent({event, start, end});
  }

  resizeEvent = ({ event, start, end }) => {
    const { events } = this.state

    const nextEvents = events.map(existingEvent => {
      if(existingEvent.id === event.id) {
        existingEvent.start = start;
        existingEvent.end = end;
        existingEvent.allDay = event.allDay;

        this.eventsDao.update(this.props.currentUser, existingEvent);
      }

      return existingEvent;
    })

    this.updateEvents(nextEvents);
  }

  itemToEvent(item) {
    this.newEvent({
      id: item.id,
      title: item.name,
      start: this.selectedTimes.start,
      end: this.selectedTimes.end,
      color: item.color
    });

    this.setState({modalIsOpen: false});
  }

  newEvent = event => {
    let hour = {
      id: parseInt(`${event.id}${Math.ceil(Math.random() * 10000)}`), // Makes the event ids unique so multiple tasks can be added in the same day
      monday_id: event.id,
      title: event.title,
      allDay: event.allDay,
      start: event.start,
      end: event.end,
      color: event.color
    }
   
    this.updateEvents(this.state.events.concat([hour]));

    this.eventsDao.save(this.props.currentUser, hour); 
  }

  onRemoveClick(event) {
    this.props.monday.execute("confirm", {
      message: "Do you want to remove this item from the calendar?", 
      confirmButton: "Yes, remove", 
      cancelButton: "No", 
      excludeCancelButton: false
    }).then((res) => {
      if(res.data.confirm === true) {
        this.removeEvent(event);
      }
    });
  }

  removeEvent(event) {
    this.eventsDao.remove(this.props.currentUser, event);

    this.updateEvents(this.state.events.filter(existingEvent => existingEvent.id !== event.id));
  }

  onImplementationIntentionClick(event) {
    console.log('TemporitaCalendar.js:170', "ON IMPLEMENTATION INTENTIONS");
  }

  getMinMaxTimes() {
    const minTime = new Date();
    const maxTime = new Date();
    minTime.setHours(this.props.settings.dayStart ? this.props.settings.dayStart : 9);
    maxTime.setHours(this.props.settings.dayEnd ? this.props.settings.dayEnd - 1 : 18); // if 16, make it 15:59
    minTime.setMinutes(0);
    maxTime.setMinutes(59);

    return {min: minTime, max: maxTime};
  }

  eventDayRender(props) {
    const label = this.props.localizer.format(props.event.start, this.getTimeFormat()) + " - " + this.props.localizer.format(props.event.end, this.getTimeFormat());
    return <TemporitaCalendarEventDay {...props} label={label} onRemoveClick={this.onRemoveClick.bind(this)} onImplementationIntentionClick={this.onImplementationIntentionClick.bind(this)} />
  }

  eventWeekRender(props) {
    const label = this.props.localizer.format(props.event.start, this.getTimeFormat()) + " - " + this.props.localizer.format(props.event.end, this.getTimeFormat());
    return <TemporitaCalendarEventWeek {...props} label={label} />
  }

  toolbarRender(props) {
    const settings = this.props.settings;
    const dayKey = this.getDayKey(props.date);
    let totalPlanned = 0;

    if(this.state.totalsPerDay) {
      totalPlanned = this.state.totalsPerDay.hasOwnProperty(dayKey) ? this.state.totalsPerDay[dayKey] : 0;
    }

    return <TemporitaCalendarToolbar {...props} settings={settings} totalPlanned={totalPlanned} />;
  }

  getDayKey(date) {
    return `${date.getDate()}-${date.getMonth()}-${date.getYear()}}`;
  };

  getFakeTimeSlot(minutes) { // this is a hack :(
    const today = new Date();
    today.setHours(this.props.settings.dayEnd);
    today.setMinutes(minutes);
    today.setSeconds(1);

    return today;
  }

  getTimeFormat() {
    return this.props.settings.timeFormat === "24h" ? "HH:mm" : "h:mm A";
  }

  getTimeRangeFormat() {
    return ({ start, end }, culture, localizer) => {
      return localizer.format(start, this.getTimeFormat()) + " - " + localizer.format(end, this.getTimeFormat());
    };
  }

  timeFormats() {
    return {
      timeGutterFormat: this.getTimeFormat(),
      eventTimeRangeFormat: this.getTimeRangeFormat(),
      selectRangeFormat: this.getTimeRangeFormat(),
      dayHeaderFormat: "DD.MM.YYYY (dddd)",
      dayFormat: "DD.MM.YYYY (dddd)",
    }
  }

  render() {
    const {min, max} = this.getMinMaxTimes();
    let calendarViews = this.props.settings.weekends ? {week: true, day: true } : {work_week: true, day: true };

    return (
      <div className="TemporitaCalendar">
        {this.state.loading ? <Preloader /> : ""}

        <ModalBoardList
          modalIsOpen={this.state.modalIsOpen}
          monday={this.props.monday}
          itemHandler={this.props.itemHandler}
          boards={this.props.boards}
          onItemClick={this.itemToEvent.bind(this)}
          onCloseClick={() => this.setState({modalIsOpen: false})} />

      <DragAndDropCalendar
        formats={this.timeFormats()}
        selectable
        localizer={this.props.localizer}
        onEventDrop={this.moveEvent}
        resizable
        onEventResize={this.resizeEvent}
        // Fix (the next 2 props): when calendar initialized with no events, users can't resize events first on the first try
        // https://github.com/jquense/react-big-calendar/issues/1105
        eventPropGetter={event => {
          if (event.hide) {
            return { style: { display: "none" } };
          }
        }}
        events={[
          { start: this.getFakeTimeSlot(0), end: this.getFakeTimeSlot(1), title: "", hide: true },
            ...this.state.events
        ]}
        step={10}
        timeslots={6}
        views={calendarViews}
        defaultView={Views.DAY}
        defaultDate={new Date()}
        min={min}
        max={max}
        popup={true}
        dragFromOutsideItem={
          this.state.displayDragItemInCell ? this.dragFromOutsideItem : null
        }
        onDropFromOutside={this.onDropFromOutside}
        handleDragStart={this.handleDragStart}
        onSelectSlot={this.handleSelect.bind(this)}
        components={{
          toolbar: this.toolbarRender.bind(this),
          day: {
            event: this.eventDayRender.bind(this)
          }, 
          week: {
            event: this.eventWeekRender.bind(this)
          }, 
          //eventWrapper: this.eventRender 
        }}
      />
      </div>
    )
  }
}

export default TemporitaCalendar
