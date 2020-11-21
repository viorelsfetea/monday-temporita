import React from 'react';

class TemporitaCalendarEvent extends React.Component {
  getDuration() {
    const event = this.props.event;

    const timeDiff = Math.abs(event.start - event.end);
    const timeDiffInMinutes = Math.floor((timeDiff/1000)/60);
    
    return {
      totalMinutes: timeDiffInMinutes,
      hours: Math.floor(timeDiffInMinutes/60),
      minutes: Math.floor(timeDiffInMinutes % 60)
    }
  }

  getFormattedDuration() {
    const {hours, minutes} = this.getDuration();

    let result = '';

    if(hours > 0) {
      result = `${hours}h`;
    }

    if(minutes > 0) {
      result += `${minutes}m`;
    }

    return result;
  }

  getEventClass() {
    const {totalMinutes} = this.getDuration();

    if(totalMinutes <= 20) {
      return "lessThan20Minutes";
    }

    if(totalMinutes <= 30) {
      return "lessThan30Minutes";
    }

    if(totalMinutes <= 60) {
      return "lessThan1Hour";
    }

    if(totalMinutes <= 120) {
      return "lessThan2Hours";
    }
  }

  render() {
    const {event} = this.props;

    const customDiv = (
      <div className={`TemporitaCalendarEvent ${this.getEventClass()}`}>
        <div className="EventColor" style={{background: event.color}}></div>
        <h4>{event.title}</h4>
        <div className="EventDuration">
          <div className="EventLabel">{this.props.label}</div>
          <h5>{this.getFormattedDuration()}</h5>
        </div>
      </div>
    );
    const eventDiv = React.cloneElement(this.props.children.props.children, {}, customDiv);
    const wrapper = React.cloneElement(this.props.children, {}, eventDiv);
    return (<div>
      {wrapper}
    </div>
    );
  }        
}

export default TemporitaCalendarEvent;