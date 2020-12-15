"use strict";

const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const body = JSON.parse(event.body);
  console.log(body)

  if (
    typeof body.firstName !== "string" ||
    typeof body.lastName !== "string" ||
    typeof body.username !== "string" ||
    typeof body.credentials !== "string" ||
    typeof body.email !== "string"
  ) {
    callback(
      new Error("Couldn't submit candidate because of validation errors.")
    );
    return;
  }

  body["id"] = uuidv4()

  const userEntry = {
    TableName: process.env.USERS_TABLE,
    Item: body,
  };

  dynamoDb.put(userEntry, (err, data) => {
    if (err) callback(null, {
      statusCode: 500,
      body: JSON.stringify(err)
    })
    else callback(null, {
      statusCode: 200, 
      body: JSON.stringify(data)
    })
  })

};
