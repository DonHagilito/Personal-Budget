const express = require('express');
const app = express();
const router = require('./router');

app.use('/', router);

module.exports = app;

const PORT = 4000;
app.listen(PORT, () =>{
    console.log('Server up and running');
})