import React from "react";
import Bolt from "monday-ui-react-core/dist/icons/Bolt";
import Button from "monday-ui-react-core/dist/Button";

class WelcomeScreen extends React.Component {
  render() {
    return <div className="WelcomeScreen">
      <h2>Hey there!</h2>
      <h3>Ready for a productive day?</h3>
      
      <div className="WelcomeScreenCheckItems">
        <h4>Before you start, did you...</h4>
        <div>
          <input type="checkbox" name="Removed distractions" id="remove-distractions" />
          <label htmlFor="remove-distractions">
            remove distractions from your work environment?
          </label>
        </div>
        <div>
          <input type="checkbox" name="rewards" id="end-of-day-reward"/>
          <label htmlFor="end-of-day-reward">decide on your end-of-the-day reward?</label>
        </div>
        <div>
          <input type="checkbox" name="small step" id="decide-small-step" />
          <label htmlFor="decide-small-step">decide on the first, small, but important step you want to make today?</label>
        </div>
      </div>

      <h4>Then...</h4>

      <Button size={Button.sizes.LARGE} kind={Button.kinds.PRIMARY} onClick={() => this.props.onClick()} className="WelcomeScreenCTA">
        <Bolt /> Let's go!
      </Button>
    </div>
  }
}

export default WelcomeScreen;
