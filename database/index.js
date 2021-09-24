import mysql from "mysql";

const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mypass",
  database: "wordly",
  multipleStatements: true,
});

export default mysqlConnection;
