const cors = require('cors');

const costOptions = {
    origin: ['https://localhost:5173', 'https://127.0.0.1:3000'],
    optionsSuccessStatus: 200,
    credentials: true 
}

module.exports= cors(costOptions);