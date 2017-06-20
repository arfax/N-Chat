 
var Question = require('../models/question'),
	Answer = require('../models/answer');
var User = require('../models/user'),
	logged = require('../middlewares/logged'),
	getUser = require('../middlewares/getuser'),
	slugs = require('slugs');


var discussController = function ( server, io ) {
 	
 	io.on('connection', function(socket){
 		socket.join('home');
 	});

 	server.route('/guardar_pregunta')

 	.post(logged, getUser, function (req, res){
 	
 			var question = new Question({
 			user : req.user,
 			title : req.body.title,
 			content : req.body.content,
 			slug : slugs(req.body.title)
 			});
 			question.save(function (err){
 				if (err) {
 				console.log('error');
 				return;
	 		}
	 		io.to('home').emit('preguntando', {
	 			username: req.user.username,
	 			url_foto : req.user.url_foto,
	 			content: req.body.content,
	 			created : question.created

	 		});

 		});
 		res.redirect('/');
 	});

 	server.route('/pregunta/:slug')

	.get( function (req, res){
		
		Question.findOne({ slug : req.params.slug })
		.populate('user')
		.exec( function (err, question){	
			Answer.find({ question : question })
			.populate('user')
			.sort('created')
			.exec( function (err, answers){

				res.render('discuss/question_detail', { question : question,
							answers : answers });
			});
		});
	})
	.post(logged, getUser ,function (req, res){
		Question.findOne({ slug : req.params.slug })
		.populate('user')
		.exec( function (err, question){
			var answer = new Answer({
				question: question,
				user : req.user,
				content : req.body.content
			});

		 	// console.log(consulta);
			answer.save( function (err){
				if (err) {


					console.log('error');
					return;
				}
			});
			res.redirect('/pregunta/'+ req.params.slug);
		});
		
	});

 };

 module.exports = discussController;