const cheerio = require("cheerio")
const logger = require("../../../middleware/logger")
const Article = require("../../../entities/articles")
const performScraping = require("./utils.js")


async function scrapeAssociatedPress() {

    const webPage = "https://apnews.com"

    performScraping(webPage).then((axiosData, divs) => {
        logger.debug("Checking the Data here")
        const $ = cheerio.load(axiosData.data);
        const divsWithAttribute = $('a[class="wireStoryContainer-0-2-254 noImage-0-2-255 hubPeekStory-2"]');
        divsWithAttribute.each((i, div) => {
            let temp = $(div).text().toLowerCase().replace(/\n/g, '').trim();
            logger.info(temp)
            let tempRes = ['police', 'violence', 'future'].some(x => temp.includes(x))
            if (tempRes) {
                let link = $(div).attr('href')
                performScraping(webPage + link).then((axiosData, divs) => {
                    let $$ = cheerio.load(axiosData.data);
                    let title = $$('div[data-key="card-headline"]').text().toLowerCase().replace(/\n/g, '').trim();
                    let authors = $$('span[class="Component-signature-0-2-94 null"]').text().toLowerCase().replace(/\n/g, '').trim();
                    let publicationDate = $$('span[data-key="timestamp"]').attr('title').text().toLowerCase().replace(/\n/g, '').trim();
                    let articleContent = $$('div[class="Content WireStory fluid-wrapper with-lead"]').text().toLowerCase().replace(/\n/g, '').trim();
                    let articleObject = new Article(
                        'Associated Press',
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

module.exports = scrapeAssociatedPress; 