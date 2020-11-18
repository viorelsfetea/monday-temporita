class ItemsDao {
  constructor(monday) {
    this.monday = monday;
  }

  getItems() {
    return new Promise((resolve, reject) => {
      this.loadGroups()
        .then(result => resolve(result))
        .catch(() => reject(new Error("Couldn't retrieve your boards. Please refresh this page.")))
    });
  }

  loadGroups() {
    return new Promise((resolve, reject) => {
      this.monday.api(`query {
        boards {
          id
          name
          groups {
            id
            title
            color
          }
        }
      }`).then(res => {
        const boards = res.data.boards.filter(board => this.includeBoard(board));
        const boardsIds = boards.map(board => parseInt(board.id, 10));

        let groupsIds = [];

        boards.forEach(board => {
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
              }
          }
        }
      }`, { variables: {groupsIds, boardsIds} })
      .then(res => resolve(this.parseItems(res.data)))
      .catch(error => reject(error))
    });
  }

  parseItems(items) {
    return items;
  }

  includeBoard(board) {
    if(board.name.indexOf("Subitems") !== -1) {
      return false;
    }

    return true;
  }
}

export default ItemsDao;