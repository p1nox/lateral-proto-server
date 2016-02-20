var admin = {

  index: function(req, res){
  	var user = req.user;

    res.render('admin', {user: user});
  }

};

module.exports = admin;
