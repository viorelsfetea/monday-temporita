class UserDao {
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
      .catch(error => reject(new Error("Could not get your information. Please refrsh the page")));
    });
  }
}

export default UserDao;