// for testing launches it is dependent on __test__ folder

const request = require("supertest");
const app = require("../../app");

// * mongo db test
const { mongoConnect, mongoDisconnect } = require("../../utility/mongo");

// mongo db describe test where we put all code
describe("Launches API", () => {
  // * before test below code will get executed start
  beforeAll(async () => {
    await mongoConnect();
  });
  // * before test below code will get executed end

  // * after test below code will get executed start
  afterAll(async () => {
    await mongoDisconnect(); // to disconnect mongo db 
  });
  // * after test below code will get executed end

  // ! testing all get request
  describe("Test GET /launches", () => {
    test("It should respond with 200 success ", async () => {
      const response = await request(app)
        .get("/launches") // it work with app.js main file which accepts https server or express server
        .expect("Content-Type", /json/)
        // expect(response.statusCode).toBe(200); // statusCode default here
        // or
        .expect(200);
    });
  });

  // ! testing all post request
  describe("Test POST /launch", () => {
    const completeLaunchData = {
      mission: "Kepler Exploration X",
      rocket: "Explorer ISI",
      launchDate: "March 25,2021",
      target: "Kepler-442 b",
    };
    const completeLaunchDataWithoutDate = {
      mission: "Kepler Exploration X",
      rocket: "Explorer ISI",
      target: "Kepler-442 b",
    };
    const invalidDate = {
      mission: "Kepler Exploration X",
      rocket: "Explorer ISI",
      launchDate: "noDate",
      target: "Kepler-442 b",
    };
    test("It should be with 201 created ", async () => {
      const response = await request(app)
        .post("/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);
      // toMatchObject is default jest API request fn
      expect(response.body).toMatchObject(completeLaunchDataWithoutDate);
    });
    test("It should catch missing required properties ", async () => {
      const response = await request(app)
        .post("/launches")
        .send(completeLaunchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400); // 400 is bad request

      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });
    test("It should catch invalid dates ", async () => {
      const response = await request(app)
        .post("/launches")
        .send(invalidDate)
        .expect("Content-Type", /json/)
        .expect(400); // 400 is bad request
      expect(response.body).toStrictEqual({
        error: "Invalid launch Date",
      });
    });
  });
});

// describe test both are js in build fn for jest
/*  O/P
    Test Suites: 1 passed, 1 total                                                        
    Tests:       4 passed, 4 total                                                        
    Snapshots:   0 total
    Time:        0.858 s, estimated 2 s
    Ran all test suites.
*/

/*
    ! supertest do ?
    * It take app object that i pass to it and calling the listen
        fn on that object and then it allows you to make requests 
        directly against the resulting https server like Axios or
        browser fetch fn 
    * It mostly used to check status code and response 

    * use npm run test-watch
*/
