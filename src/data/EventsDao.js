class EventsDao {
  constructor(monday, utils) {
    this.monday = monday;
    this.utils = utils;

    this.saveErrorMessage = "Could not save this item. Please try again";
  }

  save(user, event) {
    const eventKey = `event.${user.id}.${this.formatDate(event.start)}`;

    this.getExistingEvents(eventKey)
      .then(events => {
        events.push(event);

        this.monday.storage.instance.setItem(eventKey, events)
          .then(res => {
            // Does the user need feedback if an event was successfully saved?
          })
          .catch(error => this.utils.showError(this.saveErrorMessage));
      })
      .catch(error => this.utils.showError(this.saveErrorMessage));
  }

  getExistingEvents(eventKey) {
    return new Promise((resolve, reject) => {
      this.monday.storage.instance.getItem(eventKey)
        .then(res => {
          let events = [];

          if(res.data !== null) {
            events = res.data;
          }
          
          resolve(events);
        })
        .catch(error => reject(error));
    });
  }

  formatDate(date) {
    return `${date.getDay()}${date.getMonth()}${date.getYear()}`;
  }
}

export default EventsDao;