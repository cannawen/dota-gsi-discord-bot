/* eslint-disable jest/no-done-callback */
/* eslint-disable jest/expect-expect */
const request = require("supertest");
import sut from "../server";

describe("server", () => {
    test("instructions", (done) => {
        request(sut)
            .get("/instructions")
            .expect("Content-Type", /html/)
            .expect(200, done);
    });
});
