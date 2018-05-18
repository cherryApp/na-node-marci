/**
 * A NodeJS alapvető működésének gyakorlása.
 */

/**
 * A szükséges függőségek beolvasása.
 */
const http = require('http'),
      HTTPResponse = require('./httpResponse'),
      config = require('./config');

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

        this.port = this.argObject.port || config.defaultServerPort;
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

new Server();