
var express = require("express");
var app = express();
var port = 80;
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
var ejs = require("ejs");
app.set("view engine", "ejs");




var users = [
{
	name: "Will",
	applications: ["bonk", "spotify", "unlock", "slither", "agario", ""], 
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
	applications: ["bonk", "spotify", "unlock"],
	password: "Drew192837"
},
{
	name: "Caleb",
	applications: [],
	password: "jumpercables645"
},
{
	name: "Admin",
	applications: "edit",
	password: "password"
}
];
function LoginIsValid(username, password){
	var info = [];
	for(var i = 0; i < users.length; i++) {
		if(username === "Admin" && password === "password") {
			info.push("good");
			return info;
		} else if(username === users[i].name && password === users[i].password){
			info.push(true);
			for(var o = 0; o < users[i].applications.length; o++){
				info.push(users[i].applications[o]);
			}
			return info;
		}
	}
	info.push(false);
	return info;
}
app.post("/login", function(req,res){
	
	var username = req.body.username;
	var password = req.body.password;

	
	
	var login = LoginIsValid(username, password)[0];
	var info = LoginIsValid(username, password);
		info.splice(0,1);
	if(login === "good" || login) {
		console.log(username + " has logged in --- Username-" + "\"" + username + "\"" + " Password- "  + "\"" + password + "\"");
		if(login !== "good"){
			console.log(login);
			res.render("bonk.ejs", {things: info});	
		} else if (login === "good"){
			res.render("edit");
		}
		
	} else if (!LoginIsValid(username, password)){
		console.log("Someone has failed to Login --- Username-" + "\"" + username + "\"" + " Password- " + "\"" + password + "\"");
		res.render("home");
	}
});
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
		console.log(users);
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
	console.log("Server Started at localhost: " + port);
});
app.get("/", function(req,res){
	res.render("home", {});
});

app.get("*", function(req,res){
	res.render("home", {});
});


