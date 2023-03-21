import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import * as dotenv from 'dotenv';
import { Controller } from './controller.mjs';

if (process.env.NODE_ENV !== "production") {
    console.log("--> Starting Test environment")
    dotenv.config();
}


class AppTLV {

    // port;
    // app;
    // config;
    // controller;

    constructor() {
        this.port = process.env.TLV_FLIGHTS_PORT;
        this.app = express();
    }

    async readConfigFile() {
        console.log("--> readConfigFile - start")

        try {
            const configFile = await fs.readFile('config.json', 'utf8');
            this.config = JSON.parse(configFile);

            console.log("--> readConfigFile - end")
            return;
        } catch (error) {
            console.log('--> Error')
            console.log(error);
            console.log("Can't read config file ");
        }
    }

    async initController() {
        this.controller = new Controller(this.config);
    }


    initMiddlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use((req, res, next) => {
            console.log("--> New Request")
            next();
        })

    }

    initRoutes() {
        this.app.get('/api/flights', async (req, res, next) => await this.controller.getTotalFlights(req, res, next));

        this.app.get('/api/flights/inbound', async (req, res, next) => await this.controller.getInboundFlights(req, res, next));

        this.app.get('/api/flights/outbound', async (req, res, next) => await this.controller.getOutboundFlights(req, res, next));

        this.app.get('/api/flights/delayed', async (req, res, next) => await this.controller.getDelayedFlights(req, res, next));

        this.app.get('/api/flights/popular', async (req, res, next) => await this.controller.getMostPopularDest(req, res, next));

        this.app.get('/api/flights/getaway', async (req, res, next) => await this.controller.findGetaway(req, res, next));

        this.app.use('*', async (req, res, next) => await this.controller.notFound(req, res, next));

    }

    initErrorHandler() {
        this.app.use(async (err, req, res, next) => await this.controller.errorHandler(err, req, res, next));
    }


    async start() {
        console.log("--> Starting App")
        await this.readConfigFile();
        this.initController();
        this.initMiddlewares();
        this.initRoutes();
        this.initErrorHandler();
        this.app.listen(Number(this.port), () => {
            console.log(`TLV flights app listening on port ${process.env.TLV_FLIGHTS_PORT}`)
        })
    }

}


const appInstance = new AppTLV();
await appInstance.start();



























