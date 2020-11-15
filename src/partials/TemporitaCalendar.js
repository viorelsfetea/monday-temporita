import React from 'react'
import { Calendar, Views } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'

const DragAndDropCalendar = withDragAndDrop(Calendar)

class TemporitaCalendar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      events: this.props.itemHandler.getEvents(),
      displayDragItemInCell: true,
    }

    this.moveEvent = this.moveEvent.bind(this)
    this.newEvent = this.newEvent.bind(this)
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
    minTime.setHours(9);
    maxTime.setHours(18);
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

    return (
      <DragAndDropCalendar
        formats={{
          timeGutterFormat: "HH:mm"
        }}
        selectable
        localizer={this.props.localizer}
        onEventDrop={this.moveEvent}
        resizable
        onEventResize={this.resizeEvent}
        onSelectSlot={this.newEvent}
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
        step={15}
        timeslots={4}
        views={{week: true, day: true }}
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
        components={{
          event: this.eventRender
        }}
      />
    )
  }
}

export default TemporitaCalendar
