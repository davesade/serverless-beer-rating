'use strict';

class Beer{
	constructor(dbClient, uuid){
		this.docClient = dbClient;
		this.uuid = uuid;
	}
	hello(event,callback){
		const response = {
			statusCode: 200,
			body: JSON.stringify({
			  message: 'Go Serverless v1.0! Your function executed successfully!',
			  input: event,
			}),
		};

		callback(null, response);
	}
	addRating(params,callback){
		  var Item = {
			  id: this.uuid.v4(),
			  beer: params.beer,
			  rating: Number(params.rating),
			  description: params.description
		  };

		  this.docClient.put({TableName: 'slsbeer', Item: Item}, (error) => {
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
	getRating(params,callback){
	  this.docClient.scan(params, (error, data) => {
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
	allRatings(params,callback){
		this.docClient.scan(params, (error, data) => {
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
}

module.exports = Beer;