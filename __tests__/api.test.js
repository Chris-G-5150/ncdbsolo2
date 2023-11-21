const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const app = require("../db/app.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data/index.js");
const endPointsJSON = require("../endpoints.json")
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

        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });

  test("Get api/klsnkdfnilfvn should return 404 status", () => {
    return request(app)
      .get("/api/klsnkdfnilfvn")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Endpoint not found");
      });
  });

});

describe("challenge 3 get/api/info endpoints", () => {
  test("does /api return json object with info attached?", () => {
    return request(app)
    .get('/api/')
    .expect(200)
    .then(({body}) => {
      console.log(body)
      expect(body).toEqual({endPointsJSON})
    })
  })


})
