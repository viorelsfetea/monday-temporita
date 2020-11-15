import React from "react";

class Item extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;
  }

  onDragStart() {
    this.props.itemHandler.setDraggedItem({
      id: this.props.item.id,
      title: this.props.item.name,
      color: this.props.color
    });
  }

  openItem() {
    console.log(this.props.item.id, this.props.monday);
    this.props.monday.execute('openItemCard', { itemId: this.props.item.id, kind: "updates" });
  }

  render() {
    return <div className="Item mb-1" onClick={() => this.openItem()} draggable="true" onDragStart={this.onDragStart.bind(this)}>
          <div className="ItemColor" style={{background: (this.props.color)}}></div>
          <h5>{this.props.item.name}</h5>
        </div>;
  }
}

export default Item;