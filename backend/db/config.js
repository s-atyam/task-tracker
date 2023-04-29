const mysql = require('mysql')
const db = mysql.createConnection({
host: "localhost",
user: "root",
password: "",
database:"project" 
})
db.connect()
console.log("conneted");

module.exports = db;