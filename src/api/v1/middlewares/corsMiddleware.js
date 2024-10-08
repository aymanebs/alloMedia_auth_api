const cors = require('cors');

const costOptions = {
    origin: 'https://localhost:5173',
    optionsSuccessStatus: 200,
    credentials: true 
}

module.exports= cors(costOptions);