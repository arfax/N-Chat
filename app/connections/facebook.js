
var passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy;


var facebookConnection = function (server){

	passport.use(new FacebookStrategy({
		clientID: '922157774481272',
		clientSecret: '633da05ecae6c1f7b14af7b20b1bcca6',
		callbackURL : 'http://192.168.1.216:8000/auth/facebook/callback'
	}, function (accessToken, RefreshToken, profile, done){
		done(null, profile);
	}));

	server.get('/auth/facebook', passport.authenticate('facebook'));

	server.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/extra_data',
																			failureRedirect: '../error/error'}));


};

module.exports = facebookConnection;