/**
 * A NodeJS alapvető működésének gyakorlása.
 */

/**
 * A szükséges függőségek beolvasása.
 */
const http = require('http');

/**
 * HTTP kérések feldolgozása és a megfelelő válasz visszaküldése.
 */
class HTTPResponse {
    /**
     * A megfelelő url esetén a megfelelő választ küldi vissza.
     * A kapott paramétereket példányváltozókban tárolja.
     * Beállítja az elfogadott url-ek listáját.
     * @param {Request} req a http kérés.
     * @param {Response} res a http válasz objektum.
     */
    constructor(req, res) {
        this.req = req;
        this.res = res;

        this.routes = {
            '/': 'index',
            '/login': 'login',
            '/logout': 'logout'
        };

        this.sendResponse();
    }

    /**
     * Az url alapján eldönti, hogy milyen forrást küldjön vissza a kliensnek.
     * Ha olyan url-t kap, ami nincs beállítva a listában, akkor 404 hibát dob.
     * Ha benne van a routing listában az url, akkor az annak megfelelő 
     * tartalmat küldi vissza.
     */
    sendResponse() {
        let page = this.routes[this.req.url],
            content = '';
        
        switch(page) {
            case 'index': 
                content = 'Hello az oldalon.';
                break;
            case 'login': 
                content = 'Belépés: ';
                break;
            case 'logout': 
                content = 'Kilépés: ';
                break;
            default: 
                return this.send404();
        }

        this.res.writeHead(200, {
            'Content-Length': Buffer.byteLength(content),
            'Content-Type': 'text/html' }
        );
        
        this.res.end(content);
    }

    /**
     * 404 hiba küldése.
     */
    send404() {
        let body = `Az oldal nem található!`;
        this.res.writeHead(404, {
            'Content-Length': Buffer.byteLength(body),
            'Content-Type': 'text/plain' }
        );
        
        this.res.end(body);
    }
}

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
        new HTTPResponse(req, res);
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
