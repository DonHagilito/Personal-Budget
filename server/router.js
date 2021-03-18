const express = require('express');
const router = express.Router();
const user = require('./db');
const bodyParser = require('body-parser');
const {
  addEnvelope,
  getEnvelopes
} = require('./db.js')

router.use(bodyParser.json());

router.get('/', (req, res, next) =>{
    res.sendFile(__dirname + '/public/index.html');
})

router.get('/style.css', function(req, res) {
    res.sendFile(__dirname + "/public/style.css");
  });

router.get('/api/envelopes', function(req, res) {
    const envelopes = getEnvelopes();
    res.send(envelopes);
});

router.post('/api/envelope', (req, res, next) => {
  const body = req.body
  const addedEnvelope = addEnvelope(body.name, body.saveAmount, body.total)

  res.send(addedEnvelope);
})


module.exports = router;
