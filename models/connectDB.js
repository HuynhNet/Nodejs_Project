var mysql = require('mysql');

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nlcn"
});

conn.connect( (err) => {
    if(err){
        console.log(err);
    }else{
        console.log("Connect database seccussfunly");
    }
});

module.exports = conn;