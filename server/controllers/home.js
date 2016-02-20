var home = {

  index: function(req, res){
  	var user = req.user;

    res.render('index', {user: user});
  }

};

module.exports = home;
