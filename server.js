const app = require("./src/app");
const https = require("https");
require("dotenv").config();
const fs = require("fs");
const path = require("path");


const port = process.env.PORT || 3000;

// Read SSL certificate and key files

const options = {

    key: fs.readFileSync(path.join(__dirname, "localhost-key.pem")),
  
    cert: fs.readFileSync(path.join(__dirname, "localhost.pem")),
  
  };
  
  

const server = https.createServer(options, app);




server.listen(port,() =>{
    console.log(`Listening on port ${port}`);
})

