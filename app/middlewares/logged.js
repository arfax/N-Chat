
var loggedMiddleware = function (req, res, next ){
	if (req.user) {
		next();
	}else{
		res.redirect('/auth/facebook');
	}
};

module.exports = loggedMiddleware;

