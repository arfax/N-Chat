 
var Question = require('../models/question');

var homeController = function (server){
	// console.log('homeController listo');
	
	server.route('/')
	.get(function (req,res){
		Question.find({}).sort('-created').populate('user').limit(5).exec( function (err, questions){
			//console.log(questions);
		if (req.user) {
			if (req.user.provider=='facebook') {
				var user = req.user._json.first_name;
				var url_foto = "http://graph.facebook.com/"+req.user.id+"/picture"
			}
			if (req.user.provider=='twitter') {
				var user = req.user.username;
				var url_foto = req.user.photos[0].value;
			}
			// var users ={user: user, url_foto: url_foto, questions: questions}
			// console.log(users);
			res.render('home/index',{
				user : user,
				url_foto : url_foto,
				questions : questions
			});
		}else{
			
			res.render('home/index', {
				questions : questions
			});
		}

		});

	
	});
};

module.exports = homeController;