import React from "react";
import Modal from "react-modal";

import Button from "monday-ui-react-core/dist/Button";
import Sun from "monday-ui-react-core/dist/icons/Sun";
import TextField from "monday-ui-react-core/dist/TextField";

import MultiSelect from "@kenshooui/react-multi-select";
import "@kenshooui/react-multi-select/dist/style.css"
import { v4 as uuidv4 } from 'uuid';

class ModalImplementationIntentions extends React.Component {
  constructor() {
   super();

   this.state = {
     modalExplanationIsOpen: false,
     fieldSituation: "",
     fieldAction: "",
     validationSituation: null,
     validationAction: null,
     validationTriggered: false,
     saving: false,
     intentions: [],
     intentionsSelected: []
   }
  }

  handleChange(intentionsSelected) {
    this.setState({ intentionsSelected });
  }

  verifyFields() {
    if(!this.state.validationTriggered) return;

    let errors = false;

    if(this.state.fieldSituation === "") {
      this.setState({validationSituation: {status: "error"}});
      errors = true;
    } else {
      this.setState({validationSituation: null});
    }

    if(this.state.fieldAction === "") {
      this.setState({validationAction: {status: "error"}})
      errors = true;
    } else {
      this.setState({validationAction: null});
    }

    return errors;
  }

  saveNewImplementationIntention() {
    this.setState({validationTriggered: true}, () => {
      if(!this.verifyFields()) {
        this.setState({saving: true});
        this.addToList();
      }
    });
  }

  addToList() {
    const intention = {
      id: uuidv4(),
      label: `If ${this.state.fieldSituation} then ${this.state.fieldAction}`
    }

    this.setState({
      intentions: this.state.intentions.concat([intention]),
      intentionsSelected: this.state.intentionsSelected.concat([intention])
    });
  }


  render() {
    return <div>
     <Modal
       isOpen={this.state.modalExplanationIsOpen}

       style={{
         content : {
           borderRadius: '16px',
           boxShadow: '0.0px 15.0px 50.0px 0px rgba(0, 0, 0, 0.3)',
           top: '40%',
           left: '50%',
           right: 'auto',
           bottom: 'auto',
           marginRight: '-50%',
           width: '30%',
           transform: 'translate(-50%, -50%)',
         },
         overlay: {
           zIndex: 99
         }
       }}
     >
       <div className="ModalHeader">
         <h4>Implementation intentions</h4>
       </div>
       <div className="ModalBody ModalExplanation">
         <p>
           <strong>Implementation intentions</strong> (II) are self-guiding strategies to better achieve your goals. IIs specify the <em>when</em>, <em>where</em>, and <em>how</em> to help you focus on your desired result and visualize the steps to obtain it.
         </p>
         <p>
           An II comes in the form of an "<em>if-then plan</em>" and serves in habit and behavior modification. Think about when and where you are likely to find yourself in trouble, and what you can do to overcome it: '<strong><em><span style={{color: "#676879"}}>if this happens</span>, <span style={{color: "#0085FF"}}>then I will do that</span></em></strong>'.
         </p>
         <p>
           Presto, you have yourself a plan!
         </p>
       </div>
       <div className="ModalFooter">
         <Button size={Button.sizes.MEDIUM} kind={Button.kinds.TERTIARY} onClick={() => this.setState({modalExplanationIsOpen: false})}>
           Close Window
         </Button>
       </div>
     </Modal>
     <Modal
       isOpen={this.props.modalIsOpen}
       onRequestClose={() => console.log("Modal Closed")}
       style={{
         content: {
           borderRadius: '16px',
           boxShadow: '0.0px 15.0px 50.0px 0px rgba(0, 0, 0, 0.3)',
           top: '40%',
           left: '50%',
           right: 'auto',
           bottom: 'auto',
           marginRight: '-50%',
           width: '40%',
           transform: 'translate(-50%, -50%)',
         },
         overlay: {
           zIndex: 8
         }

       }}
       contentLabel="Implementation Intentions"
     >
       <div className="ModalHeader">
         <h5><Sun /> Implementation intentions for this item
           <Button className="ButtonExplanation" size={Button.sizes.SMALL} kind={Button.kinds.TERTIARY} onClick={() => this.setState({modalExplanationIsOpen: true})}>
             <i className="far fa-question-circle"></i> what are those?
           </Button>
         </h5>
       </div>
       <div className="ModalBody">
         <div className="AddNewImplementationIntention mb-4">
           <div className="form-row">
             <div className="form-group col-md-5">
               <label htmlFor="condition">If situation happens</label>
               <TextField id="condition" iconName={this.state.validationSituation ? "fa-exclamation-circle" : ""} placeholder="situation" validation={this.state.validationSituation} value={this.state.fieldSituation || ""} onChange={(value) => this.setState({fieldSituation: value }, () => {this.verifyFields()})}/>
             </div>
             <div className="form-group col-md-5">
               <label htmlFor="then">then I will</label>
               <TextField id="then" iconName={this.state.validationAction ? "fa-exclamation-circle" : ""} placeholder="action" validation={this.state.validationAction} value={this.state.fieldAction || ""} onChange={(value) => this.setState({fieldAction: value }, () => {this.verifyFields()})} />
                 </div>
             <div className="form-group col-md-2 align-items-end d-flex">
               <Button size={Button.sizes.SMALL} kind={Button.kinds.PRIMARY} onClick={() => this.saveNewImplementationIntention()} loading={this.state.saving}>
                 Add new
               </Button>
             </div>
           </div>
         </div>
         <MultiSelect
           items={this.state.intentions}
           selectedItems={this.state.intentionsSelected}
           onChange={this.handleChange}
         />
       </div>
       <div className="ModalFooter">
         <Button size={Button.sizes.MEDIUM} kind={Button.kinds.TERTIARY} onClick={this.props.onCloseClick}>
           Close Window
         </Button>
       </div>
     </Modal>
   </div>
 }
}

export default ModalImplementationIntentions;
