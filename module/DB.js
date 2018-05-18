/**
 * Modulok.
 */
const fs = require('fs'),
      path = require('path'),
      config = require('./config'),
      Fsm = require('./fsm');

/**
 * File alapú json adatbázis.
 */
module.exports = class DB {
    constructor(collection) {
        this.filePath = path.join(config.dbDirectory, collection + '.json');
    }

    getAll() {
        return Fsm.readPromise(this.filePath);
    }

    getOne(id) {
        return new Promise( (resolve, reject) => {
            Fsm.readPromise(this.filePath).then( (json) => {
                let data = JSON.parse(json);
                let row = {};
                for (let k in data) {
                    if (data[k].id == id) {
                        row = data[k];
                    }
                }
                resolve( JSON.stringify(row));
            });
        });
    }

}