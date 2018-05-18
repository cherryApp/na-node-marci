/**
 * Middleware a kérések node_modules mappára irányítására.
 */
const path = require('path');
const fs = require('fs');
const typeRegexp = /\/mod(\/.*(json|js|css|map|img|png|gif|ttf|eot|svg|woff|woff2|otf))/;

/**
 * Megvizsgáljuk az elérési utat, és szükség estén a node_modules mappából 
 * szolgáluk ki a fájlt.
 * @param {Request} req a http kérés.
 * @param {Response} res a http válasz.
 * @param {Function} next a függvény, ami továbbadja a kérést.
 */
const moduleResolver = (req, res, next) => {
    let filePath = '';
    if (typeRegexp.test(req.url)) {
        filePath = path.join(
            __dirname,
            '../node_modules',
            req.url.match(typeRegexp)[1]
        );
        res.sendFile(filePath);
    } else {
        next();
    }
};

module.exports = moduleResolver;
