const AWS = require("aws-sdk");
const URLS_TABLE = process.env.URLS_TABLE || 'urls-table-prod';
const dynamoDbClient = new AWS.DynamoDB.DocumentClient({
    region: "ap-south-1",
});

const getURLData = async (url) => {
    const params = {
        TableName: URLS_TABLE,
        Key: {
            url,
        },
    };
    const data = await dynamoDbClient.get(params).promise();
    return data;
};

const saveURLData = async (url, meta_data) => {
    const params = {
        TableName: URLS_TABLE,
        Item: {
            url,
            meta_data,
        },
    };
    try {
        await dynamoDbClient.put(params).promise();
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getURLData,
    saveURLData,
};
