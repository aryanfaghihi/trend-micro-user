"use strict";
const AWS = require("aws-sdk");

module.exports.get = function (event, context, callback) {
  const userId = event["pathParameters"]["id"];
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  var params = {
    Key: {
      id: userId,
    },
    TableName: process.env.USERS_TABLE,
  };
  dynamoDb.get(params, (err, data) => {
    if (err) callback(err);
    else {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(data),
      });
    }
  });
};

module.exports.getAWS = () => {
  return AWS;
};
