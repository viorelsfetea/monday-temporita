import React from "react";
import BoardIcon from "monday-ui-react-core/dist/icons/Board";

import Group from "./Group";

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;
  }

  render() {
    return <div className="Board mt-4">
        <h3 className="mb-0"><BoardIcon /> {this.props.board.name}</h3>
        {this.props.board.groups ? this.props.board.groups.map((group, index) => <Group key={index} group={group} monday={this.props.monday} itemHandler={this.props.itemHandler} />) : ""}
      </div>;
  }
}

export default Board;