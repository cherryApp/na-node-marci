/**
 * Függőségek betöltése.
 */
const fs = require('fs'),
      path = require('path'),
      util = require('util');

class Fsm {
    /**
     * A konstruktorban beállítjuk az fs modult.
     * A fontosabb metódusokat a util.promisify segítségével átalakítjuk.
     */
    constructor() {
        this.fs = fs;
        this.readdir = util.promisify(fs.readdir);
        // this.readFile = util.promisify(fs.readFile);
        this.writeFile = util.promisify(fs.writeFile);
    }

    readFile(filePath, encoding) {
        return new Promise( (resolve, reject) => {
            fs.readFile(filePath, encoding, (err, content) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(content);
                }
            });
        });
    }
}

module.exports = new Fsm();