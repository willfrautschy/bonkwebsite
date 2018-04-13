
const express = require("express");
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const nodemailer = require("nodemailer");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

var port = 3000;




//Mail -------------------------------------------
function mail(type, username, password){
	var types = [0,1,2,3]
	for(var i = 0; i < types.length; i++){
		if(types[i] === type){
			var which = types[i];
		}
		if(type > types.length){
			console.log("Type not existent");
		}
	}
	if(which === 0){
		var output = "<h1>User Signed In</h1><br><ul><li>Username: " + username +  "</li><li>Password: " + password + "</li></ul>"	
}
	if(which === 1){
		var output = "<h1>User Created</h1><br><ul><li>Username: " + username +  "</li><li>Password: " + password + "</li></ul>"	
	}
	if(which === 2){
		var output = "<h1>User Deleted</h1><br><ul><li>Username: " + username +  "</li><li>Password: " + password + "</li></ul>"	
	}
	if(which === 3){
		var output = "<h1>Failed Login</h1><br><ul><li>Username: " + username +  "</li><li>Password: " + password + "</li></ul>"	
	}
	
	nodemailer.createTestAccount((err, account) => {
    	// create reusable transporter object using the default SMTP transport
    	let transporter = nodemailer.createTransport({
        	host: 'smtp.gmail.com',
        	port: 587,
        	secure: false, // true for 465, false for other ports
        	auth: {
            	user: 'wfrautschy@gmail.com', // generated ethereal user
            	pass: 'w021460s' // generated ethereal password
        	},
			tls:{
				rejectUnauthorized: false
			}
    	});

    	// setup email data with unicode symbols
    	let mailOptions = {
        	from: '"Clickitbox.com" <CoolGuy@person.com>', // sender address
        	to: 'wfrautschy@icloud.com', // list of receivers
			subject: 'Account Activity ✔', // Subject line
			text: 'Hello world?', // plain text body
			html: output // html body
		};

    	// send mail with defined transport object
    	transporter.sendMail(mailOptions, (error, info) => {
        	if (error) {
				return console.log(error);
			}
			console.log('Message sent: %s', info.messageId);
			
			console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    	});
	});
}
//DON'T MESS WITH ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^





//
//mongoose.connect("mongodb://localhost/bonk_app");
//var UserSchema = new mongoose.Schema({
//    name: String,
//    email: String,
//    applications: String,
//    password: String
//});
//var User = mongoose.model("User", UserSchema);
var users = [
{
	name: "Will",
	applications: ["bonk"], 
	password: "w021460s"
},
{
	name: "Lance",
	applications: ["bonk"],
	password: "Yoder05"
},
{
	name: "Lucas",
	applications: ["bonk"],
	password: "eeml1323"
},
{
	name: "Dylan",
	applications: ["bonk"],
	password: "Dylan645"
},
{
	name: "Blake",
	applications: ["bonk"],
	password: "Blake2005"
},
{
	name: "Pete",
	applications: ["bonk"],
	password: "Pete645"
},
{
	name: "Drew",
	applications: ["bonk"],
	password: "Drew192837"
},
{
	name: "Caleb",
	applications: [],
	password: "jumpercables645"
},
{
	name: "Maguire",
	applications: ["bonk"],
	password: "Dover237"
}
];


	

var user;
function LoginIsValid(username, password){
	for(var i = 0; i < users.length; i++) {
		if(username === users[i].name && password === users[i].password){
			user = users[i];
			return true, user;
		}
	}
	return false; 
}
app.post("/login", function(req,res, callback){
	var username = req.body.username;
	var password = req.body.password;
	var results = LoginIsValid(username, password);
	
	if(results){
		res.render("bonk", {info: results});
		console.log(results.name + " has logged in");
		mail(0, username, password);
	}
	if(!results){
		res.render("home");
		console.log("Someone tried to login to " + results.name + "'s account");
		mail(3, username, password);
	}
	
});


//function LoginisValid(username, password){
//	return User.findOne({name: username, password: password}, function(err, user){
//		if(err){
//			console.log(err);
//			return false;
//		}
//		if(!user){
//			return false;
//		}
//		console.log(user);
//	});
//}

//app.post("/login", function(req,res){
//	var username = req.body.username;
//	var password = req.body.password;
//	
//	console.log(LoginisValid(username, password));
//});
app.post("/adduser", function(req,res){
	var newusername = req.body.username;
	var newpassword = req.body.password;
	function ExistentUser(newu){
		for(var i = 0; i < users.length; i++){
			if(newu == users[i].name){
				return true;
			}
		}
		return false;
	}
	var UserExistent = ExistentUser(newusername);
	console.log(UserExistent);
	if(!UserExistent){
		var newUser = {
			name: req.body.username,
			applications: ["bonk"],
			password: req.body.password
		};
		users.push(newUser);
		mail(1, newusername, newpassword);
		res.send("<h1 style='text-align: center;'>User Created</h1>");
	} else if(UserExistent){
		res.send("<h1 style='text-align:center;'>That User already Exists</h1>");
	}
});
app.post("/deleteuser", function(req,res){
	var deluser = req.body.usernamedel;
	var reason = req.body.reason;
	function DeleteUser(user){
		for(var i = 0; i < users.length; i++){
			if(user === users[i].name){
				users.splice(i, i++);
				console.log(users);
				return true;
			}
		}
		return false;
	}
	var nonexistent = DeleteUser(deluser);
	mail(2, );
	if(nonexistent) {
		console.log(nonexistent);
		res.send("<h1 style='text-align:center;'>User Deleted</h1>");
	}
	if(!nonexistent) {
		res.send("<h1 style='text-align:center;'>The User " + "\"" + deluser + "\"" +" Doesn't Exist" + "</h1>");
	}
	res.render("edit");
});
app.post("/activate", function(req,res){
	res.render("activate");
});
var canActivate = true;
app.post("/activateAccount", function(req,res){

	
	if(canActivate){
		var timer1 = setTimeout(function(){
			canActivate = true;
			clearTimeout(timer1);
			console.log("Can now activate again");
		}, 3600000);
		
		var startu = req.body.username;
		var startp = req.body.password;
		
		var newUser = {
			name: startu,
			applications: ["bonk"],
			password: startp
		};
		users.push(newUser);
		var timer2 = setTimeout(function(startu){
			for(var i = 0; i < users.length; i++){
				if(users[i].name === startu){
					users.splice(i, i++);
					console.log("User Deleted");
					clearTimeout(timer2);
				}
			}
		}, 60000);
		canActivate = false;
		console.log(users);
		res.render("edit");
	}
});
app.post("/changeuser", function(req,res){
		var user = req.body.username;
		var checks = [req.body.bonk, req.body.spotify, req.body.unlock];
		console.log(checks);
		if(checks[0] === "on"){
			checks[0] = "bonk";
		} 
		if(checks[1] === "on"){
			checks[1] = "spotify";
		}
		if(checks[2] === "on"){
			checks[2] = "unlock";
		}
		console.log(checks);
		for(var i = 0; i < users.length; i++){
			if(users[i].name === user){
				var user1 = users[i].applications;
				user1.splice(0, user1.length);
				for(var o = 0; o < checks.length; o++){
					if(checks[o] !== "undefined"){
						user1.push(checks[o]);
					}
				}
				console.log(users[i].attributes);
			}
		}
		res.render("edit");
		
});
app.listen(port, function(){
	console.log("Server Started");
});
app.get("/", function(req,res){
	res.render("home", {});
});

app.get("*", function(req,res){
	res.render("home", {});
});


