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
    
}

export default TemporitaCalendarEvent;