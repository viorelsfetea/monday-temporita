import React from "react";
import TemporitaCalendarEvent from "./TemporitaCalendarEvent";

class TemporitaCalendarEventWork extends TemporitaCalendarEvent {
  render() {
    const {event} = this.props;

    return <div className={`TemporitaCalendarEventWeek ${this.getEventClass()}`}>
        <div className="EventColor" style={{background: event.color}}></div>
        <h5>{this.getFormattedDuration()}</h5>
        <h4><span className="EventLabel">{this.props.label}: </span>{event.title}</h4>
      </div>
  }    
}

export default TemporitaCalendarEventWork;