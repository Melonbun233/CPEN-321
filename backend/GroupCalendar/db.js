var mysql = require('mysql');

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'secretpw=ZZJ321',
  database: 'UserDB'
});

db.connect(function(err) {
  if (err) throw err;
  console.log('You are now connected to mysql...');
});

exports.query = function(query, res){ 
	db.query(query, function(err, res){
		if (err) throw err;
		res.send(res);
	});
};