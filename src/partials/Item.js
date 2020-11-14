import React from "react";

class Item extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;

    console.log(this.props);
  }

  render() {
    return <div className="Item mb-1">
        <div className="ItemColor" style={{background: (this.props.color)}}></div>
        <h5>{this.props.item.name}</h5>
      </div>;
  }
}

export default Item;