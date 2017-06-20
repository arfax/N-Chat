var mongoose = require('../connections/mongoose');
var Schema = mongoose.Schema;

var answerShema = new Schema({
	
	question: { type: Schema.Types.ObjectId, ref : 'question'},
	user : { type: Schema.Types.ObjectId, ref: 'user' },
	content : { type: String },
	created : { type: Date, default : Date.now }
	
});

var Answer = mongoose.model('answer', answerShema);

module.exports = Answer;