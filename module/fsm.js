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
        this.readFile = util.promisify(fs.readFile);
        this.writeFile = util.promisify(fs.writeFile);
    }
}

module.exports = new Fsm();