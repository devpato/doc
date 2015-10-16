// require dependencies
var express = require("express");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");

// instantiate express
var app = express();

// tell express to use these packages
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// run server
app.listen(8000, function(){
    // callback function after the server starts
    console.log("Server listening on port:\t%d",8000);
});

app.get("myroute", function(req, res){
    res.write("Hello world.");
});