const fs = require('fs'),
      path = require('path'),
      config = require('./config');

class Fsm {
    /**
     * Fájlok olvasása Promise segítségével.
     * @param {String} filePath a fájl elérési útja.
     */
    readPromise(filePath) {
        return new Promise( (resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, content) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(content);
                }
            });
        });
    }

    /**
     * Fájlok írása Promise segítségével.
     * @param {String} filePath a fájl elérési útja.
     * @param {String} content a fájl tartalma.
     * @param {Boolean} append hozzáfűzés.
     */
    writePromise(filePath, content, append = false) {
        console.log(content);
        return new Promise( (resolve, reject) => {
            fs.writeFile(
                filePath,
                content,
                {
                    encoding: 'utf8',
                    flag: append ? 'a' : 'w'
                }, 
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }
};

module.exports = new Fsm();