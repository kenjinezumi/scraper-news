class Article {
    constructor(source, url, title, authors, publicationDate,
        articleContent, timestamp) {
        this.source = source;
        this.url = url;
        this.title = title;
        this.authors = authors;
        this.publicationDate = publicationDate;
        this.articleContent = articleContent;
        this.timestamp = timestamp;
        this.mapArticle = new Map(); 
    }
}


module.exports = Article;
