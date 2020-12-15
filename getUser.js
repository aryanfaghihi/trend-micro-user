"use strict";

const { v4: uuidv4, validate } = require("uuid");
const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
  // const body = JSON.parse(event);
  const userId = event["pathParameters"]["id"];
  // callback(null, {
  //   statusCode: 200,
  //   body: event
  // })

   
  var params = {
    Key: {
      id: userId,
    },
    TableName: process.env.USERS_TABLE,
  };
  dynamoDb.get(params, (err, data) => {
    if (err) {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify(err),
      });
    } else {
      console.log(data);
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(data),
      });
    }
  });
};
