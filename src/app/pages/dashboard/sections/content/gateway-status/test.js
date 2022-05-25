var mysql = require('mysql');

var con = mysql.createConnection({
    host: "telemetrikbd.cjxqpv0cmtep.us-west-2.rds.amazonaws.com",
    user: "Telelamp",
    password: "t3l3m3tr1k",
    database: "alcaldia_med"
});

/*con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.destroy();
});*/

con.connect();

con.query("SELECT * FROM photocell_lora", function (err, result, fields) {
    console.log(result);
    con.destroy();
});