import React from "react";
import Button from "monday-ui-react-core/dist/Button";
import Home from "monday-ui-react-core/dist/icons/Home";
import Calendar from "monday-ui-react-core/dist/icons/Calendar";
import Dashboard from "monday-ui-react-core/dist/icons/Dashboard";
import Person from "monday-ui-react-core/dist/icons/Person";

import Tooltip from "monday-ui-react-core/dist/Tooltip";

class Menu extends React.Component {
  goTo(path) {
    this.props.history.push(path);
  };

  isCurrentPath(path) {
    return this.props.location.pathname === path;
  }

  getButton(title, path, icon) {
    return <Tooltip
      showDelay={300}
      content={title}
      containerSelector="body"
    >
      <Button size={Button.sizes.SMALL} kind={Button.kinds.TERTIARY} onClick={() => this.goTo(path)} active={this.isCurrentPath(path)}>
        {icon}
      </Button>
    </Tooltip>
  }

  render() {
    return <div className="MenuButtons">
      {this.getButton("Your day", "/today", <Home />)}
      {this.getButton("Planner", "/planner", <Calendar />)}
      {this.getButton("Reports", "/reports", <Dashboard />)}
      {this.getButton("What are other people working on?", "/others", <Person />)}
    </div>
  }
}


export default Menu;
