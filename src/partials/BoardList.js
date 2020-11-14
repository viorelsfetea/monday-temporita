import React from "react";

import { Search } from "monday-ui-react-core";

import Board from "./Board";

class BoardList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      boards: []
    };

    this.props = props;

    this.searchValue = "";
  }

  componentDidMount() {
    this.parseBoards();
  }

  parseBoards() {
    if(!this.searchValue) {
      this.setState({boards: this.props.boards});
      return;
    }

    let boards = [];

    this.props.boards.forEach(board => {
      let boardFiltered = {name: board.name, groups: []}; //TODO clone the initial board
      
      board.groups.forEach(group => {
        let groupFiltered = {id: group.id, title: group.title, color: group.color, items: []}; //TODO clone the initial group
        
        groupFiltered.items = group.items.filter(item => {
          return item.name.toLocaleLowerCase().includes(this.searchValue.toLocaleLowerCase());
        });
        boardFiltered.groups.push(groupFiltered);
      })
      boards.push(boardFiltered);
    })

    this.setState({boards});
  }

  searchChanged(value) {
    console.log("Search:", value);
    this.searchValue = value;
    this.parseBoards();
  }

  searchCleared() {
    console.log("Search cleared");
    this.searchValue = "";
    this.parseBoards();
  }

  render() {
    return <div className="BoardsList mt-4">
      <div className="mb-4">
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
      </div>
        {this.state.boards ? this.state.boards.map((board, index) => <Board key={index} board={board} />) : ""}
      </div>;
  }
}

export default BoardList;