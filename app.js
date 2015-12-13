var express = require('express');
var app = express();
var exphbs = require('express3-handlebars');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
mongoose.connect('mongodb://pevargas:Policia9@ds061984.mongolab.com:61984/users');
	var Schema = new mongoose.Schema({
		_id    : String,
		name: String,
		lastName: String,
		age: String,
		sex: String,
		symptoms: String,
		ssn:'String',
		amount: Number
		
	});
var user = mongoose.model('patients', Schema);
/***********************************************/

app.engine('handlebars',
		exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

/**************************************************/

app.get('/',function(req,res){
	res.render('index');
});
app.get('/admin',function(req,res){
	user.find(function(err,docs){
		res.render('admin',{layout:'admin.handlebars',users : docs});
	});
	//res.render('admin',{layout: 'admin.handlebars'});
});
app.get('/admin/data',function(req,res){
	user.find(function(err,docs){
		res.send(docs);//pasing only the object that i want
	});
	//res.render('admin',{layout: 'admin.handlebars'});
});
app.get('/calendar',function(req,res){
	res.render('calendar',{layout: 'admin.handlebars'});
});
app.get('/profile',function(req,res){
	res.render('profile',{layout: 'admin.handlebars'});
});


app.use('/public', express.static('public'));

/*********************************************************************/

var port = Number(process.env.PORT || 2000);
//app.on('Listening to ');
var myPort = app.listen(port);
console.log('Listening...' + port);