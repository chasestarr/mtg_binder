var express = require('express');
var request = require('request');
var cons = require('consolidate');
var bodyParser = require('body-parser');
var swig = require('swig');

app = express();

app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + "/views");
app.use(bodyParser.urlencoded({ extended: false }));

var api = 'https://api.deckbrew.com/mtg/cards/';
var indexTem;

function errorHandler(err, req, res, next){
	console.error(err.message);
	console.error(err.stack);
	res.status(500);
	res.render('error_template', {error : err});
}

app.use(errorHandler);
app.get('/', function(req,res,next){
	
	var name = '?name=' + req.query.name;
	var searchTerm = api + name;
	var index = swig.compileFile('./views/index.html');

	request(searchTerm, function (error, response, cards) {
  		if (!error && response.statusCode == 200) {
  			var cardsJSONObj = JSON.parse(cards);

    		indexTem = {
    			cardsJSON : cardsJSONObj
    		};
			res.render('index', indexTem);
  		}
	});
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});