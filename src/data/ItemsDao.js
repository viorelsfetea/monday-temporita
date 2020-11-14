class ItemsDao {
  constructor(monday) {
    this.monday = monday;
  }

  getItems() {
    return new Promise((resolve, reject) => {
      this.loadGroups()
        .then(result => resolve(result))
        .catch(error => reject(error))
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
        let groupsIds = []
        boards.forEach(board => {
          groupsIds = groupsIds.concat(board.groups.map(group => group.id))
        });

        this.loadItems(groupsIds)
          .then(items => resolve(items))
          .catch(error => reject(error));
      });
    });
  }

  loadItems(groupsIds) {
    return new Promise((resolve, reject) => {
      this.monday.api(`query($groupsIds: [String]) {
          boards {
            groups(ids: $groupsIds) {
              title
              color
              items {
                name
              }
          }
        }
      }`, { variables: {groupsIds} })
      .then(res => resolve(this.parseItems(res.data)))
      .catch(error => reject(error))
    });
  }

  parseItems(items) {
    console.log("Items: ", items);
  }

  includeBoard(board) {
    if(board.name.indexOf("Subitems") !== -1) {
      return false;
    }

    return true;
  }
}

export default ItemsDao;