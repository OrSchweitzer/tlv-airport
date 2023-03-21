import { Service } from "./service.mjs";
export class Controller {

    //service;

    constructor(config) {
        this.service = new Service(config);
    }

    async getTotalFlights(req, res, next) {
        try {
            const { country = null } = req.body;

            const totalFlights = await this.service.getFlights(country);
            res.json({ totalFlights });
        } catch (err) {
            next(err);
        }
    }

    async getInboundFlights(req, res, next) {
        try {
            const { country = null } = req.body;

            const totalFlights = await this.service.getInboundFlights(country);
            res.json({ totalFlights });
        } catch (err) {
            next(err);
        }
    }

    async getOutboundFlights(req, res, next) {
        try {
            const { country = null } = req.body;

            const totalFlights = await this.service.getOutboundFlights(country);
            res.json({ totalFlights });
        } catch (err) {
            next(err);
        }
    }

    async getDelayedFlights(req, res, next) {
        try {
            const totalFlights = await this.service.getDelayedFlights();
            res.json({ totalFlights });
        } catch (err) {
            next(err);
        }
    }

    async getMostPopularDest(req, res, next) {
        try {
            const city = await this.service.getMostPopularDest();
            res.json({ city });
        } catch (err) {
            next(err);
        }
    }

    async findGetaway(req, res, next) {
        try {
            const result = await this.service.findGetaway();
            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    async notFound(req, res) {
        res.status(404).json({
            message: 'Page not found!'
        })
    }

    async errorHandler(err, req, res, next) {
        console.log("errorHandler - start")
        res.status(500).json(
            {
                message: "Something went wrong",
                error: err.message
            }
        )
    }




}