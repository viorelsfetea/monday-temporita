class ItemsDao {
  constructor(monday, context) {
    this.monday = monday;
    this.context = context;
  }

  getItems() {
    return new Promise((resolve, reject) => {
      this.loadBoards()
        .then(result => resolve(result))
        .catch(() => reject(new Error("Couldn't retrieve your boards. Please refresh this page.")))
    });
  }

  loadBoards() {
    return new Promise((resolve, reject) => {
      this.monday.api(`query {
        boards {
          id
          name
        }}`)
        .then(res => {
          const boardsIds = res.data.boards
            .filter(board => this.includeBoard(board))
            .map(board => parseInt(board.id, 10));

          this.loadGroups(boardsIds)
            .then(result => resolve(result))
            .catch(error => reject(error))
        })
        .catch(error => reject(error));
    });
  }

  loadGroups(boardsIds) {
    return new Promise((resolve, reject) => {
      this.monday.api(`query($boardsIds: [Int]) {
        boards(ids: $boardsIds) {
          groups {
            id
            title
            color
          }
        }
      }`, {variables: {boardsIds}}).then(res => {
        let groupsIds = [];

        res.data.boards.forEach(board => {
          groupsIds = groupsIds.concat(board.groups.map(group => group.id))
        });

        this.loadItems(boardsIds, groupsIds)
          .then(items => resolve(items))
          .catch(error => reject(error));
      });
    });
  }

  loadItems(boardsIds, groupsIds) {
    return new Promise((resolve, reject) => {
      this.monday.api(`query($groupsIds: [String], $boardsIds: [Int]) {
          boards(ids: $boardsIds) {
            name
            groups(ids: $groupsIds) {
              title
              color
              items {
                id
                name
                subscribers {
                  id
                }
              }
          }
        }
      }`, {variables: {groupsIds, boardsIds}})
        .then(res => resolve(this.parseItems(res.data)))
        .catch(error => reject(error))
    });
  }

  parseItems(items) {
    return items;
  }

  includeBoard(board) {
    return board.name.indexOf("Subitems") === -1 && parseInt(board.id) === this.context.boardId;
  }
}

export default ItemsDao;
