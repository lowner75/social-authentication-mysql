// Database dependencies ...
const mysql = require('mysql');

// MySQL connection pool ...
const db = mysql.createPool({
  host:       process.env.MYSQL_HOST,
  port:       process.env.MYSQL_PORT,
  user:       process.env.MYSQL_USER,
  password:   process.env.MYSQL_PASSWORD,
  database:   process.env.MYSQL_DB_NAME,
  debug:      false,
})

// Connect to the database .
db.getConnection((err) => {
  if (err) throw err;
  console.log("Successfully connected to MySQL...\n");
});

module.exports = db