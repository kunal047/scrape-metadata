const URL = require('url');
const http = require("http");
const https = require("https");
const gunzip = require("zlib").createGunzip();

const cheerio = require("cheerio");

const fetchMetaData = async (html) => {
    const $ = cheerio.load(html);
    const title =
        $('meta[property="og:title"]').attr("content") ||
        $("title").text() ||
        $('meta[name="title"]').attr("content");
    const description =
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content");
    const url = $('meta[property="og:url"]').attr("content");
    const site_name = $('meta[property="og:site_name"]').attr("content");
    let images =
        $('meta[property="og:image"]').attr("content") ||
        $('meta[property="og:image:url"]').attr("content") ||
        $("#landingImage").attr("src");
    const keywords =
        $('meta[property="og:keywords"]').attr("content") ||
        $('meta[name="keywords"]').attr("content");
    if (typeof images === "string") {
        images = [images];
    }
    return {
        title,
        description,
        url,
        site_name,
        images,
        keywords,
    };
};

const fetchHTML = async (url) => {
    return new Promise((resolve, reject) => {
        let client = http;
        if (url.toString().indexOf("https") === 0) {
            client = https;
        }
        const { hostname, path } = URL.parse(url);
        const options = {
            hostname,
            path,
            headers: {
                "accept-encoding": "gzip,deflate",
            },
        };
        client
            .get(options, (res) => {
                res.pipe(gunzip);
                let body = "";
                gunzip.on("data", (chunk) => (body += chunk));
                gunzip.on("end", () => resolve(body));
            })
            .on("error", reject);
    });
};

module.exports = {
    fetchHTML,
    fetchMetaData,
};
