var express = require('express');
var fortune = require('./lib/fortune.js');
//var tours = require('./lib/tour.js');
//var products = require('./lib/product.js');

var app = express();
//if (app.thing === null) console.log('bleat!');

// set up handlebars view engine
var handlebars = require('express-handlebars').create({
	defaultLayout: 'main',
	helpers: {
		section: function (name, options) {
			if (!this._sections) this._sections = {};
			this._sections[name] = options.fn(this);
			return null;
		},
	},
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));



// set 'showTests' context property if the querystring contains test=1
app.use(function (req, res, next) {
	res.locals.showTests =
		app.get('env') !== 'production' && req.query.test === '1';
	next();
});

app.disable('x-powered-by');

app.get('/', function (req, res) {
	res.render('home');
});

app.get('/api/tours', function (req, res) {

	var toursXml = '<?xml version="1.0"?><tours>' +
		products.map(function (p) {
			return '<tour price="' + p.price +
				'" id="' + p.id + '">' + p.name + '</tour>';
		}).join('') + '</tours>';
	var toursText = tours.map(function (p) {
		return p.id + ': ' + p.name + ' (' + p.price + ')';
	}).join('\n');
	res.format({
		'application/json': function () {
			res.json(tours);
		},
		'application/xml': function () {
			res.type('application/xml');
			res.send(toursXml);
		},
		'text/xml': function () {
			res.type('text/xml');
			res.send(toursXml);
		},
		'text/plain': function () {
			res.type('text/plain');
			res.send(toursXml);
		}
	});
});
//put 
app.put('/api/tour/:id', function (req, res) {
	var p = tours.some(function (p) { return p.id == req.params.id; });
	if (p) {
		if (req.query.name) p.name = req.query.name;
		if (req.query.price) p.price = req.query.price;
		res.json({ success: true });
	} else {
		res.json({ error: 'No such tour exists.' });
	}
});

app.delete('/api/tour/:id', function (req, res) {
	var i;
	for (i = tours.length - 1; i >= 0; i--)
		if (tours[i].id == req.params.id) break;
	if (i >= 0) {
		tours.splice(i, 1);
		res.json({ success: true });
	} else {
		res.json({ error: 'No such tour exists.' });
	}
});
app.get('/headers', function (req, res) {
	res.set('Content-Type', 'text/plain');
	var s = '';
	for (var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
	res.send(s);
});
app.get('/about', function (req, res) {
	res.render('about', {
		fortune: fortune.getFortune(),
		pageTestScript: '/qa/tests-about.js',
	});
});
app.get('/custom-layout', function (req, res) {
	res.render('custom-layout', {
		layout: 'custom',
	});
});
app.get('/user', function (req, res) {
	console.log("Name: ", req.query.name);
	console.log("Age:", req.query.age);
	res.send();
});
app.get('/greeting', function (req, res) {
	res.render('about', {
		message: 'welcome',
		style: req.query.style,
		/*	userid: req.cookie.userid,
			username: req.session.username,*/

	});
});
app.get('/test', function (req, res) {
	res.type('text/plain');
	res.send('this is a test');
});
app.get('/tours/hood-river', function (req, res) {
	res.render('tours/hood-river');
});
app.get('/tours/oregon-coast', function (req, res) {
	res.render('tours/oregon-coast');
});
app.get('/tours/request-group-rate', function (req, res) {
	res.render('tours/request-group-rate');
});
// the layout file views/layouts/custom.handlebars will be used


// 404 catch-all handler (middleware)
app.use(function (req, res, next) {
	res.status(404);
	res.render('404');
});

// 500 error handler (middleware)
app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500);
	res.render('500');
});



app.listen(app.get('port'), function () {
	console.log(
		'Express started on http://localhost:' +
		app.get('port') +
		'; press Ctrl-C to terminate.'
	);
});
