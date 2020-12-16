"use strict";
const AWS = require("aws-sdk");

module.exports.get = function (event, context, callback) {
  const userId = event["pathParameters"]["id"];
  var dynamoDb = new AWS.DynamoDB();

  var params = {
    Key: {
      id: {
        S: userId,
      },
    },
    TableName: process.env.USERS_TABLE,
  };
  dynamoDb.getItem(params, (err, data) => {
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
