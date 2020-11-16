import React from 'react'
import { Calendar, Views } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import Modal from 'react-modal';

import BoardList from "../partials/BoardList";

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'

const DragAndDropCalendar = withDragAndDrop(Calendar)

class TemporitaCalendar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      events: this.props.itemHandler.getEvents(),
      displayDragItemInCell: true,
      modalIsOpen: false
    }

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
    const { events } = this.state
    
    event.allDay = droppedOnAllDaySlot;

    const nextEvents = events.map(existingEvent => {
      return existingEvent.id === event.id
        ? { ...existingEvent, start, end }
        : existingEvent
    })

    this.props.itemHandler.addEvent(event);

    this.setState({
      events: nextEvents,
    })

    // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
  }

  resizeEvent = ({ event, start, end }) => {
    const { events } = this.state

    const nextEvents = events.map(existingEvent => {
      return existingEvent.id === event.id
        ? { ...existingEvent, start, end }
        : existingEvent
    })

    this.setState({
      events: nextEvents,
    })

    //alert(`${event.title} was resized to ${start}-${end}`)
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
    let idList = this.state.events.length > 0 ? this.state.events.map(a => a.id) : [0]
    let newId = Math.max(...idList) + 1
    let hour = {
      id: newId,
      title: event.title,
      allDay: event.allDay,
      start: event.start,
      end: event.end,
      color: event.color
    }

    this.setState({
      events: this.state.events.concat([hour]),
    })
  }

  getMinMaxTimes() {
    const minTime = new Date();
    const maxTime = new Date();
    minTime.setHours(this.props.settings.dayStart ? this.props.settings.dayStart : 9);
    maxTime.setHours(this.props.settings.dayEnd ? this.props.settings.dayEnd : 18);
    minTime.setMinutes(0);
    maxTime.setMinutes(0);

    return {min: minTime, max: maxTime};
  }

  eventRender({ event }) {
    return (
      <span style={{color: (event.color)}}>
        <strong>{event.title}</strong>
        {event.desc && ':  ' + event.desc}
      </span>
    )
  }

  render() {
    const {min, max} = this.getMinMaxTimes();
    let calendarViews = this.props.settings.weekends ? {week: true, day: true } : {work_week: true, day: true };

    return (
      <div className="TemporitaCalendar">

        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={false}
          style={{
          content : {
              top                   : '50%',
              left                  : '50%',
              right                 : 'auto',
              bottom                : 'auto',
              marginRight           : '-50%',
              height                : '50vh',
              width                 : '40%',
              transform             : 'translate(-50%, -50%)'
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
        formats={{
          timeGutterFormat: "HH:mm"
        }}
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

          return {style: {background: event.color}}
        }}
        events={[
          { start: new Date(), end: new Date(), title: "", hide: true },
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
          event: this.eventRender
        }}
      />
      </div>
    )
  }
}

export default TemporitaCalendar
