class Cache {
  static write(key, value) {
    localStorage[key] = JSON.stringify(value);
  }

  static read(key) {
    if(!localStorage.hasOwnProperty(key)) return null;

    return JSON.parse(localStorage[key]);
  }
}

export default Cache;
