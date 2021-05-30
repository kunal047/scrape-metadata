const expect = require("chai").expect;
const request = require("request");

const query = require("../query");
const helper = require("../helper");

describe("Scrape meta-data from url", function () {
    const url =
        "https://www.amazon.com/Dove-Body-Wash-Pump-Moisture/dp/B00MEDOY2G";

    const wrongUrl =
        "https://www.amazon.com/Dove-Body-Wash-Pump-Moisture/dp/B00";

    describe("Fetch meta data", function () {
        let html = "";
        it("should return html of the url", async () => {
            const response = await helper.fetchHTML(url);
            html = response;
            expect(response).to.be.a("string");
        });
        it("should fetch meta data from the html", async () => {
            const response = await helper.fetchMetaData(html);
            expect(response).to.have.property("title");
            expect(response).to.have.property("description");
            expect(response).to.have.property("images");
        });
    });

    describe("Fetch data from db", function () {
        it("should get meta data of url", async () => {
            const response = await query.getURLData(url);
            expect(response).to.have.property("Item");
            expect(response).to.have.deep.nested.property("Item.url");
            expect(response).to.have.deep.nested.property("Item.meta_data");
            expect(response).to.have.deep.nested.property(
                "Item.meta_data.title"
            );
            expect(response).to.have.deep.nested.property(
                "Item.meta_data.description"
            );
            expect(response).to.have.deep.nested.property(
                "Item.meta_data.images"
            );
        });

        it("should return empty object", async () => {
            const response = await query.getURLData(wrongUrl);
            expect(response).to.be.deep.equal({});
        });
    });
});
