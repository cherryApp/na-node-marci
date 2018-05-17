/**
 * Függőségek betöltése.
 */
const fs = require('fs'),
      path = require('path'),
      config = require('./config');

/**
 * Az osztály feladata, hogy betöltse és összeállítsa a sablonokat.
 */
module.exports = class Template {
    /**
     * 
     */
    constructor() {

    }

    /**
     * Getter egy sablon lekéréséhez.
     */
    getContent(filePath, callBack) {
        filePath = path.join(config.templatePath, filePath);
        fs.readFile(filePath, 'utf8', (err, content) => {
            if (err) {
                callBack(err);
            } else {
                callBack(null, content);
            }
        });
    }
};