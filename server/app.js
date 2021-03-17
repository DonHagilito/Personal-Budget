const express = require('express');
const app = express();



app.get('/', (req, res, next) => {
    res.send('Hello world!')
})



const PORT = 4001;
app.listen(PORT, () =>{
    console.log('Server up and running');
})