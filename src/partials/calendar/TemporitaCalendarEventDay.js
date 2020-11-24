import React from "react";
import TemporitaCalendarEvent from "./TemporitaCalendarEvent";
import Button from "monday-ui-react-core/dist/Button";
import Delete from "monday-ui-react-core/dist/icons/Delete";
import Sun from "monday-ui-react-core/dist/icons/Sun";
import Tooltip from 'monday-ui-react-core/dist/Tooltip';

class TemporitaCalendarEventDay extends TemporitaCalendarEvent {
  render() {
    const {event} = this.props;

    return <div className={`TemporitaCalendarEvent ${this.getEventClass()}`}>
        <div className="EventColor" style={{background: event.color}}></div>
        <h4>{event.title} </h4>
        <div className="EventDuration">
          <div className="EventLabel">
            <Tooltip
              showDelay={300}
              content="Implementation intentions"
              containerSelector="body"
            >
              <Button size={Button.sizes.SMALL} kind={Button.kinds.TERTIARY} onClick={() => this.props.onImplementationIntentionClick(this.props.event)}>
                <Sun />
              </Button>
            </Tooltip>
            {this.props.label}
          </div>
          <h5>
            {this.getFormattedDuration()}
            <Tooltip
              showDelay={300}
              content="Remove from calendar"
              containerSelector="body"
            >
              <Button size={Button.sizes.SMALL} kind={Button.kinds.TERTIARY} onClick={() => this.props.onRemoveClick(this.props.event)}>
                <Delete />
              </Button>
            </Tooltip>
          </h5>
        </div>
      </div>
  }    
}

export default TemporitaCalendarEventDay;
