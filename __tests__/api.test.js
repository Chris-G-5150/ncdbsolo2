const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const app = require("../db/app.js");
const db = require("../db/connection.js");
const data = require("../db/data/test-data/index.js");
const endPointsJSON = require("../endpoints.json");
require("jest-sorted");

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
            .then(({ body }) => {
                body.articleList.forEach((article) => {
                    expect(article).not.toHaveProperty("body");
                });
            });
    });
});

describe("challenge 6", () => {
    test(`does the endpoint /api/:articleid/comments send back an array of comment objects with selected article id with correct keys?`, () => {
        return request(app)
            .get(`/api/1/comments`)
            .expect(200)
            .then(({ body }) => {
                expect(body.commentsOnArticles.length).toBe(11);
                body.commentsOnArticles.forEach((article) => {
                    expect(article).toMatchObject({
                        comment_id: expect.any(Number),
                        body: expect.any(String),
                        article_id: 1,
                        author: expect.any(String),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                    });
                });
            });
    });

    test("expect an empty array to be returned when querying an article id with no comments", () => {
        return request(app)
            .get(`/api/2/comments`)
            .expect(200)
            .then(({ body }) => {
                expect(body.commentsOnArticles.length).toBe(0);
                expect(body.commentsOnArticles).toEqual([]);
            });
    });

    test("given an invalid article id is a 400 error returned?", () => {
        return request(app)
            .get(`/api/haberdashery/comments`)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid request");
            });
    });

    test("given an invalid article id is a 404 error returned?", () => {
        return request(app)
            .get(`/api/88648/comments`)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found");
            });
    });

    test("are the comments brought back in date descending order?", () => {
        return request(app)
            .get(`/api/1/comments`)
            .expect(200)
            .then(({ body }) => {
                expect(body.commentsOnArticles).toBeSortedBy("created_at", {
                    descending: true,
                });
            });
    });
});

describe("Challenge 7", () => {
    test("Does post /api/:article_id/comments send back the posted comment with correct formatting", () => {
        return request(app)
            .post(`/api/articles/1/comments`)
            .send({ body: "Article go brrr", user: "rogersop" })
            .expect(201)
            .then(({ body }) => {
                expect(body).toMatchObject({
                    comment_id: expect.any(Number),
                    body: "Article go brrr",
                    article_id: 1,
                    author: "rogersop",
                    votes: 0,
                    created_at: expect.any(String),
                });
            });
    });

    test("Does POST /api/:articleid/comments send an error when given an username that doesn't exist in the database err code 404", () => {
        return request(app)
            .post(`/api/articles/1/comments`)
            .send({
                body: "Article go brrr",
                user: "sfckjlsdjvkldjnjkhnfvklhnkjld",
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toEqual("not found");
            });
    });

    test("if an incorrect article id is selected does it send back 400 invalid request?", () => {
        return request(app)
            .post(`/api/articles/ufhjkdhbdjkg/comments`)
            .send({ body: "Article go brrr", user: "rogersop" })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid request");
            });
    });

    test("if a article id is selected that doesn't exist does it send back 404 not found?", () => {
        return request(app)
            .post(`/api/articles/999/comments`)
            .send({ body: "Article go brrr", user: "rogersop" })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Article not found");
            });
    });
});

// For a successful PATCH, common status codes would likely be
// 200 (OK) or 204 (No Content). If the PATCH method was
// unsuccessful, status codes such as 304 (Not Modified),
// 400 (Bad Request), or 422 (Unprocessable Entity) may be seen.

describe("challenge 8", () => {
    test("After sending an uppdated votes object the votes, will respond with updated article and vote count, incrementing the vote count", () => {
        return request(app)
            .patch(`/api/articles/2`)
            .send({ inc_votes: 10 })
            .expect(200)
            .then(({ body }) => {
                expect(body).toMatchObject({
                    article_id: 2,
                    title: "Sony Vaio; or, The Laptop",
                    topic: "mitch",
                    author: "icellusedkars",
                    body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
                    created_at: expect.any(String),
                    votes: 10,
                    article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                });
            });
    });

    test(`if the inc_votes number is negative does it decrease the vote count`, () => {
        return request(app)
            .patch(`/api/articles/1`) //picked one as it has 100 votes
            .send({ inc_votes: -10 })
            .expect(200)
            .then(({ body }) => {
                expect(body).toMatchObject({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: expect.any(String),
                    votes: 90,
                    article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                });
            });
    });

    test("if an in out of range article id is sent will receive a 404 error", () => {
        return request(app)
            .patch("/api/articles/jfkbkjb")
            .send({ inc_votes: 10 })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid request");
            });
    });

    test("if an in out of range article id is sent will receive a 404 error", () => {
        return request(app)
            .patch("/api/articles/888")
            .send({ inc_votes: 10 })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("not found");
            });
    });

    test("if vote amount is passed incorrect type(string) it will return with an error 400 bad request", () => {
        return request(app)
            .patch("/api/articles/2")
            .send({ inc_votes: "10" })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            });
    });
});

describe("challenge 9", () => {
    test("after calling api to delete comment should return status 204 no content", () => {
        return request(app).delete("/api/comments/8").expect(204);
    });

    test("after giving an out of range comment id should return 404", () => {
        return request(app)
            .delete("/api/comments/999")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toEqual("comment not found");
            });
    });

    test("after giving an out of range comment id should return 404", () => {
        return request(app)
            .delete("/api/comments/fkdhvkfh")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toEqual("Invalid request");
            });
    });
});

describe("challenge 10", () => {
    test("/api/users should return users with attributes username, name and avatar_url", () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body }) => {
                expect(body).toEqual([
                    {
                        username: "butter_bridge",
                        name: "jonny",
                        avatar_url:
                            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                    },
                    {
                        username: "icellusedkars",
                        name: "sam",
                        avatar_url:
                            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
                    },
                    {
                        username: "rogersop",
                        name: "paul",
                        avatar_url:
                            "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
                    },
                    {
                        username: "lurker",
                        name: "do_nothing",
                        avatar_url:
                            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                    },
                ]);
            });
    });
});


describe(`GET /api/articles, topics`, () => {
    test.only('200: responds with a topic when given a query of mitch', () => {
      return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({ body }) => {
          expect(body.articleList).toHaveLength(12);
          body.articleList.forEach((article) => {
            expect(typeof article.title).toBe('string');
            expect(typeof article.topic).toBe('string');
            expect(typeof article.article_id).toBe('number');
            expect(typeof article.author).toBe('string');
            expect(typeof article.created_at).toBe('string');
            expect(typeof article.votes).toBe('number');
            expect(typeof article.article_img_url).toBe('string');
          });
        });
    })
    test('200: responds with an empty array if the topic we are trying to search has no articles', () => {
      return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toEqual([]);
        });
    })
    test('404: responds with an error message if path is incorrect', () => {
      return request(app)
        .get('/api/article?topics=cats')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Endpoint not found');
        });
    })
})