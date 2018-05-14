/**
 * A NodeJS alapvető működésének gyakorlása.
 */

/**
 * A szükséges függőségek beolvasása.
 */
const http = require('http');

/**
 * ES6 OOP.
 */
class Server {
    /**
     * A konstruktor akkor fut le, amikor egy új példányt hozunk létre a Server -ből.
     * Most nincs argumentuma, de adhatunk át neki változókat ha szükséges.
     * Feladatai: 
     * 1. Beállítja a portot, ahol fut majd a NodeJS szerver.
     * 2. Létrehoz egy új szervert a http.createServer segítségével.
     * 3. A szervert beállítja, hogy figyelje a megadott portot.
     */
    constructor() {
        this.port = 3210;
        this.instance = http.createServer( (req, res) => {
            this.create(req, res);
        });
        this.startListening();        
    }

    /**
     * 
     * @param {Request} req a kérést tartalmazza. 
     * @param {Response} res a válaszadáshoz szükséges objektum.
     */
    create(req, res) {
        res.write('<h1>');
        res.write('Hello ');
        res.write('Marci!');
        res.write('</h1>');
        res.write(`<p>A port a kovetkező: ${this.port}.`);
        res.end();
    }

    /**
     * Megkezdi az adott port figyelését.
     */
    startListening() {
        this.instance.listen(this.port, (err) => {
            if (err) {
                return console.error(`Init error: ${err}`);
            }
            console.log(`Server running in port: ${this.port}`);
        });
    }
}

new Server();
