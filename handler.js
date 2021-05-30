const express = require("express");
const serverless = require("serverless-http");

const { fetchHTML, fetchMetaData } = require("./helper");
const { getURLData, saveURLData } = require('./query');

const app = express();

app.use(express.json());

app.post("/url", async function (req, res) {
    const { url } = req.body;
    if (typeof url !== "string") {
        res.status(400).json({ error: '"url" must be a string' });
    }

    // check if meta data exists for the url in the db
    const data = await getURLData(url);
    if (!data.Item) {
        // fetching meta data
        const html = await fetchHTML(url);
        const meta_data = await fetchMetaData(html);
        await saveURLData(url, meta_data);
        return res.json({ ...meta_data });
    }
    return res.json({ ...data.Item.meta_data });
});

app.use((req, res, next) => {
    return res.status(404).json({
        error: "Not Found",
    });
});

module.exports.handler = serverless(app);
