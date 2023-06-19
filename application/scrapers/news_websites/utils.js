const cheerio = require("cheerio")
const axios = require("axios")
const logger = require("../../../middleware/logger")


async function performScraping(webPage){

    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
    }

    logger.info(`Starting scraping for ${webPage}`);

    const axiosData = await axios.request( {
        method: "GET", 
        url: webPage,
        headers: headers
    }) 
    return axiosData; 
}

module.exports = performScraping; 