/**
 * Védjük az url-eket jogosulatlan megtekintés ellen.
 */
const Auth = require('../module/auth');

module.exports = (req, res, next) => {
    if (!Auth.isAuthenticated(req, res)) {
        res.redirect('/login?redirect='+req.url);
    } else {
        next();
    }
};