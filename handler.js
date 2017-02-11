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
  var beer = new Beer(docClient,uuid);
  beer.addRating(params,callback);
}

module.exports.getRating = (event, context, callback) => {
  var docClient = new AWS.DynamoDB.DocumentClient();
  var params = {
    TableName: 'slsbeer',
    FilterExpression : 'beer = :beer_name',
    ExpressionAttributeValues : {':beer_name' : event.pathParameters.beer}
  }
  var beer = new Beer(docClient,uuid);
  beer.getRating(params,callback);
}


module.exports.allRatings = (event, context, callback) => {
  var docClient = new AWS.DynamoDB.DocumentClient();
  var params = {
    TableName: 'slsbeer'
  }
  var beer = new Beer(docClient,uuid);
  beer.allRatings(params,callback);
}