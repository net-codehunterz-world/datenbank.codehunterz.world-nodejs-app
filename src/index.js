const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const utils = require('rjutils-collection');
const https = require('https');
const http = require('http');
const fs = require('fs');
const requestIP = require('request-ip');
const app = express();




console.log("Console > Starting Account-Server!!...");


app.use(cors());
app.use(express.json());






const db = mysql.createConnection({
  host: "45.131.109.129",
  user: "x3pc092201",
  password: "cr0nicalz96",
  database: "blackzspacededbx"
});





let date_time = new Date();
let date = ("0" + date_time.getDate()).slice(-2);
let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
let hours = date_time.getHours();
let minutes = date_time.getMinutes();




app.post('/login', (req, res) => {
  const sql = "SELECT * FROM login_table WHERE username = ? AND password = ?";
  const hashed = utils.hashStr({ text: req.body.password, algorithm: 'sha256', output: 'hex' })

  db.query(sql, [req.body.user, hashed], (err, data) => {
    if(err) return res.json("Login failed");
    if(data.length > 0) {
      return res.json({ message: "Login Succesfull!"});
    } else {
      return res.json("No Record!")
    }
  });
});





app.post('/register', (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const hashed = utils.hashStr({ text: req.body.password, algorithm: 'sha256', output: 'hex' })
  db.query("INSERT INTO login_table (username, password, email) VALUES(?, ?, ?)", [username, hashed, email],
  (err, result) => {
    if(result){
      res.json({message: "Registered!"});
    } else {
      res.json({message: "ENTER CORRECT ASKED DETAILS"})
    }
  })

});





app.post('/ip', (req, res) => {
  const ipAddress = requestIP.getClientIp(req);
  let date_ob = new Date();

  fs.writeFile('.logs/visitors/ip.txt', ipAddress, err => {
    if (err) {
      console.error(err);
    } else {
      res.json({ message: "IP SAVED!" });
    }
  });
   
  const newLogs = `${Date.now()}: new logs`;
  fs.readFile('ip.txt', { encoding: 'utf8' }, (err, data) => {
      const newData = data + newLogs + '\n';
      fs.writeFile('ip.txt', newData, 'utf8', callback);
  });
});






const httpServer = http.createServer(app);
const httpsServer = https.createServer({
  key: fs.readFileSync('./keys/blackzspace.de-0001/privkey.pem'),
  cert: fs.readFileSync('./keys/blackzspace.de-0001/fullchain.pem'),

  
}, app);





console.log(`

    ░░██████═╗░██╗░░░░░░░░░░███═╗░░░░░░██████╗░██╗░░██╗░██████╗░███████╗░██████═╗░░░░███═╗░░░░░░██████╗░██████╗░░░░░██████═╗░██████╗░░
    ░░██║░░██╝░██║░░░░░░░░░██╗██╚╗░░░░██═════╝░██║ ██═╝░░░░░██║░██═════╝░██║░░██║░░░██╗██╚╗░░░░██═════╝░██════╝░░░░░██║░░██║░██════╝░░
    ░░██████╚╗░██║░░░░░░░░███████╚╗░░██╚╗░░░░░░█████╚╗░░░░██╔═╝░███████╗░██████╔╝░░███████╚╗░░██╚╗░░░░░░██████╗░░░░░██║░░██║░██████╗░░
    ░░██║░░██║░██║░░░░░░░██╔════██╚╗░░██║░░░░░░██╔═██╚╗░██╔═╝░░░░░░░░██║░██╔═══╝░░██╔════██╚╗░░██║░░░░░░██════╝░░░░░██║░░██║░██════╝░░
    ░░██████╔╝░███████╗░██╔╝░░░░░██║░░░██████╗░██║░░██║░██████╗░███████║░██║░░░░░██╔╝░░░░░██║░░░██████╗░██████╗░██╗░██████╔╝░██████╗░░
    ░░╚═════╝░░╚══════╝░╚═╝░░░░░░╚═╝░░░╚═════╝░╚═╝░░╚═╝░╚═════╝░╚══════╝░╚═╝░░░░░╚═╝░░░░░░╚═╝░░░╚═════╝░╚═════╝░╚═╝░╚═════╝░░╚═════╝░░
    `);


    



httpServer.listen(8080, () => {
    
  console.log("Console > HTTP Running on PORT:  8080")
});



httpsServer.listen(8081, () => {
  console.log("Console > HTTPS Running on PORT:  8081")
});
