/**
 * Modulok betöltése.
 */
const fs = require('fs'),
      path = require('path'),
      config = require('./config'),
      Fsm = require('./fsm');

/**
 * Kiszolgálja a sablonokat.
 */
module.exports = class Template {
    constructor() {
        this.layoutPath = path.join(config.htmlDirectory, 'layout.html');
    }

    /**
     * 
     * @param {String} filePath a kért sablonfájl neve.
     * @param {Function} callBack Ennek adjuk át a tartalmat.
     */
    getContent(filePath, callBack) {
        filePath = path.join(config.htmlDirectory, filePath);
        let p1 = Fsm.readPromise(filePath);
        let p2 = Fsm.readPromise(this.layoutPath);
        Promise.all([p1, p2])
            .then((contents) => {
                let content = contents[1].replace(/\#\{content\}/, contents[0]);
                callBack(null, content);
            })
            .catch( (err1) => {
                console.error(err1);
                callBack(err1);
            });
    }
}
