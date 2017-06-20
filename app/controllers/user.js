var User = require('../models/user'),
	logged = require('../middlewares/logged'),
	getUser = require('../middlewares/getuser');


var users = [];
var userControllers = function (server, io){

	var io2 = io.of('/chat');

	io2.on('connection', function(socket){
		socket.join('chat');
		socket.on('nuevo usuario', function(data){
				socket.broadcast.to('chat').emit('devolviendo usuario', data);
			});

			socket.on('nuevo mensaje', function(data){
				io2.to('chat').emit('devolviendo mensaje', data);
			});

		});


	server.route('/chat')

	.get(logged, getUser, function (req,res){


		var user = {
			user : req.user.username,
			url_foto : req.user.url_foto
		}
		User.find({ chat : true }, function (err, userss){
			var users2 = [];
			var query = { id_network: req.user.id_network},
				options = { upsert: false, multi: false };
			if (userss.length > 0) {
				for(dato in userss){
					if (userss[dato].username!=req.user.username) {
						users2.push({'user':userss[dato].username, 'url_foto': userss[dato].url_foto });
					}
				}
				users2.push(user);
				User.update(query, { $set: { chat : true }}, options, function (err, modi){
				
				});
				
			}else{
				users2.push(user);
				User.update(query, { $set: { chat: true }}, options, function (err, modi){
					console.log(err);
				});
			}
			res.render('user/chat', {users : users2  ,user : req.user.username, url_foto : req.user.url_foto });
		});
	});

	server.route('/logout')

	.get(function (req, res){
		var user; 
		// users = users.filter( function (el){
		// 	// console.log(users);
		// 	if (req.user.provider == 'facebook') {
		// 		user = req.user.name.givenName;
		// 		return el.username !== req.user.name.givenName;
		// 	}
		// 	if (req.user.provider == 'twitter') {
		// 		user = req.user.username;
		// 		return el.username !== req.user.username;
		// 	}


		// });

		if (req.user.provider == 'facebook') {
				user = req.user.name.givenName;
			}
			if (req.user.provider == 'twitter') {
				user = req.user.username;
			}

		var query = { id_network: req.user.id },
		options = { upsert: false, multi: false };
		User.update(query, { $set: { chat : false }}, options, function (err, modi){
		
			});
		io2.in('chat').emit('logout', user.replace(/\s/g,''));
		req.logout();
		res.redirect('/');
	});

	server.route('/extra_data')

	.get( function (req, res){
		User.findOne({ id_network : req.user.id }, function (err, user){
			if (user) {
				res.redirect('/');
				return;
			}else{
				res.render('user/extra_data');
			}
		});

	})
	.post( function (req, res ){

		var username = req.body.username;
		var email = req.body.email;
	  	if (req.user.provider == 'facebook') {

	  		var user = new User({
		 	id_network : req.user.id,
		 	username : username,
		 	email : email,
		 	first_name : req.user.name.givenName,
		 	last_name : req.user.name.familyName,
			url_foto : "http://graph.facebook.com/"+req.user.id+"/picture"

			 	});
			user.save( function (err){
			if (err) {
				console.log('error');
				return;
			}
		});

	  	}
		if (req.user.provider == 'twitter') {
			var user = new User({
		 	id_network : req.user.id,
		 	username : username,
		 	email : email,
		 	first_name : req.user.displayName,
		 	url_foto : req.user.photos[0].value
		 	// last_name : req.user.name.familyName
			 	});
			user.save( function (err){
			if (err) {
				console.log('error');
				return;
				}
			});
		}


		res.redirect('/');
	});

};

module.exports = userControllers;