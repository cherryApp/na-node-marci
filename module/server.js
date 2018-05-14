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
     * A konstruktor akkor fut le, amikor egy új Server példányt hozunk létre.
     * Most nincs argumentuma, de adhatunk át neki változókat ha szükséges.
     * Feladatai: 
     * 1. Beállítja a portot, ahol fut majd a NodeJS szerver.
     * 2. Beállítja a maximum újrapróbálkozások számát hiba estére.
     * 3. Beállítja a kezdeti értékét az újrapróbálkozásoknak.
     * 4. Beállítja az újrapróbálkozások között eltelt időt.
     * 5. Létrehoz egy új szervert a http.createServer segítségével.
     * 6. A szervert beállítja, hogy figyelje a megadott portot.
     */
    constructor() {
        this.port = 3210;
        this.maxRetry = 10;
        this.retryNum = 0;
        this.retryInterval = 3000;

        this.instance = http.createServer( (req, res) => {
            this.response(req, res);
        });

        this.handleError();
        this.startListening();        
    }

    /**
     * Összeállítja a válaszokat a http kérések számára.
     * @param {Request} req a kérést tartalmazza. 
     * @param {Response} res a válaszadáshoz szükséges objektum.
     */
    response(req, res) {
        let body = `<h1>Hello Marci!</h1>
            <p>A port a kovetkező: ${this.port}</p>.
        `;
        res.writeHead(201, {
            'Content-Length': Buffer.byteLength(body),
            'Content-Type': 'text/html' }
        );
        
        res.end(body);
    }

    /**
     * Megkezdi az adott port figyelését.
     */
    startListening() {
        this.instance.listen(this.port, () => {
            console.log(`Server running in port: ${this.port}`);
        });
    }

    /**
     * Hibák kezelése.
     * Ha a port foglalt, akkor újrapróbálkozik 1s múlva.
     */
    handleError() {
        this.instance.on('error', (e) => {
            if (e.code === 'EADDRINUSE') {
                this.retryNum++;
                if (this.retryNum >= this.maxRetry) {
                    return;
                }

                console.log('A port használatban van, újrapróbálkozás...');

                let to = setTimeout(() => {
                    clearTimeout(to);
                    this.instance.close();
                    this.startListening();
                }, this.retryInterval);
            }
        });
    }
}

new Server();
