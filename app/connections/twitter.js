
var passport = require('passport'),
	TwitterStrategy = require('passport-twitter').Strategy;


var twitterConnection = function (server){

	passport.use(new TwitterStrategy({
		consumerKey: 'Au2MU4xn9ueVPexRzQBU2z4Ud',
		consumerSecret: 'YhMIWSQ0gfrofLJW3WY4DN0giICnQlCbLObaQNYj7Sp8ZNeoZg',
		callbackURL : 'http://192.168.1.216:8000/auth/twitter/callback'
	}, function (accessToken, RefreshToken, profile, done){
		done(null, profile);
	}));

	server.get('/auth/twitter', passport.authenticate('twitter'));

	server.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/extra_data',
																			failureRedirect: '../error/error'}));


};

module.exports = twitterConnection;