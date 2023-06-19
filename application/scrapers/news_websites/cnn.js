const cheerio = require("cheerio")
const logger = require("../../../middleware/logger")
const Article = require("../../../entities/articles")
const performScraping = require("./utils.js")


async function scrapeCnn() {

    const webPage = "https://edition.cnn.com"

    performScraping(webPage).then((axiosData, divs) => {
        logger.debug("Checking the Data here")
        const $ = cheerio.load(axiosData.data);
        const divsWithAttribute = $('a[data-link-type="article"]');
        divsWithAttribute.each((i, div) => {
            let temp = $(div).text().toLowerCase().replace(/\n/g, '').trim();
            let tempRes = ['police', 'violence', 'future'].some(x => temp.includes(x))
            if (tempRes) {
                let link = $(div).attr('href')
                performScraping(webPage + link).then((axiosData, divs) => {
                    let $$ = cheerio.load(axiosData.data);
                    let title = $$('h1[data-editable="headlineText"]').text().toLowerCase().replace(/\n/g, '').trim();
                    let authors = $$('div[class="byline__names"]').text().toLowerCase().replace(/\n/g, '').trim();
                    let publicationDate = $$('div[class="timestamp"]').text().toLowerCase().replace(/\n/g, '').trim();
                    let articleContent = $$('div[class="article__content"]').text().toLowerCase().replace(/\n/g, '').trim();
                    let articleObject = new Article(
                        'CNN',
                        `${webPage}${link}`,
                        title,
                        authors,
                        publicationDate,
                        articleContent,
                        new Date().toISOString()
                    )


                    logger.info(`The object to save is: ${JSON.stringify(articleObject)}`);
                })
            }
        });
        logger.info(`End of the script`);
    }
    )
}

module.exports = scrapeCnn; 