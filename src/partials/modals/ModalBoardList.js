import React from "react";

import Modal from "react-modal";
import BoardList from "../BoardList";
import Button from "monday-ui-react-core/dist/Button";

class ModalBoardList extends React.Component {
  render() {
   return <Modal
      isOpen={this.props.modalIsOpen}
      onRequestClose={() => console.log("Modal Closed")}
      style={{
        content : {
          borderRadius: '16px',
          top: '40%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          height: '60vh',
          width: '40%',
          transform: 'translate(-50%, -50%)'
        }
      }}
      contentLabel="Example Modal"
    >
      <div className="ModalHeader">
        <h5>Click on an item in the list to set it in the timeslot</h5>
      </div>
      <div className="ModalBody">
        <BoardList
          monday={this.props.monday}
          itemHandler={this.props.itemHandler}
          boards={this.props.boards}
          onItemClick={this.props.onItemClick}
        />
      </div>
      <div className="ModalFooter">
        <Button size={Button.sizes.MEDIUM} kind={Button.kinds.TERTIARY} onClick={this.props.onCloseClick}>
          Close Window
        </Button>
      </div>
    </Modal>
  }
}

export default ModalBoardList;
