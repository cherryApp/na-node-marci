/**
 * A NodeJS alapvető működésének gyakorlása.
 */

/**
 * A szükséges függőségek beolvasása.
 */
const http = require('http');

/**
 * Bejelentkező űrlap.
 */
const loginContent = `
<!DOCTYPE html>
<html>
    <head>
        <title>Oldal</title>
    </head>
    <body>
        <h2>Belépés</h2>
        <p>kérem adja meg az adatokat a belépéshez</p>
        <form method="post">
            <label>Email</label>
            <br>
            <input type="email" name="email">
            <br><br>
            <label>Jelszó</label>
            <br>
            <input type="password" name="password">
            <br><br>
            <button>belépés</button>
        </form>
    </body>
</html>
`;

/**
 * HTTP kérések feldolgozása és a megfelelő válasz küldése a kliens számára.
 */
class HTTPResponse {
    /**
     * Beállítja az elfogadott url-ek listáját.
     * @param {Request} req a kérés adatai.
     * @param {Response} res a válaszadó objektum.
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
     * Az url alapján eldönti, hogy milyen választ küldjön a kliensnek.
     */
    sendResponse() {
        let page = this.routes[this.req.url],
            content = '';

        switch(page) {
            case 'index': 
                content = 'Hellóka, a főoldalon vagy.';
                break;
            case 'login':
                content = loginContent;
                break;
            case 'logout': 
                content = 'Kilépés...';
                break;
            default: 
                return this.send404();
        }

        this.res.writeHead(200, {
            'Content-Length': Buffer.byteLength(content),
            'Content-Type': 'text/html'
        });
        this.res.end(content);
    }

    /**
     * 404 hibaüzenet küldése.
     */
    send404() {
        let body = `Az oldal nem található!`;
        this.res.writeHead(404, {
            'Content-Length': Buffer.byteLength(body),
            'Content-Tpye': 'text/plain'
        });

        this.res.end(body);
    }
}

/**
 * Server osztály a kérések és válaszok feldolgozására.
 */
class Server {
    /**
     * A konstruktor akkor fut le, amikor létrehozunk egy új szerver példányt.
     * Most nincs argumentuma, de át is adhatnánk neki adatokat.
     * 1. Beállítja a portot, ahol fut majd a NodeJS szerver.
     * 2. Beállítja a maximum újrapróbálkozások számát, foglalt port esetén.
     * 3. Beállítja a kezdeti értékét az újrapróbálkozásoknak.
     * 4. Beállítja az újrapróbálkozások között eltelt időt.
     * 5. Létrehozza a szervert.
     * 6. Beállítja a hibakezelést.
     * 7. Elindítja a port figyelését.
     */
    constructor() {
        this.port = 3210;
        this.maxRetry = 7;
        this.retryNum = 0;
        this.retryInterval = 1500;

        this.instance = http.createServer( (req, res) => {
            this.response(req, res);
        });

        this.handleError();

        this.startListening();
    }

    /**
     * Post figyelésének megkezdése.
     */
    startListening() {
        this.instance.listen(this.port, () => {
            console.log(`My server listen in port: ${this.port}.`);
        });
    }

    /**
     * Összeállítja a válaszokat a http kérésekhez.
     * @param {Request} req a kérést tartalmazza.
     * @param {Response} res a válaszadáshoz szükséges objektum.
     */
    response(req, res) {
        console.log(`${req.method}  ${req.url}  ${new Date()}, ${req.cookie}`);
        new HTTPResponse(req, res);
    }

    /**
     * Hibák kezelése.
     * Ha a port foglalt, akkor újrapróbálkozik a megodott intervallumonként.
     */
    handleError() {
        this.instance.on('error', (e) => {
            if (e.code === 'EADDRINUSE') {
                this.retryNum++;
                if (this.maxRetry >= this.retryNum) {
                    let to = setTimeout( () => {
                        clearInterval(to);
                        console.error(`A ${this.port} port használatban van! 
                            Újrapróbálkozás ${(this.retryInterval/1000)}s múlva.`);
                        this.instance.close();
                        this.startListening();
                    }, this.retryInterval);
                }
            }
        });
    }
}

new Server();
