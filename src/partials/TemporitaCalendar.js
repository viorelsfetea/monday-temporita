import React from 'react'
import { Calendar, Views } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import Modal from 'react-modal';

import BoardList from "../partials/BoardList";
import EventsDao from "../data/EventsDao";

import TemporitaCalendarEvent from "../partials/calendar/TemporitaCalendarEvent";

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'

const DragAndDropCalendar = withDragAndDrop(Calendar)

class TemporitaCalendar extends React.Component {
  constructor(props) {
    super(props)

    this.eventsDao = new EventsDao(this.props.monday, this.props.utils);

    this.state = {
      events: [],
      displayDragItemInCell: true,
      modalIsOpen: false
    }

    this.eventsDao.getCurrentEvents(this.props.currentUser, new Date(), this.props.settings.weekends)
      .then(events => {
        console.log(events);
        this.setState({events})
      })

    this.moveEvent = this.moveEvent.bind(this)
    this.newEvent = this.newEvent.bind(this)

    this.selectedTimes = {
      start: null, end: null
    }
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

    console.log(start, end);

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

    this.setState({
      events: nextEvents,
    })
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
    
    this.setState({
      events: this.state.events.concat([hour]),
    });

    this.eventsDao.save(this.props.currentUser, hour); 
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

  eventRender(props) {
    return <TemporitaCalendarEvent {...props} />
  }

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
      selectRangeFormat: this.getTimeRangeFormat()
    }
  }

  render() {
    const {min, max} = this.getMinMaxTimes();
    let calendarViews = this.props.settings.weekends ? {week: true, day: true } : {work_week: true, day: true };

    return (
      <div className="TemporitaCalendar">

        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={() => console.log("Modal Closed")}
          style={{
          content : {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              height: '50vh',
              width: '40%',
              transform: 'translate(-50%, -50%)'
            }
          }}
          contentLabel="Example Modal"
        >
            <BoardList 
              monday={this.props.monday}
              itemHandler={this.itemHandler}
              boards={this.props.boards} 
              onItemClick={this.itemToEvent.bind(this)}
            />
       </Modal>
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
          eventWrapper: this.eventRender 
        }}
      />
      </div>
    )
  }
}

export default TemporitaCalendar
