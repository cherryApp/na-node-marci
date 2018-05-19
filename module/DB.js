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

    /**
     * Lekéri a kollekció összes dokumentumát.
     * @returns {Promise}.
     */
    getAll() {
        return Fsm.readPromise(this.filePath);
    }

    /**
     * Lekér egy dokumentumot az id alapján.
     * @param {Number} id a documentum egyedi azonosítója.
     * @returns {Promise}.
     */
    getOne(id) {
        return new Promise( (resolve, reject) => {
            Fsm.readPromise(this.filePath).then( (json) => {
                let data = JSON.parse(json);
                let row = null;
                for (let k in data) {
                    if (data[k].id == id) {
                        row = data[k];
                    }
                }
                resolve(row);
            });
        });
    }

    /**
     * Lekér egy dokumentumot az adott kulcs-érték párok alapján.
     * @param {Object} where a feltételek kulcs-érték párjai.
     * @returns {Promise}.
     */
    findOne(where) {
        console.log(where);
        return new Promise( (resolve, reject) => {
            Fsm.readPromise(this.filePath).then( (json) => {
                let data = JSON.parse(json);
                let hit = false;
                for (let k in data) {
                    for (let j in where) {
                        hit = data[k][j] == where[j];
                    }
                    if (hit) {
                        return resolve(data[k]);
                    }
                }
                resolve(null);
            });
        });
    }

}