import React from "react";
import Tooltip from "monday-ui-react-core/dist/Tooltip";

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
      color: this.props.color,
      board: this.props.boardName
    });
  }

  getItemRender() {
    const item = this.props.item;
    item.board = this.props.boardName;

    return <div className="ItemWrapper">
          <div className="Item" onClick={() => this.props.onItemClick(item)} draggable={this.props.draggable ? this.props.draggable : false} onDragStart={this.onDragStart.bind(this)}>
            <div className="ItemColor" style={{background: (this.props.color)}}>&nbsp;</div>
            <h5>{this.props.item.name}</h5>
          </div>
          {this.props.columns ? this.props.columns.map(column => <div className="ItemColumn" style={{width: column.width}}>{column.text}</div>) : ""}
        </div>
  }

  render() {
    if(this.props.item.name.length <= 30) {
      return this.getItemRender();
    }
    
    return <Tooltip
        showDelay={300}
        immediateShowDelay={0}
        content={this.props.item.name}
        containerSelector="body"
      >
        {this.getItemRender()}
      </Tooltip>;
  }
}

export default Item;
