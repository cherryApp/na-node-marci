/**
 * Függőségek betöltése.
 */
const zlib = require('zlib'),
      Auth = require('./auth'),
      Readable = require('stream').Readable,
      querystring = require('querystring');

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
module.exports = class HTTPResponse {
    /**
     * Beállítja az elfogadott url-ek listáját.
     * -> Szétválasztja a kéréseket metódus szerint.
     * @param {Request} req a kérés adatai.
     * @param {Response} res a válaszadó objektum.
     */
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.testLogin = {email: 'joe@gmail.com', 'password': 'joe'};

        this.routes = {
            '/': { name: 'index', guard: true },
            '/login': { name: 'login', guard: false },
            '/logout': { name: 'logout', guard: true }
        };

        switch( this.req.method.toLowerCase() ) {
            case 'get': 
                this.sendResponse();
                break;
            case 'post': 
                this.handlePost();
                break;
            default: 
                this.send404();
        }
        
    }

    /**
     * Post kérések feldolgozása.
     */
    handlePost() {
        let postData = '';
        this.req.on('data', (chunk) => {
            postData += chunk;
        });
        this.req.on('end', () => {
            postData = querystring.parse(postData);

            if (
                this.req.url === '/login' && 
                postData.email == this.testLogin.email && 
                postData.password == this.testLogin.password
            ) {
                this.res = Auth.setCookie(
                    this.req, 
                    this.res, 
                    {id: 33, name: 'Joe', email: 'joe@gmail.com'}
                );
                this.compress('Sikeres belépés!');
            } else {
                this.send401();
            }
        });
    }

    /**
     * Az url alapján eldönti, hogy milyen választ küldjön a kliensnek.
     */
    sendResponse() {
        let page = this.routes[this.req.url],
            content = '',
            encoded = {};

        if (!page || !page.name) {
            return this.send404();
        }

        if (page.guard && !Auth.isAuthenticated(this.req, this.res)) {
            return this.send401();
        }

        switch (page.name) {
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

    /**
     * 401 hibaüzenet küldése.
     */
    send401() {
        let body = `Hozzáférés megtagadva! Kérem jelentkezzen be.`;
        this.res.writeHead(401, {
            'Content-Length': Buffer.byteLength(body),
            'Content-Tpye': 'text/plain'
        });

        this.res.end(body);
    }
}