const path = require('path');
const http = require('http');
require('dotenv').config({ path: path.resolve(__dirname, '../.env')});
const app = require('./app');


const PORT = process.env.SERVER_PORT || 3001;
const server = http.createServer(app);



server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});