import React from "react";

import Item from "./Item";

class Group extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;

    console.log(this.props);
  }

  render() {
    return <div className="Group ml-4">
        <h4 style={{color: (this.props.group.color)}}>{this.props.group.title}</h4>
        {this.props.group.items ? this.props.group.items.map((item, index) => <Item key={index} item={item} color={this.props.group.color} />) : ""}
      </div>;
  }
}

export default Group;