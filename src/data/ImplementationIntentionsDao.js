import Cache from "./Cache";

class ImplementationIntentionsDao {
  constructor(monday) {
    this.monday = monday;
    this.initialStructure = {
      "PER_TASK": [],
      "PER_DAY": []
    }
  }

  getIntentionsByUser(user) {
    const key = this.getUserKey(user);

    return new Promise((resolve, reject) => {
      const cached = Cache.read(key);

      if(cached) {
        resolve(cached);
        return;
      }

      this.monday.storage.instance.getItem(key)
        .then(result => {
          let results = JSON.parse(result.data.value);

          if(results === null) {
            this.initiateIntentionsForUser(user);
            results = this.initialStructure;
          }

          Cache.write(key, results);
          resolve(results);
        })
        .catch(error => reject(error));
    });
  }

  updateIntentionsByUser(user, intentions) {
    const key = this.getUserKey(user);

    return new Promise((resolve, reject) => {
      this.monday.storage.instance.setItem(key, JSON.stringify(intentions))
        .then(() => {
          Cache.write(key, intentions);
          resolve();
        })
        .catch(error => reject(error))
    });
  }

  getUserKey(user) {
    return `ii-${user.id}`;
  }

  getEventKey(user, event) {
    return `ii-${user.id}-${event.monday_id}`;
  }

  initiateIntentionsForUser(user) {
    this.monday.storage.instance.setItem(this.getUserKey(user), JSON.stringify(this.initialStructure)); // Fire and foooorget
  }

  getEventsForItem(user, event) {
    const key = this.getEventKey(user, event);

    return new Promise((resolve, reject) => {
      const cached = Cache.read(key);

      if(cached) {
        resolve(cached);
        return;
      }

      this.monday.storage.instance.getItem(key)
        .then(result => {
          resolve(result.data.value);
        })
        .catch(error => reject(error))
    });
  }

  saveEventsForItem(user, event, intentions) {
    const key = this.getEventKey(user, event);

   return new Promise((resolve, reject) => {
      this.monday.storage.instance.setItem(key, JSON.stringify(intentions))
        .then(() => {
          Cache.write(key, intentions);
          resolve();
        })
        .catch(error => reject(error))
   });
  }
}

export default ImplementationIntentionsDao;
