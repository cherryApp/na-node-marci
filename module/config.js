/**
 * Ez a modul tárolja az alkalmazás közös konfigurációs beállításait.
 */
const path = require('path');

module.exports = {
    templatePath: path.join(__dirname, 'files'),
    logPath: path.join(__dirname, 'files/log'),
    dbPath: path.join(__dirname, 'files/db'),
    cookieName: 'login',
    expire: 60 * 60 * 1000
};