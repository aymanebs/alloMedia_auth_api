const cors = require('cors');

const costOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

module.exports= cors(costOptions);