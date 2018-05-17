/**
 * Függőségek betöltése.
 */
const fs = require('fs'),
      path = require('path'),
      config = require('./config');

/**
 * Az osztály feladata a logok írása fájlba.
 */
class Logger {
    /**
     * Beállítjuk az aktuális logfile helyét.
     */
    constructor() {
        this.logFile = path.join(
            config.logPath, 
            this.sqlDate()+'.log'
        );
    }

    /**
     * SQL formátumú dátumot generálunk.
     */
    sqlDate() {
        let date = new Date(),
            parts = [
                date.getFullYear(),
                date.getMonth()+1,
                date.getDate()
            ];

        for (let k in parts) {
            if (parts[k] < 10) {
                parts[k] = '0'+parts[k];
            }
        }

        return parts.join('-');
    }

    /**
     * Logoljuk a kapott üzenetet.
     * @param {String} message a logba kerülő üzenet.
     */
    log(message) {
        fs.appendFile(
            this.logFile,
            `${new Date()}: ${message} \n`,
            'utf8',
            (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('logged');
                }
            }
        );
    }
}

module.exports = new Logger();