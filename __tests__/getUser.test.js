const AWS = require("aws-sdk-mock");
const { get, getAWS } = require("../getUser");
const { v4: uuidv4 } = require("uuid");

test("test success user retrieval", (done) => {
  const userId = uuidv4();
  process.env["USERS_TABLE"] = "USERS_TABLE";

  AWS.setSDKInstance(getAWS());
  AWS.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
    callback(null, params.Key.id === userId);
  });

  get(
    {
      pathParameters: {
        id: userId,
      },
    },
    null,
    (err, result) => {
      expect(err).toBe(null);
      expect(result.statusCode).toBe(200);
      expect(result.body).toBe("true");
      AWS.restore("DynamoDB.DocumentClient");
      done();
    }
  );

});

test("test missing user retrieval", (done) => {
  const userId = uuidv4();
  process.env["USERS_TABLE"] = "USERS_TABLE";

  AWS.setSDKInstance(getAWS());
  AWS.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
    callback(null, params.Key.id !== userId);
  });

  get(
    {
      pathParameters: {
        id: userId,
      },
    },
    null,
    (err, result) => {
      expect(err).toBe(null);
      expect(result.statusCode).toBe(200);
      expect(result.body).toBe("false");
      AWS.restore("DynamoDB.DocumentClient");
      done();
    }
  );

});

test("test fail user retrieval", (done) => {
  const userId = uuidv4();
  process.env["USERS_TABLE"] = "USERS_TABLE";

  AWS.setSDKInstance(getAWS());
  AWS.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
    callback("Something went wrong");
  });

  get(
    {
      pathParameters: {
        id: userId,
      },
    },
    null,
    (err, result) => {
      expect(err).toBe("Something went wrong");
      AWS.restore("DynamoDB.DocumentClient");
      done();
    }
  );

});
