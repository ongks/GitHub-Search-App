var express = require('express');
var router = express.Router();
var request = require('request');

// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'GitHub Search' });
});

/*
Search queries will be routed to this function.
If the input is valid (e.g. blank string), user will be prompted to key in a non-empty string.
Else the query accesses GitHub's api and parses the result as a JSON. The relevant information
are stored in the resultsArray and returned to main.js
*/
router.get('/search', function(req, res) {
	var val = req.query.search;
	var url = 'https://api.github.com/legacy/repos/search/' + val;
	console.log(val);

	//input validation: ensure no blank keyword is provided.
	if(val == '') {
		res.send("Please enter a term to search for!");
		return 0;
	} 

	//headers required to access github api
	var options = {
		url: url,
		headers: {
			'User-Agent': 'ongks'
		}
	};

	//part of request module which processes input from user by inserting
	//each result into the resultsArray
	function callback(err, resp, body) {
		var resultsArray = [];
		body = JSON.parse(body);
		//console.log(body);

		// compare search results with the input from user
		if (!body.repositories[0]) {
			searchRes = "No results found. Try again.";
			reply(searchRes);
		} else {
			searchRes = body.repositories;
			for(var i = 0; i < searchRes.length; i++) {
				resultsArray.push(
					{idx: "" + i,
					owner: searchRes[i]["owner"],
					name: searchRes[i]["name"],
					language: searchRes[i]["language"],
					followers: searchRes[i]["followers"],
					url: searchRes[i]["url"],
					description: searchRes[i]["description"]}
				);
			}
			reply(resultsArray);
		}
	};

	// request module is used to process the github api url and return the results in JSON format
	function requests(url, reply) {
		request(options, callback);
	};

	// pass back the results to client side
	function reply(data) {
		res.send(data);
	}

	requests(url, reply);
});

module.exports = router;
