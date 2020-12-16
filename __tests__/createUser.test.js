const AWS = require("aws-sdk-mock");
const { create, getAWS } = require("../createUser");
const { v4: uuidv4 } = require("uuid");

test("test success user creation", (done) => {
  const event = {
    body: JSON.stringify({
      data: {
        firstName: "Jane",
        lastName: "Doe",
        username: "jane.doe",
        credentials: "password",
        email: "jane.doe@gmail.com",
      },
    }),
  };

  process.env["USERS_TABLE"] = "USERS_TABLE";
  process.env["CMK"] = "123";

  AWS.setSDKInstance(getAWS());
  AWS.mock("DynamoDB.DocumentClient", "put", (params, callback) => {
    callback(null, params);
  });
  AWS.mock("KMS", "encrypt", (params, callback) => {
    const response = {
      CiphertextBlob: Buffer.from("some string", "base64"),
    };
    callback(null, response);
  });

  create(event, null, (err, result) => {
    expect(err).toBe(null)
    expect(result.statusCode).toBe(201)
    expect(typeof JSON.parse(result.body)).toBe('object');
    AWS.restore("DynamoDB.DocumentClient");
    done();
  });

});
