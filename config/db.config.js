require("dotenv").config();
/*const { query } = require("express");
const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: PGPASSWORD,
    port: 5432,
})
*/
pool.connect(function(err, client, done) {
    client.query("express")
    done()
  })
  // pool shutdown
  pool.end()

 /*module.exports = {
     async query(text,param){}
 };*/
 