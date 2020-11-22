import React from "react";
import {navigate} from "react-big-calendar/lib/utils/constants";
import Button from "monday-ui-react-core/dist/Button";
import NavigationChevronLeft from "monday-ui-react-core/dist/icons/NavigationChevronLeft";
import NavigationChevronRight from "monday-ui-react-core/dist/icons/NavigationChevronRight";

class TemporitaCalendarToolbar extends React.Component {
  navigate(action) {
    this.props.onNavigate(action)
  }

  isToday() {
    const today = new Date();
    const date = this.props.date;

    return date.getYear() === today.getYear() && date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
  }

  render() {
    let {
      localizer: { messages },
      label,
    } = this.props

    return (
      <div className="rbc-toolbar">
        <span>{this.viewNamesGroup(messages)}</span>

        <span className="rbc-toolbar-label">{label}</span>

        <span>
          <Button
            size={Button.sizes.SMALL} kind={Button.kinds.TERTIARY}
            onClick={this.navigate.bind(this, navigate.PREVIOUS)}
          >
            <NavigationChevronLeft />
          </Button>
          <Button
            size={Button.sizes.SMALL} kind={Button.kinds.TERTIARY}
            onClick={this.navigate.bind(this, navigate.TODAY)}
            active={this.isToday()}
          >
            {messages.today}
          </Button>
          <Button
            size={Button.sizes.SMALL} kind={Button.kinds.TERTIARY}
            onClick={this.navigate.bind(this, navigate.NEXT)}
          >
            <NavigationChevronRight />
          </Button>
        </span>
      </div>
    )
  }

  view = view => {
    this.props.onView(view)
  }

  viewNamesGroup(messages) {
    let viewNames = this.props.views
    const view = this.props.view

    if (viewNames.length > 1) {
      return viewNames.map(name => (
        <Button
          type="button"
          size={Button.sizes.SMALL} kind={Button.kinds.TERTIARY}
          key={name}
          active={ view === name }
          onClick={this.view.bind(null, name)}
        >
          {messages[name]}
        </Button>
      ))
    }
  }
}

export default TemporitaCalendarToolbar;