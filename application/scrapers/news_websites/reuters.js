const cheerio = require("cheerio")
const logger = require("../../../middleware/logger")
const Article = require("../../../entities/articles")
const performScraping = require("./utils.js")


async function scrapeReuters() {

    const webPage = "https://www.reuters.com"

    performScraping(webPage).then((axiosData, divs) => {
        logger.debug("Checking the Data here")
        const $ = cheerio.load(axiosData.data);
        const divsWithAttribute = $('a[data-testid="Heading"]');
        divsWithAttribute.each((i, div) => {
            let temp = $(div).text().toLowerCase().replace(/\n/g, '').trim();
            let tempRes = ['police', 'violence', 'future'].some(x => temp.includes(x))
            if (tempRes) {
                let link = $(div).attr('href')
                performScraping(webPage + link).then((axiosData, divs) => {
                    let $$ = cheerio.load(axiosData.data);
                    let title = $$('h1[data-testid="Heading"]').text().toLowerCase().replace(/\n/g, '').trim();
                    let authors = $$('div[class="text__text__1FZLe text__dark-grey__3Ml43 text__medium__1kbOh text__small__1kGq2 article-header__author__3PcB3"]').text().toLowerCase().replace(/\n/g, '').trim();
                    let publicationDate = $$('span[class="date-line__date__23Ge-"]').text().toLowerCase().replace(/\n/g, '').trim();
                    let articleContent = $$('div[class="article-body__content__17Yit"]').text().toLowerCase().replace(/\n/g, '').trim();
                    let articleObject = new Article(
                        'Reuters',
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

module.exports = scrapeReuters; 