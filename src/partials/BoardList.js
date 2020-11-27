import React from "react";
import MenuButton from "monday-ui-react-core/dist/MenuButton";
import { Search } from "monday-ui-react-core";
import Filter from "monday-ui-react-core/dist/icons/Filter";
import Board from "./Board";

class BoardList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      boards: [],
      searchValue: "",
      onlyOwn: false
    };

    this.props = props;
  }

  componentDidMount() {
    this.parseBoards();
  }

  parseBoards() {
    if(!this.state.searchValue && !this.state.onlyOwn) {
      this.setState({boards: this.props.boards});
      return;
    }

    let boards = [];

    this.props.boards.forEach(board => {
      let boardFiltered = {name: board.name, groups: []}; //TODO clone the initial board
      
      board.groups.forEach(group => {
        let groupFiltered = {id: group.id, title: group.title, color: group.color, items: []}; //TODO clone the initial group

        let items = group.items;

        if(this.state.onlyOwn) {
          items = items.filter(item => {
            return item.subscribers.find(subscriber => subscriber.id === this.props.user.id) !== undefined;
          });
        }

        if(this.state.searchValue) {
          items = items.filter(item => {
            return item.name.toLocaleLowerCase().includes(this.state.searchValue.toLocaleLowerCase());
          });
        }

        groupFiltered.items = items;

        if(groupFiltered.items.length > 0) {
          boardFiltered.groups.push(groupFiltered);
        }
      })

      if(boardFiltered.groups.length > 0) {
        boards.push(boardFiltered);
      }
    })

    this.setState({boards});
  }

  searchChanged(value) {
    this.setState({searchValue: value}, () => this.parseBoards());
    this.parseBoards();
  }

  searchCleared() {
    this.setState({searchValue: ""}, () => this.parseBoards());
    this.parseBoards();
  }

  filterChanged(event) {
    this.setState({onlyOwn: event.currentTarget.checked}, () => this.parseBoards());
  }
  
  render() {
    return <div className="BoardsList mt-4">
        <div className="SearchFilter mb-4">
          <Search
            debounceRate={0}
            iconName="fa-search"
            secondaryIconName="fa-times"
            id="Knobs"
            clearOnIconClick={true}
            inputAriaLabel="Filter your items"
            placeholder="Filter your items"
            onChange={this.searchChanged.bind(this)}
            value=""
            size={Search.sizes.SMALL}
          />
          <MenuButton
            size={MenuButton.sizes.XS}
            component={Filter}
          >
            <div className="FilterMenu">
              <h5>Filter items</h5>
              <input type="checkbox" id="show-my-items" onChange={this.filterChanged.bind(this)} checked={this.state.onlyOwn}/> <label htmlFor="show-my-items">See only items you're involved in</label>
            </div>
          </MenuButton>
        </div>
        <div className="Boards pr-2">
          {this.state.boards ? this.state.boards.map((board, index) => <Board key={index} board={board} onItemClick={this.props.onItemClick} {...this.props} />) : ""}
        </div>
      </div>;
  }
}

export default BoardList;
