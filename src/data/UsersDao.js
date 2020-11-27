class UsersDao {
  constructor(monday) {
    this.monday = monday;
  }

  getCurrentUser() {
    return new Promise((resolve, reject) => {
      this.monday.api(`query {
                        me {
                          id
                          name
                        }
                    }`)
      .then(res => resolve(res.data))
      .catch(error => reject(new Error("Could not get your information. Please refresh the page")));
    });
  }

  getOtherUsers() {
    return new Promise((resolve, reject) => {
      this.monday.api(`query {
                        users(kind: non_guests) {
                          id, name, photo_thumb, enabled
                        }
                    }`)
        .then(res => resolve(res.data))
        .catch(error => reject(new Error("Could not get your information. Please refresh the page")));
    });
  }
}

export default UsersDao;
