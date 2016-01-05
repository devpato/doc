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
		ssn: String,
		amount: Number
		
	});
    var SchemaApp = new mongoose.Schema({
		_id : String,
		time:[{
			date: String,
			hour: String
		}]			
	});
	var CitaApp = new mongoose.Schema({
		_id : String,
		time:[{
			date: String,
			hour: String
		}]			
	});


var citas = mongoose.model('citas', CitaApp);
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
});
app.get('/patients',function(req,res){
	user.find(function(err,docs){
		res.render('patients',{layout:'admin.handlebars',users : docs});
	});
	//res.render('admin',{layout: 'admin.handlebars'});
});
app.get('/admin/data',function(req,res){
	user.find(function(err,docs){
		res.send(docs);//pasing only the object that i want
	});
});
app.get('/admin/appointment',function(req,res){
	citas.find(function(err,docs){
		res.send(docs);//pasing only the object that i want
	});
});
app.get('/calendar/appointment',function(req,res){
	citas.find(function(err,docs){
		res.send(docs);//pasing only the object that i want
	});
});
app.get('/calendar',function(req,res){
	citas.find(function(err,docs){
		res.render('calendar',{layout:'admin.handlebars',users : docs});
	});
});

app.get('/profile',function(req,res){
	res.render('profile',{layout: 'admin.handlebars'});
});
app.get('/user/:id/delete', function(req, res){
	user.remove({_id: req.params.id}, 
	   function(err){
		if(err) res.json(err);
		else    res.redirect('/patients');
	});
});
/***************************************** */
app.post('/cita',function(req,res){
  var time = req.body.hour +":"+req.body.minutes;
  var date = req.body.dateApp;
  var patient = req.body.appPatient;
  var flag = true;
  citas.find(function(err,docs){
        for(var i = 0;i<docs.length;i++){
            for(var j = 0;j<docs[i].time.length;j++){
                if((time === docs[i].time[j].hour) && (date === docs[i].time[j].date)){
                    console.log(time+" vs "+docs[i].time[j].hour);
                    console.log(date+" vs "+docs[i].time[j].date);
                    flag = false;                        
                 }
            }
        }
        if(flag){
            citas.update({"_id": patient},{
                    $push:{
                        "time":{
                            "hour": time,
                            "date": date
                        }
                    }
                },function(err){
                    if(err) console.log(err);
                });
        }
        res.redirect("/admin");
    });
  //http://stackoverflow.com/questions/17288439/mongodb-how-to-insert-additional-object-into-object-collection
});
/**************************************************/
app.post('/appointment', function(req, res){
	new appointment({
		_id    : req.body.email,
		time:[{//appointment
			//date: req.body.date,
			hour: req.body.time	//time
		}]		
	}).save(function(err, doc){
		if(err) res.json(err);
		else    res.redirect('/patients');
	});
});
app.post('/new', function(req, res){
	new user({
		_id    : req.body.email,
		name: req.body.name,
		lastname: req.body.lastName,
		age   : req.body.age,
		sex: req.body.sex,
		symptoms: req.body.symptoms,
		ssn: req.body.ssn,
		amount: req.body.amount				
	}).save(function(err, doc){
		if(err) res.json(err);
	});
    new citas({
        _id: req.body.email,
        time:[
            
        ]
    }).save(function(err, doc){
		if(err) res.json(err);
		else    res.redirect('/patients');
	});
});
app.post('/newPatient', function(req, res){
	new user({
		_id    : req.body.email,
		name: req.body.name,
		lastname: req.body.lastName,
		age   : req.body.age,
		sex: req.body.sex,
		symptoms: req.body.symptoms,
		ssn: req.body.ssn,
		amount: req.body.amount				
	}).save(function(err, doc){
		if(err) res.json(err);
	});
    new citas({
        _id: req.body.email,
        time:[
            
        ]
    }).save(function(err, doc){
		if(err) res.json(err);
		else    res.redirect('/calendar');
	});
});
app.post('/update', function(req, res){
	var myID = req.body.emailU;
	var myName = req.body.nameU;
	var myLastName = req.body.lastNameU;
	var myAge = req.body.ageU;
	var mySex = req.body.sexU;
	var mySymptoms = req.body.symptomsU;
	var mySSN = req.body.ssnU;
	var myAmount = req.body.amountU;
	
	console.log(new Date().toLocaleDateString()+" "+ new Date().toLocaleTimeString());
	
	user.findById(req.body.emailU, function(err, user) {
		if (err) throw err;
		
		// change the info
		if(myID.length>0){ 
			if(myName.length>0){ 
				user.name = req.body.nameU;
			}
			if(myLastName.length>0){ 
				user.lastname = req.body.lastNameU;
			}
			if(myAge.length>0){ 
				user.age = req.body.ageU;
			}
			if(mySex.length>0){ 
				user.sex = req.body.sexU;
			}
			if(mySymptoms.length>0){ 
				user.symptoms = req.body.symptomsU;
			}
			if(mySSN.length>0){ 
				user.SSN = req.body.ssnU;
			}
			if(myAmount.length>0){ 
				user.amount = req.body.amountU;
			}
		}
		
		console.log(myName.length);
		user.lastName = req.body.lastNameU;
		// save the user
		user.save(function(err) {
			if (err) throw err;
			res.redirect("/patients");
			console.log('User successfully updated!');
		});
	});
});
app.post('/updateApp', function(req, res){
	var myID = req.body.emailU;
    var date = req.body.appDate;
    var hour = req.body.hour;
    var minutes = req.body.minutes;
    var myTime = hour+":"+minutes;
    var flag = false;
    var index;
	citas.find(function(err, docs) {
		if (err) throw err;		
		// change the info
		if(myID.length>0){ 
            for(var i = 0;i<docs.length;i++){
                if(myID === docs[i]._id){
                    console.log(i);
                    index = i;
                    flag = true;
                 }
             }
        }
        console.log(index);
		if(flag){
            citas.update({"_id": myID},{
                $pop:{
                    "time":1                     
                    }
                }
                ,function(err){
                    if(err) console.log(err);
                });
                
                citas.update({"_id": myID},{
                    $push:{
                        "time":{
                            "hour": myTime,
                            "date": date
                         }
                    }
                },function(err){
                    if(err) console.log(err);
                });
        }
        res.redirect("/calendar");
	});
});
/**************************************************/
app.use('/public', express.static('public'));

/*********************************************************************/

var port = Number(process.env.PORT || 2000);
//app.on('Listening to ');
var myPort = app.listen(port);
console.log('Listening...' + port);