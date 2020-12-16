"use strict";
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");

module.exports.create = (event, context, callback) => {
  const body = JSON.parse(event.body);
  const data = body.data || {};

  if (isInvalid(data)) {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        title: "Couldn't submit candidate because of validation errors.",
      }),
    });
    return;
  }

  encrypt(data.credentials).then((credentials) => {
    data["id"] = uuidv4();
    data["credentials"] = credentials;

    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    const userEntry = {
      TableName: process.env.USERS_TABLE,
      Item: data,
    };

    dynamoDb.put(userEntry, (err) => {
      delete data["credentials"];
      if (err)
        callback(null, {
          statusCode: 500,
          body: JSON.stringify(err),
        });
      else
        callback(null, {
          statusCode: 201,
          body: JSON.stringify({ data: data }),
        });
    });
  });
};

// source is plaintext
async function encrypt(text) {
  const kms = new AWS.KMS();

  const params = {
    KeyId: process.env.CMK,
    Plaintext: text,
  };

  try {
    const { CiphertextBlob } = await kms.encrypt(params).promise();
    return CiphertextBlob.toString("base64");
  } catch (err) {
    throw err;
  }
}

function isInvalid(data) {
  return (
    typeof data.firstName !== "string" ||
    typeof data.lastName !== "string" ||
    typeof data.username !== "string" ||
    typeof data.credentials !== "string" ||
    typeof data.email !== "string"
  );
}

module.exports.getAWS = () => {
  return AWS;
};
module.exports.isInvalid = isInvalid;
module.exports.encrypt = encrypt;
