var mysql = require('mysql');

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'secretpw=ZZJ321',
  database: 'UserDB',
  multipleStatements: true
});

db.connect(function(err) {
  if (err){ 
    throw err
  }
  console.log('You are now connected to UserDB...');
});

exports.query = function(query, result){ 
	db.query(query, function(err, res){
		if (err){ 
      result(err, null);
		} else {
      result(null, res);
    }
	});
};