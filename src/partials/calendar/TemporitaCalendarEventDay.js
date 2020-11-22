import React from "react";
import TemporitaCalendarEvent from "./TemporitaCalendarEvent";

class TemporitaCalendarEventDay extends TemporitaCalendarEvent {
  render() {
    const {event} = this.props;

    return <div className={`TemporitaCalendarEvent ${this.getEventClass()}`}>
        <div className="EventColor" style={{background: event.color}}></div>
        <h4>{event.title}</h4>
        <div className="EventDuration">
          <div className="EventLabel">{this.props.label}</div>
          <h5>{this.getFormattedDuration()}</h5>
        </div>
      </div>
  }    
}

export default TemporitaCalendarEventDay;