/**
 * Modulok.
 */
const fsm = require('./fsm'),
      path = require('path'),
      config = require('./config');

/**
 * Az osztály feladata a fájl alapú adatbáziskezelés.
 */
class DB {
    constructor() {
        this.dir = config.dbPath;
    }

    /**
     * 
     * @param {File} doc a json struktúrát tartalmazó fájl neve.
     */
    getAll(doc, callBack) {
        let filePath = path.join(this.dir, `${doc}.json`);
        fsm.readFile.then( (json) => {
            callBack(null, json);
        }).catch( (err) => {
            callBack(err);
        });
    }
}

module.exports = new DB();