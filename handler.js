const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");

const { fetchHTML, fetchMetaData } = require("./helper");

const app = express();

const URLS_TABLE = process.env.URLS_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient({
    region: "ap-south-1",
});

app.use(express.json());

app.post("/url", async function (req, res) {
    const { url } = req.body;
    if (typeof url !== "string") {
        res.status(400).json({ error: '"url" must be a string' });
    }

    // check if meta data exists for the url in the db
    const params = {
        TableName: URLS_TABLE,
        Key: {
            url,
        },
    };
    const data = await dynamoDbClient.get(params).promise();
    if (!data.Item) {
        // fetching meta data
        const html = await fetchHTML(url);
        const meta_data = await fetchMetaData(html);
        return res.json({ ...meta_data });
    }
    return res.json({ 'msg' : 'url found' });


    // const params = {
    //   TableName: URLS_TABLE,
    //   Item: {
    //     url,
    //   },
    // };

    // try {
    //   await dynamoDbClient.put(params).promise();
    //   res.json({ url });
    // } catch (error) {
    //   console.log(error);
    //   res.status(500).json({ error: "Could not create meta data for url" });
    // }
});

app.use((req, res, next) => {
    return res.status(404).json({
        error: "Not Found",
    });
});

module.exports.handler = serverless(app);
