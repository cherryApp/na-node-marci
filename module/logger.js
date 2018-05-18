/**
 * Betöltjük a szükséges modulokat.
 */
const fs = require('fs'),
      path = require('path'),
      config = require('./config'),
      Fsm = require('./fsm');

/**
 * A Logger osztály fájlokba logolja a megadott információt.
 */
class Logger {
    /**
     * Beállítjuk a logok könyvtárának az elérési útját.
     */
    constructor() {
        
    }

    log(message) {
        Fsm.writePromise(
            path.join(config.logDirectory, 'log.log'),
            `${new Date()} ${message}\n`,
            true
        ).catch( (err) => {
            console.error(err);
        });
    }
}

module.exports = new Logger();
