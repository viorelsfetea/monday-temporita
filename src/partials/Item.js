import React from "react";

class Item extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;

    this.props.item.color = this.props.color;
  }

  onDragStart() {
    this.props.itemHandler.setDraggedItem({
      id: this.props.item.id,
      title: this.props.item.name,
      color: this.props.color
    });
  }

  render() {
    return <div className="Item mb-1" onClick={() => this.props.onItemClick(this.props.item)} draggable={this.props.draggable ? this.props.draggable : false} onDragStart={this.onDragStart.bind(this)}>
          <div className="ItemColor" style={{background: (this.props.color)}}></div>
          <h5>{this.props.item.name}</h5>
        </div>;
  }
}

export default Item;