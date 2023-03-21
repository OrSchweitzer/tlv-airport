import moment from 'moment-timezone';

export function getCountry(flight) {
    if (!flight) return null;

    return flight.CHLOCCT.toUpperCase();

}

export function isSameCountry(flight, country = null) {
    //if country is falsy return true;
    if (!country) return true;


    return (getCountry(flight) === country.toUpperCase());
}

export function isInbound(flight) {
    return !(flight.CHCINT);
}

export function isOutbound(flight) {
    return !!(flight.CHCINT)
}

export function isOnTime(flight) {
    return (flight.CHRMINE.toUpperCase() === "ON TIME");
}

//returns datetime stamp
export function getEstimatedDeparture(flight) {
    return flight.CHSTOL;
}

//returns datetime stamp
export function getRealDeparture(flight) {
    return flight.CHPTOL;
}

//returns departure time in unix
export function getRealDepartureUnix(flight) {
    const stamp = getRealDeparture(flight);
    const dtUnix = moment.tz(stamp, "Asia/Tel_Aviv").unix();

    if (Number.isNaN(dtUnix)) {
        throw new Error(`failed to parse departure date ${stamp}`)
    }

    return dtUnix;
}


export function isDelayed(flight) {
    return (Date.parse(getRealDeparture(flight)) > Date.parse(getEstimatedDeparture(flight)));
}


//returns true if f1's departure time is after 
//departure time of f2
export function isAfterOtherFlight(f1, f2) {
    return (getRealDepartureUnix(f1) > getRealDepartureUnix(f2));
}

//returns true if departure time is after a certatim time
export function isAfterDateTimeUnix(flight, unix) {
    return (getRealDepartureUnix(flight) > unix);
}


export function getFlightTitle(flight) {
    return (flight.CHOPER + "" + flight.CHFLTN)
}

export function isCanceled(flight) {
    return (flight.CHRMINE === "CANCELED");

}










