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

describe("challenge 4, api/articles/:articleid/", () => {
  test("does the dynamic endpoint send back the correct article based on id", () => {
    //I checked the valid article Ids in PSQL
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          article_id: expect.any(Number),
          article_img_url: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          title: expect.any(String),
          topic: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });

  test("if unknown id is selected, will throw an error 404 No article found with this Id", () => {
    const fakeId = 5023;

    return request(app)
      .get(`/api/articles/${fakeId}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found with that ID");
      });
  });

  test.only("if a completely invalid ID is passed will throw a different error 400 Invalid request", () => {
    const fakeId = "admin";
    return request(app)
      .get(`/api/articles/${fakeId}`)
      .expect(400)
      .then(({ body }) => {
        console.log(body, "<==== Invalid request message");

        expect(body.msg).toBe("Invalid request");
      });
  });
});
