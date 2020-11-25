import React from "react";
import Modal from "react-modal";

import Button from "monday-ui-react-core/dist/Button";
import Sun from "monday-ui-react-core/dist/icons/Sun";
import TextField from "monday-ui-react-core/dist/TextField";

import MultiSelect from "@kenshooui/react-multi-select";
import "@kenshooui/react-multi-select/dist/style.css"
import { v4 as uuidv4 } from 'uuid';
import ImplementationIntentionsDao from "../../data/ImplementationIntentionsDao";
import Preloader from "../Preloader";

class ModalImplementationIntentions extends React.Component {
  constructor(props) {
   super(props);

   this.dao = new ImplementationIntentionsDao(props.monday);

   this.state = {
     loading: true,
     modalExplanationIsOpen: false,
     fieldSituation: "",
     fieldAction: "",
     validationSituation: null,
     validationAction: null,
     validationTriggered: false,
     saving: false,
     intentions: this.dao.initialStructure,
     selectorIntentions: [],
     selectorIntentionsSelected: [],
     savingIntentions: false
   }
  }

  getTypeKey() {
    return this.props.type === "day" ? "PER_DAY" : "PER_TASK";
  }

  modalOpened() {
    //this.dao.updateIntentionsByUser(this.props.user, null);

    this.setState({loading: true});

    let actions = [this.dao.getIntentionsByUser(this.props.user)];

    if(this.props.type === "event") {
      actions.push(this.dao.getImplementationsForItem(this.props.user, this.props.event))
    }

    if(this.props.type === "day") {
      actions.push(this.dao.getImplementationsForDay(this.props.user, this.props.date))
    }

    Promise.all(actions)
      .then(results => {
        this.setState({
          loading: false,
          intentions: results[0],
          selectorIntentions: results[0][this.getTypeKey()].map(intention => this.formatSelectorLabel(intention)),
          selectorIntentionsSelected: results[1] ? results[1].map(intention => this.formatSelectorLabel(intention)) : []
        })
      })
      .catch(error => {
        console.error("Temporita", error);
        this.props.utils.showError("Could not read your list of implementation intentions. Please refresh the page.")
      });
  }

  handleChange(selectorIntentionsSelected) {
    this.setState({ selectorIntentionsSelected });
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

  formatSelectorLabel(intention) {
    return {
      id: intention.id,
      label: `If ${intention.situation} then ${intention.action}`
    }
  }

  addToList() {
    const intention = {
      id: uuidv4(),
      situation: this.state.fieldSituation,
      action: this.state.fieldAction
    }

    const selectorIntention = this.formatSelectorLabel(intention);

    const intentions = this.state.intentions;
    intentions[this.getTypeKey()] = intentions[this.getTypeKey()].concat([intention]);

    this.dao.updateIntentionsByUser(this.props.user, intentions)
      .then(() => {
        this.setState({
          saving: false,
          intentions,
          selectorIntentions: this.state.selectorIntentions.concat([selectorIntention]),
          selectorIntentionsSelected: this.state.selectorIntentionsSelected.concat([selectorIntention]),
          fieldSituation: "",
          fieldAction: "",
          validationTriggered: false
        });
      });
  }

  setIntentions() {
    switch (this.props.type) {
      case "event":
        return this.setIntentionsForItem();

      case "day":
        return this.setIntentionsForDay();
    }
  }

  setIntentionsForDay() {
    this.setState({savingIntentions: true});

    const intentions = this.state.selectorIntentionsSelected.map(intention => {
      return this.state.intentions["PER_DAY"].find(item => item.id === intention.id)
    });

    this.dao.saveImplementationsForDay(this.props.user, this.props.date, intentions)
      .then(() => {
        this.setState({savingIntentions: false});
        this.props.onCloseClick();
      })
      .catch(error => {
        this.setState({savingIntentions: false});
        console.error("Temporita", error);
        this.utils.showError("Could not save implementation intentions. Please try again");
      })
  }

  setIntentionsForItem() {
    this.setState({savingIntentions: true});

    const intentions = this.state.selectorIntentionsSelected.map(intention => {
      return this.state.intentions["PER_TASK"].find(item => item.id === intention.id)
    });

    this.dao.saveImplementationsForItem(this.props.user, this.props.event, intentions)
      .then(() => {
        this.setState({savingIntentions: false});
        this.props.onCloseClick();
      })
      .catch(error => {
        this.setState({savingIntentions: false});
        console.error("Temporita", error);
        this.utils.showError("Could not save implementation intentions. Please try again");
      })
  }

  getContent() {
    if(this.state.loading) {
      return <Preloader />
    }

    return <div>
      <div className="AddNewImplementationIntention mb-4">
        <div className="form-row">
          <div className="form-group col-md-5">
            <label htmlFor="condition">if</label>
            <TextField id="condition" iconName={this.state.validationSituation ? "fa-exclamation-circle" : ""} placeholder="situation" validation={this.state.validationSituation} value={this.state.fieldSituation || ""} onChange={(value) => this.setState({fieldSituation: value }, () => {this.verifyFields()})}/>
          </div>
          <div className="form-group col-md-5">
            <label htmlFor="then">then</label>
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
        responsiveHeight="35vh"
        itemHeight={32}
        items={this.state.selectorIntentions}
        selectedItems={this.state.selectorIntentionsSelected}
        onChange={this.handleChange.bind(this)}
        wrapperClassName="SelectorContainer"
      />
    </div>
  }

  render() {
    return <div>
      <Modal
        isOpen={this.state.modalExplanationIsOpen}
        ariaHideApp={false}
        onRequestClose={() => this.setState({modalExplanationIsOpen: false})}
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
       onRequestClose={() => this.props.onCloseClick()}
       onAfterOpen={() => this.modalOpened()}
       ariaHideApp={false}
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
         <h5><Sun /> Implementation intentions for {this.props.type === "day" ? "day" : "item"}
           <Button className="ButtonExplanation" size={Button.sizes.SMALL} kind={Button.kinds.TERTIARY} onClick={() => this.setState({modalExplanationIsOpen: true})}>
             <i className="far fa-question-circle"></i> what are those?
           </Button>
         </h5>
       </div>
       <div className="ModalBody">
         {this.getContent()}
       </div>
       <div className="ModalFooter">
         <Button size={Button.sizes.MEDIUM} kind={Button.kinds.SECONDARY} color={Button.colors.NEGATIVE} onClick={this.props.onCloseClick}>
           Cancel
         </Button>
         {!this.state.loading ? <Button size={Button.sizes.MEDIUM} kind={Button.kinds.PRIMARY} color={Button.colors.POSITIVE} onClick={this.setIntentions.bind(this)} loading={this.state.savingIntentions}> Set </Button> : ""}
       </div>
     </Modal>
   </div>
 }
}

export default ModalImplementationIntentions;
