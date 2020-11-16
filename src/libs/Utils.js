class Utils {
    static logError(error) {
        console.error("Temporita: ", error);
    }

    static hashObject(object) {
      object = JSON.stringify(object);

      let hash = 0, chr;

      for (let i = 0; i < object.length; i++) {
        chr   = object.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0;
      }

      return hash;
    }
}

export default Utils;