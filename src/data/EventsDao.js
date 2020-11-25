import Cache from "./Cache";

class EventsDao {
  constructor(monday, utils) {
    this.monday = monday;
    this.utils = utils;
    this.actions = {
      UPDATE: "update",
      DELETE: "delete"
    }

    this.saveErrorMessage = "Could not save this item. Please try again";
  }

  save(user, event) {
    const eventKey = this.getKey(user, event.start);

    this.getExistingEvents(eventKey)
      .then(events => {
        events.push(event);

        this.monday.storage.instance.setItem(eventKey, JSON.stringify(events))
          .then(res => {
            Cache.write(eventKey, events);
            // Does the user need feedback if an event was successfully saved?
          })
          .catch(error => this.utils.showError(this.saveErrorMessage));
      })
      .catch(error => this.utils.showError(this.saveErrorMessage));
  }

  update(user, event) {
    this.changeEvents(user, event, this.actions.UPDATE);
  }

  remove(user, event) {
    this.changeEvents(user, event, this.actions.DELETE);
  }

  changeEvents(user, event, type) {
    const eventKey = this.getKey(user, event.start);

    this.getExistingEvents(eventKey)
      .then(events => {
        let nextEvents = null;

        if(type === this.actions.UPDATE) {
          nextEvents = events.map(existingEvent => {
            if(existingEvent.id === event.id) return event;

            return existingEvent;
          });
        }

        if(type === this.actions.DELETE) {
          nextEvents = events.filter(existingEvent => existingEvent.id !== event.id);
        }

        if(nextEvents === null) return;

        this.monday.storage.instance.setItem(eventKey, JSON.stringify(nextEvents))
          .then(res => {
            Cache.write(eventKey, nextEvents);
            // Does the user need feedback if an event was successfully saved?
          })
          .catch(error => this.utils.showError(this.saveErrorMessage));
      })
      .catch(error => this.utils.showError(this.saveErrorMessage));
  }

  /**
   * Based on the date, get the events for that week, the week before and the next week
   * 
   * user - the user the events are retrieved for
   * date - the date to get the events for
   * includeWeekends - get the events also for weekend days, otherwise ignore as a performance feat
   */
  getCurrentEvents(user, date, includeWeekends) {
    const dates = this.getPreloadDates(date, includeWeekends);
    const keys = dates.map(date => this.getKey(user, date));

    return new Promise((resolve, reject) => {
      let events = [];
      let remainingKeys = [];

      keys.forEach(key => {
        const cached = Cache.read(key);

        if(cached) {
          events = events.concat(cached.map(event => {
            event.start = new Date(event.start);
            event.end = new Date(event.end);

            return event;
          }));
        } else {
          remainingKeys.push(key);
        }
      });

      if(remainingKeys.length === 0) {
        resolve(events);
        return;
      }
      
      Promise.all(remainingKeys.map(key => this.monday.storage.instance.getItem(key)))
        .then(results => {
          results.forEach((result, index) => {
            if(result.data.value === null) return;

            const eventsRaw = JSON.parse(result.data.value);

            Cache.write(remainingKeys[index], eventsRaw);

            events = events.concat(eventsRaw.map(event => {
              event.start = new Date(event.start);
              event.end = new Date(event.end);

              return event;
            }));
          });

          resolve(events);
        })
        .catch(error => reject(error));
    });
  }

  getTodayEvents(user) {
    const eventKey = this.getKey(user, new Date());

    return this.getExistingEvents(eventKey);
  }

  getKey(user, date) {
    return `event-${user.id}-${this.formatDate(date)}`
  }

  getExistingEvents(eventKey) {
    return new Promise((resolve, reject) => {
      const cached = Cache.read(eventKey);

      if(!cached) {
        resolve(cached);
        return;
      }

      this.monday.storage.instance.getItem(eventKey)
        .then(res => {
          let events = [];

          if(res.data.value !== null) {
            events = JSON.parse(res.data.value);
          }
          
          resolve(events);
        })
        .catch(error => reject(error));
    });
  }

  formatDate(date) {
    return `${date.getDate()}${date.getMonth()}${date.getYear()}`;
  }

  /**
   * Gets 21 dates based on the date given: all days in this week, the previous one and the next one
   * 
   * @param {Date} date 
   */
  getPreloadDates(date, includeWeekends) {
    const dates = [];
    const isWeekend = (date) => current.getDay() === 0 || current.getDay() === 6;

    // Go to Monday, last week, and set it as a start:
    const current = new Date();
    current.setDate(date.getDate() - date.getDay() + 1 - 7);

    // Calculate the 21 needed dates
    for(let i = 1; i <= 21; i++) {
      if(!includeWeekends && isWeekend(current) ) {
        current.setDate(current.getDate() + 1);
        continue;
      }

      dates.push(new Date(current));

      current.setDate(current.getDate() + 1);
    }

    return dates;
  }
}

export default EventsDao;
