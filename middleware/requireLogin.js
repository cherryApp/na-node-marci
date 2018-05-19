/**
 * Védjük az url-eket a jogosultalan megnyitás ellen.
 */
module.exports = (req, res, next) => {
    if (!res.locals.authenticated) {
        res.redirect('/');
    } else {
        next();
    }
};