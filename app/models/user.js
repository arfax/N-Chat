var mongoose = require('../connections/mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	id_network : {type : String},
	username : {type : String, required : true, index : {unique : true}},
	email : {type : String, required : true},
	first_name : {type : String},
	last_name : {type : String},
	url_foto : {type : String},
	chat : { type: Boolean, default: false }
	
});

var User = mongoose.model('user', userSchema);

module.exports = User;