/**
 * Függőségek betöltése.
 */
const { Jwt } = require('@coolgk/jwt'),
      Cookies = require('cookies');

/**
 * Bejelentkezéseket kezelő osztály.
 * A jwt technológiát használja az azonosításra.
 */
class Auth {
    /**
     * Beállítjuk a lejárati időt és a titkosításhoz használt kulcsot.
     */
    constructor() {
        this.cookieName = 'login';
        this.expire = 60 * 60 * 1000; // 60 * 60 * 1000ms = 1hour
        this.jwt = new Jwt({secret: 'myAwesomeWebAppForMarci'});
    }

    /**
     * Készít egy titkosított tokent a felhasználó számára.
     * @param {String} info a titkosítandó objektum.
     * @returns jwt token.
     */
    getToken(info) {
        return this.jwt.generate(info, this.expire);
    }

    setCookie(req, res, info) {
        let cookies = new Cookies(req, res);
        cookies.set(this.cookieName, this.getToken(info));        
        return res;
    }

    /**
     * Ellenőrzi a bejelentkezés érvényességét.
     * @param {Request} req a http kérés.
     * @returns {Boolean} true ha érvényes a token, false ha nem.
     */
    isAuthenticated(req, res) {
        let cookies = new Cookies(req, res);
        let cookie = cookies.get(this.cookieName); 
        let verified = this.jwt.verify(cookie);
        
        return verified === false ? false : true;        
    }
}

module.exports = new Auth();
