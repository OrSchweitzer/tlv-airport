import {
    isSameCountry, isInbound, isOutbound, isCanceled,
    isDelayed, getCountry, isAfterOtherFlight, isAfterDateTimeUnix,
    getFlightTitle, getDestCity
} from './flight-utils.mjs'

import { nowUnixTimeSeconds, makeCkanRequest } from './utils.mjs'


export class Service {

    //base_url;

    constructor(config) {
        this.base_url = config.base_url;
    }

    async getFlights(country = null) {
        try {
            console.log("--> getFlights - start")
            const flightsArr = await makeCkanRequest(this.base_url);

            console.log("--> how many flights?")
            let result = flightsArr.length;
            result = flightsArr.filter(rec => isSameCountry(rec, country)).length;

            console.log(result);
            console.log("--> getFlights - end");
            return result;

        } catch (err) {
            console.log("--> getFlights - error");
            throw err;
        }
    }

    async getInboundFlights(country = null) {
        try {
            console.log("--> getInboundFlights - start")
            const flightsArr = await makeCkanRequest(this.base_url);

            console.log("--> how many flights?")
            let result = flightsArr.length;

            result = flightsArr.filter(rec => (isInbound(rec) && isSameCountry(rec, country))).length;

            console.log(result);
            console.log("--> getInboundFlights - end");
            return result;

        } catch (err) {
            console.log("--> getInboundFlights - error");
            throw err;
        }

    }

    async getOutboundFlights(country = null) {
        try {
            console.log("--> getOutboundFlights - start")
            const flightsArr = await makeCkanRequest(this.base_url);

            console.log("--> how many flights?")
            let result = flightsArr.length;

            result = flightsArr.filter(rec => (isOutbound(rec) && isSameCountry(rec, country))).length;

            console.log(result);
            console.log("--> getOutboundFlights - end");
            return result;

        } catch (err) {
            console.log("--> getOutboundFlights - error");
            throw err;
        }

    }

    async getDelayedFlights() {
        try {
            console.log("--> getDelayedFlights - start")
            const flightsArr = await makeCkanRequest(this.base_url);

            console.log("--> how many flights?")
            const result = flightsArr.filter(rec => isDelayed(rec)).length;

            console.log(result);
            console.log("--> getDelayedFlights - end");
            return result;

        } catch (err) {
            console.log("--> getDelayedFlights - error");
            throw err;
        }


    }

    async getMostPopularDest() {
        try {
            console.log("--> getMostPopularDest - start")
            const flightsArr = await makeCkanRequest(this.base_url);

            console.log("--> count for each city the number of outbound flights");
            const counters = {};
            let popularCity = "";

            flightsArr.forEach(flight => {
                if (isOutbound(flight)) {
                    //increment counter of city
                    const city = getDestCity(flight);
                    if (!(city in counters)) {
                        counters[city] = 1;
                    }
                    else {
                        counters[city]++;
                    }

                    //check if this city is most popular
                    if (!popularCity || (counters[city] > counters[popularCity])) {
                        popularCity = city;
                    }
                }
            });

            console.log("--> getMostPopularDest - end");
            console.log(`${popularCity} is the most popular with ${counters[popularCity]} flights`);

            return popularCity;

        } catch (err) {
            console.log("--> getMostPopularDest - error");
            throw err;
        }
    }

    async findGetaway() {
        try {
            console.log("--> findGetaway - start");
            const flightsArr = await makeCkanRequest(this.base_url);
            const countryMap = {};

            for (let flight of flightsArr) {
                if (isCanceled(flight) || !isAfterDateTimeUnix(flight, nowUnixTimeSeconds())) {
                    continue;
                }

                console.log("--> flight to consider")

                let key = isOutbound(flight) ? "earliestOutbound" : "latestInbound";
                let country = getCountry(flight);

                //for this given country 
                // keep this flight in map in case
                // it is either the earliest outbound or the latest inbound
                if (!countryMap[country]) {
                    countryMap[country] = {};
                    countryMap[country][key] = flight;
                }
                else if (!countryMap[country][key]) {
                    countryMap[country][key] = flight;
                }

                else {
                    //then flight of this type(inbound/oubound) already found with this country
                    if (isOutbound(flight)) {
                        //keep earliest flight
                        countryMap[country][key] = isAfterOtherFlight(flight, countryMap[country][key]) ?
                            countryMap[country][key] : flight;
                    }
                    else {
                        //inbound flight
                        // keep latest flight
                        countryMap[country][key] = isAfterOtherFlight(flight, countryMap[country][key]) ?
                            flight : countryMap[country][key];
                    }
                }

                const outboundFlight = countryMap[country]["earliestOutbound"];
                const inboundFlight = countryMap[country]["latestInbound"];

                console.log("--> checking possible combination")
                if (outboundFlight && inboundFlight) {
                    //check if the updated combination is a possible getaway 
                    console.log({ outboundFlight, inboundFlight })
                    if (isAfterOtherFlight(inboundFlight, outboundFlight)) {
                        return {
                            departure: getFlightTitle(outboundFlight),
                            arrival: getFlightTitle(inboundFlight)
                        };

                    }
                }
            }
            //we reach end of for loop in case getaway not found.
            console.log("--> findGetaway - end");
            return {};

        } catch (err) {
            console.log("--> findGetaway - error");
            throw err;
        }
    }

}

