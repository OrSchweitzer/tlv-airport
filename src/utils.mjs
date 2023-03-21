import fetch from 'node-fetch';

export async function makeCustomRequest(url, options = null) {

    try {
        console.log("--> makeCustomRequest - start");

        console.log(`--> calling ${url}`);

        let response;
        if (!options) {
            response = await fetch(url);
        }
        else {
            response = await fetch(url, options);
        }

        if (!response.ok) {
            console.log(`--> request return an error`);
            throw new Error(`unexpected response ${response.statusText}`);
        }

        const result = await response.json();
        console.log("--> makeCustomRequest - end");

        return result;
    } catch (error) {
        console.log("--> makeCustomRequest - error")
        throw error;
    }

}

export async function makeCkanRequest(url, options = null) {
    try {
        console.log("--> makeCkanRequest - start");
        const jsonRes = await makeCustomRequest(url, options);
        if (!(jsonRes && jsonRes.success)) {
            throw new Error(jsonRes.error && jsonRes.error.message)
        }

        console.log("--> makeCkanRequest - end");
        return (jsonRes.result && jsonRes.result.records);

    } catch (err) {
        console.log("makeCkanRequest - error")
        throw err;
    }

}
