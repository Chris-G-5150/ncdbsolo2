const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const app = require("../db/app.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data/index.js");
beforeAll(() => seed(data));
afterAll(() => db.end());

describe("Challenge 2 /api/topics tests", () => {
  test("GET api/topics should return an array of JSON objects with the keys of slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.topics)).toBe(true);
        expect(body.topics).toHaveLength(3);
        expect(body.topics).toEqual([
          {
            description: "The man, the Mitch, the legend",
            slug: "mitch",
          },
          {
            description: "Not dogs",
            slug: "cats",
          },
          {
            description: "what books are made of",
            slug: "paper",
          },
        ]);
      });
  });
});
