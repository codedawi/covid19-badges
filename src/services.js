const axios = require("axios");
const { setupCache } = require("axios-cache-adapter");

// Create `axios` instance passing the newly created `cache.adapter`
const api = axios.create({
    adapter: setupCache({
        maxAge: 15 * 60 * 1000
    }).adapter
})

const url = "https://coronavirus-tracker-api.herokuapp.com/v2/locations";

/**
 * Interface COVID-19 Cases Statistics
 * 
 * @typedef {Object} Covid19Impact
 * @property {Number} confirmed - number of confirmed cases of COVID-19.
 * @property {Number} deaths - number of confirmed deaths of COVID-19.
 * @property {Number} recovered - number of confirmed recovers of COVID-19.
 */


/**
 * Get latest cases, deaths, and recovers globally of COVID-19
 */
async function getLatestGlobally() {

    const { data } = await api.get(`${url}/v2/latest`);

    return data.latest;
}
/**
 * Get latest cases, deaths, and recovers globally of COVID-19
 * for specific country.
 * 
 * @param {String} country = Alpha-2 Country Code (https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
 * @returns {Object} 
 */
async function getLatestByCountry(country) {

    const params = {
        "country_code": country,
        "timelines": 0,
    };

    const { data } = await api.get(`${url}/v2/locations`, { params });

    const latest = data.locations.reduce(
        (total, province) => {
            return {
                confirmed: total.confirmed + province.latest.confirmed,
                deaths: total.deaths + province.latest.deaths,
                recovered: total.recovered + province.latest.recovered,
            }
        },
        { confirmed: 0, deaths: 0, recovered: 0, }
    )

    return latest;
}

module.exports = { getLatestGlobally, getLatestByCountry, }

/**
 *****************
 WORK IN PROGRESS
*****************
    async function getChangeGlobally(since) {
        // TODO: work in progress
        if (!since) since = new Date(Date.now() - 1000 * 60 * 60 * 24);

        // ignore time
        since.setHours(0,0,0,0)

        const params = {
            "timelines": 1,
        };

        const { data } = await axios.get(`${url}/v2/locations`, { params });

        const changeZero = {
            confirmed: 0,
            deaths: 0,
            recovered: 0,
        };


        const change = data.locations.reduce(
            (diff, province) => {

                let total = 0;

                Object.entries(province.timelines)
                    .forEach(([d, count]) => {
                        // 2020-01-22T00:00:00Z
                        const jsd = Date.parse(d.replace("Z", ""))
                        // ignore time
                        jsd.setHours(0, 0, 0, 0)

                        if (jsd >= since) {
                            total += count
                        }
                    });
                return diff - total;
            },
            changeZero,
        )

        return change;

    }
*/



