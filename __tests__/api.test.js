const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const app = require("../db/app.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data/index.js");
const endPointsJSON = require("../endpoints.json");
require("jest-sorted")


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
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endPointsJSON).toEqual(endPointsJSON);
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
        expect(body).toEqual({
          article_id: 2,
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          created_at: "2020-10-16T05:03:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
});

test("if unknown id is selected, returns error message and status 404 for valid but non-existent article-id", () => {
  return request(app)
    .get(`/api/articles/5023`)
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("No article found with that ID");
    });
});

test("if a completely invalid ID is passed will throw a different error 400 Invalid request", () => {
  const fakeId = "admin";
  return request(app)
    .get(`/api/articles/${fakeId}`)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid request");
    });
});

describe("challenge 5, get/api/articles", () => {
  test(`does the article list length match the amount of articles in the database`, () => {
    return request(app)
      .get(`/api/articles`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articleList.length).toEqual(13);
      });
  });

  test(`does the returning array of objects have matching keys author
  title
  article_id
  topic
  created_at
  votes
  article_img_url
  comment_count, which is the total count of all the comments with this article_id.`, () => {
    return request(app)
      .get(`/api/articles`)
      .expect(200)
      .then(({ body }) => {
        body.articleList.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });

  test(`is the returning array of objects in descending order`, () => {
    return request(app)
      .get(`/api/articles`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articleList).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });

  test(`does the returning array objects contain the body property which should be omitted`, () => {
    return request(app)
    .get(`/api/articles`)
    .expect(200)
    .then(({body}) => {
      body.articleList.forEach((article) => {
        expect(article).not.toHaveProperty('body');
      });
    });


  })
});

describe("challenge 6", () => {
  test(`does the endpoint /api/:articleid/comments send back an array of comment objects with selected article id with correct keys?`, () => {
    return request(app)
      .get(`/api/1/comments`)
      .expect(200)
      .then(({body}) => {
        body.commentsOnArticles.forEach((article) => {
        expect(article).toMatchObject({
          comment_id: expect.any(Number),
          body: expect.any(String),
          article_id: expect.any(Number),
          author: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String)
        })
      })
    })
  })

  test("Does the article id in the endpoint match the one in the returning array of objects?", () => {
    return request(app)
      .get(`/api/1/comments`)
      .expect(200)
      .then(({body}) => {
        body.commentsOnArticles.forEach((article) => {
        expect(article.article_id).toEqual(1)
      })
    })
  })

  test("given an invalid article id is a 400 error returned?", () => {
    return request(app)
      .get(`/api/haberdashery/comments`)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Invalid request")
    })
  })

  test("are the comments brought back in date descending order?", () => {
    return request(app)
    .get(`/api/1/comments`)
    .expect(200)
    .then(({body}) => {
      expect(body.commentsOnArticles).toBeSortedBy("created_at", {
        descending: true,
      });
    });
  })
})




