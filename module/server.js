/**
 * A NodeJS alapvető működésének gyakorlása.
 */

/**
 * A szükséges függőségek beolvasása.
 */
const http = require('http'),
    zlib = require('zlib'),
    Readable = require('stream').Readable;

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
            content = '',
            encoded = {};

        switch (page) {
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

        this.compress(content);
    }

    /**
     * Küldés előtt tömörítjük az adatokat.
     * 1. Megyvizsgáljuk, hogy fogad-e tömörített állományt a kliens.
     * 2. Ha fogad, akkor az adott eljárással tömörítjük a választ.
     * @param {String} content a tartalom.
     */
    compress(content) {
        let acceptEncoding = this.req.headers['accept-encoding'],
            type = null,
            contentStream = new Readable();
        
        contentStream._read = function noop() {};
        contentStream.push(content);
        contentStream.push(null);

        if (!acceptEncoding) {
            acceptEncoding = '';
        }

        if (/\bdeflate\b/.test(acceptEncoding)) {
            this.res.writeHead(200, { 'Content-Encoding': 'deflate' });
            contentStream.pipe(zlib.createDeflate()).pipe(this.res);
        } else if (/\bgzip\b/.test(acceptEncoding)) {
            this.res.writeHead(200, { 'Content-Encoding': 'gzip' });
            contentStream.pipe(zlib.createGzip()).pipe(this.res);
        } else {
            res.writeHead(200, {});
            contentStream.pipe(this.res);
        }
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
        /*console.log(process.argv.join('#').match(/\#port\=([^\#]*)/)[1]);
        process.on('exit', (code) => {
            console.log(`A processz leállt a ${code} kóddal.`); 
        });
        setTimeout( () => {
            process.exit(3);
        }, 1000);*/

        this.processArgs();

        this.port = this.argObject.port || 3210;
        this.maxRetry = 7;
        this.retryNum = 0;
        this.retryInterval = 1500;

        this.instance = http.createServer((req, res) => {
            this.response(req, res);
        });

        this.handleError();

        this.startListening();
    }

    /**
     * Feldolgozza a processz argumentumait.
     */
    processArgs() {
        this.args = [];
        this.argObject = {};
        let pair = [];

        process.argv.forEach((val, index) => {
            if (val.includes('=')) {
                pair = val.split('=');
                this.argObject[pair[0]] = pair[1];
            } else {
                this.args[index] = val;
            }
        });
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
                    let to = setTimeout(() => {
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
// csáó bell
new Server();