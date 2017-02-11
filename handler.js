'use strict';

var AWS = require('aws-sdk');
var uuid = require('uuid');
var Beer = require('./Beer');

module.exports.hello = (event, context, callback) => {
  var beer = new Beer();
  beer.hello(event, callback);
};

module.exports.addRating = (event, context, callback) => {
  var docClient = new AWS.DynamoDB.DocumentClient();
  var params = JSON.parse(event.body);
  var Item = {
      id: uuid.v4(),
      beer: params.beer,
      rating: Number(params.rating),
	  description: params.description
  };

  docClient.put({TableName: 'slsbeer', Item: Item}, (error) => {
    if (error) {
      callback(error);
    }

    callback(null, {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
    });
  });
}

module.exports.getRating = (event, context, callback) => {
  var docClient = new AWS.DynamoDB.DocumentClient();
  console.log(event);
  var params = {
    TableName: 'slsbeer',
    FilterExpression : 'beer = :beer_name',
    ExpressionAttributeValues : {':beer_name' : event.pathParameters.beer}
  }

  docClient.scan(params, (error, data) => {
    if (error) {
      callback(error);
    }

    var sum = data.Items.reduce((accumulated, current) => {
      return accumulated + current.rating}
    , 0);

    var average = sum/data.Items.length;

    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ averageRating: average }),
    })

  });
}


module.exports.allRatings = (event, context, callback) => {
  var docClient = new AWS.DynamoDB.DocumentClient();
  var params = {
    TableName: 'slsbeer'
  }

  docClient.scan(params, (error, data) => {
    if (error) {
      callback(error);
    }

    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data.Items),
    })

  });
}